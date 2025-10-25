import { Request, Response } from "express"
import * as EnrollmentService from "./enrollment.service"
import { sendResponse, sendError } from "../../app/utils/response.util"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"
import { MESSAGES } from "../../app/constants/message.constant"
import { ApiResponse } from "../../app/types/ApiResponse.interface"
/**
 * @openapi
 * /enrollments:
 *   get:
 *     tags:
 *       - Enrollment
 *     summary: Retrieve all enrollments
 *     responses:
 *       200:
 *         description: List of enrollments
 */
export const getAll = async (_req: Request, res: Response) => {
  try {
    const enrollments = await EnrollmentService.getAllEnrollments()
    if(!enrollments.length) return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.ENROLLMENT_NOT_FOUND)
    
    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: enrollments
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /enrollments/{id}:
 *   get:
 *     tags:
 *       - Enrollment
 *     summary: Retrieve enrollment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollment details
 */
export const getById = async (req: Request, res: Response) => {
  try {
    const enrollment = await EnrollmentService.getEnrollmentById(req.params.id)
    if(!enrollment) return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.ENROLLMENT_NOT_FOUND)

    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: enrollment
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /enrollments:
 *   post:
 *     tags:
 *       - Enrollment
 *     summary: Create a new enrollment
 *     requestBody:
 *       required: true
 *       description: New enrollment details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - courseId
 *             properties:
 *               userId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [enrolled, completed, cancelled]
 *                 default: enrolled
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 */
export const create = async (req: Request, res: Response) => {
  try {
    const newEnrollment = await EnrollmentService.createEnrollment(req.body)

    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: newEnrollment
    }
    return sendResponse(res, HTTP_STATUS.CREATED, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /enrollments/{id}:
 *   put:
 *     tags:
 *       - Enrollment
 *     summary: Update enrollment details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Enrollment ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Fields to update (all fields are optional, at least one required)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID (optional, typically not changed)
 *                 example: "68f21bbfcc61757d1a5a287c"
 *               courseId:
 *                 type: string
 *                 description: Course ID (optional, typically not changed)
 *                 example: "68ea3d080c5167bd4aaec90f"
 *               status:
 *                 type: string
 *                 enum: [enrolled, completed, cancelled]
 *                 description: Enrollment status
 *                 example: "cancelled"
 *           examples:
 *             statusUpdate:
 *               summary: Update enrollment status
 *               value:
 *                 status: "cancelled"
 *             fullUpdate:
 *               summary: Update multiple fields
 *               value:
 *                 userId: "68f21bbfcc61757d1a5a287c"
 *                 courseId: "68ea3d080c5167bd4aaec90f"
 *                 status: "cancelled"
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
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
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     courseId:
 *                       type: string
 *                     enrolledAt:
 *                       type: string
 *                     status:
 *                       type: string
 */
export const update = async (req: Request, res: Response) => {
  try {
    const updatedEnrollment = await EnrollmentService.updateEnrollment(req.params.id, req.body)
    if(!updatedEnrollment) return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.ENROLLMENT_NOT_FOUND)

    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: updatedEnrollment
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /enrollments/{id}:
 *   delete:
 *     tags:
 *       - Enrollment
 *     summary: Delete enrollment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Enrollment ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
export const remove = async (req: Request, res: Response) => {
  try {
    await EnrollmentService.deleteEnrollment(req.params.id)
    return sendResponse(res, HTTP_STATUS.OK, null, MESSAGES.ENROLLMENT_DELETED)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /enrollments/user/{userId}:
 *   get:
 *     tags:
 *       - Enrollment
 *     summary: Get enrollments by user ID
 *     description: |
 *       Retrieve all enrollments for a specific user with populated course details.
 *       
 *       **Features:**
 *       - Returns all enrollments for the specified user
 *       - Includes detailed course information
 *       - Shows enrollment status and dates
 *       - Useful for user dashboard and progress tracking
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to get enrollments for
 *         example: "68f21bbfcc61757d1a5a287c"
 *     responses:
 *       200:
 *         description: User enrollments retrieved successfully
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
 *                   example: "User enrollments retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Enrollment ID
 *                       userId:
 *                         type: string
 *                         description: User ID
 *                       status:
 *                         type: string
 *                         enum: [enrolled, completed, cancelled]
 *                         description: Enrollment status
 *                       enrolledAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date of enrollment
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Last update date
 *                       courseId:
 *                         type: object
 *                         description: Course details
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           instructor:
 *                             type: string
 *                           category:
 *                             type: string
 *                           level:
 *                             type: string
 *                           price:
 *                             type: number
 *                           thumbnailUrl:
 *                             type: string
 *                           duration:
 *                             type: string
 *                           totalHours:
 *                             type: number
 *                           rating:
 *                             type: number
 *                           totalStudents:
 *                             type: number
 *       404:
 *         description: No enrollments found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No enrollments found for this user"
 *                 data:
 *                   type: array
 *                   example: []
 *       400:
 *         description: Invalid user ID format
 *       500:
 *         description: Internal server error
 */
export const getEnrollmentsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    
    // Validate userId format (basic ObjectId validation)
    if (!userId || userId.length !== 24) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Invalid user ID format")
    }
    
    const enrollments = await EnrollmentService.getEnrollmentsByUserId(userId)
    
    if (!enrollments || enrollments.length === 0) {
      return sendResponse(res, HTTP_STATUS.OK, [], "No enrollments found for this user")
    }
    
    return sendResponse(res, HTTP_STATUS.OK, enrollments, "User enrollments retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message || "Failed to retrieve user enrollments")
  }
}
