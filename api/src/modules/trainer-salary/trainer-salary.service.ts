import { Types } from "mongoose"
import { TrainerSalaryModel, ITrainerSalary } from "./trainer-salary.model"
import { UserModel } from "../users/user.model"
import { ScheduleClassModel } from "../schedule-classes/schedule-class.model"

export interface CreateTrainerSalaryDTO {
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
  paymentMethod?: string
  remarks?: string
  createdBy: string
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
  classBasedEarnings?: number
  paymentMethod?: string
  remarks?: string
  updatedBy?: string
}

export interface SalaryQueryParams {
  page?: number
  limit?: number
  trainerId?: string
  salaryMonth?: number
  salaryYear?: number
  paymentStatus?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface BulkSalaryData {
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
  createdBy: string
}

// Get all trainer salaries with filtering and pagination
export const getAllTrainerSalaries = async (queryParams: SalaryQueryParams) => {
  const {
    page = 1,
    limit = 10,
    trainerId,
    salaryMonth,
    salaryYear,
    paymentStatus,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = queryParams

  // Build filter query
  const filter: any = {}
  if (trainerId) filter.trainerId = trainerId
  if (salaryMonth) filter.salaryMonth = salaryMonth
  if (salaryYear) filter.salaryYear = salaryYear
  if (paymentStatus) filter.paymentStatus = paymentStatus

  // Build sort query
  const sort: any = {}
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1

  const skip = (page - 1) * limit

  const [salaries, totalCount] = await Promise.all([
    TrainerSalaryModel.find(filter)
      .populate('trainerId', 'firstName lastName email trainerInfo.employeeId trainerInfo.department')
      .populate('createdBy', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    TrainerSalaryModel.countDocuments(filter)
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

// Get trainer salary by ID
export const getTrainerSalaryById = async (id: string) => {
  return TrainerSalaryModel.findById(id)
    .populate('trainerId', 'firstName lastName email phone trainerInfo')
    .populate('createdBy', 'firstName lastName')
    .populate('approvedBy', 'firstName lastName')
}

// Get trainer salary by trainer and period
export const getTrainerSalaryByPeriod = async (
  trainerId: string,
  month: number,
  year: number
) => {
  return TrainerSalaryModel.findOne({
    trainerId: trainerId,
    salaryMonth: month,
    salaryYear: year
  }).populate('trainerId', 'firstName lastName email trainerInfo.employeeId')
}

// Create new trainer salary
export const createTrainerSalary = async (payload: CreateTrainerSalaryDTO) => {
  // Check if trainer exists
  const trainer = await UserModel.findOne({
    _id: payload.trainerId,
    role: 'trainer',
    isActive: true
  })
  
  if (!trainer) {
    throw new Error('Trainer not found or inactive')
  }

  // Check if salary already exists for this period
  const existingSalary = await TrainerSalaryModel.findOne({
    trainerId: payload.trainerId,
    salaryMonth: payload.salaryMonth,
    salaryYear: payload.salaryYear
  })

  if (existingSalary) {
    throw new Error(`Salary already exists for ${payload.salaryMonth}/${payload.salaryYear}`)
  }

  // Calculate class-based earnings if not provided
  let classBasedEarnings = 0
  if (payload.hourlyRate && payload.totalHours) {
    classBasedEarnings = payload.hourlyRate * payload.totalHours
  }

  const salaryData = {
    ...payload,
    classBasedEarnings,
    trainerId: new Types.ObjectId(payload.trainerId),
    createdBy: new Types.ObjectId(payload.createdBy)
  }

  const salary = new TrainerSalaryModel(salaryData)
  return salary.save()
}

// Update trainer salary
export const updateTrainerSalary = async (id: string, payload: UpdateTrainerSalaryDTO) => {
  const salary = await TrainerSalaryModel.findById(id)
  
  if (!salary) {
    throw new Error('Trainer salary not found')
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

  const updatedSalary = await TrainerSalaryModel.findByIdAndUpdate(
    id,
    updatePayload,
    { new: true, runValidators: true }
  ).populate('trainerId', 'firstName lastName email trainerInfo.employeeId')

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
  const salary = await TrainerSalaryModel.findById(id)
  
  if (!salary) {
    throw new Error('Trainer salary not found')
  }

  const updateData: any = {
    paymentStatus,
    ...paymentDetails
  }

  if (paymentStatus === 'paid') {
    updateData.paymentDate = new Date()
  }

  if (updatedBy) {
    updateData.updatedBy = new Types.ObjectId(updatedBy)
  }

  const updatedSalary = await TrainerSalaryModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('trainerId', 'firstName lastName email')

  return updatedSalary
}

// Approve salary
export const approveSalary = async (
  id: string,
  approved: boolean,
  approvedBy: string,
  remarks?: string
) => {
  const salary = await TrainerSalaryModel.findById(id)
  
  if (!salary) {
    throw new Error('Trainer salary not found')
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

  const updatedSalary = await TrainerSalaryModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('trainerId', 'firstName lastName email')
    .populate('approvedBy', 'firstName lastName')

  return updatedSalary
}

// Delete trainer salary
export const deleteTrainerSalary = async (id: string) => {
  const salary = await TrainerSalaryModel.findById(id)
  
  if (!salary) {
    throw new Error('Trainer salary not found')
  }

  if (salary.paymentStatus === 'paid') {
    throw new Error('Cannot delete paid salary')
  }

  return TrainerSalaryModel.findByIdAndDelete(id)
}

// Bulk create salaries
export const bulkCreateSalaries = async (bulkData: BulkSalaryData) => {
  const { salaryMonth, salaryYear, trainers, createdBy } = bulkData

  // Check if any salaries already exist for this period
  const trainerIds = trainers.map(t => t.trainerId)
  const existingSalaries = await TrainerSalaryModel.find({
    trainerId: { $in: trainerIds },
    salaryMonth,
    salaryYear
  })

  if (existingSalaries.length > 0) {
    const existingTrainerIds = existingSalaries.map(s => s.trainerId.toString())
    throw new Error(`Salaries already exist for trainers: ${existingTrainerIds.join(', ')}`)
  }

  // Validate all trainers exist
  const validTrainers = await UserModel.find({
    _id: { $in: trainerIds },
    role: 'trainer',
    isActive: true
  })

  if (validTrainers.length !== trainers.length) {
    throw new Error('Some trainers not found or inactive')
  }

  // Prepare salary documents
  const salaryDocs = trainers.map(trainer => {
    let classBasedEarnings = 0
    if (trainer.hourlyRate && trainer.totalHours) {
      classBasedEarnings = trainer.hourlyRate * trainer.totalHours
    }

    return {
      ...trainer,
      salaryMonth,
      salaryYear,
      classBasedEarnings,
      trainerId: new Types.ObjectId(trainer.trainerId),
      createdBy: new Types.ObjectId(createdBy)
    }
  })

  return TrainerSalaryModel.insertMany(salaryDocs)
}

// Get salary summary for a period
export const getSalarySummary = async (month?: number, year?: number) => {
  const match: any = {}
  if (month) match.salaryMonth = month
  if (year) match.salaryYear = year
  
  const summary = await TrainerSalaryModel.aggregate([
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

// Calculate automatic salary based on classes
export const calculateAutomaticSalary = async (
  trainerId: string,
  month: number,
  year: number,
  includeClassBasedEarnings = true,
  includePerformanceBonus = true
) => {
  // Get trainer details
  const trainer = await UserModel.findOne({
    _id: trainerId,
    role: 'trainer',
    isActive: true
  })

  if (!trainer) {
    throw new Error('Trainer not found or inactive')
  }

  // Get trainer's base salary and hourly rate from profile
  const baseSalary = trainer.trainerInfo?.hourlyRate ? trainer.trainerInfo.hourlyRate * 160 : 0 // Assuming 160 hours/month
  const hourlyRate = trainer.trainerInfo?.hourlyRate || 0

  let calculatedData: any = {
    trainerId,
    baseSalary,
    hourlyRate,
    classesAssigned: 0,
    classesCompleted: 0,
    totalHours: 0,
    classBasedEarnings: 0,
    performanceBonus: 0
  }

  if (includeClassBasedEarnings) {
    // Calculate start and end dates for the month
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    // Get scheduled classes for the trainer in the month
    const classes = await ScheduleClassModel.find({
      instructorId: trainerId,
      startTime: {
        $gte: startDate,
        $lte: endDate
      }
    })

    const completedClasses = classes.filter(c => c.status === 'completed')
    const totalDuration = completedClasses.reduce((total, cls) => {
      const duration = (new Date(cls.endTime).getTime() - new Date(cls.startTime).getTime()) / (1000 * 60 * 60)
      return total + duration
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

// Get trainer salary history
export const getTrainerSalaryHistory = async (
  trainerId: string,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit

  const [salaries, totalCount] = await Promise.all([
    TrainerSalaryModel.find({ trainerId })
      .sort({ salaryYear: -1, salaryMonth: -1 })
      .skip(skip)
      .limit(limit),
    TrainerSalaryModel.countDocuments({ trainerId })
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
  return TrainerSalaryModel.find({
    paymentStatus: { $in: ['pending', 'processing'] }
  })
    .populate('trainerId', 'firstName lastName email trainerInfo.employeeId')
    .sort({ createdAt: -1 })
}

// Generate salary report
export const generateSalaryReport = async (
  startMonth?: number,
  endMonth?: number,
  startYear?: number,
  endYear?: number,
  trainerId?: string,
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

  if (trainerId) {
    matchQuery.trainerId = new Types.ObjectId(trainerId)
  }

  if (paymentStatus) {
    matchQuery.paymentStatus = paymentStatus
  }

  let pipeline: any[] = [{ $match: matchQuery }]

  // Add trainer lookup
  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'trainerId',
      foreignField: '_id',
      as: 'trainer'
    }
  })

  pipeline.push({ $unwind: '$trainer' })

  // Department filter
  if (departmentFilter) {
    pipeline.push({
      $match: {
        'trainer.trainerInfo.department': departmentFilter
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

    case 'trainer_wise':
      pipeline.push({
        $group: {
          _id: '$trainerId',
          trainerName: { $first: { $concat: ['$trainer.firstName', ' ', '$trainer.lastName'] } },
          employeeId: { $first: '$trainer.trainerInfo.employeeId' },
          department: { $first: '$trainer.trainerInfo.department' },
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
          _id: '$trainer.trainerInfo.department',
          department: { $first: '$trainer.trainerInfo.department' },
          trainerCount: { $addToSet: '$trainerId' },
          totalSalaries: { $sum: 1 },
          totalGrossSalary: { $sum: '$grossSalary' },
          totalNetSalary: { $sum: '$netSalary' },
          avgNetSalary: { $avg: '$netSalary' }
        }
      })
      pipeline.push({
        $project: {
          department: 1,
          trainerCount: { $size: '$trainerCount' },
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
          trainerId: 1,
          trainerName: { $concat: ['$trainer.firstName', ' ', '$trainer.lastName'] },
          employeeId: '$trainer.trainerInfo.employeeId',
          department: '$trainer.trainerInfo.department',
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

  return TrainerSalaryModel.aggregate(pipeline)
}