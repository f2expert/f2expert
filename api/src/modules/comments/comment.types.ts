export interface ICommentDTO {
  id?: string
  content: string
  author: {
    userId: string
    name: string
    email: string
    photo?: string
  }
  tutorialId: string
  parentId?: string
  isApproved?: boolean
  isEdited?: boolean
  editHistory?: {
    content: string
    editedAt: Date
  }[]
  likes?: number
  dislikes?: number
  isReported?: boolean
  reportCount?: number
  level?: number
  replies?: ICommentDTO[]
  replyCount?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface ICreateCommentRequest {
  content: string
  tutorialId: string
  parentId?: string
}

export interface CreateCommentDTO {
  content: string
  contentType: 'tutorial' | 'course'
  contentId: string // tutorialId or courseId
  tutorialId?: string // Legacy support
  courseId?: string // New field for courses
  parentId?: string
}

export interface IUpdateCommentRequest {
  content: string
}

export interface ICommentReportRequest {
  reason: 'spam' | 'inappropriate' | 'offensive' | 'harassment' | 'other'
  description?: string
}

export interface ICommentInteractionRequest {
  action: 'like' | 'dislike' | 'unlike' | 'undislike'
}

export interface ICommentFilterQuery {
  tutorialId?: string
  authorId?: string
  isApproved?: boolean
  level?: number
  parentId?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'likes' | 'replies'
  sortOrder?: 'asc' | 'desc'
}

export interface ICommentStats {
  totalComments: number
  approvedComments: number
  pendingComments: number
  reportedComments: number
  totalReplies: number
  averageCommentsPerTutorial: number
  topCommenters: {
    userId: string
    name: string
    commentCount: number
  }[]
}

export interface ICommentModerationAction {
  action: 'approve' | 'reject' | 'delete' | 'restore'
  reason?: string
  moderatorId: string
}