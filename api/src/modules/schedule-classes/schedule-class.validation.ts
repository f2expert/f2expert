import Joi from "joi"

// Address schema for location validation
const addressSchema = Joi.object({
  street: Joi.string().max(200).optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(100).optional(),
  country: Joi.string().max(100).optional().default("India"),
  zipCode: Joi.string().max(10).optional()
})

// Recurring pattern schema
const recurringPatternSchema = Joi.object({
  type: Joi.string().valid('daily', 'weekly', 'monthly').required(),
  interval: Joi.number().min(1).max(12).required(),
  endDate: Joi.date().min('now').optional(),
  daysOfWeek: Joi.array().items(
    Joi.number().min(0).max(6)
  ).when('type', {
    is: 'weekly',
    then: Joi.required(),
    otherwise: Joi.forbidden()
  })
})

// Enrolled student schema
const enrolledStudentSchema = Joi.object({
  studentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  enrollmentDate: Joi.date().optional(),
  status: Joi.string().valid('enrolled', 'waitlist', 'cancelled').default('enrolled')
})

// Attendance schema
const attendanceSchema = Joi.object({
  studentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  status: Joi.string().valid('present', 'absent', 'late', 'excused').required(),
  checkInTime: Joi.date().optional(),
  checkOutTime: Joi.date().optional(),
  notes: Joi.string().max(500).optional()
})

// Material schema
const materialSchema = Joi.object({
  title: Joi.string().max(200).required(),
  description: Joi.string().max(500).optional(),
  fileUrl: Joi.string().uri().optional(),
  fileType: Joi.string().max(50).optional(),
  isRequired: Joi.boolean().default(false)
})

// Assignment schema
const assignmentSchema = Joi.object({
  title: Joi.string().max(200).required(),
  description: Joi.string().max(1000).required(),
  dueDate: Joi.date().min('now').optional(),
  isCompleted: Joi.boolean().default(false),
  submittedStudents: Joi.array().items(
    Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
  ).optional()
})

// Announcement schema
const announcementSchema = Joi.object({
  message: Joi.string().max(1000).required(),
  isUrgent: Joi.boolean().default(false),
  readBy: Joi.array().items(
    Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
  ).optional()
})

// Create Schedule Class Schema
export const createScheduleClassSchema = Joi.object({
  courseId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Course ID must be a valid MongoDB ObjectId',
      'any.required': 'Course ID is required'
    }),
    
  instructorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Instructor ID must be a valid MongoDB ObjectId',
      'any.required': 'Instructor ID is required'
    }),
    
  className: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Class name must be at least 5 characters long',
      'string.max': 'Class name must not exceed 200 characters',
      'any.required': 'Class name is required'
    }),
    
  description: Joi.string()
    .max(1000)
    .optional(),
    
  // Scheduling Information
  scheduledDate: Joi.date()
    .min('now')
    .required()
    .messages({
      'date.min': 'Scheduled date must be in the future',
      'any.required': 'Scheduled date is required'
    }),
    
  startTime: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.pattern.base': 'Start time must be in HH:MM format (24-hour)',
      'any.required': 'Start time is required'
    }),
    
  endTime: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.pattern.base': 'End time must be in HH:MM format (24-hour)',
      'any.required': 'End time is required'
    }),
    
  // Location Information
  venue: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Venue must be at least 3 characters long',
      'string.max': 'Venue must not exceed 200 characters',
      'any.required': 'Venue is required'
    }),
    
  address: addressSchema.optional(),
  
  capacity: Joi.number()
    .min(1)
    .max(200)
    .required()
    .messages({
      'number.min': 'Capacity must be at least 1',
      'number.max': 'Capacity must not exceed 200',
      'any.required': 'Capacity is required'
    }),
    
  // Status and Recurring
  status: Joi.string()
    .valid('scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled')
    .default('scheduled'),
    
  isRecurring: Joi.boolean().default(false),
  
  recurringPattern: recurringPatternSchema
    .when('isRecurring', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    
  // Enrollment
  maxEnrollments: Joi.number()
    .min(1)
    .max(200)
    .optional(),
    
  enrolledStudents: Joi.array()
    .items(enrolledStudentSchema)
    .optional(),
    
  // Materials and Content
  materials: Joi.array()
    .items(materialSchema)
    .optional(),
    
  assignments: Joi.array()
    .items(assignmentSchema)
    .optional(),
    
  announcements: Joi.array()
    .items(announcementSchema)
    .optional(),
    
  // Class Content
  classNotes: Joi.string().max(5000).optional(),
  summary: Joi.string().max(2000).optional(),
  objectives: Joi.array().items(Joi.string().max(500)).optional(),
  
  // Prerequisites
  prerequisites: Joi.array().items(Joi.string().max(200)).optional(),
  requiredMaterials: Joi.array().items(Joi.string().max(200)).optional(),
  
  // Pricing
  classPrice: Joi.number().min(0).optional(),
  currency: Joi.string().default('INR'),
  
  // Metadata
  tags: Joi.array().items(Joi.string().max(50)).optional(),
  
  createdBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Created by must be a valid MongoDB ObjectId',
      'any.required': 'Created by is required'
    })
})

// Update Schedule Class Schema
export const updateScheduleClassSchema = Joi.object({
  className: Joi.string().min(5).max(200).optional(),
  description: Joi.string().max(1000).optional(),
  
  // Course and Instructor Information
  courseId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Course ID must be a valid MongoDB ObjectId',
    }),
  instructorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Instructor ID must be a valid MongoDB ObjectId',
    }),
  
  // Scheduling Information
  scheduledDate: Joi.date().min('now').optional(),
  startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  
  // Location Information
  venue: Joi.string().min(3).max(200).optional(),
  address: addressSchema.optional(),
  capacity: Joi.number().min(1).max(200).optional(),
  
  // Status and Recurring
  status: Joi.string().valid('scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled').optional(),
  isRecurring: Joi.boolean().optional(),
  recurringPattern: recurringPatternSchema.optional(),
  
  // Enrollment
  maxEnrollments: Joi.number().min(1).max(200).optional(),
  
  // Content
  classNotes: Joi.string().max(5000).optional(),
  summary: Joi.string().max(2000).optional(),
  objectives: Joi.array().items(Joi.string().max(500)).optional(),
  
  // Prerequisites
  prerequisites: Joi.array().items(Joi.string().max(200)).optional(),
  requiredMaterials: Joi.array().items(Joi.string().max(200)).optional(),
  
  // Pricing
  classPrice: Joi.number().min(0).optional(),
  currency: Joi.string().optional(),
  
  // Metadata
  tags: Joi.array().items(Joi.string().max(50)).optional(),
  
  lastModifiedBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
})

// Enroll Student Schema
export const enrollStudentSchema = Joi.object({
  studentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Student ID must be a valid MongoDB ObjectId',
      'any.required': 'Student ID is required'
    }),
    
  status: Joi.string()
    .valid('enrolled', 'waitlist')
    .default('enrolled')
})

// Mark Attendance Schema
export const markAttendanceSchema = Joi.object({
  studentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Student ID must be a valid MongoDB ObjectId',
      'any.required': 'Student ID is required'
    }),
    
  status: Joi.string()
    .valid('present', 'absent', 'late', 'excused')
    .required()
    .messages({
      'any.required': 'Attendance status is required'
    }),
    
  checkInTime: Joi.date().optional(),
  checkOutTime: Joi.date().optional(),
  notes: Joi.string().max(500).optional()
})

// Add Material Schema
export const addMaterialSchema = Joi.object({
  title: Joi.string()
    .max(200)
    .required()
    .messages({
      'string.max': 'Material title must not exceed 200 characters',
      'any.required': 'Material title is required'
    }),
    
  description: Joi.string().max(500).optional(),
  fileUrl: Joi.string().uri().optional(),
  fileType: Joi.string().max(50).optional(),
  isRequired: Joi.boolean().default(false)
})

// Add Assignment Schema
export const addAssignmentSchema = Joi.object({
  title: Joi.string()
    .max(200)
    .required()
    .messages({
      'string.max': 'Assignment title must not exceed 200 characters',
      'any.required': 'Assignment title is required'
    }),
    
  description: Joi.string()
    .max(1000)
    .required()
    .messages({
      'string.max': 'Assignment description must not exceed 1000 characters',
      'any.required': 'Assignment description is required'
    }),
    
  dueDate: Joi.date().min('now').optional()
})

// Add Announcement Schema
export const addAnnouncementSchema = Joi.object({
  message: Joi.string()
    .max(1000)
    .required()
    .messages({
      'string.max': 'Announcement message must not exceed 1000 characters',
      'any.required': 'Announcement message is required'
    }),
    
  isUrgent: Joi.boolean().default(false)
})

// Filter Schema for querying classes
export const filterScheduleClassSchema = Joi.object({
  courseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  instructorId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  status: Joi.string().valid('scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional(),
  venue: Joi.string().optional(),
  studentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  
  // Pagination
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  
  // Sorting
  sortBy: Joi.string()
    .valid('scheduledDate', 'className', 'createdAt', 'status', 'currentEnrollments')
    .default('scheduledDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc')
})

// Bulk Attendance Schema
export const bulkAttendanceSchema = Joi.object({
  attendance: Joi.array()
    .items(attendanceSchema)
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one attendance record is required',
      'any.required': 'Attendance data is required'
    })
})