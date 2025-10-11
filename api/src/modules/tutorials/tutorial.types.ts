export interface TutorialDTO {
  id?: string
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
  prerequisites?: string[]
  learningObjectives: string[]
  estimatedReadTime: number
  tutorialType: 'Article' | 'Video' | 'Interactive' | 'Code-Along' | 'Step-by-Step'
  steps?: {
    stepNumber: number
    title: string
    content: string
    codeSnippet?: string
    language?: string
    imageUrl?: string
  }[]
  codeExamples?: {
    title: string
    language: string
    code: string
    description?: string
  }[]
  resources?: {
    title: string
    url: string
    type: 'Documentation' | 'Tool' | 'Library' | 'Framework' | 'Article' | 'Video'
  }[]
  tags?: string[]
  difficulty?: number
  rating?: number
  totalViews?: number
  totalLikes?: number
  totalComments?: number
  isPublished?: boolean
  isFeatured?: boolean
  isPremium?: boolean
  thumbnailUrl?: string
  videoUrl?: string
  videoDuration?: number
  relatedCourses?: string[]
  relatedTutorials?: string[]
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  language?: string
  publishedAt?: Date
  lastUpdated?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface TutorialFilters {
  category?: string
  level?: string
  technologies?: string[]
  tutorialType?: string
  difficulty?: number
  rating?: number
  estimatedReadTime?: {
    min?: number
    max?: number
  }
  isFeatured?: boolean
  isPremium?: boolean
  dateRange?: {
    startDate: Date
    endDate: Date
  }
}

export interface TutorialSortOptions {
  field: 'createdAt' | 'rating' | 'totalViews' | 'totalLikes' | 'title' | 'estimatedReadTime' | 'publishedAt'
  order: 'asc' | 'desc'
}

export interface TutorialSearchQuery {
  searchTerm?: string
  filters?: TutorialFilters
  sort?: TutorialSortOptions
  page?: number
  limit?: number
}

export interface TutorialStep {
  stepNumber: number
  title: string
  content: string
  codeSnippet?: string
  language?: string
  imageUrl?: string
}

export interface CodeExample {
  title: string
  language: string
  code: string
  description?: string
}

export interface TutorialResource {
  title: string
  url: string
  type: 'Documentation' | 'Tool' | 'Library' | 'Framework' | 'Article' | 'Video'
}

export interface TutorialStats {
  totalTutorials: number
  totalViews: number
  averageRating: number
  categoryDistribution: { [key: string]: number }
  levelDistribution: { [key: string]: number }
  typeDistribution: { [key: string]: number }
  topTechnologies: { technology: string; count: number }[]
}

export interface TutorialInteraction {
  tutorialId: string
  userId: string
  action: 'view' | 'like' | 'bookmark' | 'comment' | 'share'
  timestamp: Date
}