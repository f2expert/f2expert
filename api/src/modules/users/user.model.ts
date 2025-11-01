import { Schema, model, Document } from "mongoose"

export interface IUser extends Document {
  // Basic Information
  firstName: string
  lastName: string
  email: string
  password: string
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
  isActive: boolean
  isEmailVerified: boolean
  isPhoneVerified?: boolean
  
  // Profile Information
  photo?: string // URL to user's profile photo
  bio?: string
  
  // Emergency Contact (common for all roles)
  emergencyContact?: {
    name?: string
    phone?: string
    relationship?: string
    email?: string
  }
  
  // Role-specific Information
  studentInfo?: {
    studentId?: string
    enrollmentDate?: Date
    educationLevel?: "high_school" | "bachelor" | "master" | "phd" | "other"
    previousExperience?: string
    careerGoals?: string
  }
  
  trainerInfo?: {
    employeeId?: string
    department?: string
    specializations?: string[]
    experience?: number // years of experience
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
  
  // Security and Verification
  lastLogin?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  emailVerificationToken?: string
  emailVerificationExpires?: Date
  
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
  
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    // Basic Information
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      trim: true 
    },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true },
    dateOfBirth: { type: Date },
    gender: { 
      type: String, 
      enum: ["male", "female", "other"] 
    },
    
    // Address Information
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: "India" },
      zipCode: { type: String, trim: true }
    },
    
    // Role and Status
    role: { 
      type: String, 
      enum: ["admin", "trainer", "student"], 
      required: true,
      default: "student" 
    },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    
    // Profile Information
    photo: { type: String },
    bio: { type: String, maxlength: 500 },
    
    // Emergency Contact (common for all roles)
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String },
      email: { type: String }
    },
    
    // Role-specific Information
    studentInfo: {
      studentId: { type: String, unique: true, sparse: true },
      enrollmentDate: { type: Date, default: Date.now },
      educationLevel: { 
        type: String, 
        enum: ["high_school", "bachelor", "master", "phd", "other"] 
      },
      previousExperience: { type: String, maxlength: 1000 },
      careerGoals: { type: String, maxlength: 1000 }
    },
    
    trainerInfo: {
      employeeId: { type: String, unique: true, sparse: true },
      department: { type: String },
      specializations: [{ type: String }],
      experience: { type: Number, min: 0 }, // years
      qualifications: [{ type: String }],
      certifications: [{
        name: { type: String, required: true },
        issuedBy: { type: String, required: true },
        issuedDate: { type: Date, required: true },
        expiryDate: { type: Date },
        certificateUrl: { type: String }
      }],
      expertise: [{ type: String }],
      hourlyRate: { type: Number, min: 0 }
    },
    
    adminInfo: {
      employeeId: { type: String, unique: true, sparse: true },
      department: { type: String },
      permissions: [{ type: String }],
      accessLevel: { 
        type: String, 
        enum: ["super_admin", "admin", "manager"],
        default: "admin"
      }
    },
    
    // Security and Verification
    lastLogin: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    
    // Preferences
    preferences: {
      language: { type: String, default: "en" },
      timezone: { type: String, default: "Asia/Kolkata" },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true }
      }
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.emailVerificationToken;
        return ret;
      }
    }
  }
)

// Indexes for better performance
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ "studentInfo.studentId": 1 })
userSchema.index({ "trainerInfo.employeeId": 1 })
userSchema.index({ "adminInfo.employeeId": 1 })
userSchema.index({ isActive: 1 })
userSchema.index({ createdAt: -1 })

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim()
})

// Virtual for role display
userSchema.virtual('roleDisplay').get(function() {
  if (!this.role || typeof this.role !== 'string') {
    return 'Unknown'
  }
  return this.role.charAt(0).toUpperCase() + this.role.slice(1)
})

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })

export const UserModel = model<IUser>("User", userSchema)
