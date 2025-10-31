import { Schema, model, Document, Types } from "mongoose"

export interface ITrainerSalary extends Document {
  // Basic Information
  trainerId: Types.ObjectId
  
  // Salary Period
  salaryMonth: number  // 1-12
  salaryYear: number
  
  // Salary Components
  baseSalary: number
  performanceBonus?: number
  housingAllowance?: number
  transportAllowance?: number
  mealAllowance?: number
  specialAllowance?: number
  overtimeAmount?: number
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
  
  // Class-based Earnings
  classesAssigned: number
  classesCompleted: number
  hourlyRate: number
  totalHours: number
  classBasedEarnings: number
  
  // Payment Information
  paymentStatus: "pending" | "processing" | "paid" | "cancelled"
  paymentMethod?: "bank_transfer" | "cash" | "cheque" | "upi"
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

const trainerSalarySchema = new Schema<ITrainerSalary>(
  {
    // Basic Information
    trainerId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    
    // Salary Period
    salaryMonth: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 12 
    },
    salaryYear: { 
      type: Number, 
      required: true,
      min: 2020,
      max: 2030
    },
    
    // Salary Components
    baseSalary: { 
      type: Number, 
      required: true, 
      min: 0 
    },
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
    
    // Class-based Earnings
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
    
    // Payment Information
    paymentStatus: { 
      type: String, 
      enum: ["pending", "processing", "paid", "cancelled"], 
      default: "pending" 
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

// Compound index for unique salary per trainer per month/year
trainerSalarySchema.index(
  { trainerId: 1, salaryMonth: 1, salaryYear: 1 }, 
  { unique: true }
)

// Additional indexes for performance
trainerSalarySchema.index({ trainerId: 1, createdAt: -1 })
trainerSalarySchema.index({ paymentStatus: 1 })
trainerSalarySchema.index({ salaryYear: 1, salaryMonth: 1 })
trainerSalarySchema.index({ approvedBy: 1 })
trainerSalarySchema.index({ createdAt: -1 })

// Pre-save middleware to calculate totals
trainerSalarySchema.pre('save', function(next) {
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

// Virtual for trainer details (populated)
trainerSalarySchema.virtual('trainer', {
  ref: 'User',
  localField: 'trainerId',
  foreignField: '_id',
  justOne: true
})

// Virtual for creator details (populated)
trainerSalarySchema.virtual('creator', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true
})

// Virtual for approver details (populated)
trainerSalarySchema.virtual('approver', {
  ref: 'User',
  localField: 'approvedBy',
  foreignField: '_id',
  justOne: true
})

// Virtual for salary period display
trainerSalarySchema.virtual('salaryPeriod').get(function() {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return `${months[this.salaryMonth - 1]} ${this.salaryYear}`
})

// Virtual for completion percentage
trainerSalarySchema.virtual('completionPercentage').get(function() {
  if (this.classesAssigned === 0) return 0
  return Math.round((this.classesCompleted / this.classesAssigned) * 100)
})

// Virtual for payment status display
trainerSalarySchema.virtual('paymentStatusDisplay').get(function() {
  const statusMap: { [key: string]: string } = {
    pending: 'Pending',
    processing: 'Processing',
    paid: 'Paid',
    cancelled: 'Cancelled'
  }
  return statusMap[this.paymentStatus] || this.paymentStatus
})



export const TrainerSalaryModel = model<ITrainerSalary>("TrainerSalary", trainerSalarySchema)