import { CommentModel, IComment } from "./comment.model"
import { TutorialModel } from "../tutorials/tutorial.model"
import { UserModel } from "../users/user.model"
import { model } from 'mongoose'
import { 
  ICreateCommentRequest,
  IUpdateCommentRequest, 
  ICommentFilterQuery,
  ICommentStats,
  ICommentReportRequest,
  ICommentModerationAction,
  CreateCommentDTO
} from "./comment.types"
import mongoose from 'mongoose'

// Generic create comment function supporting both tutorials and courses
export const createComment = async (commentData: CreateCommentDTO, userId: string) => {
  // Verify content exists based on type
  if (commentData.contentType === 'tutorial') {
    const tutorial = await TutorialModel.findById(commentData.contentId)
    if (!tutorial) {
      throw new Error('Tutorial not found')
    }
  } else if (commentData.contentType === 'course') {
    const CourseModel = model('Course')
    const course = await CourseModel.findById(commentData.contentId)
    if (!course) {
      throw new Error('Course not found')
    }
  }

  // Get user information
  const user = await UserModel.findById(userId).select('firstName lastName email photo')
  if (!user) {
    throw new Error('User not found')
  }

  let level = 0
  let parentComment = null

  // If this is a reply, check parent comment and determine level
  if (commentData.parentId) {
    parentComment = await CommentModel.findById(commentData.parentId)
    if (!parentComment) {
      throw new Error('Parent comment not found')
    }
    
    // Ensure parent comment belongs to the same content
    const parentDoc = parentComment as any
    if (parentDoc.contentId.toString() !== commentData.contentId) {
      throw new Error('Parent comment does not belong to this content')
    }
    
    level = parentComment.level + 1
    
    // Limit nesting depth
    if (level > 3) {
      throw new Error('Maximum comment nesting level reached')
    }
  }

  const comment = await CommentModel.create({
    content: commentData.content,
    contentType: commentData.contentType,
    contentId: commentData.contentId,
    tutorialId: commentData.contentType === 'tutorial' ? commentData.contentId : undefined,
    courseId: commentData.contentType === 'course' ? commentData.contentId : undefined,
    author: {
      userId: userId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      photo: user.photo
    },
    parentId: commentData.parentId || null,
    level: level
  })

  // If this is a reply, add it to parent's replies array
  if (parentComment) {
    await CommentModel.findByIdAndUpdate(
      parentComment._id,
      { $push: { replies: comment._id } }
    )
  }

  return await CommentModel.findById(comment._id).populate('replies')
}

// Legacy function for backward compatibility
export const createCommentForTutorial = async (commentData: ICreateCommentRequest, userId: string) => {
  const convertedData: CreateCommentDTO = {
    content: commentData.content,
    contentType: 'tutorial',
    contentId: commentData.tutorialId,
    tutorialId: commentData.tutorialId,
    parentId: commentData.parentId
  }
  return createComment(convertedData, userId)
}

export const getCommentById = async (commentId: string) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error('Invalid comment ID format')
  }

  return await CommentModel.findById(commentId)
    .populate('replies')
    .populate('author.userId', 'firstName lastName photo')
}

export const updateComment = async (commentId: string, updateData: IUpdateCommentRequest, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error('Invalid comment ID format')
  }

  const comment = await CommentModel.findById(commentId)
  if (!comment) {
    throw new Error('Comment not found')
  }

  // Check if user is the author of the comment
  if (comment.author.userId.toString() !== userId) {
    throw new Error('Not authorized to update this comment')
  }

  // Update the comment
  const updatedComment = await CommentModel.findByIdAndUpdate(
    commentId,
    {
      content: updateData.content,
      isEdited: true,
      updatedAt: new Date()
    },
    { new: true }
  ).populate('replies')

  return updatedComment
}

export const getCommentsByTutorial = async (
  tutorialId: string, 
  page: number = 1, 
  limit: number = 20,
  sortBy: string = 'createdAt',
  sortOrder: string = 'desc'
) => {
  if (!mongoose.Types.ObjectId.isValid(tutorialId)) {
    throw new Error('Invalid tutorial ID format')
  }

  const skip = (page - 1) * limit
  const sort: any = {}
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1

  // Get only top-level comments (level 0)
  const comments = await CommentModel.find({
    tutorialId,
    level: 0,
    isApproved: true
  })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'replies',
      options: { sort: { createdAt: 1 } },
      populate: {
        path: 'replies',
        options: { sort: { createdAt: 1 } },
        populate: {
          path: 'replies',
          options: { sort: { createdAt: 1 } }
        }
      }
    })

  const totalComments = await CommentModel.countDocuments({
    tutorialId,
    level: 0,
    isApproved: true
  })

  return {
    comments,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      totalComments,
      hasNext: page < Math.ceil(totalComments / limit),
      hasPrev: page > 1,
      limit
    }
  }
}

export const getCommentReplies = async (parentId: string, page: number = 1, limit: number = 10) => {
  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    throw new Error('Invalid parent comment ID format')
  }

  const skip = (page - 1) * limit

  const replies = await CommentModel.find({
    parentId,
    isApproved: true
  })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .populate('replies')

  const totalReplies = await CommentModel.countDocuments({
    parentId,
    isApproved: true
  })

  return {
    replies,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalReplies / limit),
      totalReplies,
      hasNext: page < Math.ceil(totalReplies / limit),
      hasPrev: page > 1,
      limit
    }
  }
}

export const deleteComment = async (commentId: string, userId: string, isAdmin: boolean = false) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error('Invalid comment ID format')
  }

  const comment = await CommentModel.findById(commentId)
  if (!comment) {
    throw new Error('Comment not found')
  }

  // Check if user owns the comment or is admin
  if (!isAdmin && comment.author.userId.toString() !== userId) {
    throw new Error('You can only delete your own comments')
  }

  // Remove comment from parent's replies array if it's a reply
  if (comment.parentId) {
    await CommentModel.findByIdAndUpdate(
      comment.parentId,
      { $pull: { replies: comment._id } }
    )
  }

  // Delete all nested replies recursively
  await deleteCommentReplies(commentId)

  // Delete the comment
  await CommentModel.findByIdAndDelete(commentId)

  return { message: 'Comment deleted successfully' }
}

const deleteCommentReplies = async (parentId: string) => {
  const replies = await CommentModel.find({ parentId })
  
  for (const reply of replies) {
    await deleteCommentReplies((reply._id as any).toString())
    await CommentModel.findByIdAndDelete(reply._id)
  }
}

export const likeComment = async (commentId: string) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error('Invalid comment ID format')
  }

  const comment = await CommentModel.findByIdAndUpdate(
    commentId,
    { $inc: { likes: 1 } },
    { new: true }
  )

  if (!comment) {
    throw new Error('Comment not found')
  }

  return comment
}

export const unlikeComment = async (commentId: string) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error('Invalid comment ID format')
  }

  const comment = await CommentModel.findByIdAndUpdate(
    commentId,
    { $inc: { likes: -1 } },
    { new: true }
  )

  if (!comment) {
    throw new Error('Comment not found')
  }



  return comment
}

export const dislikeComment = async (commentId: string) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error('Invalid comment ID format')
  }

  const comment = await CommentModel.findByIdAndUpdate(
    commentId,
    { $inc: { dislikes: 1 } },
    { new: true }
  )

  if (!comment) {
    throw new Error('Comment not found')
  }

  return comment
}

export const undislikeComment = async (commentId: string) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error('Invalid comment ID format')
  }

  const comment = await CommentModel.findByIdAndUpdate(
    commentId,
    { $inc: { dislikes: -1 } },
    { new: true }
  )

  if (!comment) {
    throw new Error('Comment not found')
  }



  return comment
}

// Unified toggle methods
export const toggleLike = async (commentId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error('Invalid comment ID format')
  }

  const comment = await CommentModel.findById(commentId)
  if (!comment) {
    throw new Error('Comment not found')
  }

  const hasLiked = comment.likes.some(id => id.toString() === userId)
  const hasDisliked = comment.dislikes.some(id => id.toString() === userId)
  
  let updateQuery: any = {}
  let userAction: string

  if (hasLiked) {
    // User has already liked, remove the like
    updateQuery = { $pull: { likes: userId } }
    userAction = 'unliked'
  } else {
    // User hasn't liked, add the like
    updateQuery = { $addToSet: { likes: userId } }
    userAction = 'liked'
    
    // If user has disliked, remove the dislike
    if (hasDisliked) {
      updateQuery.$pull = { dislikes: userId }
    }
  }

  const updatedComment = await CommentModel.findByIdAndUpdate(
    commentId,
    updateQuery,
    { new: true }
  )

  return {
    likes: updatedComment!.likes.length,
    dislikes: updatedComment!.dislikes.length,
    userAction
  }
}

export const toggleDislike = async (commentId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error('Invalid comment ID format')
  }

  const comment = await CommentModel.findById(commentId)
  if (!comment) {
    throw new Error('Comment not found')
  }

  const hasLiked = comment.likes.some(id => id.toString() === userId)
  const hasDisliked = comment.dislikes.some(id => id.toString() === userId)
  
  let updateQuery: any = {}
  let userAction: string

  if (hasDisliked) {
    // User has already disliked, remove the dislike
    updateQuery = { $pull: { dislikes: userId } }
    userAction = 'undisliked'
  } else {
    // User hasn't disliked, add the dislike
    updateQuery = { $addToSet: { dislikes: userId } }
    userAction = 'disliked'
    
    // If user has liked, remove the like
    if (hasLiked) {
      updateQuery.$pull = { likes: userId }
    }
  }

  const updatedComment = await CommentModel.findByIdAndUpdate(
    commentId,
    updateQuery,
    { new: true }
  )

  return {
    likes: updatedComment!.likes.length,
    dislikes: updatedComment!.dislikes.length,
    userAction
  }
}

export const reportComment = async (commentId: string, reportData: ICommentReportRequest, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error('Invalid comment ID format')
  }

  const comment = await CommentModel.findById(commentId)
  if (!comment) {
    throw new Error('Comment not found')
  }

  // Check if user already reported this comment
  const existingReport = comment.reports?.find(
    report => report.userId.toString() === userId
  )

  if (existingReport) {
    throw new Error('You have already reported this comment')
  }

  const updatedComment = await CommentModel.findByIdAndUpdate(
    commentId,
    {
      $push: {
        reports: {
          userId: userId,
          reason: reportData.reason,
          reportedAt: new Date()
        }
      },
      $inc: { reportCount: 1 },
      $set: { isReported: true }
    },
    { new: true }
  )

  return updatedComment
}

export const getCommentStats = async (): Promise<ICommentStats> => {
  const [
    totalComments,
    approvedComments,
    pendingComments,
    reportedComments,
    totalReplies
  ] = await Promise.all([
    CommentModel.countDocuments(),
    CommentModel.countDocuments({ isApproved: true }),
    CommentModel.countDocuments({ isApproved: false }),
    CommentModel.countDocuments({ isReported: true }),
    CommentModel.countDocuments({ level: { $gt: 0 } })
  ])

  const totalTutorials = await TutorialModel.countDocuments({ isPublished: true })
  const averageCommentsPerTutorial = totalTutorials > 0 ? totalComments / totalTutorials : 0

  // Get top commenters
  const topCommenters = await CommentModel.aggregate([
    { $match: { isApproved: true } },
    {
      $group: {
        _id: '$author.userId',
        name: { $first: '$author.name' },
        commentCount: { $sum: 1 }
      }
    },
    { $sort: { commentCount: -1 } },
    { $limit: 10 },
    {
      $project: {
        userId: '$_id',
        name: 1,
        commentCount: 1,
        _id: 0
      }
    }
  ])

  return {
    totalComments,
    approvedComments,
    pendingComments,
    reportedComments,
    totalReplies,
    averageCommentsPerTutorial: Math.round(averageCommentsPerTutorial * 100) / 100,
    topCommenters
  }
}

export const moderateComment = async (commentId: string, action: ICommentModerationAction) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new Error('Invalid comment ID format')
  }

  const comment = await CommentModel.findById(commentId)
  if (!comment) {
    throw new Error('Comment not found')
  }

  let updateData: any = {}

  switch (action.action) {
    case 'approve':
      updateData = { isApproved: true }
      break
    case 'reject':
      updateData = { isApproved: false }
      break
    case 'delete':
      return await deleteComment(commentId, action.moderatorId, true)
    case 'restore':
      updateData = { isApproved: true, isReported: false, reportCount: 0, reports: [] }
      break
    default:
      throw new Error('Invalid moderation action')
  }

  const updatedComment = await CommentModel.findByIdAndUpdate(
    commentId,
    updateData,
    { new: true }
  )

  return updatedComment
}

// Generic methods for both tutorials and courses
export const getCommentsByContent = async (
  contentId: string,
  contentType: 'tutorial' | 'course',
  page: number = 1,
  limit: number = 20,
  sortBy: string = 'createdAt',
  sortOrder: string = 'desc'
) => {
  const filter = contentType === 'tutorial' 
    ? { tutorialId: contentId } 
    : { courseId: contentId }
  
  return await getCommentsByTutorial(contentId, page, limit, sortBy, sortOrder)
}

export const getCommentsByCourse = async (
  courseId: string,
  page: number = 1,
  limit: number = 20,
  sortBy: string = 'createdAt',
  sortOrder: string = 'desc'
) => {
  return await getCommentsByTutorial(courseId, page, limit, sortBy, sortOrder)
}