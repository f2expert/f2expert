import Joi from "joi"

const syllabusSchema = Joi.object({
  module: Joi.string().required(),
  topics: Joi.array().items(Joi.string()).min(1).required(),
  duration: Joi.string().required()
})

const classScheduleSchema = Joi.object({
  day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
  startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
})

export const createCourseSchema = Joi.object({
  title: Joi.string().min(5).max(150).required().messages({
    'string.min': 'Title must be at least 5 characters long',
    'string.max': 'Title must not exceed 150 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().min(50).max(2000).required().messages({
    'string.min': 'Description must be at least 50 characters long',
    'string.max': 'Description must not exceed 2000 characters',
    'any.required': 'Description is required'
  }),
  shortDescription: Joi.string().min(20).max(200).required().messages({
    'string.min': 'Short description must be at least 20 characters long',
    'string.max': 'Short description must not exceed 200 characters',
    'any.required': 'Short description is required'
  }),
  instructor: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Instructor name must be at least 2 characters long',
    'string.max': 'Instructor name must not exceed 50 characters',
    'any.required': 'Instructor is required'
  }),
  instructorBio: Joi.string().max(500).optional(),
  category: Joi.string().valid(
    'Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'Cloud Computing',
    'DevOps', 'Cybersecurity', 'Database', 'Programming Languages', 'Software Testing',
    'UI/UX Design', 'Game Development', 'Blockchain', 'IoT', 'Big Data', 'Other'
  ).required().messages({
    'any.only': 'Category must be one of the valid IT course categories',
    'any.required': 'Category is required'
  }),
  subCategory: Joi.string().max(50).optional(),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').required(),
  technologies: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one technology must be specified',
    'any.required': 'Technologies are required'
  }),
  prerequisites: Joi.array().items(Joi.string()).optional(),
  learningOutcomes: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one learning outcome must be specified',
    'any.required': 'Learning outcomes are required'
  }),
  syllabus: Joi.array().items(syllabusSchema).optional(),
  price: Joi.number().min(0).precision(2).required().messages({
    'number.min': 'Price must be 0 or positive',
    'any.required': 'Price is required'
  }),
  originalPrice: Joi.number().min(0).precision(2).optional(),
  currency: Joi.string().length(3).default('USD'),
  duration: Joi.string().required(),
  totalHours: Joi.number().min(1).required().messages({
    'number.min': 'Total hours must be at least 1',
    'any.required': 'Total hours is required'
  }),
  totalLectures: Joi.number().min(1).required().messages({
    'number.min': 'Total lectures must be at least 1',
    'any.required': 'Total lectures is required'
  }),
  language: Joi.string().default('English'),
  isPublished: Joi.boolean().default(false),
  isFeatured: Joi.boolean().default(false),
  difficulty: Joi.number().min(1).max(5).default(1),
  certificateProvided: Joi.boolean().default(true),
  hasProjects: Joi.boolean().default(false),
  hasAssignments: Joi.boolean().default(false),
  hasQuizzes: Joi.boolean().default(false),
  supportProvided: Joi.boolean().default(true),
  jobAssistance: Joi.boolean().default(false),
  thumbnailUrl: Joi.string().uri().optional(),
  videoPreviewUrl: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  enrollmentStartDate: Joi.date().optional(),
  enrollmentEndDate: Joi.date().min(Joi.ref('enrollmentStartDate')).optional(),
  courseStartDate: Joi.date().optional(),
  courseEndDate: Joi.date().min(Joi.ref('courseStartDate')).optional(),
  maxStudents: Joi.number().min(1).optional(),
  minStudents: Joi.number().min(1).optional(),
  classSchedule: Joi.array().items(classScheduleSchema).optional(),
  mode: Joi.string().valid('Online', 'Offline', 'Hybrid').default('Online')
})

export const updateCourseSchema = Joi.object({
  title: Joi.string().min(5).max(150).optional(),
  description: Joi.string().min(50).max(2000).optional(),
  shortDescription: Joi.string().min(20).max(200).optional(),
  instructor: Joi.string().min(2).max(50).optional(),
  instructorBio: Joi.string().max(500).optional(),
  category: Joi.string().valid(
    'Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'Cloud Computing',
    'DevOps', 'Cybersecurity', 'Database', 'Programming Languages', 'Software Testing',
    'UI/UX Design', 'Game Development', 'Blockchain', 'IoT', 'Big Data', 'Other'
  ).optional(),
  subCategory: Joi.string().max(50).optional(),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').optional(),
  technologies: Joi.array().items(Joi.string()).min(1).optional(),
  prerequisites: Joi.array().items(Joi.string()).optional(),
  learningOutcomes: Joi.array().items(Joi.string()).min(1).optional(),
  syllabus: Joi.array().items(syllabusSchema).optional(),
  price: Joi.number().min(0).precision(2).optional(),
  originalPrice: Joi.number().min(0).precision(2).optional(),
  currency: Joi.string().length(3).optional(),
  duration: Joi.string().optional(),
  totalHours: Joi.number().min(1).optional(),
  totalLectures: Joi.number().min(1).optional(),
  language: Joi.string().optional(),
  isPublished: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  difficulty: Joi.number().min(1).max(5).optional(),
  certificateProvided: Joi.boolean().optional(),
  hasProjects: Joi.boolean().optional(),
  hasAssignments: Joi.boolean().optional(),
  hasQuizzes: Joi.boolean().optional(),
  supportProvided: Joi.boolean().optional(),
  jobAssistance: Joi.boolean().optional(),
  thumbnailUrl: Joi.string().uri().optional(),
  videoPreviewUrl: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  enrollmentStartDate: Joi.date().optional(),
  enrollmentEndDate: Joi.date().optional(),
  courseStartDate: Joi.date().optional(),
  courseEndDate: Joi.date().optional(),
  maxStudents: Joi.number().min(1).optional(),
  minStudents: Joi.number().min(1).optional(),
  classSchedule: Joi.array().items(classScheduleSchema).optional(),
  mode: Joi.string().valid('Online', 'Offline', 'Hybrid').optional()
})

export const courseFilterSchema = Joi.object({
  category: Joi.string().optional(),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').optional(),
  technologies: Joi.array().items(Joi.string()).optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  rating: Joi.number().min(0).max(5).optional(),
  mode: Joi.string().valid('Online', 'Offline', 'Hybrid').optional(),
  isFeatured: Joi.boolean().optional(),
  hasProjects: Joi.boolean().optional(),
  certificateProvided: Joi.boolean().optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'price', 'rating', 'totalStudents', 'title').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
})
