// Common constants used across multiple modules

export const CATEGORIES = [
  'Web Development',
  'Mobile Development', 
  'Data Science',
  'AI/ML',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'Database',
  'Programming Languages',
  'Software Testing',
  'UI/UX Design',
  'Game Development',
  'Blockchain',
  'IoT',
  'Big Data',
  'Tools & Setup',
  'Other'
] as const

export const LEVELS = [
  'Beginner',
  'Intermediate', 
  'Advanced',
  'Expert'
] as const

export const TUTORIAL_TYPES = [
  'Article',
  'Video', 
  'Interactive',
  'Code-Along',
  'Step-by-Step'
] as const

export const RESOURCE_TYPES = [
  'Documentation',
  'Tool',
  'Library', 
  'Framework',
  'Article',
  'Video'
] as const

export const COURSE_MODES = [
  'Online',
  'Offline',
  'Hybrid'
] as const

export const CURRENCIES = [
  'USD',
  'INR',
  'EUR',
  'GBP'
] as const

export const LANGUAGES = [
  'English',
  'Hindi',
  'Spanish',
  'French',
  'German'
] as const

export const WEEKDAYS = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const

// Common validation patterns
export const VALIDATION_PATTERNS = {
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  MONGODB_ID: /^[0-9a-fA-F]{24}$/
} as const

// Common validation limits
export const VALIDATION_LIMITS = {
  TITLE_MIN: 5,
  TITLE_MAX: 200,
  SHORT_DESC_MIN: 20,
  SHORT_DESC_MAX: 300,
  DESC_MIN: 50,
  DESC_MAX: 2000,
  CONTENT_MIN: 100,
  BIO_MAX: 500,
  DIFFICULTY_MIN: 1,
  DIFFICULTY_MAX: 5,
  RATING_MIN: 0,
  RATING_MAX: 5,
  PRICE_MIN: 0,
  READ_TIME_MIN: 1,
  READ_TIME_MAX: 300,
  HOURS_MIN: 1,
  LECTURES_MIN: 1,
  SEO_TITLE_MAX: 60,
  SEO_DESC_MAX: 160
} as const

export type Category = typeof CATEGORIES[number]
export type Level = typeof LEVELS[number]
export type TutorialType = typeof TUTORIAL_TYPES[number]
export type ResourceType = typeof RESOURCE_TYPES[number]
export type CourseMode = typeof COURSE_MODES[number]
export type Currency = typeof CURRENCIES[number]
export type Language = typeof LANGUAGES[number]
export type Weekday = typeof WEEKDAYS[number]