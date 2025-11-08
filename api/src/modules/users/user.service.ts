import { UserModel } from "./user.model"
import { 
  IUserDTO, 
  ICreateUserRequest, 
  IUpdateUserRequest,
  IUpdateStudentInfoRequest,
  IUpdateTrainerInfoRequest,
  IUpdateAdminInfoRequest 
} from "./user.types"
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

// Basic CRUD Operations
export const getAllUsers = async (role?: string, isActive?: boolean) => {
  const filter: any = {}
  if (role) filter.role = role
  if (isActive !== undefined) filter.isActive = isActive
  
  return UserModel.find(filter).select('-password')
}

export const getUserById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID format')
  }
  return UserModel.findById(id).select('-password')
}

export const getUserByEmail = async (email: string) => {
  return UserModel.findOne({ email: email.toLowerCase() })
}

export const createUser = async (payload: ICreateUserRequest) => {
  // Check if email already exists
  const existingUser = await getUserByEmail(payload.email)
  if (existingUser) {
    throw new Error('Email already exists')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(payload.password, 12)
  
  // Generate role-specific IDs
  const userData: any = {
    ...payload,
    password: hashedPassword,
    email: payload.email.toLowerCase()
  }

  // Generate role-specific information
  if (payload.role === 'student') {
    userData.studentInfo = {
      studentId: await generateStudentId(),
      enrollmentDate: new Date(),
      // Include student-specific fields from payload
      ...(payload.educationLevel && { educationLevel: payload.educationLevel }),
      ...(payload.previousExperience && { previousExperience: payload.previousExperience }),
      ...(payload.careerGoals && { careerGoals: payload.careerGoals }),
      ...(payload.emergencyContact && { emergencyContact: payload.emergencyContact })
    }
  } else if (payload.role === 'trainer') {
    userData.trainerInfo = {
      employeeId: await generateEmployeeId('TR'),
      // Include trainer-specific fields from payload
      ...(payload.department && { department: payload.department }),
      ...(payload.specializations && { specializations: payload.specializations }),
      ...(payload.experience && { experience: payload.experience }),
      ...(payload.qualifications && { qualifications: payload.qualifications }),
      ...(payload.certifications && { certifications: payload.certifications }),
      ...(payload.expertise && { expertise: payload.expertise }),
      ...(payload.hourlyRate && { hourlyRate: payload.hourlyRate })
    }
  } else if (payload.role === 'admin') {
    userData.adminInfo = {
      employeeId: await generateEmployeeId('AD'),
      accessLevel: payload.accessLevel || 'admin',
      // Include admin-specific fields from payload
      ...(payload.department && { department: payload.department }),
      ...(payload.permissions && { permissions: payload.permissions })
    }
  }

  // Remove role-specific fields from the root level before creating user
  const roleSpecificFields = [
    'educationLevel', 'previousExperience', 'careerGoals',
    'department', 'specializations', 'experience', 'qualifications', 
    'certifications', 'expertise', 'hourlyRate', 'permissions', 'accessLevel'
  ]
  
  roleSpecificFields.forEach(field => {
    delete userData[field]
  })

  const user = await UserModel.create(userData)
  return user.toObject()
}

export const updateUser = async (id: string, payload: IUpdateUserRequest) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID format')
  }

  // Check if email is being updated and if it already exists
  if (payload.email) {
    const existingUser = await UserModel.findOne({ 
      email: payload.email.toLowerCase(), 
      _id: { $ne: id } 
    })
    if (existingUser) {
      throw new Error('Email already exists')
    }
    payload.email = payload.email.toLowerCase()
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    id, 
    payload, 
    { new: true, runValidators: true }
  ).select('-password')
  
  return updatedUser
}

export const deleteUser = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID format')
  }
  return UserModel.findByIdAndDelete(id)
}

// Role-specific operations
export const getUsersByRole = async (role: 'admin' | 'trainer' | 'student') => {
  return UserModel.find({ role, isActive: true }).select('-password')
}

export const updateStudentInfo = async (userId: string, payload: IUpdateStudentInfoRequest) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format')
  }

  const user = await UserModel.findById(userId)
  if (!user || user.role !== 'student') {
    throw new Error('User not found or not a student')
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { studentInfo: { ...user.studentInfo, ...payload } } },
    { new: true, runValidators: true }
  ).select('-password')

  return updatedUser
}

export const updateTrainerInfo = async (userId: string, payload: IUpdateTrainerInfoRequest) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format')
  }

  const user = await UserModel.findById(userId)
  if (!user || user.role !== 'trainer') {
    throw new Error('User not found or not a trainer')
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { trainerInfo: { ...user.trainerInfo, ...payload } } },
    { new: true, runValidators: true }
  ).select('-password')

  return updatedUser
}

export const updateAdminInfo = async (userId: string, payload: IUpdateAdminInfoRequest) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format')
  }

  const user = await UserModel.findById(userId)
  if (!user || user.role !== 'admin') {
    throw new Error('User not found or not an admin')
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { adminInfo: { ...user.adminInfo, ...payload } } },
    { new: true, runValidators: true }
  ).select('-password')

  return updatedUser
}

// Password operations
export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format')
  }

  const user = await UserModel.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
  if (!isCurrentPasswordValid) {
    throw new Error('Current password is incorrect')
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 12)

  await UserModel.findByIdAndUpdate(userId, { 
    password: hashedNewPassword,
    lastLogin: new Date()
  })

  return { message: 'Password changed successfully' }
}

// Statistics and analytics
export const getUserStats = async () => {
  const stats = await UserModel.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        active: {
          $sum: {
            $cond: [{ $eq: ['$isActive', true] }, 1, 0]
          }
        }
      }
    }
  ])

  const totalUsers = await UserModel.countDocuments()
  const activeUsers = await UserModel.countDocuments({ isActive: true })

  return {
    totalUsers,
    activeUsers,
    roleBreakdown: stats,
    inactiveUsers: totalUsers - activeUsers
  }
}

// Search and filtering
export const searchUsers = async (searchTerm: string, role?: string, limit = 20) => {
  const query: any = {
    $or: [
      { firstName: { $regex: searchTerm, $options: 'i' } },
      { lastName: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } }
    ]
  }

  if (role) {
    query.role = role
  }

  return UserModel.find(query)
    .select('-password')
    .limit(limit)
    .sort({ firstName: 1, lastName: 1 })
}

// Utility functions
async function generateStudentId(): Promise<string> {
  const year = new Date().getFullYear()
  const lastStudent = await UserModel.findOne(
    { 'studentInfo.studentId': { $exists: true } },
    {},
    { sort: { 'studentInfo.studentId': -1 } }
  )
  
  let nextNumber = 1
  if (lastStudent?.studentInfo?.studentId) {
    const lastNumber = parseInt(lastStudent.studentInfo.studentId.slice(-4))
    nextNumber = lastNumber + 1
  }
  
  return `STU${year}${nextNumber.toString().padStart(4, '0')}`
}

async function generateEmployeeId(prefix: string): Promise<string> {
  const year = new Date().getFullYear().toString().slice(-2)
  const lastEmployee = await UserModel.findOne(
    {
      $or: [
        { 'trainerInfo.employeeId': { $regex: `^${prefix}${year}` } },
        { 'adminInfo.employeeId': { $regex: `^${prefix}${year}` } }
      ]
    },
    {},
    { sort: { createdAt: -1 } }
  )
  
  let nextNumber = 1
  if (lastEmployee) {
    const employeeId = lastEmployee.trainerInfo?.employeeId || lastEmployee.adminInfo?.employeeId
    if (employeeId) {
      const lastNumber = parseInt(employeeId.slice(-3))
      nextNumber = lastNumber + 1
    }
  }
  
  return `${prefix}${year}${nextNumber.toString().padStart(3, '0')}`
}

// Refresh Token Management Functions
export const addRefreshToken = async (userId: string, refreshToken: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format')
  }

  await UserModel.findByIdAndUpdate(
    userId,
    { 
      $push: { refreshTokens: refreshToken },
      $currentDate: { lastLogin: true }
    }
  )
}

export const removeRefreshToken = async (userId: string, refreshToken: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format')
  }

  await UserModel.findByIdAndUpdate(
    userId,
    { $pull: { refreshTokens: refreshToken } }
  )
}

export const removeAllRefreshTokens = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format')
  }

  await UserModel.findByIdAndUpdate(
    userId,
    { 
      $set: { refreshTokens: [] },
      $inc: { refreshTokenVersion: 1 }
    }
  )
}

export const updateLastLogin = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format')
  }

  await UserModel.findByIdAndUpdate(
    userId,
    { $currentDate: { lastLogin: true } }
  )
}

export const validateRefreshToken = async (userId: string, refreshToken: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return false
  }

  const user = await UserModel.findById(userId)
  if (!user || !user.refreshTokens) {
    return false
  }

  return user.refreshTokens.includes(refreshToken)
}
