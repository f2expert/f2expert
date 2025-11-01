import { Request, Response } from "express"
import { MESSAGES } from "../../app/constants/message.constant"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"
import { sendError, sendResponse } from "../../app/utils/response.util"
import * as ScheduleClassService from "./schedule-class.service"
import { ApiResponse } from "../../app/types/ApiResponse.interface"

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
 *     RecurringPattern:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *         interval:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         endDate:
 *           type: string
 *           format: date-time
 *         daysOfWeek:
 *           type: array
 *           items:
 *             type: integer
 *             minimum: 0
 *             maximum: 6
 *
 *     EnrolledStudent:
 *       type: object
 *       properties:
 *         studentId:
 *           type: string
 *         enrollmentDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [enrolled, waitlist, cancelled]
 *
 *     AttendanceRecord:
 *       type: object
 *       properties:
 *         studentId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [present, absent, late, excused]
 *         checkInTime:
 *           type: string
 *           format: date-time
 *         checkOutTime:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *           maxLength: 500
 *
 *     ClassMaterial:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *         description:
 *           type: string
 *           maxLength: 500
 *         fileUrl:
 *           type: string
 *           format: uri
 *         fileType:
 *           type: string
 *           maxLength: 50
 *         isRequired:
 *           type: boolean
 *           default: false
 *
 *     ClassAssignment:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *         description:
 *           type: string
 *           maxLength: 1000
 *         dueDate:
 *           type: string
 *           format: date-time
 *         isCompleted:
 *           type: boolean
 *           default: false
 *         submittedStudents:
 *           type: array
 *           items:
 *             type: string
 *
 *     ClassAnnouncement:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           maxLength: 1000
 *         createdAt:
 *           type: string
 *           format: date-time
 *         isUrgent:
 *           type: boolean
 *           default: false
 *         readBy:
 *           type: array
 *           items:
 *             type: string
 *
 *     ScheduleClass:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         courseId:
 *           type: string
 *         instructorId:
 *           type: string
 *         className:
 *           type: string
 *           example: "JavaScript Fundamentals - Session 1"
 *         description:
 *           type: string
 *           example: "Introduction to JavaScript basics and syntax"
 *         scheduledDate:
 *           type: string
 *           format: date
 *           example: "2025-11-15"
 *         startTime:
 *           type: string
 *           example: "09:00"
 *         endTime:
 *           type: string
 *           example: "12:00"
 *         duration:
 *           type: integer
 *           description: "Duration of the class in minutes (automatically calculated from startTime and endTime)"
 *           example: 180
 *           readOnly: true
 *         venue:
 *           type: string
 *           example: "Classroom A"
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         capacity:
 *           type: integer
 *           example: 30
 *         status:
 *           type: string
 *           enum: [scheduled, in-progress, completed, cancelled, rescheduled]
 *           example: "scheduled"
 *         isRecurring:
 *           type: boolean
 *           example: false
 *         recurringPattern:
 *           $ref: '#/components/schemas/RecurringPattern'
 *         enrolledStudents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EnrolledStudent'
 *         maxEnrollments:
 *           type: integer
 *           example: 25
 *         currentEnrollments:
 *           type: integer
 *           example: 18
 *         attendance:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttendanceRecord'
 *         materials:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ClassMaterial'
 *         assignments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ClassAssignment'
 *         announcements:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ClassAnnouncement'
 *         classNotes:
 *           type: string
 *         summary:
 *           type: string
 *         objectives:
 *           type: array
 *           items:
 *             type: string
 *         prerequisites:
 *           type: array
 *           items:
 *             type: string
 *         requiredMaterials:
 *           type: array
 *           items:
 *             type: string
 *         classPrice:
 *           type: number
 *           example: 500
 *         currency:
 *           type: string
 *           example: "INR"
 *         createdBy:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /schedule-classes:
 *   post:
 *     tags:
 *       - Schedule Classes
 *     summary: Create a new scheduled class
 *     description: |
 *       Create a new scheduled class for offline course delivery.
 *       
 *       **Features:**
 *       - Instructor and venue conflict detection
 *       - Automatic enrollment management
 *       - Recurring class support
 *       - Capacity management with waitlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - instructorId
 *               - className
 *               - scheduledDate
 *               - startTime
 *               - endTime
 *               - venue
 *               - capacity
 *               - createdBy
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               instructorId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               className:
 *                 type: string
 *                 example: "JavaScript Fundamentals - Session 1"
 *               description:
 *                 type: string
 *                 example: "Introduction to JavaScript basics and syntax"
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-15"
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 example: "12:00"
 *               venue:
 *                 type: string
 *                 example: "Classroom A"
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *               capacity:
 *                 type: integer
 *                 example: 30
 *               maxEnrollments:
 *                 type: integer
 *                 example: 25
 *               isRecurring:
 *                 type: boolean
 *                 example: false
 *               recurringPattern:
 *                 $ref: '#/components/schemas/RecurringPattern'
 *               objectives:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Understand JavaScript syntax", "Learn variables and data types"]
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Basic HTML knowledge", "Computer literacy"]
 *               requiredMaterials:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Laptop", "Notebook", "Pen"]
 *               classPrice:
 *                 type: number
 *                 example: 500
 *               currency:
 *                 type: string
 *                 example: "INR"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["javascript", "programming", "beginner"]
 *               createdBy:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439013"
 *     responses:
 *       201:
 *         description: Scheduled class created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error or scheduling conflict
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Course or instructor not found
 */
export const createScheduleClass = async (req: Request, res: Response) => {
  try {
    const scheduleClass = await ScheduleClassService.createScheduleClass(req.body)
    return sendResponse(res, HTTP_STATUS.CREATED, scheduleClass, "Scheduled class created successfully")
  } catch (err: any) {
    if (err.message.includes("not found") || err.message.includes("not a trainer")) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, err.message)
    }
    if (err.message.includes("conflict") || err.message.includes("already booked")) {
      return sendError(res, HTTP_STATUS.CONFLICT, err.message)
    }
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes:
 *   get:
 *     tags:
 *       - Schedule Classes
 *     summary: Retrieve all scheduled classes with filters
 *     description: |
 *       Get a list of scheduled classes with optional filtering and pagination.
 *       
 *       **Filter Options:**
 *       - Course ID
 *       - Instructor ID
 *       - Status
 *       - Date range
 *       - Venue
 *       - Student enrollment
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *       - in: query
 *         name: instructorId
 *         schema:
 *           type: string
 *         description: Filter by instructor ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, in-progress, completed, cancelled, rescheduled]
 *         description: Filter by class status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for date range filter
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for date range filter
 *       - in: query
 *         name: venue
 *         schema:
 *           type: string
 *         description: Filter by venue name (partial match)
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *         description: Filter classes where student is enrolled
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of classes per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [scheduledDate, className, createdAt, status, currentEnrollments]
 *           default: scheduledDate
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of scheduled classes retrieved successfully
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
 *                   example: "Scheduled classes retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     classes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ScheduleClass'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       500:
 *         description: Internal server error
 */
export const getScheduleClasses = async (req: Request, res: Response) => {
  try {
    const result = await ScheduleClassService.getScheduleClasses(req.query)
    return sendResponse(res, HTTP_STATUS.OK, result, "Scheduled classes retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/{id}:
 *   get:
 *     tags:
 *       - Schedule Classes
 *     summary: Get a scheduled class by ID
 *     description: |
 *       Retrieve detailed information about a specific scheduled class including:
 *       - Course and instructor details
 *       - Enrolled students and waitlist
 *       - Attendance records
 *       - Materials and assignments
 *       - Announcements
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled class ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Scheduled class retrieved successfully
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
 *                   example: "Scheduled class retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ScheduleClass'
 *       404:
 *         description: Scheduled class not found
 *       500:
 *         description: Internal server error
 */
export const getScheduleClassById = async (req: Request, res: Response) => {
  try {
    const scheduleClass = await ScheduleClassService.getScheduleClassById(req.params.id)
    if (!scheduleClass) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Scheduled class not found")
    }
    return sendResponse(res, HTTP_STATUS.OK, scheduleClass, "Scheduled class retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/{id}:
 *   put:
 *     tags:
 *       - Schedule Classes
 *     summary: Update a scheduled class
 *     description: |
 *       Update details of a scheduled class. Includes conflict detection
 *       for time and venue changes.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               className:
 *                 type: string
 *               description:
 *                 type: string
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               venue:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [scheduled, in-progress, completed, cancelled, rescheduled]
 *               maxEnrollments:
 *                 type: integer
 *               classNotes:
 *                 type: string
 *               summary:
 *                 type: string
 *               classPrice:
 *                 type: number
 *               lastModifiedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Scheduled class updated successfully
 *       400:
 *         description: Validation error or scheduling conflict
 *       404:
 *         description: Scheduled class not found
 *       401:
 *         description: Authentication required
 */
export const updateScheduleClass = async (req: Request, res: Response) => {
  try {
    const updatedClass = await ScheduleClassService.updateScheduleClass(req.params.id, req.body)
    if (!updatedClass) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Scheduled class not found")
    }
    return sendResponse(res, HTTP_STATUS.OK, updatedClass, "Scheduled class updated successfully")
  } catch (err: any) {
    if (err.message.includes("not found")) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, err.message)
    }
    if (err.message.includes("conflict") || err.message.includes("already booked")) {
      return sendError(res, HTTP_STATUS.CONFLICT, err.message)
    }
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/{id}:
 *   delete:
 *     tags:
 *       - Schedule Classes
 *     summary: Delete a scheduled class
 *     description: |
 *       Delete a scheduled class. This action cannot be undone.
 *       Consider changing status to 'cancelled' instead for record keeping.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled class ID
 *     responses:
 *       204:
 *         description: Scheduled class deleted successfully
 *       404:
 *         description: Scheduled class not found
 *       401:
 *         description: Authentication required
 */
export const deleteScheduleClass = async (req: Request, res: Response) => {
  try {
    const deleted = await ScheduleClassService.deleteScheduleClass(req.params.id)
    if (!deleted) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Scheduled class not found")
    }
    return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, "Scheduled class deleted successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/{id}/enroll:
 *   post:
 *     tags:
 *       - Class Enrollment
 *     summary: Enroll a student in a scheduled class
 *     description: |
 *       Enroll a student in a scheduled class. If the class is full,
 *       the student will be added to the waitlist automatically.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439013"
 *               status:
 *                 type: string
 *                 enum: [enrolled, waitlist]
 *                 default: enrolled
 *     responses:
 *       200:
 *         description: Student enrolled successfully
 *       400:
 *         description: Student already enrolled or validation error
 *       404:
 *         description: Class or student not found
 */
export const enrollStudentInClass = async (req: Request, res: Response) => {
  try {
    const { studentId, status } = req.body
    const updatedClass = await ScheduleClassService.enrollStudentInClass(req.params.id, studentId, status)
    return sendResponse(res, HTTP_STATUS.OK, updatedClass, "Student enrolled successfully")
  } catch (err: any) {
    if (err.message.includes("not found")) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, err.message)
    }
    if (err.message.includes("already enrolled")) {
      return sendError(res, HTTP_STATUS.CONFLICT, err.message)
    }
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/{id}/unenroll:
 *   post:
 *     tags:
 *       - Class Enrollment
 *     summary: Remove a student from a scheduled class
 *     description: |
 *       Remove a student from a scheduled class. If there are students
 *       on the waitlist, the first one will be automatically enrolled.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439013"
 *     responses:
 *       200:
 *         description: Student removed successfully
 *       404:
 *         description: Class or student not found
 */
export const removeStudentFromClass = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body
    const updatedClass = await ScheduleClassService.removeStudentFromClass(req.params.id, studentId)
    return sendResponse(res, HTTP_STATUS.OK, updatedClass, "Student removed successfully")
  } catch (err: any) {
    if (err.message.includes("not found")) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, err.message)
    }
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/{id}/attendance:
 *   post:
 *     tags:
 *       - Attendance Management
 *     summary: Mark attendance for a student
 *     description: |
 *       Mark attendance for a single student in a scheduled class.
 *       Previous attendance records for the same student will be overwritten.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - status
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439013"
 *               status:
 *                 type: string
 *                 enum: [present, absent, late, excused]
 *                 example: "present"
 *               checkInTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-15T09:05:00Z"
 *               checkOutTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-15T12:00:00Z"
 *               notes:
 *                 type: string
 *                 example: "Arrived 5 minutes late"
 *     responses:
 *       200:
 *         description: Attendance marked successfully
 *       400:
 *         description: Student not enrolled or validation error
 *       404:
 *         description: Class not found
 */
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const updatedClass = await ScheduleClassService.markAttendance(req.params.id, req.body)
    return sendResponse(res, HTTP_STATUS.OK, updatedClass, "Attendance marked successfully")
  } catch (err: any) {
    if (err.message.includes("not found")) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, err.message)
    }
    if (err.message.includes("not enrolled")) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
    }
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/{id}/attendance/bulk:
 *   post:
 *     tags:
 *       - Attendance Management
 *     summary: Mark bulk attendance for multiple students
 *     description: |
 *       Mark attendance for multiple students in a single request.
 *       This replaces all existing attendance records for the class.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attendance
 *             properties:
 *               attendance:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/AttendanceRecord'
 *     responses:
 *       200:
 *         description: Bulk attendance marked successfully
 *       400:
 *         description: Validation error or student not enrolled
 *       404:
 *         description: Class not found
 */
export const markBulkAttendance = async (req: Request, res: Response) => {
  try {
    const { attendance } = req.body
    const updatedClass = await ScheduleClassService.markBulkAttendance(req.params.id, attendance)
    return sendResponse(res, HTTP_STATUS.OK, updatedClass, "Bulk attendance marked successfully")
  } catch (err: any) {
    if (err.message.includes("not found")) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, err.message)
    }
    if (err.message.includes("not enrolled")) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
    }
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/{id}/attendance/report:
 *   get:
 *     tags:
 *       - Attendance Management
 *     summary: Get attendance report for a class
 *     description: |
 *       Get a detailed attendance report for a scheduled class including:
 *       - All enrolled students
 *       - Their attendance status
 *       - Summary statistics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled class ID
 *     responses:
 *       200:
 *         description: Attendance report retrieved successfully
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
 *                   example: "Attendance report retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     class:
 *                       $ref: '#/components/schemas/ScheduleClass'
 *                     attendanceReport:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           student:
 *                             type: object
 *                           enrollmentDate:
 *                             type: string
 *                             format: date-time
 *                           attendance:
 *                             $ref: '#/components/schemas/AttendanceRecord'
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalEnrolled:
 *                           type: integer
 *                         present:
 *                           type: integer
 *                         absent:
 *                           type: integer
 *                         late:
 *                           type: integer
 *                         excused:
 *                           type: integer
 *       404:
 *         description: Class not found
 */
export const getAttendanceReport = async (req: Request, res: Response) => {
  try {
    const report = await ScheduleClassService.getAttendanceReport(req.params.id)
    return sendResponse(res, HTTP_STATUS.OK, report, "Attendance report retrieved successfully")
  } catch (err: any) {
    if (err.message.includes("not found")) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, err.message)
    }
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/{id}/materials:
 *   post:
 *     tags:
 *       - Class Materials
 *     summary: Add material to a class
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassMaterial'
 *     responses:
 *       200:
 *         description: Material added successfully
 *       404:
 *         description: Class not found
 */
export const addMaterial = async (req: Request, res: Response) => {
  try {
    const updatedClass = await ScheduleClassService.addMaterial(req.params.id, req.body)
    return sendResponse(res, HTTP_STATUS.OK, updatedClass, "Material added successfully")
  } catch (err: any) {
    if (err.message.includes("not found")) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, err.message)
    }
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/{id}/assignments:
 *   post:
 *     tags:
 *       - Class Assignments
 *     summary: Add assignment to a class
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "JavaScript Variables Exercise"
 *               description:
 *                 type: string
 *                 example: "Complete the exercises on variable declarations and assignments"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-20T23:59:59Z"
 *     responses:
 *       200:
 *         description: Assignment added successfully
 *       404:
 *         description: Class not found
 */
export const addAssignment = async (req: Request, res: Response) => {
  try {
    const updatedClass = await ScheduleClassService.addAssignment(req.params.id, req.body)
    return sendResponse(res, HTTP_STATUS.OK, updatedClass, "Assignment added successfully")
  } catch (err: any) {
    if (err.message.includes("not found")) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, err.message)
    }
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/{id}/announcements:
 *   post:
 *     tags:
 *       - Class Announcements
 *     summary: Add announcement to a class
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheduled class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Class will start 15 minutes early tomorrow"
 *               isUrgent:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Announcement added successfully
 *       404:
 *         description: Class not found
 */
export const addAnnouncement = async (req: Request, res: Response) => {
  try {
    const updatedClass = await ScheduleClassService.addAnnouncement(req.params.id, req.body)
    return sendResponse(res, HTTP_STATUS.OK, updatedClass, "Announcement added successfully")
  } catch (err: any) {
    if (err.message.includes("not found")) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, err.message)
    }
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/instructor/{instructorId}:
 *   get:
 *     tags:
 *       - Schedule Classes
 *     summary: Get classes by instructor
 *     parameters:
 *       - in: path
 *         name: instructorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Instructor ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter
 *     responses:
 *       200:
 *         description: Instructor classes retrieved successfully
 */
export const getClassesByInstructor = async (req: Request, res: Response) => {
  try {
    const result = await ScheduleClassService.getClassesByInstructor(req.params.instructorId, req.query)
    return sendResponse(res, HTTP_STATUS.OK, result, "Instructor classes retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /schedule-classes/student/{studentId}:
 *   get:
 *     tags:
 *       - Schedule Classes
 *     summary: Get classes by student
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter
 *     responses:
 *       200:
 *         description: Student classes retrieved successfully
 */
export const getClassesByStudent = async (req: Request, res: Response) => {
  try {
    const result = await ScheduleClassService.getClassesByStudent(req.params.studentId, req.query)
    return sendResponse(res, HTTP_STATUS.OK, result, "Student classes retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}