export interface CourseDTO {
  id?: string
  title: string
  description: string
  shortDescription: string
  instructor: string
  instructorBio?: string
  category: string
  subCategory?: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  technologies: string[]
  prerequisites?: string[]
  learningOutcomes: string[]
  syllabus?: {
    module: string
    topics: string[]
    duration: string
  }[]
  price: number
  originalPrice?: number
  currency?: string
  duration: string
  totalHours: number
  totalLectures: number
  language?: string
  isPublished?: boolean
  isFeatured?: boolean
  difficulty?: number
  rating?: number
  totalStudents?: number
  certificateProvided?: boolean
  hasProjects?: boolean
  hasAssignments?: boolean
  hasQuizzes?: boolean
  supportProvided?: boolean
  jobAssistance?: boolean
  thumbnailUrl?: string
  videoPreviewUrl?: string
  tags?: string[]
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
  createdAt?: Date
  updatedAt?: Date
}

export interface CourseFilters {
  category?: string
  level?: string
  technologies?: string[]
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  duration?: string
  mode?: string
  isFeatured?: boolean
  hasProjects?: boolean
  certificateProvided?: boolean
}

export interface CourseSortOptions {
  field: 'createdAt' | 'price' | 'rating' | 'totalStudents' | 'title'
  order: 'asc' | 'desc'
}
