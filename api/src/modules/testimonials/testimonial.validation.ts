import Joi from "joi"

// Create Testimonial Schema
export const createTestimonialSchema = Joi.object({
  studentName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Student name is required',
      'string.min': 'Student name must be at least 2 characters',
      'string.max': 'Student name cannot exceed 100 characters'
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  course: Joi.string()
    .max(200)
    .required()
    .messages({
      'string.empty': 'Course name is required',
      'string.max': 'Course name cannot exceed 200 characters'
    }),
  
  batchYear: Joi.number()
    .integer()
    .min(2020)
    .max(new Date().getFullYear() + 2)
    .optional()
    .messages({
      'number.min': 'Batch year cannot be before 2020',
      'number.max': 'Batch year cannot be more than 2 years in the future'
    }),
  
  title: Joi.string()
    .max(200)
    .required()
    .messages({
      'string.empty': 'Testimonial title is required',
      'string.max': 'Title cannot exceed 200 characters'
    }),
  
  content: Joi.string()
    .min(50)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'Testimonial content is required',
      'string.min': 'Content must be at least 50 characters',
      'string.max': 'Content cannot exceed 2000 characters'
    }),
  
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.min': 'Rating must be at least 1 star',
      'number.max': 'Rating cannot exceed 5 stars',
      'any.required': 'Rating is required'
    }),
  
  studentPhoto: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Student photo must be a valid URL'
    }),
  
  currentPosition: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Current position cannot exceed 100 characters'
    }),
  
  currentCompany: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Current company cannot exceed 100 characters'
    }),
  
  linkedinProfile: Joi.string()
    .pattern(/^https?:\/\/(www\.)?linkedin\.com\/.*/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid LinkedIn URL'
    }),
  
  tags: Joi.array()
    .items(Joi.string().max(50))
    .max(10)
    .optional()
    .messages({
      'array.max': 'Cannot have more than 10 tags'
    }),
  
  courseCompletionDate: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Course completion date cannot be in the future'
    }),
  
  placementDetails: Joi.object({
    salary: Joi.number().min(0).optional(),
    company: Joi.string().max(100).optional(),
    role: Joi.string().max(100).optional(),
    location: Joi.string().max(100).optional()
  }).optional()
})

// Update Testimonial Schema
export const updateTestimonialSchema = Joi.object({
  studentName: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  course: Joi.string().max(200).optional(),
  batchYear: Joi.number().integer().min(2020).max(new Date().getFullYear() + 2).optional(),
  title: Joi.string().max(200).optional(),
  content: Joi.string().min(50).max(2000).optional(),
  rating: Joi.number().integer().min(1).max(5).optional(),
  studentPhoto: Joi.string().uri().optional(),
  currentPosition: Joi.string().max(100).optional(),
  currentCompany: Joi.string().max(100).optional(),
  linkedinProfile: Joi.string().pattern(/^https?:\/\/(www\.)?linkedin\.com\/.*/).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional(),
  courseCompletionDate: Joi.date().max('now').optional(),
  placementDetails: Joi.object({
    salary: Joi.number().min(0).optional(),
    company: Joi.string().max(100).optional(),
    role: Joi.string().max(100).optional(),
    location: Joi.string().max(100).optional()
  }).optional()
})

// Approval Schema
export const approvalSchema = Joi.object({
  isApproved: Joi.boolean().required(),
  approvedBy: Joi.string().optional()
})

// Query Schema for filtering testimonials
export const testimonialQuerySchema = Joi.object({
  isApproved: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  course: Joi.string().optional(),
  rating: Joi.number().integer().min(1).max(5).optional(),
  minRating: Joi.number().integer().min(1).max(5).optional(),
  tags: Joi.string().optional(), // comma-separated tags
  limit: Joi.number().integer().min(1).max(100).optional().default(20),
  page: Joi.number().integer().min(1).optional().default(1),
  sortBy: Joi.string().valid('rating', 'date', 'course').optional().default('date'),
  sortOrder: Joi.string().valid('asc', 'desc').optional().default('desc')
})