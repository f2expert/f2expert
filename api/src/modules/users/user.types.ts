export interface IUserDTO {
  id?: string
  
  // Basic Information
  firstName: string
  lastName: string
  email: string
  password?: string // Optional for responses
  phone?: string
  dateOfBirth?: Date
  gender?: "male" | "female" | "other"
  
  // Address Information
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  
  // Role and Status
  role: "admin" | "trainer" | "student"
  isActive?: boolean
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  
  // Profile Information
  photo?: string // URL to user's profile photo
  bio?: string
  
  // Role-specific Information
  studentInfo?: {
    studentId?: string
    enrollmentDate?: Date
    emergencyContact?: {
      name?: string
      phone?: string
      relationship?: string
    }
    educationLevel?: "high_school" | "bachelor" | "master" | "phd" | "other"
    previousExperience?: string
    careerGoals?: string
  }
  
  trainerInfo?: {
    employeeId?: string
    department?: string
    specializations?: string[]
    experience?: number
    qualifications?: string[]
    certifications?: {
      name: string
      issuedBy: string
      issuedDate: Date
      expiryDate?: Date
      certificateUrl?: string
    }[]
    expertise?: string[]
    hourlyRate?: number
  }
  
  adminInfo?: {
    employeeId?: string
    department?: string
    permissions?: string[]
    accessLevel?: "super_admin" | "admin" | "manager"
  }
  
  // Preferences
  preferences?: {
    language?: string
    timezone?: string
    notifications?: {
      email?: boolean
      sms?: boolean
      push?: boolean
    }
  }
  
  // Virtual fields
  fullName?: string
  roleDisplay?: string
  
  // Timestamps
  createdAt?: Date
  updatedAt?: Date
  lastLogin?: Date
}

// Create User Request Interface
export interface ICreateUserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  role: "admin" | "trainer" | "student"
  dateOfBirth?: Date
  gender?: "male" | "female" | "other"
  photo?: string // URL to user's profile photo
  bio?: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  emergencyContact?: {
    name?: string
    phone?: string
    relationship?: string
    email?: string
  }
  
  // Student specific fields (can be provided at root level)
  educationLevel?: "high_school" | "bachelor" | "master" | "phd" | "other"
  previousExperience?: string
  careerGoals?: string
  
  // Trainer specific fields (can be provided at root level)
  department?: string
  specializations?: string[]
  experience?: number
  qualifications?: string[]
  certifications?: {
    name: string
    issuedBy: string
    issuedDate: Date
    expiryDate?: Date
    certificateUrl?: string
  }[]
  expertise?: string[]
  hourlyRate?: number
  
  // Admin specific fields (can be provided at root level)
  permissions?: string[]
  accessLevel?: "super_admin" | "admin" | "manager"
}

// Update User Request Interface
export interface IUpdateUserRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: Date
  gender?: "male" | "female" | "other"
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  bio?: string
  photo?: string // URL to user's profile photo
  isActive?: boolean
}

// Role-specific update interfaces
export interface IUpdateStudentInfoRequest {
  emergencyContact?: {
    name?: string
    phone?: string
    relationship?: string
  }
  educationLevel?: "high_school" | "bachelor" | "master" | "phd" | "other"
  previousExperience?: string
  careerGoals?: string
}

export interface IUpdateTrainerInfoRequest {
  department?: string
  specializations?: string[]
  experience?: number
  qualifications?: string[]
  certifications?: {
    name: string
    issuedBy: string
    issuedDate: Date
    expiryDate?: Date
    certificateUrl?: string
  }[]
  expertise?: string[]
  hourlyRate?: number
}

export interface IUpdateAdminInfoRequest {
  department?: string
  permissions?: string[]
  accessLevel?: "super_admin" | "admin" | "manager"
}
