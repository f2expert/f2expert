import Joi from "joi"

const stepSchema = Joi.object({
  stepNumber: Joi.number().min(1).required(),
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).required(),
  codeSnippet: Joi.string().optional(),
  language: Joi.string().optional(),
  imageUrl: Joi.string().uri().optional()
})

const codeExampleSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  language: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().optional()
})

const resourceSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  url: Joi.string().uri().required(),
  type: Joi.string().valid('Documentation', 'Tool', 'Library', 'Framework', 'Article', 'Video').required()
})

export const createTutorialSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    'string.min': 'Title must be at least 5 characters long',
    'string.max': 'Title must not exceed 200 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().min(20).max(1000).required().messages({
    'string.min': 'Description must be at least 20 characters long',
    'string.max': 'Description must not exceed 1000 characters',
    'any.required': 'Description is required'
  }),
  content: Joi.string().min(50).required().messages({
    'string.min': 'Content must be at least 50 characters long',
    'any.required': 'Content is required'
  }),
  author: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Author name must be at least 2 characters long',
    'string.max': 'Author name must not exceed 50 characters',
    'any.required': 'Author is required'
  }),
  category: Joi.string().valid(
    'Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'Cloud Computing',
    'DevOps', 'Cybersecurity', 'Database', 'Programming Languages', 'Software Testing',
    'UI/UX Design', 'Game Development', 'Blockchain', 'IoT', 'Big Data', 'Tools & Setup', 'Other'
  ).required().messages({
    'any.only': 'Category must be one of the valid IT tutorial categories',
    'any.required': 'Category is required'
  }),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').required(),
  technologies: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one technology must be specified',
    'any.required': 'Technologies are required'
  }),
  estimatedReadTime: Joi.number().min(1).max(300).required().messages({
    'number.min': 'Estimated read time must be at least 1 minute',
    'number.max': 'Estimated read time must not exceed 300 minutes',
    'any.required': 'Estimated read time is required'
  }),
  tutorialType: Joi.string().valid('Article', 'Video', 'Interactive', 'Code-Along', 'Step-by-Step').default('Article'),
  // Optional fields with defaults
  tags: Joi.array().items(Joi.string()).optional(),
  difficulty: Joi.number().min(1).max(5).default(2),
  isPublished: Joi.boolean().default(false),
  thumbnailUrl: Joi.string().uri().optional(),
  videoUrl: Joi.string().uri().optional().messages({
    'string.uri': 'Video URL must be a valid URL'
  }),
  videoDuration: Joi.number().min(0).optional().messages({
    'number.min': 'Video duration must be 0 or positive (in seconds)'
  })
})

export const updateTutorialSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  description: Joi.string().min(50).max(2000).optional(),
  shortDescription: Joi.string().min(20).max(300).optional(),
  content: Joi.string().min(100).optional(),
  author: Joi.string().min(2).max(50).optional(),
  authorBio: Joi.string().max(500).optional(),
  category: Joi.string().valid(
    'Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'Cloud Computing',
    'DevOps', 'Cybersecurity', 'Database', 'Programming Languages', 'Software Testing',
    'UI/UX Design', 'Game Development', 'Blockchain', 'IoT', 'Big Data', 'Tools & Setup', 'Other'
  ).optional(),
  subCategory: Joi.string().max(50).optional(),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').optional(),
  technologies: Joi.array().items(Joi.string()).min(1).optional(),
  prerequisites: Joi.array().items(Joi.string()).optional(),
  learningObjectives: Joi.array().items(Joi.string()).min(1).optional(),
  estimatedReadTime: Joi.number().min(1).max(300).optional(),
  tutorialType: Joi.string().valid('Article', 'Video', 'Interactive', 'Code-Along', 'Step-by-Step').optional(),
  steps: Joi.array().items(stepSchema).optional(),
  codeExamples: Joi.array().items(codeExampleSchema).optional(),
  resources: Joi.array().items(resourceSchema).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  difficulty: Joi.number().min(1).max(5).optional(),
  isPublished: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  isPremium: Joi.boolean().optional(),
  thumbnailUrl: Joi.string().uri().optional(),
  videoUrl: Joi.string().uri().optional(),
  videoDuration: Joi.number().min(0).optional(),
  relatedCourses: Joi.array().items(Joi.string().hex().length(24)).optional(),
  relatedTutorials: Joi.array().items(Joi.string().hex().length(24)).optional(),
  seoTitle: Joi.string().max(60).optional(),
  seoDescription: Joi.string().max(160).optional(),
  seoKeywords: Joi.array().items(Joi.string()).optional(),
  language: Joi.string().optional()
})

export const tutorialFilterSchema = Joi.object({
  category: Joi.string().optional(),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').optional(),
  technologies: Joi.array().items(Joi.string()).optional(),
  tutorialType: Joi.string().valid('Article', 'Video', 'Interactive', 'Code-Along', 'Step-by-Step').optional(),
  difficulty: Joi.number().min(1).max(5).optional(),
  rating: Joi.number().min(0).max(5).optional(),
  minReadTime: Joi.number().min(1).optional(),
  maxReadTime: Joi.number().min(1).optional(),
  isFeatured: Joi.boolean().optional(),
  isPremium: Joi.boolean().optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(50).default(10),
  sortBy: Joi.string().valid('createdAt', 'rating', 'totalViews', 'totalLikes', 'title', 'estimatedReadTime', 'publishedAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().optional()
})

export const tutorialInteractionSchema = Joi.object({
  action: Joi.string().valid('view', 'like', 'bookmark', 'share').required(),
  tutorialId: Joi.string().hex().length(24).required()
})