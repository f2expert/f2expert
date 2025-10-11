import { Request, Response } from "express"
import { MESSAGES } from "../../app/constants/message.constant"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"

import { sendError, sendResponse } from "../../app/utils/response.util"
import * as CourseService from "./course.service"
import { ApiResponse } from "../../app/types/ApiResponse.interface"
/**
 * @openapi
 * /courses:
 *   get:
 *     tags:
 *       - Course
 *     summary: Retrieve all courses
 *     responses:
 *       200:
 *         description: List of courses
 */
export const getAll = async (_req: Request, res: Response) => {
  try {
    const courses = await CourseService.getAllCourses()
    if(!courses.length) return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.COURSE_NOT_FOUND)
      
    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: courses
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /courses/{id}:
 *   get:
 *     tags:
 *       - Course
 *     summary: Retrieve course by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 */
export const getById = async (req: Request, res: Response) => {
  try {
    const course = await CourseService.getCourseById(req.params.id)
    if(!course) return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.COURSE_NOT_FOUND)
    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: course
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /courses:
 *   post:
 *     tags:
 *       - Course
 *     summary: Create a new course
 *     requestBody:
 *       required: true
 *       description: New course details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - instructor
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               instructor:
 *                 type: string
 *               price:
 *                 type: number
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Course created successfully
 */
export const create = async (req: Request, res: Response) => {
  try {
    const newCourse = await CourseService.createCourse(req.body)
    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: newCourse
    }
    return sendResponse(res, HTTP_STATUS.CREATED, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /courses/{id}:
 *   put:
 *     tags:
 *       - Course
 *     summary: Update course details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Fields to update (title, description, instructor, price, isPublished)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               instructor:
 *                 type: string
 *               price:
 *                 type: number
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Course updated successfully
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
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     instructor:
 *                       type: string
 *                     price:
 *                       type: number
 *                     isPublished:
 *                       type: boolean
 */
export const update = async (req: Request, res: Response) => {
  try {
    const updatedCourse = await CourseService.updateCourse(req.params.id, req.body)
    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: updatedCourse
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /courses/{id}:
 *   delete:
 *     tags:
 *       - Course
 *     summary: Delete course by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
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
    await CourseService.deleteCourse(req.params.id)
    return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.COURSE_DELETED)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
