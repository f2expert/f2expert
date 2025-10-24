import { Schema, model, Document } from "mongoose"

export interface IReview extends Document {
  // Core Fields
  courseId: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
  title?: string
  content: string
  rating: number // 1-5 stars
  
  // User Information (populated from User model)
  author: {
    userId: string
    name: string
    email: string
    photo?: string
  }
  
  // Course Information (populated from Course model)
  course: {
    courseId: string
    title: string
    instructor: string
    category: string
  }
  
  // Review Metadata
  isApproved: boolean
  isVerifiedPurchase: boolean // Whether user actually enrolled in the course
  isAnonymous: boolean
  
  // Engagement
  helpfulVotes: Schema.Types.ObjectId[] // Users who found this review helpful
  unhelpfulVotes: Schema.Types.ObjectId[] // Users who found this review unhelpful
  helpfulCount: number
  unhelpfulCount: number
  
  // Moderation
  isReported: boolean
  reportCount: number
  reports: {
    userId: Schema.Types.ObjectId
    reason: string
    description?: string
    reportedAt: Date
  }[]
  
  // Status
  isDeleted: boolean
  isEdited: boolean
  editHistory: {
    previousContent: string
    previousTitle: string
    previousRating: number
    editedAt: Date
    reason?: string
  }[]
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    courseId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    title: { 
      type: String, 
      required: false, 
      trim: true,
      minlength: 10,
      maxlength: 200
    },
    content: { 
      type: String, 
      required: true,
      minlength: 50,
      maxlength: 2000
    },
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    
    // Populated fields
    author: {
      userId: { type: String },
      name: { type: String },
      email: { type: String },
      photo: { type: String }
    },
    course: {
      courseId: { type: String },
      title: { type: String },
      instructor: { type: String },
      category: { type: String }
    },
    
    // Status fields
    isApproved: { type: Boolean, default: false },
    isVerifiedPurchase: { type: Boolean, default: false },
    isAnonymous: { type: Boolean, default: false },
    
    // Engagement
    helpfulVotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    unhelpfulVotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    helpfulCount: { type: Number, default: 0 },
    unhelpfulCount: { type: Number, default: 0 },
    
    // Moderation
    isReported: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 },
    reports: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      reason: { 
        type: String, 
        required: true,
        enum: ['spam', 'inappropriate', 'fake', 'offensive', 'other']
      },
      description: { type: String, maxlength: 500 },
      reportedAt: { type: Date, default: Date.now }
    }],
    
    // Status
    isDeleted: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    editHistory: [{
      previousContent: { type: String, required: true },
      previousTitle: { type: String, required: true },
      previousRating: { type: Number, required: true },
      editedAt: { type: Date, default: Date.now },
      reason: { type: String, maxlength: 200 }
    }]
  },
  { 
    timestamps: true,
    toJSON: { 
      transform: function(doc: any, ret: any) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      }
    }
  }
)

// Indexes for better performance
reviewSchema.index({ courseId: 1, userId: 1 }, { unique: true }) // One review per user per course
reviewSchema.index({ courseId: 1, isApproved: 1, isDeleted: 1 })
reviewSchema.index({ userId: 1, isDeleted: 1 })
reviewSchema.index({ rating: -1 })
reviewSchema.index({ createdAt: -1 })
reviewSchema.index({ helpfulCount: -1 })

// Pre-save middleware to calculate counts
reviewSchema.pre('save', function(next) {
  if (this.isModified('helpfulVotes')) {
    this.helpfulCount = this.helpfulVotes.length
  }
  if (this.isModified('unhelpfulVotes')) {
    this.unhelpfulCount = this.unhelpfulVotes.length
  }
  if (this.isModified('reports')) {
    this.reportCount = this.reports.length
    this.isReported = this.reports.length > 0
  }
  next()
})

export const ReviewModel = model<IReview>("Review", reviewSchema)