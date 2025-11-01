import { Request, Response } from "express"
import * as UserService from "./user.service"
import * as EnrollmentService from "../enrollments/enrollment.service"
import { sendError, sendResponse } from "../../app/utils/response.util"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"
import { ICreateUserRequest, IUpdateUserRequest } from "./user.types"
import { IUser } from "./user.model"
import { deletePhotoFile, getPhotoUrl } from "../../app/middlewares/upload.middleware"
import { generateToken } from "../../app/utils/jwt.util"
import { comparePassword } from "../../app/utils/hash.util"
import path from "path"

/**
 * @openapi
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *           maxLength: 200
 *         city:
 *           type: string
 *           maxLength: 100
 *         state:
 *           type: string
 *           maxLength: 100
 *         country:
 *           type: string
 *           maxLength: 100
 *           default: "India"
 *         zipCode:
 *           type: string
 *           maxLength: 10
 *
 *     EmergencyContact:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *         phone:
 *           type: string
 *         relationship:
 *           type: string
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *
 *     Certification:
 *       type: object
 *       required:
 *         - name
 *         - issuedBy
 *         - issuedDate
 *       properties:
 *         name:
 *           type: string
 *         issuedBy:
 *           type: string
 *         issuedDate:
 *           type: string
 *           format: date
 *         expiryDate:
 *           type: string
 *           format: date
 *         certificateUrl:
 *           type: string
 *           format: uri
 *
 *     StudentInfo:
 *       type: object
 *       properties:
 *         studentId:
 *           type: string
 *           example: "STU20240001"
 *         enrollmentDate:
 *           type: string
 *           format: date-time
 *         educationLevel:
 *           type: string
 *           enum: [high_school, bachelor, master, phd, other]
 *         previousExperience:
 *           type: string
 *           maxLength: 1000
 *         careerGoals:
 *           type: string
 *           maxLength: 1000
 *
 *     TrainerInfo:
 *       type: object
 *       properties:
 *         employeeId:
 *           type: string
 *           example: "TR24001"
 *         department:
 *           type: string
 *         specializations:
 *           type: array
 *           items:
 *             type: string
 *         experience:
 *           type: number
 *           minimum: 0
 *           maximum: 50
 *         qualifications:
 *           type: array
 *           items:
 *             type: string
 *         certifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Certification'
 *         expertise:
 *           type: array
 *           items:
 *             type: string
 *         hourlyRate:
 *           type: number
 *           minimum: 0
 *
 *     AdminInfo:
 *       type: object
 *       properties:
 *         employeeId:
 *           type: string
 *           example: "AD24001"
 *         department:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *         accessLevel:
 *           type: string
 *           enum: [super_admin, admin, manager]
 *
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - role
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: "John"
 *         lastName:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           example: "SecurePass123"
 *           description: "Must contain at least one uppercase, one lowercase letter and one number"
 *         phone:
 *           type: string
 *           example: "+91-9876543210"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         role:
 *           type: string
 *           enum: [admin, trainer, student]
 *           example: "student"
 *         emergencyContact:
 *           $ref: '#/components/schemas/EmergencyContact'
 *
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *         lastName:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         bio:
 *           type: string
 *           maxLength: 500
 *         photo:
 *           type: string
 *           format: uri
 *         isActive:
 *           type: boolean
 *         emergencyContact:
 *           $ref: '#/components/schemas/EmergencyContact'
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         role:
 *           type: string
 *           enum: [admin, trainer, student]
 *         isActive:
 *           type: boolean
 *         isEmailVerified:
 *           type: boolean
 *         photo:
 *           type: string
 *         bio:
 *           type: string
 *         emergencyContact:
 *           $ref: '#/components/schemas/EmergencyContact'
 *         studentInfo:
 *           $ref: '#/components/schemas/StudentInfo'
 *         trainerInfo:
 *           $ref: '#/components/schemas/TrainerInfo'
 *         adminInfo:
 *           $ref: '#/components/schemas/AdminInfo'
 *         fullName:
 *           type: string
 *         roleDisplay:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserStats:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: number
 *         activeUsers:
 *           type: number
 *         inactiveUsers:
 *           type: number
 *         roleBreakdown:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               count:
 *                 type: number
 *               active:
 *                 type: number
 *
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *         - confirmPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           description: "Must contain at least one uppercase, one lowercase letter and one number"
 *         confirmPassword:
 *           type: string
 *           description: "Must match newPassword"
 *
 * /users:
 *   get:
 *     tags:
 *       - User Management
 *     summary: Get all users
 *     description: Retrieve all users with optional filtering by role and status
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, trainer, student]
 *         description: Filter users by role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter users by active status
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Users retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserResponse'
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     tags:
 *       - User Management
 *     summary: Create a new user
 *     description: Register a new user (admin, trainer, or student) in the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error or email already exists
 *       500:
 *         description: Internal server error
 *
 * /users/search:
 *   get:
 *     tags:
 *       - User Management
 *     summary: Search users
 *     description: Search users by name or email with optional role filtering
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term (name or email)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, trainer, student]
 *         description: Filter by user role
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *           maximum: 100
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Search term is required
 *
 * /users/stats:
 *   get:
 *     tags:
 *       - User Management
 *     summary: Get user statistics
 *     description: Retrieve comprehensive user statistics including role breakdown
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserStats'
 *       500:
 *         description: Internal server error
 *
 * /users/{id}:
 *   get:
 *     tags:
 *       - User Management
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their unique identifier
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid user ID format
 *
 *   put:
 *     tags:
 *       - User Management
 *     summary: Update user profile
 *     description: Update user profile information (basic fields only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error or email already exists
 *       404:
 *         description: User not found
 *
 *   delete:
 *     tags:
 *       - User Management
 *     summary: Delete user
 *     description: Permanently delete a user from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid user ID format
 *
 * /users/{id}/change-password:
 *   post:
 *     tags:
 *       - User Management
 *     summary: Change user password
 *     description: Change password for a specific user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Password changed successfully"
 *       400:
 *         description: Invalid current password or validation error
 *
 * /users/{id}/student-info:
 *   put:
 *     tags:
 *       - Student Management
 *     summary: Update student-specific information
 *     description: Update additional information specific to student users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               educationLevel:
 *                 type: string
 *                 enum: [high_school, bachelor, master, phd, other]
 *               previousExperience:
 *                 type: string
 *                 maxLength: 1000
 *               careerGoals:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Student info updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: User not found or not a student
 *       404:
 *         description: Student not found
 *
 * /users/{id}/trainer-info:
 *   put:
 *     tags:
 *       - Trainer Management
 *     summary: Update trainer-specific information
 *     description: Update additional information specific to trainer users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trainer user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department:
 *                 type: string
 *                 maxLength: 100
 *               specializations:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 100
 *               experience:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 50
 *               qualifications:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 200
 *               certifications:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Certification'
 *               expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 100
 *               hourlyRate:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10000
 *     responses:
 *       200:
 *         description: Trainer info updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: User not found or not a trainer
 *       404:
 *         description: Trainer not found
 *
 * /users/{id}/admin-info:
 *   put:
 *     tags:
 *       - Admin Management
 *     summary: Update admin-specific information
 *     description: Update additional information specific to admin users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department:
 *                 type: string
 *                 maxLength: 100
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *               accessLevel:
 *                 type: string
 *                 enum: [super_admin, admin, manager]
 *     responses:
 *       200:
 *         description: Admin info updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: User not found or not an admin
 *       404:
 *         description: Admin not found
 */

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, isActive } = req.query
    const users = await UserService.getAllUsers(
      role as string, 
      isActive ? isActive === 'true' : undefined
    )
    return sendResponse(res, HTTP_STATUS.OK, users, "Users retrieved successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve users")
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await UserService.getUserById(id)
    
    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "User not found")
    }
    
    return sendResponse(res, HTTP_STATUS.OK, user, "User retrieved successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message || "Failed to retrieve user")
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData: ICreateUserRequest = req.body
    const user = await UserService.createUser(userData)
    return sendResponse(res, HTTP_STATUS.CREATED, user, "User created successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message || "Failed to create user")
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData: IUpdateUserRequest = req.body
    const user = await UserService.updateUser(id, updateData)
    
    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "User not found")
    }
    
    return sendResponse(res, HTTP_STATUS.OK, user, "User updated successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message || "Failed to update user")
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deletedUser = await UserService.deleteUser(id)
    
    if (!deletedUser) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "User not found")
    }
    
    return res.status(HTTP_STATUS.NO_CONTENT).send()
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message || "Failed to delete user")
  }
}

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { q, role, limit } = req.query
    
    if (!q) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Search term is required")
    }
    
    const users = await UserService.searchUsers(
      q as string, 
      role as string, 
      limit ? parseInt(limit as string) : undefined
    )
    
    return sendResponse(res, HTTP_STATUS.OK, users, "Search completed successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Search failed")
  }
}

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const stats = await UserService.getUserStats()
    return sendResponse(res, HTTP_STATUS.OK, stats, "User statistics retrieved successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve statistics")
  }
}

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { currentPassword, newPassword } = req.body
    
    const result = await UserService.changePassword(id, currentPassword, newPassword)
    return sendResponse(res, HTTP_STATUS.OK, result, "Password changed successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message || "Failed to change password")
  }
}

export const updateStudentInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await UserService.updateStudentInfo(id, req.body)
    
    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "Student not found")
    }
    
    return sendResponse(res, HTTP_STATUS.OK, user, "Student info updated successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message || "Failed to update student info")
  }
}

export const updateTrainerInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await UserService.updateTrainerInfo(id, req.body)
    
    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "Trainer not found")
    }
    
    return sendResponse(res, HTTP_STATUS.OK, user, "Trainer info updated successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message || "Failed to update trainer info")
  }
}

export const updateAdminInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await UserService.updateAdminInfo(id, req.body)
    
    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "Admin not found")
    }
    
    return sendResponse(res, HTTP_STATUS.OK, user, "Admin info updated successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message || "Failed to update admin info")
  }
}

/**
 * @openapi
 * /users/{id}/upload-photo:
 *   post:
 *     tags:
 *       - User Management
 *     summary: Upload user profile photo
 *     description: Upload a profile photo for a user (max 5MB, supports JPEG, PNG, GIF, WebP)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: User photo file
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     photoUrl:
 *                       type: string
 *                     filename:
 *                       type: string
 *       400:
 *         description: No file uploaded or invalid file type
 *       404:
 *         description: User not found
 *       413:
 *         description: File size too large
 */
export const uploadUserPhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    if (!req.file) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "No photo file uploaded")
    }

    // Get current user to check if they have an existing photo
    const currentUser = await UserService.getUserById(id)
    if (!currentUser) {
      // Delete uploaded file if user not found
      deletePhotoFile(req.file.path)
      return sendError(res, HTTP_STATUS.NOT_FOUND, "User not found")
    }

    // Delete old photo file if exists
    if (currentUser.photo) {
      const oldPhotoPath = path.join(process.cwd(), "uploads", "users", path.basename(currentUser.photo))
      deletePhotoFile(oldPhotoPath)
    }

    // Update user with new photo filename
    const photoUrl = getPhotoUrl(req.file.filename, req)
    const updatedUser = await UserService.updateUser(id, { photo: photoUrl })

    return sendResponse(res, HTTP_STATUS.OK, {
      photoUrl: photoUrl,
      filename: req.file.filename,
      user: updatedUser
    }, "Photo uploaded successfully")

  } catch (error: any) {
    // Delete uploaded file if there's an error
    if (req.file) {
      deletePhotoFile(req.file.path)
    }
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to upload photo")
  }
}

/**
 * @openapi
 * /users/{id}/delete-photo:
 *   delete:
 *     tags:
 *       - User Management
 *     summary: Delete user profile photo
 *     description: Remove the profile photo for a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Photo deleted successfully
 *       404:
 *         description: User not found or no photo to delete
 */
export const deleteUserPhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await UserService.getUserById(id)
    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "User not found")
    }

    if (!user.photo) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "No photo to delete")
    }

    // Delete photo file
    const photoPath = path.join(process.cwd(), "uploads", "users", path.basename(user.photo))
    deletePhotoFile(photoPath)

    // Update user to remove photo
    await UserService.updateUser(id, { photo: undefined })

    return sendResponse(res, HTTP_STATUS.OK, null, "Photo deleted successfully")

  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to delete photo")
  }
}

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags:
 *       - User Management
 *     summary: User login
 *     description: Authenticate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                           enum: [admin, trainer, student]
 *                         isActive:
 *                           type: boolean
 *                         photo:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                     token:
 *                       type: string
 *                       description: JWT authentication token
 *                     enrollments:
 *                       type: array
 *                       description: User's course enrollments (simplified)
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Enrollment ID
 *                             example: "68fbca0a93412e139f6f0868"
 *                           courseId:
 *                             type: string
 *                             description: Course ID
 *                             example: "68ea3d080c5167bd4aaec90f"
 *                           status:
 *                             type: string
 *                             enum: [enrolled, completed, cancelled]
 *                             description: Enrollment status
 *                             example: "enrolled"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Date of enrollment
 *                             example: "2025-10-24T18:48:42.408Z"
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Email and password are required")
    }

    // Find user by email (with all fields including role-specific info)
    const user = await UserService.getUserByEmail(email) as IUser | null
    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "User not found")
    }

    // Check if user is active
    if (!user.isActive) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "User account is deactivated")
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Invalid credentials")
    }

    // Generate JWT token
    const token = generateToken({ 
      id: (user._id as any).toString(), 
      email: user.email, 
      role: user.role 
    })

    // Get user enrollments (simplified for login response)
    console.log("Fetching enrollments for user ID:", (user._id as any).toString())
    const enrollments = await EnrollmentService.getEnrollmentsByUserIdSimplified((user._id as any).toString())
    console.log("Found enrollments:", enrollments)

    // Prepare complete user data with role-specific information
    const userData: any = {
      _id: (user._id as any).toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth?.toISOString().split('T')[0],
      gender: user.gender,
      address: user.address,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified || false,
      photo: user.photo,
      bio: user.bio,
      fullName: `${user.firstName} ${user.lastName}`,
      roleDisplay: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown',
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString()
    }

    // Add role-specific information based on user role
    if (user.role === 'student' && user.studentInfo) {
      userData.studentInfo = {
        ...user.studentInfo,
        enrollmentDate: user.studentInfo.enrollmentDate?.toISOString()
      }
    } else if (user.role === 'trainer' && user.trainerInfo) {
      userData.trainerInfo = {
        ...user.trainerInfo,
        certifications: user.trainerInfo.certifications?.map(cert => ({
          ...cert,
          issuedDate: cert.issuedDate?.toISOString().split('T')[0],
          expiryDate: cert.expiryDate?.toISOString().split('T')[0]
        }))
      }
    } else if (user.role === 'admin' && user.adminInfo) {
      userData.adminInfo = user.adminInfo
    }

    return sendResponse(res, HTTP_STATUS.OK, {
      user: userData,
      token,
      enrollments: enrollments || []
    }, "Login successful")

  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Login failed")
  }
}
