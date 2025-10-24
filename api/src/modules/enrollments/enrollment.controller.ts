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
 *       description: Fields to update (userId, courseId, status)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [enrolled, completed, cancelled]
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
