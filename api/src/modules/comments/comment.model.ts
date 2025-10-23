import { Schema, model, Document } from "mongoose"

export interface IComment extends Document {
  content: string
  author: {
    userId: Schema.Types.ObjectId
    name: string
    email: string
    photo?: string
  }
  tutorialId: Schema.Types.ObjectId
  parentId?: Schema.Types.ObjectId // For nested replies
  isApproved: boolean
  isEdited: boolean
  editHistory?: {
    content: string
    editedAt: Date
  }[]
  likes: number
  dislikes: number
  isReported: boolean
  reportCount: number
  reports?: {
    userId: Schema.Types.ObjectId
    reason: string
    reportedAt: Date
  }[]
  level: number // 0 for top-level, 1 for replies, 2 for nested replies, etc.
  replies: Schema.Types.ObjectId[] // Array of reply comment IDs
  createdAt: Date
  updatedAt: Date
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000
    },
    author: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },
      photo: {
        type: String
      }
    },
    tutorialId: {
      type: Schema.Types.ObjectId,
      ref: 'Tutorial',
      required: true,
      index: true
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true
    },
    isApproved: {
      type: Boolean,
      default: true // Auto-approve comments, can be changed based on requirements
    },
    isEdited: {
      type: Boolean,
      default: false
    },
    editHistory: [{
      content: String,
      editedAt: Date
    }],
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    dislikes: {
      type: Number,
      default: 0,
      min: 0
    },
    isReported: {
      type: Boolean,
      default: false
    },
    reportCount: {
      type: Number,
      default: 0,
      min: 0
    },
    reports: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      reason: {
        type: String,
        required: true,
        enum: ['spam', 'inappropriate', 'offensive', 'harassment', 'other']
      },
      reportedAt: {
        type: Date,
        default: Date.now
      }
    }],
    level: {
      type: Number,
      default: 0,
      min: 0,
      max: 3 // Limit nested replies to 3 levels
    },
    replies: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
)

// Indexes for better performance
commentSchema.index({ tutorialId: 1, createdAt: -1 })
commentSchema.index({ 'author.userId': 1 })
commentSchema.index({ parentId: 1 })
commentSchema.index({ isApproved: 1 })
commentSchema.index({ createdAt: -1 })
commentSchema.index({ likes: -1 })

// Middleware to update content comment count
commentSchema.post('save', async function() {
  if (this.isNew && this.isApproved) {
    const doc = this as any
    const ModelName = doc.contentType === 'tutorial' ? 'Tutorial' : 'Course'
    await model(ModelName).findByIdAndUpdate(
      doc.contentId,
      { $inc: { totalComments: 1 } }
    )
  }
})

commentSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const docAny = doc as any
    const ModelName = docAny.contentType === 'tutorial' ? 'Tutorial' : 'Course'
    await model(ModelName).findByIdAndUpdate(
      docAny.contentId,
      { $inc: { totalComments: -1 } }
    )
  }
})

// Virtual for reply count
commentSchema.virtual('replyCount').get(function() {
  return this.replies.length
})

// Ensure virtual fields are serialized
commentSchema.set('toJSON', { virtuals: true })
commentSchema.set('toObject', { virtuals: true })

export const CommentModel = model<IComment>("Comment", commentSchema)