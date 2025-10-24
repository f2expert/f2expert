import Joi from "joi"

export const createReviewSchema = Joi.object({
  courseId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid course ID format'),
  
  title: Joi.string()
    .optional()
    .min(10)
    .max(200)
    .trim()
    .messages({
      'string.min': 'Review title must be at least 10 characters long',
      'string.max': 'Review title cannot exceed 200 characters'
    }),
  
  content: Joi.string()
    .required()
    .min(10)
    .max(2000)
    .trim()
    .messages({
      'string.min': 'Review content must be at least 10 characters long',
      'string.max': 'Review content cannot exceed 2000 characters',
      'any.required': 'Review content is required'
    }),
  
  rating: Joi.number()
    .required()
    .integer()
    .min(1)
    .max(5)
    .messages({
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5',
      'any.required': 'Rating is required'
    }),
  
  isAnonymous: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'isAnonymous must be a boolean value'
    }),
  
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid user ID format')
    .optional()
})

export const updateReviewSchema = Joi.object({
  title: Joi.string()
    .min(10)
    .max(200)
    .trim()
    .messages({
      'string.min': 'Review title must be at least 10 characters long',
      'string.max': 'Review title cannot exceed 200 characters'
    }),
  
  content: Joi.string()
    .min(50)
    .max(2000)
    .trim()
    .messages({
      'string.min': 'Review content must be at least 50 characters long',
      'string.max': 'Review content cannot exceed 2000 characters'
    }),
  
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .messages({
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5'
    }),
  
  reason: Joi.string()
    .max(200)
    .trim()
    .messages({
      'string.max': 'Edit reason cannot exceed 200 characters'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
})

export const reviewFilterSchema = Joi.object({
  courseId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid course ID format'),
  
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid user ID format'),
  
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5),
  
  minRating: Joi.number()
    .integer()
    .min(1)
    .max(5),
  
  maxRating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .greater(Joi.ref('minRating'))
    .messages({
      'number.greater': 'maxRating must be greater than minRating'
    }),
  
  isApproved: Joi.boolean(),
  isVerifiedPurchase: Joi.boolean(),
  isAnonymous: Joi.boolean(),
  isDeleted: Joi.boolean(),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),
  
  sortBy: Joi.string()
    .valid('createdAt', 'rating', 'helpfulCount', 'updatedAt')
    .default('createdAt'),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
})

export const helpfulnessSchema = Joi.object({
  action: Joi.string()
    .required()
    .valid('helpful', 'unhelpful', 'remove')
    .messages({
      'any.required': 'Action is required',
      'any.only': 'Action must be one of: helpful, unhelpful, remove'
    }),
  
  userId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid user ID format')
})

export const reportReviewSchema = Joi.object({
  reason: Joi.string()
    .required()
    .valid('spam', 'inappropriate', 'fake', 'offensive', 'other')
    .messages({
      'any.required': 'Report reason is required',
      'any.only': 'Reason must be one of: spam, inappropriate, fake, offensive, other'
    }),
  
  description: Joi.string()
    .max(500)
    .trim()
    .messages({
      'string.max': 'Report description cannot exceed 500 characters'
    }),
  
  userId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid user ID format')
})

export const moderationSchema = Joi.object({
  action: Joi.string()
    .required()
    .valid('approve', 'reject', 'delete', 'restore')
    .messages({
      'any.required': 'Moderation action is required',
      'any.only': 'Action must be one of: approve, reject, delete, restore'
    }),
  
  moderatorId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid moderator ID format'),
  
  reason: Joi.string()
    .max(500)
    .trim()
    .messages({
      'string.max': 'Moderation reason cannot exceed 500 characters'
    })
})