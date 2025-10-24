import { ReviewModel, IReview } from "./review.model"
import { CourseModel } from "./course.model"
import { 
  CreateReviewDTO, 
  UpdateReviewDTO, 
  ReviewFilters, 
  ReviewSortOptions, 
  ReviewPagination,
  ReviewStats,
  HelpfulnessAction,
  ReportReviewDTO,
  ReviewModerationDTO
} from "./review.types"

/**
 * Create a new review for a course
 */
export const createReview = async (reviewData: CreateReviewDTO, userId: string): Promise<IReview> => {
  console.log("Creating review for course:", reviewData.courseId);
  console.log("Review data:", reviewData);
  console.log("User ID:", userId);
  
  // Check if course exists
  const course = await CourseModel.findById(reviewData.courseId).lean()
  if (!course) {
    throw new Error("Course not found")
  }

  // Check if user already reviewed this course
  const existingReview = await ReviewModel.findOne({
    courseId: reviewData.courseId,
    userId: userId,
    isDeleted: false
  })

  if (existingReview) {
    throw new Error("You have already reviewed this course")
  }

  // Create the review
  const review = new ReviewModel({
    ...reviewData,
    userId,
    isApproved: false, // Reviews need approval by default
    isVerifiedPurchase: false // This should be updated based on enrollment check
  })

  const savedReview = await review.save()
  console.log("Review saved:", savedReview);

  // Return the saved review with populated fields
  const populatedReview = await ReviewModel.findById(savedReview._id)
    .populate('userId', 'name email photo')
    .populate('courseId', 'title instructor category')
    .lean()

  console.log("Populated review:", populatedReview);
  
  if (!populatedReview) {
    throw new Error("Failed to retrieve created review")
  }

  return populatedReview as IReview
}

/**
 * Get reviews for a specific course with pagination
 */
export const getReviewsByCourse = async (
  courseId: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: string = 'desc',
  filters: Partial<ReviewFilters> = {}
): Promise<{ reviews: IReview[], pagination: ReviewPagination }> => {
  const skip = (page - 1) * limit
  const sortOptions: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }

  // Build query
  const query: any = {
    courseId,
    isDeleted: false,
    isApproved: true, // Only show approved reviews by default
    ...filters
  }

  // Execute queries
  const [reviews, totalCount] = await Promise.all([
    ReviewModel.find(query)
      .populate('userId', 'name email photo')
      .populate('courseId', 'title instructor category')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    ReviewModel.countDocuments(query)
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return {
    reviews: reviews as IReview[],
    pagination: {
      page,
      limit,
      totalReviews: totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}

/**
 * Get a specific review by ID
 */
export const getReviewById = async (reviewId: string): Promise<IReview | null> => {
  const review = await ReviewModel.findById(reviewId)
    .populate('userId', 'name email photo')
    .populate('courseId', 'title instructor category')

  return review
}

/**
 * Update a review
 */
export const updateReview = async (
  reviewId: string, 
  updateData: UpdateReviewDTO, 
  userId: string
): Promise<IReview | null> => {
  const review = await ReviewModel.findOne({
    _id: reviewId,
    userId,
    isDeleted: false
  })

  if (!review) {
    throw new Error("Review not found or you don't have permission to edit it")
  }

  // Store edit history
  if (updateData.title || updateData.content || updateData.rating) {
    review.editHistory.push({
      previousTitle: review.title || '',
      previousContent: review.content,
      previousRating: review.rating,
      editedAt: new Date(),
      reason: updateData.reason
    })
    review.isEdited = true
  }

  // Update fields
  if (updateData.title) review.title = updateData.title
  if (updateData.content) review.content = updateData.content
  if (updateData.rating) review.rating = updateData.rating

  // Reviews need re-approval after editing
  review.isApproved = false

  await review.save()
  return review
}

/**
 * Delete a review (soft delete)
 */
export const deleteReview = async (reviewId: string, userId: string): Promise<void> => {
  const review = await ReviewModel.findOne({
    _id: reviewId,
    userId,
    isDeleted: false
  })

  if (!review) {
    throw new Error("Review not found or you don't have permission to delete it")
  }

  review.isDeleted = true
  await review.save()
}

/**
 * Handle helpful/unhelpful votes
 */
export const handleHelpfulness = async (
  reviewId: string, 
  helpfulnessData: HelpfulnessAction
): Promise<IReview | null> => {
  const review = await ReviewModel.findById(reviewId)
  if (!review) {
    throw new Error("Review not found")
  }

  const userIdObj = helpfulnessData.userId

  // Remove existing votes first
  review.helpfulVotes = review.helpfulVotes.filter(id => id.toString() !== userIdObj)
  review.unhelpfulVotes = review.unhelpfulVotes.filter(id => id.toString() !== userIdObj)

  // Add new vote based on action
  if (helpfulnessData.action === 'helpful') {
    review.helpfulVotes.push(userIdObj as any)
  } else if (helpfulnessData.action === 'unhelpful') {
    review.unhelpfulVotes.push(userIdObj as any)
  }
  // 'remove' action just removes existing votes (already done above)

  await review.save()
  return review
}

/**
 * Report a review
 */
export const reportReview = async (
  reviewId: string, 
  reportData: ReportReviewDTO
): Promise<IReview | null> => {
  const review = await ReviewModel.findById(reviewId)
  if (!review) {
    throw new Error("Review not found")
  }

  // Check if user already reported this review
  const existingReport = review.reports.find(
    report => report.userId.toString() === reportData.userId
  )

  if (existingReport) {
    throw new Error("You have already reported this review")
  }

  // Add the report
  review.reports.push({
    userId: reportData.userId as any,
    reason: reportData.reason,
    description: reportData.description,
    reportedAt: new Date()
  })

  await review.save()
  return review
}

/**
 * Get reviews by user
 */
export const getReviewsByUser = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ reviews: IReview[], pagination: ReviewPagination }> => {
  const skip = (page - 1) * limit

  const [reviews, totalCount] = await Promise.all([
    ReviewModel.find({ userId, isDeleted: false })
      .populate('courseId', 'title instructor category thumbnailUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ReviewModel.countDocuments({ userId, isDeleted: false })
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return {
    reviews,
    pagination: {
      page,
      limit,
      totalReviews: totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}

/**
 * Get review statistics for a course
 */
export const getReviewStats = async (courseId: string): Promise<ReviewStats> => {
  const reviews = await ReviewModel.find({
    courseId,
    isDeleted: false,
    isApproved: true
  })

  const totalReviews = reviews.length
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0

  // Rating distribution
  const ratingDistribution = {
    1: reviews.filter(r => r.rating === 1).length,
    2: reviews.filter(r => r.rating === 2).length,
    3: reviews.filter(r => r.rating === 3).length,
    4: reviews.filter(r => r.rating === 4).length,
    5: reviews.filter(r => r.rating === 5).length
  }

  // Get additional stats
  const [verifiedReviews, pendingReviews, reportedReviews] = await Promise.all([
    ReviewModel.countDocuments({ courseId, isVerifiedPurchase: true, isDeleted: false }),
    ReviewModel.countDocuments({ courseId, isApproved: false, isDeleted: false }),
    ReviewModel.countDocuments({ courseId, isReported: true, isDeleted: false })
  ])

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    ratingDistribution,
    verifiedReviews,
    approvedReviews: totalReviews,
    pendingReviews,
    reportedReviews
  }
}

/**
 * Moderate a review (Admin function)
 */
export const moderateReview = async (
  reviewId: string,
  moderationData: ReviewModerationDTO
): Promise<IReview | null> => {
  const review = await ReviewModel.findById(reviewId)
  if (!review) {
    throw new Error("Review not found")
  }

  switch (moderationData.action) {
    case 'approve':
      review.isApproved = true
      break
    case 'reject':
      review.isApproved = false
      break
    case 'delete':
      review.isDeleted = true
      break
    case 'restore':
      review.isDeleted = false
      review.isApproved = false // Needs re-approval
      break
  }

  await review.save()
  return review
}