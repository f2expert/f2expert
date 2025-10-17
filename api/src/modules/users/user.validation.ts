import Joi from "joi"

// Address schema for reuse
const addressSchema = Joi.object({
  street: Joi.string().max(200).optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(100).optional(),
  country: Joi.string().max(100).optional().default("India"),
  zipCode: Joi.string().max(10).optional()
})

// Emergency contact schema
const emergencyContactSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  relationship: Joi.string().max(50).optional()
})

// Certification schema
const certificationSchema = Joi.object({
  name: Joi.string().required(),
  issuedBy: Joi.string().required(),
  issuedDate: Joi.date().required(),
  expiryDate: Joi.date().optional(),
  certificateUrl: Joi.string().uri().optional()
})

// Create User Schema
export const createUserSchema = Joi.object({
  firstName: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 1 character',
      'string.max': 'First name cannot exceed 50 characters'
    }),
  
  lastName: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 1 character',
      'string.max': 'Last name cannot exceed 50 characters'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'string.empty': 'Password is required'
    }),
  
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  dateOfBirth: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Date of birth cannot be in the future'
    }),
  
  gender: Joi.string()
    .valid('male', 'female', 'other')
    .optional(),
  
  address: addressSchema.optional(),
  
  role: Joi.string()
    .valid('admin', 'trainer', 'student')
    .required()
    .messages({
      'any.only': 'Role must be one of: admin, trainer, student',
      'string.empty': 'Role is required'
    })
})

// Update User Schema
export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  address: addressSchema.optional(),
  bio: Joi.string().max(500).optional(),
  avatar: Joi.string().uri().optional(),
  isActive: Joi.boolean().optional()
})

// Student Info Update Schema
export const updateStudentInfoSchema = Joi.object({
  emergencyContact: emergencyContactSchema.optional(),
  educationLevel: Joi.string()
    .valid('high_school', 'bachelor', 'master', 'phd', 'other')
    .optional(),
  previousExperience: Joi.string().max(1000).optional(),
  careerGoals: Joi.string().max(1000).optional()
})

// Trainer Info Update Schema
export const updateTrainerInfoSchema = Joi.object({
  department: Joi.string().max(100).optional(),
  specializations: Joi.array().items(Joi.string().max(100)).optional(),
  experience: Joi.number().min(0).max(50).optional(),
  qualifications: Joi.array().items(Joi.string().max(200)).optional(),
  certifications: Joi.array().items(certificationSchema).optional(),
  expertise: Joi.array().items(Joi.string().max(100)).optional(),
  hourlyRate: Joi.number().min(0).max(10000).optional()
})

// Admin Info Update Schema
export const updateAdminInfoSchema = Joi.object({
  department: Joi.string().max(100).optional(),
  permissions: Joi.array().items(Joi.string()).optional(),
  accessLevel: Joi.string()
    .valid('super_admin', 'admin', 'manager')
    .optional()
})

// Change Password Schema
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Confirm password must match new password'
    })
})

// Login Schema
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email address'
    }),
  
  password: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password cannot be empty'
    })
})
