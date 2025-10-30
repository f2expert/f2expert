import { Schema, model, Document } from "mongoose"
import { CATEGORIES, LEVELS, COURSE_MODES, CURRENCIES, LANGUAGES } from "../../app/constants/common.constant"

export interface CourseDocument extends Document {
  title: string
  description: string
  shortDescription: string
  instructor: string
  instructorBio?: string
  category: string
  subCategory?: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  technologies: string[]
  prerequisites: string[]
  learningOutcomes: string[]
  syllabus: {
    module: string
    topics: string[]
    duration: string
  }[]
  modules?: {
    id: string
    title: string
    description: string
    lessons: {
      id: string
      title: string
      description: string
      videoUrl?: string
      duration: string
      resources: string[]
    }[]
  }[]
  price: number
  originalPrice?: number
  currency: string
  duration: string
  totalHours: number
  totalLectures: number
  language: string
  isPublished: boolean
  isFeatured: boolean
  difficulty: number // 1-5 scale
  rating: number
  totalStudents: number
  certificateProvided: boolean
  hasProjects: boolean
  hasAssignments: boolean
  hasQuizzes: boolean
  supportProvided: boolean
  jobAssistance: boolean
  thumbnailUrl?: string
  videoPreviewUrl?: string
  tags: string[]
  enrollmentStartDate?: Date
  enrollmentEndDate?: Date
  courseStartDate?: Date
  courseEndDate?: Date
  maxStudents?: number
  minStudents?: number
  classSchedule?: {
    day: string
    startTime: string
    endTime: string
  }[]
  mode: 'Online' | 'Offline' | 'Hybrid'
  createdAt: Date
  updatedAt: Date
}

const courseSchema = new Schema<CourseDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    instructor: { type: String, required: true, trim: true },
    instructorBio: { type: String },
    category: { 
      type: String, 
      required: true,
      enum: CATEGORIES
    },
    subCategory: { type: String },
    level: { 
      type: String, 
      required: true,
      enum: LEVELS
    },
    technologies: [{ type: String, required: true }],
    prerequisites: [{ type: String }],
    learningOutcomes: [{ type: String, required: true }],
    syllabus: [{
      module: { type: String, required: true },
      topics: [{ type: String, required: true }],
      duration: { type: String, required: true }
    }],
    modules: {
      type: [{
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        lessons: [{
          id: { type: String, required: true },
          title: { type: String, required: true },
          description: { type: String, required: true },
          videoUrl: { type: String },
          duration: { type: String, required: true },
          resources: [{ type: String }]
        }]
      }],
      default: []
    },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    currency: { type: String, enum: CURRENCIES, default: 'INR' },
    duration: { type: String, required: true },
    totalHours: { type: Number, required: true, min: 1 },
    totalLectures: { type: Number, required: true, min: 1 },
    language: { type: String, enum: LANGUAGES, default: 'English' },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    difficulty: { type: Number, min: 1, max: 5, default: 1 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    totalStudents: { type: Number, default: 0, min: 0 },
    certificateProvided: { type: Boolean, default: true },
    hasProjects: { type: Boolean, default: false },
    hasAssignments: { type: Boolean, default: false },
    hasQuizzes: { type: Boolean, default: false },
    supportProvided: { type: Boolean, default: true },
    jobAssistance: { type: Boolean, default: false },
    thumbnailUrl: { type: String },
    videoPreviewUrl: { type: String },
    tags: [{ type: String }],
    enrollmentStartDate: { type: Date },
    enrollmentEndDate: { type: Date },
    courseStartDate: { type: Date },
    courseEndDate: { type: Date },
    maxStudents: { type: Number, min: 1 },
    minStudents: { type: Number, min: 1 },
    classSchedule: [{
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    }],
    mode: { 
      type: String, 
      required: true,
      enum: COURSE_MODES,
      default: 'Online'
    }
  },
  { timestamps: true }
)

// Indexes for better query performance
courseSchema.index({ category: 1, level: 1 })
courseSchema.index({ technologies: 1 })
courseSchema.index({ isPublished: 1, isFeatured: 1 })
courseSchema.index({ rating: -1, totalStudents: -1 })
courseSchema.index({ price: 1 })

export const CourseModel = model<CourseDocument>("Course", courseSchema)
