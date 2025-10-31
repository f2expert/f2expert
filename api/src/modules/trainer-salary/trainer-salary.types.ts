import { Types } from "mongoose"

export interface TrainerSalaryDTO {
  trainerId: string
  salaryMonth: number
  salaryYear: number
  baseSalary: number
  performanceBonus?: number
  housingAllowance?: number
  transportAllowance?: number
  mealAllowance?: number
  specialAllowance?: number
  overtimeAmount?: number
  deductions?: {
    tax?: number
    pf?: number
    esi?: number
    advance?: number
    loan?: number
    other?: number
  }
  classesAssigned?: number
  classesCompleted?: number
  hourlyRate?: number
  totalHours?: number
  paymentMethod?: "bank_transfer" | "cash" | "cheque" | "upi"
  remarks?: string
}

export interface UpdateTrainerSalaryDTO {
  baseSalary?: number
  performanceBonus?: number
  housingAllowance?: number
  transportAllowance?: number
  mealAllowance?: number
  specialAllowance?: number
  overtimeAmount?: number
  deductions?: {
    tax?: number
    pf?: number
    esi?: number
    advance?: number
    loan?: number
    other?: number
  }
  classesAssigned?: number
  classesCompleted?: number
  hourlyRate?: number
  totalHours?: number
  paymentMethod?: "bank_transfer" | "cash" | "cheque" | "upi"
  remarks?: string
}

export interface PaymentStatusUpdateDTO {
  paymentStatus: "pending" | "processing" | "paid" | "cancelled"
  paymentMethod?: "bank_transfer" | "cash" | "cheque" | "upi"
  paymentReference?: string
  remarks?: string
}

export interface SalaryApprovalDTO {
  approved: boolean
  remarks?: string
}

export interface BulkSalaryCreationDTO {
  salaryMonth: number
  salaryYear: number
  trainers: Array<{
    trainerId: string
    baseSalary: number
    performanceBonus?: number
    housingAllowance?: number
    transportAllowance?: number
    mealAllowance?: number
    specialAllowance?: number
    overtimeAmount?: number
    deductions?: {
      tax?: number
      pf?: number
      esi?: number
      advance?: number
      loan?: number
      other?: number
    }
    classesAssigned?: number
    classesCompleted?: number
    hourlyRate?: number
    totalHours?: number
    remarks?: string
  }>
}

export interface SalaryQueryParams {
  page?: number
  limit?: number
  trainerId?: string
  salaryMonth?: number
  salaryYear?: number
  paymentStatus?: "pending" | "processing" | "paid" | "cancelled"
  sortBy?: "createdAt" | "salaryMonth" | "salaryYear" | "netSalary" | "paymentStatus"
  sortOrder?: "asc" | "desc"
}

export interface SalaryReportParams {
  startMonth?: number
  endMonth?: number
  startYear?: number
  endYear?: number
  trainerId?: string
  departmentFilter?: string
  paymentStatus?: "pending" | "processing" | "paid" | "cancelled"
  reportType?: "summary" | "detailed" | "trainer_wise" | "department_wise"
}

export interface SalaryCalculationParams {
  trainerId: string
  salaryMonth: number
  salaryYear: number
  includeClassBasedEarnings?: boolean
  includePerformanceBonus?: boolean
}

export interface TrainerSalaryResponse {
  _id: string
  trainerId: {
    _id: string
    firstName: string
    lastName: string
    email: string
    trainerInfo?: {
      employeeId?: string
      department?: string
    }
  }
  salaryMonth: number
  salaryYear: number
  salaryPeriod: string
  baseSalary: number
  performanceBonus: number
  housingAllowance: number
  transportAllowance: number
  mealAllowance: number
  specialAllowance: number
  overtimeAmount: number
  deductions: {
    tax: number
    pf: number
    esi: number
    advance: number
    loan: number
    other: number
  }
  grossSalary: number
  totalDeductions: number
  netSalary: number
  classesAssigned: number
  classesCompleted: number
  completionPercentage: number
  hourlyRate: number
  totalHours: number
  classBasedEarnings: number
  paymentStatus: "pending" | "processing" | "paid" | "cancelled"
  paymentStatusDisplay: string
  paymentMethod?: "bank_transfer" | "cash" | "cheque" | "upi"
  paymentDate?: Date
  paymentReference?: string
  remarks?: string
  approvedBy?: {
    _id: string
    firstName: string
    lastName: string
  }
  approvalDate?: Date
  createdBy: {
    _id: string
    firstName: string
    lastName: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface PaginatedSalaryResponse {
  salaries: TrainerSalaryResponse[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SalarySummary {
  totalSalaries: number
  totalGrossSalary: number
  totalDeductions: number
  totalNetSalary: number
  avgNetSalary?: number
  pendingPayments: number
  processingPayments: number
  paidPayments: number
}

export interface TrainerWiseSalaryReport {
  _id: string
  trainerName: string
  employeeId: string
  department: string
  totalSalaries: number
  totalGrossSalary: number
  totalNetSalary: number
  avgNetSalary: number
  lastSalaryDate: Date
}

export interface DepartmentWiseSalaryReport {
  _id: string
  department: string
  trainerCount: number
  totalSalaries: number
  totalGrossSalary: number
  totalNetSalary: number
  avgNetSalary: number
}

export interface DetailedSalaryReport {
  trainerId: string
  trainerName: string
  employeeId: string
  department: string
  salaryMonth: number
  salaryYear: number
  baseSalary: number
  grossSalary: number
  totalDeductions: number
  netSalary: number
  paymentStatus: string
  paymentDate?: Date
  createdAt: Date
}

export type SalaryReportData = 
  | SalarySummary[]
  | TrainerWiseSalaryReport[]
  | DepartmentWiseSalaryReport[]
  | DetailedSalaryReport[]