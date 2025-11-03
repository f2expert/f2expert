import { Schema, model, Document, Types } from "mongoose"

export interface ISalary extends Document {
  // Basic Information
  employeeId: Types.ObjectId
  
  // Salary Period (supporting both formats)
  payPeriod?: {
    month: number
    year: number
    startDate?: Date
    endDate?: Date
  }
  salaryMonth?: number  // 1-12 (for backward compatibility)
  salaryYear?: number   // for backward compatibility
  
  // Salary Components (supporting both formats)
  basicSalary?: number  // New format
  baseSalary?: number   // Old format (for backward compatibility)
  
  // Allowances (new structured format)
  allowances?: {
    hra?: number        // House Rent Allowance
    transport?: number  // Transport Allowance
    medical?: number    // Medical Allowance
    performance?: number // Performance Allowance
    other?: number      // Other Allowances
  }
  
  // Individual allowances (old format for backward compatibility)
  performanceBonus?: number
  housingAllowance?: number
  transportAllowance?: number
  mealAllowance?: number
  specialAllowance?: number
  overtimeAmount?: number
  
  // Deductions (supporting structured format)
  deductions: {
    tax?: number
    pf?: number  // Provident Fund
    esi?: number // Employee State Insurance
    advance?: number
    loan?: number
    other?: number
  }
  
  // Calculated Fields
  grossSalary: number     // Sum of all allowances and bonuses
  totalDeductions: number // Sum of all deductions
  netSalary: number       // Gross - Deductions
  
  // Class-based Earnings (for trainers)
  classesAssigned: number
  classesCompleted: number
  hourlyRate: number
  totalHours: number
  classBasedEarnings: number
  
  // Payment Information (supporting both formats)
  status?: "pending" | "processing" | "paid" | "cancelled"  // New format
  paymentStatus?: "pending" | "processing" | "paid" | "cancelled"  // Old format
  paymentMode?: "bank_transfer" | "cash" | "cheque" | "upi"  // New format
  paymentMethod?: "bank_transfer" | "cash" | "cheque" | "upi"  // Old format
  paymentDate?: Date
  paymentReference?: string
  
  // Additional Information
  remarks?: string
  approvedBy?: Types.ObjectId // Admin who approved
  approvalDate?: Date
  
  // Metadata
  createdBy: Types.ObjectId
  updatedBy?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const salarySchema = new Schema<ISalary>(
  {
    // Basic Information
    employeeId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    
    // Salary Period (supporting both formats)
    payPeriod: {
      month: { type: Number, min: 1, max: 12 },
      year: { type: Number, min: 2020, max: 2030 },
      startDate: { type: Date },
      endDate: { type: Date }
    },
    salaryMonth: { 
      type: Number, 
      min: 1, 
      max: 12 
    },
    salaryYear: { 
      type: Number,
      min: 2020,
      max: 2030
    },
    
    // Salary Components (supporting both formats)
    basicSalary: { 
      type: Number, 
      min: 0 
    },
    baseSalary: { 
      type: Number, 
      min: 0 
    },
    
    // Allowances (new structured format)
    allowances: {
      hra: { type: Number, default: 0, min: 0 },
      transport: { type: Number, default: 0, min: 0 },
      medical: { type: Number, default: 0, min: 0 },
      performance: { type: Number, default: 0, min: 0 },
      other: { type: Number, default: 0, min: 0 }
    },
    
    // Individual allowances (old format for backward compatibility)
    performanceBonus: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    housingAllowance: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    transportAllowance: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    mealAllowance: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    specialAllowance: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    overtimeAmount: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    
    // Deductions
    deductions: {
      tax: { type: Number, default: 0, min: 0 },
      pf: { type: Number, default: 0, min: 0 },
      esi: { type: Number, default: 0, min: 0 },
      advance: { type: Number, default: 0, min: 0 },
      loan: { type: Number, default: 0, min: 0 },
      other: { type: Number, default: 0, min: 0 }
    },
    
    // Calculated Fields
    grossSalary: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    totalDeductions: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    netSalary: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    
    // Class-based Earnings (primarily for trainers)
    classesAssigned: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    classesCompleted: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    hourlyRate: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    totalHours: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    classBasedEarnings: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    
    // Payment Information (supporting both formats)
    status: { 
      type: String, 
      enum: ["pending", "processing", "paid", "cancelled"], 
      default: "pending" 
    },
    paymentStatus: { 
      type: String, 
      enum: ["pending", "processing", "paid", "cancelled"] 
    },
    paymentMode: { 
      type: String, 
      enum: ["bank_transfer", "cash", "cheque", "upi"] 
    },
    paymentMethod: { 
      type: String, 
      enum: ["bank_transfer", "cash", "cheque", "upi"] 
    },
    paymentDate: { type: Date },
    paymentReference: { type: String },
    
    // Additional Information
    remarks: { 
      type: String, 
      maxlength: 1000 
    },
    approvedBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    },
    approvalDate: { type: Date },
    
    // Metadata
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    updatedBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Compound index for unique salary per employee per month/year
salarySchema.index(
  { employeeId: 1, salaryMonth: 1, salaryYear: 1 }, 
  { unique: true }
)

// Additional indexes for performance
salarySchema.index({ employeeId: 1, createdAt: -1 })
salarySchema.index({ paymentStatus: 1 })
salarySchema.index({ salaryYear: 1, salaryMonth: 1 })
salarySchema.index({ approvedBy: 1 })
salarySchema.index({ createdAt: -1 })

// Pre-save middleware to calculate totals
salarySchema.pre('save', function(next) {
  // Calculate gross salary
  this.grossSalary = 
    this.baseSalary + 
    (this.performanceBonus || 0) + 
    (this.housingAllowance || 0) + 
    (this.transportAllowance || 0) + 
    (this.mealAllowance || 0) + 
    (this.specialAllowance || 0) + 
    (this.overtimeAmount || 0) + 
    (this.classBasedEarnings || 0)
  
  // Calculate total deductions
  this.totalDeductions = 
    (this.deductions.tax || 0) + 
    (this.deductions.pf || 0) + 
    (this.deductions.esi || 0) + 
    (this.deductions.advance || 0) + 
    (this.deductions.loan || 0) + 
    (this.deductions.other || 0)
  
  // Calculate net salary
  this.netSalary = this.grossSalary - this.totalDeductions
  
  next()
})

// Virtual for employee details (populated)
salarySchema.virtual('employee', {
  ref: 'User',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true
})

// Virtual for creator details (populated)
salarySchema.virtual('creator', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true
})

// Virtual for approver details (populated)
salarySchema.virtual('approver', {
  ref: 'User',
  localField: 'approvedBy',
  foreignField: '_id',
  justOne: true
})

// Virtual for salary period display
salarySchema.virtual('salaryPeriod').get(function() {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return `${months[this.salaryMonth - 1]} ${this.salaryYear}`
})

// Virtual for completion percentage
salarySchema.virtual('completionPercentage').get(function() {
  if (this.classesAssigned === 0) return 0
  return Math.round((this.classesCompleted / this.classesAssigned) * 100)
})

// Virtual for payment status display
salarySchema.virtual('paymentStatusDisplay').get(function() {
  const statusMap: { [key: string]: string } = {
    pending: 'Pending',
    processing: 'Processing',
    paid: 'Paid',
    cancelled: 'Cancelled'
  }
  return statusMap[this.paymentStatus] || this.paymentStatus
})

export const SalaryModel = model<ISalary>("Salary", salarySchema)
export type SalaryDocument = ISalary