import Joi from "joi"
import { 
  CATEGORIES, 
  LEVELS, 
  TUTORIAL_TYPES, 
  RESOURCE_TYPES, 
  COURSE_MODES, 
  CURRENCIES, 
  LANGUAGES, 
  WEEKDAYS,
  VALIDATION_LIMITS,
  VALIDATION_PATTERNS 
} from "../constants/common.constant"

// Common validation schemas
export const commonValidationSchemas = {
  // Basic field validations
  title: (required = true) => {
    const schema = Joi.string()
      .min(VALIDATION_LIMITS.TITLE_MIN)
      .max(VALIDATION_LIMITS.TITLE_MAX)
      .trim()
    return required ? schema.required() : schema.optional()
  },

  shortDescription: (required = true) => {
    const schema = Joi.string()
      .min(VALIDATION_LIMITS.SHORT_DESC_MIN)
      .max(VALIDATION_LIMITS.SHORT_DESC_MAX)
      .trim()
    return required ? schema.required() : schema.optional()
  },

  description: (required = true) => {
    const schema = Joi.string()
      .min(VALIDATION_LIMITS.DESC_MIN)
      .max(VALIDATION_LIMITS.DESC_MAX)
      .trim()
    return required ? schema.required() : schema.optional()
  },

  content: (required = true) => {
    const schema = Joi.string()
      .min(VALIDATION_LIMITS.CONTENT_MIN)
      .trim()
    return required ? schema.required() : schema.optional()
  },

  bio: () => Joi.string().max(VALIDATION_LIMITS.BIO_MAX).trim().optional(),

  // Enum validations
  category: (required = true) => {
    const schema = Joi.string().valid(...CATEGORIES)
    return required ? schema.required() : schema.optional()
  },

  level: (required = true) => {
    const schema = Joi.string().valid(...LEVELS)
    return required ? schema.required() : schema.optional()
  },

  tutorialType: (required = false) => {
    const schema = Joi.string().valid(...TUTORIAL_TYPES).default('Article')
    return required ? schema.required() : schema.optional()
  },

  courseMode: (required = false) => {
    const schema = Joi.string().valid(...COURSE_MODES).default('Online')
    return required ? schema.required() : schema.optional()
  },

  currency: () => Joi.string().valid(...CURRENCIES).default('USD'),

  language: () => Joi.string().valid(...LANGUAGES).default('English'),

  weekday: () => Joi.string().valid(...WEEKDAYS),

  // Array validations
  technologies: (required = true) => {
    const schema = Joi.array().items(Joi.string().trim()).min(1)
    return required ? schema.required() : schema.optional()
  },

  tags: () => Joi.array().items(Joi.string().trim()).optional(),

  prerequisites: () => Joi.array().items(Joi.string().trim()).optional(),

  // Number validations
  difficulty: () => Joi.number()
    .min(VALIDATION_LIMITS.DIFFICULTY_MIN)
    .max(VALIDATION_LIMITS.DIFFICULTY_MAX)
    .default(1),

  rating: () => Joi.number()
    .min(VALIDATION_LIMITS.RATING_MIN)
    .max(VALIDATION_LIMITS.RATING_MAX)
    .default(0),

  price: (required = true) => {
    const schema = Joi.number().min(VALIDATION_LIMITS.PRICE_MIN).precision(2)
    return required ? schema.required() : schema.optional()
  },

  readTime: (required = true) => {
    const schema = Joi.number()
      .min(VALIDATION_LIMITS.READ_TIME_MIN)
      .max(VALIDATION_LIMITS.READ_TIME_MAX)
    return required ? schema.required() : schema.optional()
  },

  hours: (required = true) => {
    const schema = Joi.number().min(VALIDATION_LIMITS.HOURS_MIN)
    return required ? schema.required() : schema.optional()
  },

  lectures: (required = true) => {
    const schema = Joi.number().min(VALIDATION_LIMITS.LECTURES_MIN)
    return required ? schema.required() : schema.optional()
  },

  // URL validations
  url: (required = false) => {
    const schema = Joi.string().uri()
    return required ? schema.required() : schema.optional()
  },

  // Pattern validations
  time: () => Joi.string().pattern(VALIDATION_PATTERNS.TIME),

  phone: () => Joi.string().pattern(VALIDATION_PATTERNS.PHONE),

  mongoId: () => Joi.string().hex().length(24),

  // Boolean validations
  isPublished: () => Joi.boolean().default(false),
  isFeatured: () => Joi.boolean().default(false),
  isActive: () => Joi.boolean().default(true),

  // Date validations
  dateOptional: () => Joi.date().optional(),
  dateRequired: () => Joi.date().required(),

  // Pagination
  pagination: {
    page: () => Joi.number().min(1).default(1),
    limit: (max = 100) => Joi.number().min(1).max(max).default(10),
    sortOrder: () => Joi.string().valid('asc', 'desc').default('desc')
  },

  // SEO fields
  seo: {
    title: () => Joi.string().max(VALIDATION_LIMITS.SEO_TITLE_MAX).optional(),
    description: () => Joi.string().max(VALIDATION_LIMITS.SEO_DESC_MAX).optional(),
    keywords: () => Joi.array().items(Joi.string().trim()).optional()
  }
}

// Common nested object schemas
export const nestedSchemas = {
  address: Joi.object({
    street: Joi.string().trim().optional(),
    city: Joi.string().trim().optional(),
    state: Joi.string().trim().optional(),
    country: Joi.string().trim().default('India'),
    zipCode: Joi.string().trim().optional()
  }),

  emergencyContact: Joi.object({
    name: Joi.string().trim().optional(),
    phone: commonValidationSchemas.phone().optional(),
    relationship: Joi.string().trim().optional()
  }),

  certification: Joi.object({
    name: Joi.string().required(),
    issuedBy: Joi.string().required(),
    issuedDate: Joi.date().required(),
    expiryDate: Joi.date().optional(),
    certificateUrl: commonValidationSchemas.url()
  }),

  resource: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    url: commonValidationSchemas.url(true),
    type: Joi.string().valid(...RESOURCE_TYPES).required()
  }),

  codeExample: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    language: Joi.string().required(),
    code: Joi.string().required(),
    description: Joi.string().optional()
  }),

  step: Joi.object({
    stepNumber: Joi.number().min(1).required(),
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(10).required(),
    codeSnippet: Joi.string().optional(),
    language: Joi.string().optional(),
    imageUrl: commonValidationSchemas.url()
  }),

  classSchedule: Joi.object({
    day: commonValidationSchemas.weekday().required(),
    startTime: commonValidationSchemas.time().required(),
    endTime: commonValidationSchemas.time().required()
  }),

  syllabus: Joi.object({
    module: Joi.string().required(),
    topics: Joi.array().items(Joi.string()).min(1).required(),
    duration: Joi.string().required()
  })
}

export default {
  commonValidationSchemas,
  nestedSchemas
}