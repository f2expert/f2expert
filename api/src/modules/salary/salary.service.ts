import { Types } from "mongoose"
import { SalaryModel, ISalary } from "./salary.model"
import { UserModel } from "../users/user.model"
import { ScheduleClassModel } from "../schedule-classes/schedule-class.model"

// Transform response data for clean API output
const transformResponseData = (salary: any) => {
  if (!salary) return salary;
  
  const transformed = {
    id: salary._id,
    employeeId: salary.employeeId ? {
      id: salary.employeeId._id,
      firstName: salary.employeeId.firstName,
      lastName: salary.employeeId.lastName,
      fullName: salary.employeeId.fullName,
      email: salary.employeeId.email,
      employeeCode: salary.employeeId.trainerInfo?.employeeId || null
    } : salary.employeeId,
    
    // Salary Period - prioritize new format
    payPeriod: salary.payPeriod || {
      month: salary.salaryMonth,
      year: salary.salaryYear,
      startDate: null,
      endDate: null
    },
    
    // Salary Components - use new format structure
    basicSalary: salary.basicSalary || salary.baseSalary,
    allowances: salary.allowances || {
      hra: salary.housingAllowance || 0,
      transport: salary.transportAllowance || 0,
      medical: salary.mealAllowance || 0,
      performance: salary.performanceBonus || 0,
      other: salary.specialAllowance || 0,
      overtime: salary.overtimeAmount || 0
    },
    
    deductions: salary.deductions,
    
    // Calculated fields
    grossSalary: salary.grossSalary,
    totalDeductions: salary.totalDeductions,
    netSalary: salary.netSalary,
    
    // Class information (mainly for trainers)
    classInfo: {
      assigned: salary.classesAssigned || 0,
      completed: salary.classesCompleted || 0,
      hourlyRate: salary.hourlyRate || 0,
      totalHours: salary.totalHours || 0,
      earnings: salary.classBasedEarnings || 0,
      completionRate: salary.completionPercentage || 0
    },
    
    // Payment information - use new format
    paymentInfo: {
      status: salary.status || salary.paymentStatus,
      method: salary.paymentMode || salary.paymentMethod,
      date: salary.paymentDate,
      reference: salary.paymentReference
    },
    
    // Metadata
    remarks: salary.remarks,
    approvedBy: salary.approvedBy ? {
      id: salary.approvedBy._id,
      name: salary.approvedBy.fullName || `${salary.approvedBy.firstName} ${salary.approvedBy.lastName}`
    } : null,
    approvalDate: salary.approvalDate,
    createdBy: salary.createdBy ? {
      id: salary.createdBy._id,
      name: salary.createdBy.fullName || `${salary.createdBy.firstName} ${salary.createdBy.lastName}`
    } : salary.createdBy,
    createdAt: salary.createdAt,
    updatedAt: salary.updatedAt
  };
  
  return transformed;
};

// Transform payload to handle both new and old formats
const transformPayloadFormat = (payload: CreateSalaryDTO): any => {
  const transformed: any = { ...payload }
  
  // Handle salary period transformation
  if (payload.payPeriod) {
    transformed.salaryMonth = payload.payPeriod.month
    transformed.salaryYear = payload.payPeriod.year
    // Keep payPeriod for the new format
    if (payload.payPeriod.startDate) {
      transformed.payPeriod.startDate = new Date(payload.payPeriod.startDate)
    }
    if (payload.payPeriod.endDate) {
      transformed.payPeriod.endDate = new Date(payload.payPeriod.endDate)
    }
  }
  
  // Handle salary amount transformation
  if (payload.basicSalary && !payload.baseSalary) {
    transformed.baseSalary = payload.basicSalary
  }
  
  // Handle allowances transformation (convert structured to individual fields)
  if (payload.allowances) {
    const allowances = payload.allowances
    if (allowances.hra) transformed.housingAllowance = allowances.hra
    if (allowances.transport) transformed.transportAllowance = allowances.transport
    if (allowances.medical) transformed.mealAllowance = allowances.medical
    if (allowances.performance) transformed.performanceBonus = allowances.performance
    if (allowances.other) transformed.specialAllowance = allowances.other
  }
  
  // Handle payment information transformation
  if (payload.status && !payload.status) {
    transformed.paymentStatus = payload.status
  }
  if (payload.paymentMode && !payload.paymentMethod) {
    transformed.paymentMethod = payload.paymentMode
  }
  
  // Calculate gross salary if provided
  if (payload.grossSalary) {
    transformed.grossSalary = payload.grossSalary
  }
  
  // Calculate total deductions if provided
  if (payload.totalDeductions) {
    transformed.totalDeductions = payload.totalDeductions
  }
  
  // Calculate net salary if provided
  if (payload.netSalary) {
    transformed.netSalary = payload.netSalary
  }
  
  return transformed
}

export interface CreateSalaryDTO {
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
    hra?: number        
    transport?: number  
    medical?: number    
    performance?: number 
    other?: number      
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
  
  classesAssigned?: number
  classesCompleted?: number
  hourlyRate?: number
  totalHours?: number
  
  // Payment information (supporting both formats)
  status?: string       // New format
  paymentMode?: string  // New format  
  paymentMethod?: string // Old format
  remarks?: string
  createdBy: string
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
  classBasedEarnings?: number
  paymentMethod?: string
  remarks?: string
  updatedBy?: string
}

export interface SalaryQueryParams {
  page?: number
  limit?: number
  employeeId?: string
  salaryMonth?: number
  salaryYear?: number
  paymentStatus?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface BulkSalaryData {
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
  createdBy: string
}

// Get all salaries with filtering and pagination
export const getAllSalaries = async (queryParams: SalaryQueryParams) => {
  const {
    page = 1,
    limit = 10,
    employeeId,
    salaryMonth,
    salaryYear,
    paymentStatus,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = queryParams

  // Build filter query
  const filter: any = {}
  if (employeeId) filter.employeeId = employeeId
  if (salaryMonth) filter.salaryMonth = salaryMonth
  if (salaryYear) filter.salaryYear = salaryYear
  if (paymentStatus) filter.paymentStatus = paymentStatus

  // Build sort query
  const sort: any = {}
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1

  const skip = (page - 1) * limit

  const [salaries, totalCount] = await Promise.all([
    SalaryModel.find(filter)
      .populate('employeeId', 'firstName lastName email trainerInfo.employeeId trainerInfo.department')
      .populate('createdBy', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    SalaryModel.countDocuments(filter)
  ])

  // Transform response data for clean output
  const transformedSalaries = salaries.map(transformResponseData)
  
  return {
    salaries: transformedSalaries,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasNext: page < Math.ceil(totalCount / limit),
      hasPrev: page > 1
    }
  }
}

// Get salary by ID
export const getSalaryById = async (id: string) => {
  const salary = await SalaryModel.findById(id)
    .populate('employeeId', 'firstName lastName email phone trainerInfo')
    .populate('createdBy', 'firstName lastName')
    .populate('approvedBy', 'firstName lastName')
  
  return salary ? transformResponseData(salary) : null
}

// Get salary by employee and period
export const getSalaryByPeriod = async (
  employeeId: string,
  month: number,
  year: number
) => {
  const salary = await SalaryModel.findOne({
    employeeId: employeeId,
    $or: [
      { salaryMonth: month, salaryYear: year },
      { 'payPeriod.month': month, 'payPeriod.year': year }
    ]
  }).populate('employeeId', 'firstName lastName email trainerInfo.employeeId')
    .populate('createdBy', 'firstName lastName')
    .populate('approvedBy', 'firstName lastName')
  
  return salary ? transformResponseData(salary) : null
}

// Create new salary
export const createSalary = async (payload: CreateSalaryDTO) => {
  // Transform payload to handle both new and old formats
  const transformedPayload = transformPayloadFormat(payload)
  
  // Check if employee exists
  const employee = await UserModel.findOne({
    _id: payload.employeeId,
    isActive: true
  })
  
  if (!employee) {
    throw new Error('Employee not found or inactive')
  }

  // Get salary month and year from either format
  const salaryMonth = transformedPayload.salaryMonth
  const salaryYear = transformedPayload.salaryYear

  // Check if salary already exists for this period
  const existingSalary = await SalaryModel.findOne({
    employeeId: payload.employeeId,
    $or: [
      { salaryMonth: salaryMonth, salaryYear: salaryYear },
      { 'payPeriod.month': salaryMonth, 'payPeriod.year': salaryYear }
    ]
  })

  if (existingSalary) {
    throw new Error(`Salary already exists for ${salaryMonth}/${salaryYear}`)
  }

  // Calculate class-based earnings if not provided (primarily for trainers)
  let classBasedEarnings = 0
  if (transformedPayload.hourlyRate && transformedPayload.totalHours) {
    classBasedEarnings = transformedPayload.hourlyRate * transformedPayload.totalHours
  }

  const salaryData = {
    ...transformedPayload,
    classBasedEarnings,
    employeeId: new Types.ObjectId(payload.employeeId),
    createdBy: new Types.ObjectId(payload.createdBy)
  }

  const salary = new SalaryModel(salaryData)
  const savedSalary = await salary.save()
  
  // Populate and transform the response
  const populatedSalary = await SalaryModel.findById(savedSalary._id)
    .populate('employeeId', 'firstName lastName email trainerInfo.employeeId')
    .populate('createdBy', 'firstName lastName')
    .populate('approvedBy', 'firstName lastName')
  
  return transformResponseData(populatedSalary)
}

// Update salary
export const updateSalary = async (id: string, payload: UpdateSalaryDTO) => {
  const salary = await SalaryModel.findById(id)
  
  if (!salary) {
    throw new Error('Salary not found')
  }

  if (salary.paymentStatus === 'paid') {
    throw new Error('Cannot update paid salary')
  }

  // Calculate class-based earnings if hourly rate or total hours are updated
  let updatePayload: any = { ...payload }
  if (payload.hourlyRate !== undefined || payload.totalHours !== undefined) {
    const hourlyRate = payload.hourlyRate ?? salary.hourlyRate
    const totalHours = payload.totalHours ?? salary.totalHours
    updatePayload.classBasedEarnings = hourlyRate * totalHours
  }

  if (updatePayload.updatedBy) {
    updatePayload.updatedBy = new Types.ObjectId(updatePayload.updatedBy) as any
  }

  const updatedSalary = await SalaryModel.findByIdAndUpdate(
    id,
    updatePayload,
    { new: true, runValidators: true }
  ).populate('employeeId', 'firstName lastName email trainerInfo.employeeId')

  return updatedSalary
}

// Update payment status
export const updatePaymentStatus = async (
  id: string,
  paymentStatus: string,
  paymentDetails?: {
    paymentMethod?: string
    paymentReference?: string
    remarks?: string
  },
  updatedBy?: string
) => {
  const salary = await SalaryModel.findById(id)
  
  if (!salary) {
    throw new Error('Salary not found')
  }

  const updateData: any = {
    paymentStatus,
    status: paymentStatus, // Also update the new format field
    ...paymentDetails
  }
  
  // Handle both payment method formats
  if (paymentDetails?.paymentMethod) {
    updateData.paymentMode = paymentDetails.paymentMethod
  }

  if (paymentStatus === 'paid') {
    updateData.paymentDate = new Date()
  }

  if (updatedBy) {
    updateData.updatedBy = new Types.ObjectId(updatedBy)
  }

  const updatedSalary = await SalaryModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('employeeId', 'firstName lastName email trainerInfo.employeeId')
    .populate('createdBy', 'firstName lastName')
    .populate('approvedBy', 'firstName lastName')

  return updatedSalary ? transformResponseData(updatedSalary) : null
}

// Approve salary
export const approveSalary = async (
  id: string,
  approved: boolean,
  approvedBy: string,
  remarks?: string
) => {
  const salary = await SalaryModel.findById(id)
  
  if (!salary) {
    throw new Error('Salary not found')
  }

  if (salary.approvedBy) {
    throw new Error('Salary already processed for approval')
  }

  const updateData: any = {
    approvedBy: new Types.ObjectId(approvedBy),
    approvalDate: new Date()
  }

  if (remarks) {
    updateData.remarks = remarks
  }

  if (approved) {
    updateData.paymentStatus = 'processing'
  } else {
    updateData.paymentStatus = 'cancelled'
  }

  const updatedSalary = await SalaryModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('employeeId', 'firstName lastName email')
    .populate('approvedBy', 'firstName lastName')

  return updatedSalary
}

// Delete salary
export const deleteSalary = async (id: string) => {
  const salary = await SalaryModel.findById(id)
  
  if (!salary) {
    throw new Error('Salary not found')
  }

  if (salary.paymentStatus === 'paid') {
    throw new Error('Cannot delete paid salary')
  }

  return SalaryModel.findByIdAndDelete(id)
}

// Bulk create salaries
export const bulkCreateSalaries = async (bulkData: BulkSalaryData) => {
  const { salaryMonth, salaryYear, employees, createdBy } = bulkData

  // Check if any salaries already exist for this period
  const employeeIds = employees.map(e => e.employeeId)
  const existingSalaries = await SalaryModel.find({
    employeeId: { $in: employeeIds },
    salaryMonth,
    salaryYear
  })

  if (existingSalaries.length > 0) {
    const existingEmployeeIds = existingSalaries.map(s => s.employeeId.toString())
    throw new Error(`Salaries already exist for employees: ${existingEmployeeIds.join(', ')}`)
  }

  // Validate all employees exist
  const validEmployees = await UserModel.find({
    _id: { $in: employeeIds },
    isActive: true
  })

  if (validEmployees.length !== employees.length) {
    throw new Error('Some employees not found or inactive')
  }

  // Prepare salary documents
  const salaryDocs = employees.map(employee => {
    let classBasedEarnings = 0
    if (employee.hourlyRate && employee.totalHours) {
      classBasedEarnings = employee.hourlyRate * employee.totalHours
    }

    return {
      ...employee,
      salaryMonth,
      salaryYear,
      classBasedEarnings,
      employeeId: new Types.ObjectId(employee.employeeId),
      createdBy: new Types.ObjectId(createdBy)
    }
  })

  return SalaryModel.insertMany(salaryDocs)
}

// Get salary summary for a period
export const getSalarySummary = async (month?: number, year?: number) => {
  const match: any = {}
  if (month) match.salaryMonth = month
  if (year) match.salaryYear = year
  
  const summary = await SalaryModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalSalaries: { $sum: 1 },
        totalGrossSalary: { $sum: "$grossSalary" },
        totalDeductions: { $sum: "$totalDeductions" },
        totalNetSalary: { $sum: "$netSalary" },
        pendingPayments: {
          $sum: { $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0] }
        },
        processingPayments: {
          $sum: { $cond: [{ $eq: ["$paymentStatus", "processing"] }, 1, 0] }
        },
        paidPayments: {
          $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] }
        }
      }
    }
  ])
  
  return summary[0] || {
    totalSalaries: 0,
    totalGrossSalary: 0,
    totalDeductions: 0,
    totalNetSalary: 0,
    pendingPayments: 0,
    processingPayments: 0,
    paidPayments: 0
  }
}

// Calculate automatic salary based on classes (primarily for trainers)
export const calculateAutomaticSalary = async (
  employeeId: string,
  month: number,
  year: number,
  includeClassBasedEarnings = true,
  includePerformanceBonus = true
) => {
  // Get employee details
  const employee = await UserModel.findOne({
    _id: employeeId,
    isActive: true
  })

  if (!employee) {
    throw new Error('Employee not found or inactive')
  }

  // Get employee's base salary and hourly rate from profile
  const baseSalary = employee.trainerInfo?.hourlyRate ? employee.trainerInfo.hourlyRate * 160 : 0 // Assuming 160 hours/month
  const hourlyRate = employee.trainerInfo?.hourlyRate || 0

  let calculatedData: any = {
    employeeId,
    baseSalary,
    hourlyRate,
    classesAssigned: 0,
    classesCompleted: 0,
    totalHours: 0,
    classBasedEarnings: 0,
    performanceBonus: 0
  }

  // Class-based calculations primarily for trainers
  if (includeClassBasedEarnings && employee.role === 'trainer') {
    // Calculate start and end dates for the month
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    // Get scheduled classes for the trainer in the month
    const classes = await ScheduleClassModel.find({
      instructorId: employeeId,
      scheduledDate: {
        $gte: startDate,
        $lte: endDate
      }
    })

    const completedClasses = classes.filter(c => c.status === 'completed')
    const totalDuration = completedClasses.reduce((total, cls) => {
      return total + (cls.duration || 0) / 60 // Convert minutes to hours
    }, 0)

    calculatedData = {
      ...calculatedData,
      classesAssigned: classes.length,
      classesCompleted: completedClasses.length,
      totalHours: totalDuration,
      classBasedEarnings: totalDuration * hourlyRate
    }

    // Calculate performance bonus based on completion rate
    if (includePerformanceBonus && classes.length > 0) {
      const completionRate = completedClasses.length / classes.length
      if (completionRate >= 0.95) {
        calculatedData.performanceBonus = baseSalary * 0.1 // 10% bonus for 95%+ completion
      } else if (completionRate >= 0.9) {
        calculatedData.performanceBonus = baseSalary * 0.05 // 5% bonus for 90%+ completion
      }
    }
  }

  return calculatedData
}

// Get employee salary history
export const getEmployeeSalaryHistory = async (
  employeeId: string,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit

  const [salaries, totalCount] = await Promise.all([
    SalaryModel.find({ employeeId })
      .sort({ salaryYear: -1, salaryMonth: -1 })
      .skip(skip)
      .limit(limit),
    SalaryModel.countDocuments({ employeeId })
  ])

  return {
    salaries,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasNext: page < Math.ceil(totalCount / limit),
      hasPrev: page > 1
    }
  }
}

// Get pending payments
export const getPendingPayments = async () => {
  return SalaryModel.find({
    paymentStatus: { $in: ['pending', 'processing'] }
  })
    .populate('employeeId', 'firstName lastName email trainerInfo.employeeId')
    .sort({ createdAt: -1 })
}

// Generate salary report
export const generateSalaryReport = async (
  startMonth?: number,
  endMonth?: number,
  startYear?: number,
  endYear?: number,
  employeeId?: string,
  departmentFilter?: string,
  paymentStatus?: string,
  reportType = 'summary'
) => {
  const matchQuery: any = {}

  // Date range filter
  if (startMonth && startYear) {
    matchQuery.$and = matchQuery.$and || []
    matchQuery.$and.push({
      $or: [
        { salaryYear: { $gt: startYear } },
        { $and: [{ salaryYear: startYear }, { salaryMonth: { $gte: startMonth } }] }
      ]
    })
  }

  if (endMonth && endYear) {
    matchQuery.$and = matchQuery.$and || []
    matchQuery.$and.push({
      $or: [
        { salaryYear: { $lt: endYear } },
        { $and: [{ salaryYear: endYear }, { salaryMonth: { $lte: endMonth } }] }
      ]
    })
  }

  if (employeeId) {
    matchQuery.employeeId = new Types.ObjectId(employeeId)
  }

  if (paymentStatus) {
    matchQuery.paymentStatus = paymentStatus
  }

  let pipeline: any[] = [{ $match: matchQuery }]

  // Add employee lookup
  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'employeeId',
      foreignField: '_id',
      as: 'employee'
    }
  })

  pipeline.push({ $unwind: '$employee' })

  // Department filter
  if (departmentFilter) {
    pipeline.push({
      $match: {
        'employee.trainerInfo.department': departmentFilter
      }
    })
  }

  // Generate different report types
  switch (reportType) {
    case 'summary':
      pipeline.push({
        $group: {
          _id: null,
          totalSalaries: { $sum: 1 },
          totalGrossSalary: { $sum: '$grossSalary' },
          totalDeductions: { $sum: '$totalDeductions' },
          totalNetSalary: { $sum: '$netSalary' },
          avgNetSalary: { $avg: '$netSalary' },
          pendingCount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } },
          processingCount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'processing'] }, 1, 0] } },
          paidCount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] } }
        }
      })
      break

    case 'employee_wise':
      pipeline.push({
        $group: {
          _id: '$employeeId',
          employeeName: { $first: { $concat: ['$employee.firstName', ' ', '$employee.lastName'] } },
          employeeIdNumber: { $first: '$employee.trainerInfo.employeeId' },
          department: { $first: '$employee.trainerInfo.department' },
          totalSalaries: { $sum: 1 },
          totalGrossSalary: { $sum: '$grossSalary' },
          totalNetSalary: { $sum: '$netSalary' },
          avgNetSalary: { $avg: '$netSalary' },
          lastSalaryDate: { $max: '$createdAt' }
        }
      })
      pipeline.push({ $sort: { totalNetSalary: -1 } })
      break

    case 'department_wise':
      pipeline.push({
        $group: {
          _id: '$employee.trainerInfo.department',
          department: { $first: '$employee.trainerInfo.department' },
          employeeCount: { $addToSet: '$employeeId' },
          totalSalaries: { $sum: 1 },
          totalGrossSalary: { $sum: '$grossSalary' },
          totalNetSalary: { $sum: '$netSalary' },
          avgNetSalary: { $avg: '$netSalary' }
        }
      })
      pipeline.push({
        $project: {
          department: 1,
          employeeCount: { $size: '$employeeCount' },
          totalSalaries: 1,
          totalGrossSalary: 1,
          totalNetSalary: 1,
          avgNetSalary: 1
        }
      })
      break

    default: // detailed
      pipeline.push({
        $project: {
          employeeId: 1,
          employeeName: { $concat: ['$employee.firstName', ' ', '$employee.lastName'] },
          employeeIdNumber: '$employee.trainerInfo.employeeId',
          department: '$employee.trainerInfo.department',
          salaryMonth: 1,
          salaryYear: 1,
          baseSalary: 1,
          grossSalary: 1,
          totalDeductions: 1,
          netSalary: 1,
          paymentStatus: 1,
          paymentDate: 1,
          createdAt: 1
        }
      })
      pipeline.push({ $sort: { salaryYear: -1, salaryMonth: -1 } })
  }

  return SalaryModel.aggregate(pipeline)
}