export interface ITestimonialDTO {
  id?: string
  
  // Basic Information
  studentName: string
  email?: string
  course: string
  batchYear?: number
  
  // Testimonial Content
  title: string
  content: string
  rating: number // 1-5 stars
  
  // Student Details
  studentPhoto?: string
  currentPosition?: string
  currentCompany?: string
  linkedinProfile?: string
  
  // Status and Visibility
  isApproved?: boolean
  isActive?: boolean
  isFeatured?: boolean
  
  // Metadata
  submittedDate?: Date
  approvedDate?: Date
  approvedBy?: string
  
  // Additional Info
  tags?: string[]
  courseCompletionDate?: Date
  placementDetails?: {
    salary?: number
    company?: string
    role?: string
    location?: string
  }
  
  // Virtual fields
  starDisplay?: string
  statusDisplay?: string
  
  // Timestamps
  createdAt?: Date
  updatedAt?: Date
}

// Create Testimonial Request Interface
export interface ICreateTestimonialRequest {
  studentName: string
  email?: string
  course: string
  batchYear?: number
  title: string
  content: string
  rating: number
  studentPhoto?: string
  currentPosition?: string
  currentCompany?: string
  linkedinProfile?: string
  tags?: string[]
  courseCompletionDate?: Date
  placementDetails?: {
    salary?: number
    company?: string
    role?: string
    location?: string
  }
}

// Update Testimonial Request Interface
export interface IUpdateTestimonialRequest {
  studentName?: string
  email?: string
  course?: string
  batchYear?: number
  title?: string
  content?: string
  rating?: number
  studentPhoto?: string
  currentPosition?: string
  currentCompany?: string
  linkedinProfile?: string
  isActive?: boolean
  isFeatured?: boolean
  tags?: string[]
  courseCompletionDate?: Date
  placementDetails?: {
    salary?: number
    company?: string
    role?: string
    location?: string
  }
}

// Approval Request Interface
export interface IApprovalRequest {
  isApproved: boolean
  approvedBy?: string
}

// Testimonial Query Interface
export interface ITestimonialQuery {
  isApproved?: boolean
  isActive?: boolean
  isFeatured?: boolean
  course?: string
  rating?: number
  minRating?: number
  tags?: string[]
  limit?: number
  page?: number
  sortBy?: 'rating' | 'date' | 'course'
  sortOrder?: 'asc' | 'desc'
}