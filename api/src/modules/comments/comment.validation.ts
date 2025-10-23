import Joi from "joi"
import { commonValidationSchemas } from "../../app/utils/validation.util"

export const createCommentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(2000)
    .trim()
    .required()
    .messages({
      'string.min': 'Comment content cannot be empty',
      'string.max': 'Comment content must not exceed 2000 characters',
      'any.required': 'Comment content is required'
    }),
  contentType: Joi.string()
    .valid('tutorial', 'course')
    .required()
    .messages({
      'any.only': 'Content type must be either tutorial or course',
      'any.required': 'Content type is required'
    }),
  contentId: commonValidationSchemas.mongoId().required().messages({
    'any.required': 'Content ID is required',
    'string.hex': 'Invalid content ID format'
  }),
  tutorialId: commonValidationSchemas.mongoId().optional().messages({
    'string.hex': 'Invalid tutorial ID format'
  }),
  courseId: commonValidationSchemas.mongoId().optional().messages({
    'string.hex': 'Invalid course ID format'
  }),
  parentId: commonValidationSchemas.mongoId().optional().messages({
    'string.hex': 'Invalid parent comment ID format'
  })
})

export const updateCommentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(2000)
    .trim()
    .required()
    .messages({
      'string.min': 'Comment content cannot be empty',
      'string.max': 'Comment content must not exceed 2000 characters',
      'any.required': 'Comment content is required'
    })
})

export const commentReportSchema = Joi.object({
  reason: Joi.string()
    .valid('spam', 'inappropriate', 'offensive', 'harassment', 'other')
    .required()
    .messages({
      'any.only': 'Reason must be one of: spam, inappropriate, offensive, harassment, other',
      'any.required': 'Report reason is required'
    }),
  description: Joi.string()
    .max(500)
    .trim()
    .optional()
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    })
})

export const commentInteractionSchema = Joi.object({
  action: Joi.string()
    .valid('like', 'dislike', 'unlike', 'undislike')
    .required()
    .messages({
      'any.only': 'Action must be one of: like, dislike, unlike, undislike',
      'any.required': 'Action is required'
    })
})

export const commentFilterSchema = Joi.object({
  tutorialId: commonValidationSchemas.mongoId().optional(),
  authorId: commonValidationSchemas.mongoId().optional(),
  isApproved: Joi.boolean().optional(),
  level: Joi.number().min(0).max(3).optional(),
  parentId: commonValidationSchemas.mongoId().optional(),
  page: commonValidationSchemas.pagination.page(),
  limit: commonValidationSchemas.pagination.limit(50),
  sortBy: Joi.string()
    .valid('createdAt', 'likes', 'replies')
    .default('createdAt'),
  sortOrder: commonValidationSchemas.pagination.sortOrder()
})

export const commentModerationSchema = Joi.object({
  action: Joi.string()
    .valid('approve', 'reject', 'delete', 'restore')
    .required()
    .messages({
      'any.only': 'Action must be one of: approve, reject, delete, restore',
      'any.required': 'Moderation action is required'
    }),
  reason: Joi.string()
    .max(500)
    .trim()
    .optional()
    .messages({
      'string.max': 'Reason must not exceed 500 characters'
    }),
  moderatorId: commonValidationSchemas.mongoId().required().messages({
    'any.required': 'Moderator ID is required',
    'string.hex': 'Invalid moderator ID format'
  })
})