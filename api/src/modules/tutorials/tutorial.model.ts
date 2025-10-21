import { Schema, model, Document } from "mongoose"
import { CATEGORIES, LEVELS, TUTORIAL_TYPES, RESOURCE_TYPES, LANGUAGES } from "../../app/constants/common.constant"

export interface TutorialDocument extends Document {
  title: string
  description: string
  shortDescription: string
  content: string
  author: string
  authorBio?: string
  category: string
  subCategory?: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  technologies: string[]
  prerequisites: string[]
  learningObjectives: string[]
  estimatedReadTime: number // in minutes
  tutorialType: 'Article' | 'Video' | 'Interactive' | 'Code-Along' | 'Step-by-Step'
  steps?: {
    stepNumber: number
    title: string
    content: string
    codeSnippet?: string
    language?: string
    imageUrl?: string
  }[]
  codeExamples: {
    title: string
    language: string
    code: string
    description?: string
  }[]
  resources: {
    title: string
    url: string
    type: 'Documentation' | 'Tool' | 'Library' | 'Framework' | 'Article' | 'Video'
  }[]
  tags: string[]
  difficulty: number // 1-5 scale
  rating: number
  totalViews: number
  totalLikes: number
  totalComments: number
  isPublished: boolean
  isFeatured: boolean
  isPremium: boolean
  thumbnailUrl?: string
  videoUrl?: string
  videoDuration?: number // in seconds for video tutorials
  relatedCourses: Schema.Types.ObjectId[]
  relatedTutorials: Schema.Types.ObjectId[]
  seoTitle?: string
  seoDescription?: string
  seoKeywords: string[]
  language: string
  publishedAt?: Date
  lastUpdated?: Date
  createdAt: Date
  updatedAt: Date
}

const tutorialSchema = new Schema<TutorialDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 2000 },
    shortDescription: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    authorBio: { type: String, maxlength: 500 },
    category: { 
      type: String, 
      required: true,
      enum: CATEGORIES
    },
    subCategory: { type: String, maxlength: 50 },
    level: { 
      type: String, 
      required: true,
      enum: LEVELS
    },
    technologies: [{ type: String, required: true }],
    prerequisites: [{ type: String }],
    learningObjectives: [{ type: String, required: true }],
    estimatedReadTime: { type: Number, required: true, min: 1 },
    tutorialType: {
      type: String,
      required: true,
      enum: TUTORIAL_TYPES,
      default: 'Article'
    },
    steps: [{
      stepNumber: { type: Number, required: true },
      title: { type: String, required: true },
      content: { type: String, required: true },
      codeSnippet: { type: String },
      language: { type: String },
      imageUrl: { type: String }
    }],
    codeExamples: [{
      title: { type: String, required: true },
      language: { type: String, required: true },
      code: { type: String, required: true },
      description: { type: String }
    }],
    resources: [{
      title: { type: String, required: true },
      url: { type: String, required: true },
      type: { 
        type: String, 
        required: true,
        enum: RESOURCE_TYPES
      }
    }],
    tags: [{ type: String }],
    difficulty: { type: Number, min: 1, max: 5, default: 1 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    totalViews: { type: Number, default: 0, min: 0 },
    totalLikes: { type: Number, default: 0, min: 0 },
    totalComments: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    thumbnailUrl: { type: String },
    videoUrl: { type: String },
    videoDuration: { type: Number, min: 0 },
    relatedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    relatedTutorials: [{ type: Schema.Types.ObjectId, ref: 'Tutorial' }],
    seoTitle: { type: String, maxlength: 60 },
    seoDescription: { type: String, maxlength: 160 },
    seoKeywords: [{ type: String }],
    language: { type: String, enum: LANGUAGES, default: 'English' },
    publishedAt: { type: Date },
    lastUpdated: { type: Date }
  },
  { timestamps: true }
)

// Indexes for better query performance
tutorialSchema.index({ category: 1, level: 1 })
tutorialSchema.index({ technologies: 1 })
tutorialSchema.index({ tags: 1 })
tutorialSchema.index({ isPublished: 1, isFeatured: 1 })
tutorialSchema.index({ rating: -1, totalViews: -1 })
tutorialSchema.index({ difficulty: 1 })
tutorialSchema.index({ tutorialType: 1 })
tutorialSchema.index({ createdAt: -1 })

// Text index for search functionality
tutorialSchema.index({
  title: 'text',
  description: 'text',
  shortDescription: 'text',
  content: 'text',
  tags: 'text',
  technologies: 'text'
})

// Middleware to update lastUpdated and publishedAt
tutorialSchema.pre('save', function(next) {
  if (this.isModified() && this.isModified() !== this.isNew) {
    this.lastUpdated = new Date()
  }
  
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  
  next()
})

export const TutorialModel = model<TutorialDocument>("Tutorial", tutorialSchema)