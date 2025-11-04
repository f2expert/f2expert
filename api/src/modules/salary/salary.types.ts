import { Types } from "mongoose"

export interface SalaryDTO {
  employeeId: string
  
  // Salary Period (supporting both formats)
  payPeriod?: {
    month: number
    year: number
    startDate?: string | Date
    endDate?: string | Date
  }
  salaryMonth?: number  // For backward compatibility
  salaryYear?: number   // For backward compatibility
  
  // Salary Components (supporting both formats)
  basicSalary?: number  // New format
  baseSalary?: number   // Old format
  
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
  
  deductions?: {
    tax?: number
    pf?: number
    esi?: number
    advance?: number
    loan?: number
    other?: number
  }
  
  // Calculated fields
  grossSalary?: number
  totalDeductions?: number
  netSalary?: number
  
  // Class-based fields (for trainers)
  classesAssigned?: number
  classesCompleted?: number
  hourlyRate?: number
  totalHours?: number
  
  // Payment information (supporting both formats)
  status?: "pending" | "processing" | "paid" | "cancelled"  // New format
  paymentMode?: "bank_transfer" | "cash" | "cheque" | "upi"  // New format
  paymentMethod?: "bank_transfer" | "cash" | "cheque" | "upi"  // Old format
  remarks?: string
}

export interface UpdateSalaryDTO {
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
  // New format
  status?: "pending" | "processing" | "paid" | "cancelled"
  paymentMode?: "bank_transfer" | "cash" | "cheque" | "upi"
  
  // Old format (for backward compatibility)
  paymentStatus?: "pending" | "processing" | "paid" | "cancelled"
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
  employees: Array<{
    employeeId: string
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
  employeeId?: string
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
  employeeId?: string
  departmentFilter?: string
  paymentStatus?: "pending" | "processing" | "paid" | "cancelled"
  reportType?: "summary" | "detailed" | "employee_wise" | "department_wise"
}

export interface SalaryCalculationParams {
  employeeId: string
  salaryMonth: number
  salaryYear: number
  includeClassBasedEarnings?: boolean
  includePerformanceBonus?: boolean
}

export interface SalaryResponse {
  _id: string
  employeeId: {
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
  salaries: SalaryResponse[]
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

export interface EmployeeWiseSalaryReport {
  _id: string
  employeeName: string
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
  employeeCount: number
  totalSalaries: number
  totalGrossSalary: number
  totalNetSalary: number
  avgNetSalary: number
}

export interface DetailedSalaryReport {
  employeeId: string
  employeeName: string
  employeeIdNumber: string
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
  | EmployeeWiseSalaryReport[]
  | DepartmentWiseSalaryReport[]
  | DetailedSalaryReport[]