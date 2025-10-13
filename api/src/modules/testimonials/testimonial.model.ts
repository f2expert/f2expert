import { Schema, model, Document } from "mongoose"

export interface ITestimonial extends Document {
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
  isApproved: boolean
  isActive: boolean
  isFeatured: boolean
  
  // Metadata
  submittedDate: Date
  approvedDate?: Date
  approvedBy?: Schema.Types.ObjectId // Reference to admin user
  
  // Additional Info
  tags?: string[] // e.g., ["web-development", "placement", "career-change"]
  courseCompletionDate?: Date
  placementDetails?: {
    salary?: number
    company?: string
    role?: string
    location?: string
  }
  
  createdAt: Date
  updatedAt: Date
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    // Basic Information
    studentName: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: 100
    },
    email: { 
      type: String, 
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    course: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 200
    },
    batchYear: { 
      type: Number,
      min: 2020,
      max: new Date().getFullYear() + 2
    },
    
    // Testimonial Content
    title: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 200
    },
    content: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 2000
    },
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    
    // Student Details
    studentPhoto: { 
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    },
    currentPosition: { 
      type: String,
      trim: true,
      maxlength: 100
    },
    currentCompany: { 
      type: String,
      trim: true,
      maxlength: 100
    },
    linkedinProfile: { 
      type: String,
      match: [/^https?:\/\/(www\.)?linkedin\.com\/.*/, 'Please enter a valid LinkedIn URL']
    },
    
    // Status and Visibility
    isApproved: { 
      type: Boolean, 
      default: false 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    isFeatured: { 
      type: Boolean, 
      default: false 
    },
    
    // Metadata
    submittedDate: { 
      type: Date, 
      default: Date.now 
    },
    approvedDate: { 
      type: Date 
    },
    approvedBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    
    // Additional Info
    tags: [{ 
      type: String, 
      trim: true,
      lowercase: true
    }],
    courseCompletionDate: { 
      type: Date 
    },
    placementDetails: {
      salary: { 
        type: Number,
        min: 0
      },
      company: { 
        type: String,
        trim: true,
        maxlength: 100
      },
      role: { 
        type: String,
        trim: true,
        maxlength: 100
      },
      location: { 
        type: String,
        trim: true,
        maxlength: 100
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Indexes for better performance
testimonialSchema.index({ isApproved: 1, isActive: 1 })
testimonialSchema.index({ isFeatured: 1 })
testimonialSchema.index({ course: 1 })
testimonialSchema.index({ rating: -1 })
testimonialSchema.index({ submittedDate: -1 })
testimonialSchema.index({ tags: 1 })

// Virtual for star display
testimonialSchema.virtual('starDisplay').get(function() {
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating)
})

// Virtual for approval status display
testimonialSchema.virtual('statusDisplay').get(function() {
  if (!this.isApproved) return 'Pending Approval'
  if (!this.isActive) return 'Inactive'
  if (this.isFeatured) return 'Featured'
  return 'Active'
})

// Pre-save middleware to set approvedDate
testimonialSchema.pre('save', function(next) {
  if (this.isModified('isApproved') && this.isApproved && !this.approvedDate) {
    this.approvedDate = new Date()
  }
  next()
})

export const TestimonialModel = model<ITestimonial>("Testimonial", testimonialSchema)