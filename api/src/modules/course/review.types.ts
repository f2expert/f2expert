export interface CreateReviewDTO {
  courseId: string
  title?: string
  content: string
  rating: number
  isAnonymous?: boolean
}

export interface UpdateReviewDTO {
  title?: string
  content?: string
  rating?: number
  reason?: string // Reason for editing
}

export interface ReviewFilters {
  courseId?: string
  userId?: string
  rating?: number
  minRating?: number
  maxRating?: number
  isApproved?: boolean
  isVerifiedPurchase?: boolean
  isAnonymous?: boolean
  isDeleted?: boolean
}

export interface ReviewSortOptions {
  field: 'createdAt' | 'rating' | 'helpfulCount' | 'updatedAt'
  order: 'asc' | 'desc'
}

export interface ReviewPagination {
  page: number
  limit: number
  totalReviews: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  verifiedReviews: number
  approvedReviews: number
  pendingReviews: number
  reportedReviews: number
}

export interface HelpfulnessAction {
  userId: string
  action: 'helpful' | 'unhelpful' | 'remove'
}

export interface ReportReviewDTO {
  reason: 'spam' | 'inappropriate' | 'fake' | 'offensive' | 'other'
  description?: string
  userId: string
}

export interface ReviewModerationDTO {
  action: 'approve' | 'reject' | 'delete' | 'restore'
  moderatorId: string
  reason?: string
}