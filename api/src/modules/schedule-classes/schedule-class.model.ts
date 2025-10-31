import { Schema, model, Document } from "mongoose"

export interface ScheduleClassDocument extends Document {
  courseId: Schema.Types.ObjectId
  instructorId: Schema.Types.ObjectId
  className: string
  description?: string
  
  // Scheduling Information
  scheduledDate: Date
  startTime: string // Format: "HH:MM"
  endTime: string   // Format: "HH:MM"
  duration: number  // Duration in minutes
  
  // Location Information
  venue: string
  address: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  capacity: number
  
  // Status Management
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled'
  isRecurring: boolean
  recurringPattern?: {
    type: 'daily' | 'weekly' | 'monthly'
    interval: number // Every N days/weeks/months
    endDate?: Date
    daysOfWeek?: number[] // 0-6 (Sunday-Saturday) for weekly
  }
  
  // Enrollment Management
  enrolledStudents: {
    studentId: Schema.Types.ObjectId
    enrollmentDate: Date
    status: 'enrolled' | 'waitlist' | 'cancelled'
  }[]
  waitlistStudents: {
    studentId: Schema.Types.ObjectId
    waitlistDate: Date
    position: number
  }[]
  maxEnrollments: number
  currentEnrollments: number
  
  // Attendance Tracking
  attendance: {
    studentId: Schema.Types.ObjectId
    status: 'present' | 'absent' | 'late' | 'excused'
    checkInTime?: Date
    checkOutTime?: Date
    notes?: string
  }[]
  
  // Class Materials and Resources
  materials: {
    title: string
    description?: string
    fileUrl?: string
    fileType?: string
    isRequired: boolean
  }[]
  
  // Assignments and Tasks
  assignments: {
    title: string
    description: string
    dueDate?: Date
    isCompleted: boolean
    submittedStudents: Schema.Types.ObjectId[]
  }[]
  
  // Communication
  announcements: {
    message: string
    createdAt: Date
    isUrgent: boolean
    readBy: Schema.Types.ObjectId[]
  }[]
  
  // Class Notes and Summary
  classNotes?: string
  summary?: string
  objectives?: string[]
  
  // Prerequisites and Requirements
  prerequisites?: string[]
  requiredMaterials?: string[]
  
  // Pricing (if different from course pricing)
  classPrice?: number
  currency?: string
  
  // Metadata
  createdBy: Schema.Types.ObjectId
  lastModifiedBy?: Schema.Types.ObjectId
  tags?: string[]
  
  createdAt: Date
  updatedAt: Date
}

const scheduleClassSchema = new Schema<ScheduleClassDocument>(
  {
    courseId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true 
    },
    instructorId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    className: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: 200
    },
    description: { 
      type: String, 
      maxlength: 1000 
    },
    
    // Scheduling Information
    scheduledDate: { 
      type: Date, 
      required: true 
    },
    startTime: { 
      type: String, 
      required: true,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    endTime: { 
      type: String, 
      required: true,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    duration: { 
      type: Number, 
      required: true,
      min: 15,
      max: 480 // Maximum 8 hours
    },
    
    // Location Information
    venue: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 200
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: "India" },
      zipCode: { type: String, trim: true }
    },
    capacity: { 
      type: Number, 
      required: true,
      min: 1,
      max: 200
    },
    
    // Status Management
    status: { 
      type: String, 
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    },
    isRecurring: { 
      type: Boolean, 
      default: false 
    },
    recurringPattern: {
      type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly']
      },
      interval: {
        type: Number,
        min: 1,
        max: 12
      },
      endDate: Date,
      daysOfWeek: [{
        type: Number,
        min: 0,
        max: 6
      }]
    },
    
    // Enrollment Management
    enrolledStudents: [{
      studentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
      enrollmentDate: { 
        type: Date, 
        default: Date.now 
      },
      status: {
        type: String,
        enum: ['enrolled', 'waitlist', 'cancelled'],
        default: 'enrolled'
      }
    }],
    waitlistStudents: [{
      studentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
      waitlistDate: { 
        type: Date, 
        default: Date.now 
      },
      position: { 
        type: Number, 
        required: true 
      }
    }],
    maxEnrollments: { 
      type: Number,
      min: 1,
      max: 200
    },
    currentEnrollments: { 
      type: Number, 
      default: 0,
      min: 0
    },
    
    // Attendance Tracking
    attendance: [{
      studentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
      status: {
        type: String,
        enum: ['present', 'absent', 'late', 'excused'],
        required: true
      },
      checkInTime: Date,
      checkOutTime: Date,
      notes: { 
        type: String, 
        maxlength: 500 
      }
    }],
    
    // Class Materials and Resources
    materials: [{
      title: { 
        type: String, 
        required: true,
        maxlength: 200
      },
      description: { 
        type: String,
        maxlength: 500
      },
      fileUrl: String,
      fileType: String,
      isRequired: { 
        type: Boolean, 
        default: false 
      }
    }],
    
    // Assignments and Tasks
    assignments: [{
      title: { 
        type: String, 
        required: true,
        maxlength: 200
      },
      description: { 
        type: String, 
        required: true,
        maxlength: 1000
      },
      dueDate: Date,
      isCompleted: { 
        type: Boolean, 
        default: false 
      },
      submittedStudents: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
      }]
    }],
    
    // Communication
    announcements: [{
      message: { 
        type: String, 
        required: true,
        maxlength: 1000
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      },
      isUrgent: { 
        type: Boolean, 
        default: false 
      },
      readBy: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
      }]
    }],
    
    // Class Notes and Summary
    classNotes: { 
      type: String,
      maxlength: 5000
    },
    summary: { 
      type: String,
      maxlength: 2000
    },
    objectives: [{ 
      type: String,
      maxlength: 500
    }],
    
    // Prerequisites and Requirements
    prerequisites: [{ 
      type: String,
      maxlength: 200
    }],
    requiredMaterials: [{ 
      type: String,
      maxlength: 200
    }],
    
    // Pricing
    classPrice: { 
      type: Number,
      min: 0
    },
    currency: { 
      type: String,
      default: 'INR'
    },
    
    // Metadata
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    lastModifiedBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User'
    },
    tags: [{ 
      type: String,
      maxlength: 50
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Virtual for course details
scheduleClassSchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true
})

// Virtual for instructor details
scheduleClassSchema.virtual('instructor', {
  ref: 'User',
  localField: 'instructorId',
  foreignField: '_id',
  justOne: true
})

// Virtual for enrolled student details
scheduleClassSchema.virtual('studentDetails', {
  ref: 'User',
  localField: 'enrolledStudents.studentId',
  foreignField: '_id'
})

// Indexes for better performance
scheduleClassSchema.index({ courseId: 1, scheduledDate: 1 })
scheduleClassSchema.index({ instructorId: 1, scheduledDate: 1 })
scheduleClassSchema.index({ status: 1, scheduledDate: 1 })
scheduleClassSchema.index({ 'enrolledStudents.studentId': 1 })
scheduleClassSchema.index({ scheduledDate: 1, startTime: 1 })
scheduleClassSchema.index({ venue: 1, scheduledDate: 1 })

// Pre-save middleware to calculate duration and validate times
scheduleClassSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    const start = new Date(`2000-01-01T${this.startTime}:00`)
    const end = new Date(`2000-01-01T${this.endTime}:00`)
    const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
    
    if (diffInMinutes <= 0) {
      return next(new Error('End time must be after start time'))
    }
    
    this.duration = diffInMinutes
  }
  
  // Update current enrollments count
  this.currentEnrollments = this.enrolledStudents.filter(
    student => student.status === 'enrolled'
  ).length
  
  // Set maxEnrollments to capacity if not set
  if (!this.maxEnrollments) {
    this.maxEnrollments = this.capacity
  }
  
  next()
})

export const ScheduleClassModel = model<ScheduleClassDocument>("ScheduleClass", scheduleClassSchema)