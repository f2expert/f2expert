import Joi from 'joi';

export const createMenuValidation = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),

  path: Joi.string()
    .min(1)
    .max(200)
    .required()
    .pattern(/^\//)
    .messages({
      'string.empty': 'Path is required',
      'string.min': 'Path must be at least 1 character long',
      'string.max': 'Path cannot exceed 200 characters',
      'string.pattern.base': 'Path must start with forward slash (/)',
      'any.required': 'Path is required'
    }),

  icon: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.max': 'Icon cannot exceed 50 characters'
    }),

  roles: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one role is required',
      'any.required': 'Roles are required'
    }),

  parentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow('', null)
    .messages({
      'string.pattern.base': 'Parent ID must be a valid MongoDB ObjectId'
    }),

  order: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.min': 'Order must be 0 or greater',
      'number.integer': 'Order must be an integer'
    }),

  menuType: Joi.string()
    .valid('main', 'submenu', 'setting', 'link', 'action')
    .optional()
    .default('main')
    .messages({
      'any.only': 'Menu type must be one of: main, submenu, setting, link, action'
    })
});

export const updateMenuValidation = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 100 characters'
    }),

  path: Joi.string()
    .min(1)
    .max(200)
    .optional()
    .pattern(/^\//)
    .messages({
      'string.empty': 'Path cannot be empty',
      'string.min': 'Path must be at least 1 character long',
      'string.max': 'Path cannot exceed 200 characters',
      'string.pattern.base': 'Path must start with forward slash (/)'
    }),

  icon: Joi.string()
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Icon cannot exceed 50 characters'
    }),

  roles: Joi.array()
    .items(Joi.string())
    .min(1)
    .optional()
    .messages({
      'array.min': 'At least one role is required if roles are provided'
    }),

  parentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null)
    .messages({
      'string.pattern.base': 'Parent ID must be a valid MongoDB ObjectId'
    }),

  order: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Order must be 0 or greater',
      'number.integer': 'Order must be an integer'
    }),

  menuType: Joi.string()
    .valid('main', 'submenu', 'setting', 'link', 'action')
    .optional()
    .messages({
      'any.only': 'Menu type must be one of: main, submenu, setting, link, action'
    })
});

export const menuQueryValidation = Joi.object({
  role: Joi.string()
    .optional()
    .messages({
      'string.base': 'Role must be a string'
    }),

  tree: Joi.boolean()
    .optional()
    .default(false)
    .messages({
      'boolean.base': 'Tree parameter must be a boolean'
    })
});