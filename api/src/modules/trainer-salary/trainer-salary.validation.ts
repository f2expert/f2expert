import Joi from "joi"

// Validation schema for creating trainer salary
export const createTrainerSalarySchema = Joi.object({
  trainerId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Trainer ID must be a valid ObjectId'
    }),
  
  salaryMonth: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .required()
    .messages({
      'number.min': 'Salary month must be between 1 and 12',
      'number.max': 'Salary month must be between 1 and 12'
    }),
  
  salaryYear: Joi.number()
    .integer()
    .min(2020)
    .max(2030)
    .required()
    .messages({
      'number.min': 'Salary year must be between 2020 and 2030',
      'number.max': 'Salary year must be between 2020 and 2030'
    }),
  
  // Salary Components
  baseSalary: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Base salary cannot be negative'
    }),
  
  performanceBonus: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Performance bonus cannot be negative'
    }),
  
  housingAllowance: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Housing allowance cannot be negative'
    }),
  
  transportAllowance: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Transport allowance cannot be negative'
    }),
  
  mealAllowance: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Meal allowance cannot be negative'
    }),
  
  specialAllowance: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Special allowance cannot be negative'
    }),
  
  overtimeAmount: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Overtime amount cannot be negative'
    }),
  
  // Deductions
  deductions: Joi.object({
    tax: Joi.number().min(0).optional(),
    pf: Joi.number().min(0).optional(),
    esi: Joi.number().min(0).optional(),
    advance: Joi.number().min(0).optional(),
    loan: Joi.number().min(0).optional(),
    other: Joi.number().min(0).optional()
  }).optional(),
  
  // Class-based Earnings
  classesAssigned: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Classes assigned cannot be negative'
    }),
  
  classesCompleted: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Classes completed cannot be negative'
    }),
  
  hourlyRate: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Hourly rate cannot be negative'
    }),
  
  totalHours: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Total hours cannot be negative'
    }),
  
  // Payment Information
  paymentMethod: Joi.string()
    .valid("bank_transfer", "cash", "cheque", "upi")
    .optional(),
  
  remarks: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Remarks cannot exceed 1000 characters'
    })
})

// Validation schema for updating trainer salary
export const updateTrainerSalarySchema = Joi.object({
  // Allow updating salary components
  baseSalary: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Base salary cannot be negative'
    }),
  
  performanceBonus: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Performance bonus cannot be negative'
    }),
  
  housingAllowance: Joi.number()
    .min(0)
    .optional(),
  
  transportAllowance: Joi.number()
    .min(0)
    .optional(),
  
  mealAllowance: Joi.number()
    .min(0)
    .optional(),
  
  specialAllowance: Joi.number()
    .min(0)
    .optional(),
  
  overtimeAmount: Joi.number()
    .min(0)
    .optional(),
  
  // Deductions
  deductions: Joi.object({
    tax: Joi.number().min(0).optional(),
    pf: Joi.number().min(0).optional(),
    esi: Joi.number().min(0).optional(),
    advance: Joi.number().min(0).optional(),
    loan: Joi.number().min(0).optional(),
    other: Joi.number().min(0).optional()
  }).optional(),
  
  // Class-based Earnings
  classesAssigned: Joi.number()
    .integer()
    .min(0)
    .optional(),
  
  classesCompleted: Joi.number()
    .integer()
    .min(0)
    .optional(),
  
  hourlyRate: Joi.number()
    .min(0)
    .optional(),
  
  totalHours: Joi.number()
    .min(0)
    .optional(),
  
  // Payment Information
  paymentMethod: Joi.string()
    .valid("bank_transfer", "cash", "cheque", "upi")
    .optional(),
  
  remarks: Joi.string()
    .max(1000)
    .optional()
})

// Validation schema for updating payment status
export const updatePaymentStatusSchema = Joi.object({
  paymentStatus: Joi.string()
    .valid("pending", "processing", "paid", "cancelled")
    .required(),
  
  paymentMethod: Joi.string()
    .valid("bank_transfer", "cash", "cheque", "upi")
    .when('paymentStatus', {
      is: Joi.valid('processing', 'paid'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  
  paymentReference: Joi.string()
    .when('paymentStatus', {
      is: 'paid',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  
  remarks: Joi.string()
    .max(1000)
    .optional()
})

// Validation schema for salary approval
export const approveSalarySchema = Joi.object({
  approved: Joi.boolean().required(),
  remarks: Joi.string()
    .max(1000)
    .optional()
})

// Validation schema for bulk salary creation
export const bulkCreateSalarySchema = Joi.object({
  salaryMonth: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .required(),
  
  salaryYear: Joi.number()
    .integer()
    .min(2020)
    .max(2030)
    .required(),
  
  trainers: Joi.array()
    .items(
      Joi.object({
        trainerId: Joi.string()
          .required()
          .pattern(/^[0-9a-fA-F]{24}$/),
        baseSalary: Joi.number().min(0).required(),
        performanceBonus: Joi.number().min(0).optional(),
        housingAllowance: Joi.number().min(0).optional(),
        transportAllowance: Joi.number().min(0).optional(),
        mealAllowance: Joi.number().min(0).optional(),
        specialAllowance: Joi.number().min(0).optional(),
        overtimeAmount: Joi.number().min(0).optional(),
        deductions: Joi.object({
          tax: Joi.number().min(0).optional(),
          pf: Joi.number().min(0).optional(),
          esi: Joi.number().min(0).optional(),
          advance: Joi.number().min(0).optional(),
          loan: Joi.number().min(0).optional(),
          other: Joi.number().min(0).optional()
        }).optional(),
        classesAssigned: Joi.number().integer().min(0).optional(),
        classesCompleted: Joi.number().integer().min(0).optional(),
        hourlyRate: Joi.number().min(0).optional(),
        totalHours: Joi.number().min(0).optional(),
        remarks: Joi.string().max(1000).optional()
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one trainer salary data is required'
    })
})

// Query validation schemas
export const getSalaryQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  trainerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  salaryMonth: Joi.number().integer().min(1).max(12).optional(),
  salaryYear: Joi.number().integer().min(2020).max(2030).optional(),
  paymentStatus: Joi.string()
    .valid("pending", "processing", "paid", "cancelled")
    .optional(),
  sortBy: Joi.string()
    .valid("createdAt", "salaryMonth", "salaryYear", "netSalary", "paymentStatus")
    .default("createdAt"),
  sortOrder: Joi.string()
    .valid("asc", "desc")
    .default("desc")
})

export const getSalaryReportQuerySchema = Joi.object({
  startMonth: Joi.number().integer().min(1).max(12).optional(),
  endMonth: Joi.number().integer().min(1).max(12).optional(),
  startYear: Joi.number().integer().min(2020).max(2030).optional(),
  endYear: Joi.number().integer().min(2020).max(2030).optional(),
  trainerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  departmentFilter: Joi.string().optional(),
  paymentStatus: Joi.string()
    .valid("pending", "processing", "paid", "cancelled")
    .optional(),
  reportType: Joi.string()
    .valid("summary", "detailed", "trainer_wise", "department_wise")
    .default("summary")
})

// Validation for salary calculation parameters
export const calculateSalarySchema = Joi.object({
  trainerId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/),
  
  salaryMonth: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .required(),
  
  salaryYear: Joi.number()
    .integer()
    .min(2020)
    .max(2030)
    .required(),
  
  includeClassBasedEarnings: Joi.boolean().default(true),
  includePerformanceBonus: Joi.boolean().default(true)
})