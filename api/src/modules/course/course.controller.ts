import { Request, Response } from "express"
import { MESSAGES } from "../../app/constants/message.constant"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"

import { sendError, sendResponse } from "../../app/utils/response.util"
import * as CourseService from "./course.service"
import * as CommentService from "../comments/comment.service"
import * as ReviewService from "./review.service"
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
    
    // Debug: Check if there are any courses at all
    const totalCourses = await CourseService.getTotalCoursesCount()
    
    if(!courses.length) {
      return sendResponse(res, HTTP_STATUS.OK, [], "No published courses found")
    }
      
    return sendResponse(res, HTTP_STATUS.OK, courses, MESSAGES.SUCCESS)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

// Debug endpoints (remove in production)
export const getAllCoursesDebug = async (_req: Request, res: Response) => {
  try {
    const allCourses = await CourseService.getAllCoursesIncludingUnpublished()
    const totalCount = await CourseService.getTotalCoursesCount()
    
    return sendResponse(res, HTTP_STATUS.OK, allCourses, "Debug: All courses retrieved (Total: " + totalCount + ")")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

export const createSampleData = async (_req: Request, res: Response) => {
  try {
    const existingCount = await CourseService.getTotalCoursesCount()
    if (existingCount > 0) {
      return sendResponse(res, HTTP_STATUS.OK, { message: "Sample data already exists", count: existingCount }, "Sample data exists")
    }
    
    const sampleCourses = await CourseService.createSampleCourses()
    return sendResponse(res, HTTP_STATUS.CREATED, sampleCourses, "Sample courses created successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /courses/limited/{limit}:
 *   get:
 *     tags:
 *       - Course
 *     summary: Retrieve limited number of courses
 *     parameters:
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of courses to retrieve
 *     responses:
 *       200:
 *         description: Limited list of courses
 *       204:
 *         description: No courses found
 *       400:
 *         description: Invalid limit parameter
 */
export const getLimited = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.params.limit)
    
    // Validate limit parameter
    if (isNaN(limit) || limit <= 0 || limit > 100) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Limit must be a number between 1 and 100")
    }
    
    const courses = await CourseService.getLimitedCourses(limit)
    if(!courses.length) return sendResponse(res, HTTP_STATUS.OK, [], MESSAGES.COURSE_NOT_FOUND)
      
    return sendResponse(res, HTTP_STATUS.OK, courses, MESSAGES.SUCCESS)
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
 *     summary: Retrieve course by ID with review data
 *     description: |
 *       Get detailed course information including review statistics and recent reviews.
 *       
 *       **Includes:**
 *       - Course details and instructor information
 *       - Review statistics (total, average rating, distribution)
 *       - Recent reviews (up to 5 latest approved reviews)
 *       - Review engagement metrics
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Course details with review data
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
 *                   example: "Course retrieved successfully"
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
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     category:
 *                       type: string
 *                     level:
 *                       type: string
 *                     price:
 *                       type: number
 *                     totalEnrollments:
 *                       type: integer
 *                       description: Total number of enrollments for this course
 *                       example: 125
 *                     reviewData:
 *                       type: object
 *                       properties:
 *                         stats:
 *                           type: object
 *                           properties:
 *                             totalReviews:
 *                               type: integer
 *                               example: 150
 *                             averageRating:
 *                               type: number
 *                               example: 4.3
 *                             ratingDistribution:
 *                               type: object
 *                               properties:
 *                                 "1":
 *                                   type: integer
 *                                 "2":
 *                                   type: integer
 *                                 "3":
 *                                   type: integer
 *                                 "4":
 *                                   type: integer
 *                                 "5":
 *                                   type: integer
 *                             verifiedReviews:
 *                               type: integer
 *                             approvedReviews:
 *                               type: integer
 *                             pendingReviews:
 *                               type: integer
 *                         recentReviews:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                               content:
 *                                 type: string
 *                               rating:
 *                                 type: integer
 *                               author:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                   photo:
 *                                     type: string
 *                               helpfulCount:
 *                                 type: integer
 *                               isVerifiedPurchase:
 *                                 type: boolean
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                         hasMoreReviews:
 *                           type: boolean
 *                           example: true
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Course not found"
 *               data: null
 *       500:
 *         description: Internal server error
 */
export const getById = async (req: Request, res: Response) => {
  try {
    const course = await CourseService.getCourseById(req.params.id)
    if(!course) return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, MESSAGES.COURSE_NOT_FOUND)
    
    return sendResponse(res, HTTP_STATUS.OK, course, MESSAGES.SUCCESS)
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
 *       description: IT Training Course details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - shortDescription
 *               - instructor
 *               - category
 *               - level
 *               - technologies
 *               - learningOutcomes
 *               - price
 *               - duration
 *               - totalHours
 *               - totalLectures
 *               - mode
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 150
 *                 example: "Full Stack JavaScript Development"
 *               description:
 *                 type: string
 *                 minLength: 50
 *                 maxLength: 2000
 *                 example: "Comprehensive course covering front-end and back-end development using JavaScript technologies"
 *               shortDescription:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 200
 *                 example: "Learn full-stack development with React, Node.js, and MongoDB"
 *               instructor:
 *                 type: string
 *                 example: "John Smith"
 *               instructorBio:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Senior Full Stack Developer with 8+ years experience"
 *               category:
 *                 type: string
 *                 enum: [Web Development, Mobile Development, Data Science, AI/ML, Cloud Computing, DevOps, Cybersecurity, Database, Programming Languages, Software Testing, UI/UX Design, Game Development, Blockchain, IoT, Big Data, Other]
 *                 example: "Web Development"
 *               subCategory:
 *                 type: string
 *                 example: "Full Stack Development"
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced, Expert]
 *                 example: "Intermediate"
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "React", "Node.js", "MongoDB"]
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Basic HTML/CSS", "JavaScript fundamentals"]
 *               learningOutcomes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Build full-stack web applications", "Work with REST APIs", "Deploy applications to cloud"]
 *               syllabus:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     module:
 *                       type: string
 *                     topics:
 *                       type: array
 *                       items:
 *                         type: string
 *                     duration:
 *                       type: string
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 299.99
 *               originalPrice:
 *                 type: number
 *                 minimum: 0
 *                 example: 399.99
 *               currency:
 *                 type: string
 *                 example: "INR"
 *               duration:
 *                 type: string
 *                 example: "12 weeks"
 *               totalHours:
 *                 type: number
 *                 minimum: 1
 *                 example: 40
 *               totalLectures:
 *                 type: number
 *                 minimum: 1
 *                 example: 50
 *               language:
 *                 type: string
 *                 example: "English"
 *               mode:
 *                 type: string
 *                 enum: [Online, Offline, Hybrid]
 *                 example: "Online"
 *               isPublished:
 *                 type: boolean
 *                 default: false
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *               difficulty:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 3
 *               certificateProvided:
 *                 type: boolean
 *                 default: true
 *               hasProjects:
 *                 type: boolean
 *                 default: false
 *               hasAssignments:
 *                 type: boolean
 *                 default: false
 *               hasQuizzes:
 *                 type: boolean
 *                 default: false
 *               supportProvided:
 *                 type: boolean
 *                 default: true
 *               jobAssistance:
 *                 type: boolean
 *                 default: false
 *               thumbnailUrl:
 *                 type: string
 *                 format: uri
 *               videoPreviewUrl:
 *                 type: string
 *                 format: uri
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["javascript", "react", "fullstack"]
 *               enrollmentStartDate:
 *                 type: string
 *                 format: date-time
 *               enrollmentEndDate:
 *                 type: string
 *                 format: date-time
 *               courseStartDate:
 *                 type: string
 *                 format: date-time
 *               courseEndDate:
 *                 type: string
 *                 format: date-time
 *               maxStudents:
 *                 type: number
 *                 minimum: 1
 *                 example: 30
 *               minStudents:
 *                 type: number
 *                 minimum: 1
 *                 example: 5
 *               classSchedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                     startTime:
 *                       type: string
 *                       pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
 *                     endTime:
 *                       type: string
 *                       pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
 *     responses:
 *       201:
 *         description: Course created successfully
 */
export const create = async (req: Request, res: Response) => {
  try {
    const newCourse = await CourseService.createCourse(req.body)
    
    return sendResponse(res, HTTP_STATUS.CREATED, newCourse, MESSAGES.SUCCESS)
  } catch (err: any) {
    // Handle specific MongoDB validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map((error: any) => error.message).join(', ')
      return sendError(res, HTTP_STATUS.BAD_REQUEST, validationErrors)
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return sendError(res, HTTP_STATUS.CONFLICT, "Course with this data already exists")
    }
    
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
    
    return sendResponse(res, HTTP_STATUS.OK, updatedCourse, MESSAGES.SUCCESS)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /courses/category/{category}:
 *   get:
 *     tags:
 *       - Course
 *     summary: Retrieve courses by category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Web Development, Mobile Development, Data Science, AI/ML, Cloud Computing, DevOps, Cybersecurity, Database, Programming Languages, Software Testing, UI/UX Design, Game Development, Blockchain, IoT, Big Data, Other]
 *         description: Course category to filter by
 *         example: "Web Development"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of courses to retrieve (optional)
 *         example: 10
 *     responses:
 *       200:
 *         description: List of courses in the specified category
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
 *                   example: "Courses retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *                       level:
 *                         type: string
 *                       price:
 *                         type: number
 *                       rating:
 *                         type: number
 *                       totalStudents:
 *                         type: number
 *                       instructor:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *       404:
 *         description: No courses found in the specified category
 *       400:
 *         description: Invalid category or limit parameter
 */
export const getByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined
    
    // Validate limit parameter if provided
    if (limit && (isNaN(limit) || limit <= 0 || limit > 100)) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Limit must be a number between 1 and 100")
    }
    
    // Validate category parameter
    const validCategories = [
      'Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 
      'Cloud Computing', 'DevOps', 'Cybersecurity', 'Database', 
      'Programming Languages', 'Software Testing', 'UI/UX Design', 
      'Game Development', 'Blockchain', 'IoT', 'Big Data', 'Other'
    ]
    
    if (!validCategories.includes(category)) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, `Invalid category. Valid categories are: ${validCategories.join(', ')}`)
    }
    
    const courses = await CourseService.getCoursesByCategory(category, limit)
    
    if (!courses.length) {
      return sendResponse(res, HTTP_STATUS.OK, [], `No courses found in category: ${category}`)
    }
    
    return sendResponse(res, HTTP_STATUS.OK, courses, `Courses in ${category} retrieved successfully`)
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

/**
 * @openapi
 * /courses/{id}/comments:
 *   get:
 *     tags:
 *       - Course
 *     summary: Get comments for a course
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
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
 *                     comments:
 *                       type: array
 *                     pagination:
 *                       type: object
 *       404:
 *         description: Course not found
 */
export const getCourseComments = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const sortBy = req.query.sortBy as string || 'createdAt'
    const sortOrder = req.query.sortOrder as string || 'desc'

    // Verify course exists
    const course = await CourseService.getCourseById(courseId)
    if (!course) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Course not found")
    }

    const result = await CommentService.getCommentsByTutorial(courseId, page, limit, sortBy, sortOrder)
    return sendResponse(res, HTTP_STATUS.OK, result, "Comments retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /courses/{id}/comments:
 *   post:
 *     tags:
 *       - Course
 *     summary: Add a comment to a course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *                 example: "Great course! Very informative."
 *               parentId:
 *                 type: string
 *                 description: "Parent comment ID for replies"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Course not found
 */
export const addCourseComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId // Fallback for testing
    
    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Authentication required")
    }

    const courseId = req.params.id
    
    // Verify course exists
    const course = await CourseService.getCourseById(courseId)
    if (!course) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Course not found")
    }

    const commentData = {
      content: req.body.content,
      contentType: 'course' as const,
      contentId: courseId,
      courseId: courseId,
      parentId: req.body.parentId
    }

    const comment = await CommentService.createComment(commentData, userId)
    return sendResponse(res, HTTP_STATUS.CREATED, comment, "Comment added successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /courses/{id}/reviews:
 *   get:
 *     tags:
 *       - Course Reviews
 *     summary: Get reviews for a course
 *     description: |
 *       Retrieve paginated reviews for a specific course with filtering and sorting options.
 *       
 *       **Features:**
 *       - Pagination support
 *       - Multiple sorting options
 *       - Rating filters
 *       - Only approved reviews are returned
 *       - Includes helpful/unhelpful vote counts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: "507f1f77bcf86cd799439011"
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
 *           maximum: 50
 *           default: 10
 *         description: Number of reviews per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, rating, helpfulCount, updatedAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Minimum rating filter
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Maximum rating filter
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
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
 *                   example: "Reviews retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           content:
 *                             type: string
 *                           rating:
 *                             type: integer
 *                           author:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               photo:
 *                                 type: string
 *                           helpfulCount:
 *                             type: integer
 *                           unhelpfulCount:
 *                             type: integer
 *                           isVerifiedPurchase:
 *                             type: boolean
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalReviews:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Course not found"
 *               data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
export const getCourseReviews = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const sortBy = req.query.sortBy as string || 'createdAt'
    const sortOrder = req.query.sortOrder as string || 'desc'

    // Build filters
    const filters: any = {}
    if (req.query.minRating) filters.rating = { $gte: parseInt(req.query.minRating as string) }
    if (req.query.maxRating) {
      filters.rating = { ...filters.rating, $lte: parseInt(req.query.maxRating as string) }
    }

    // Verify course exists
    const course = await CourseService.getCourseById(courseId)
    if (!course) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Course not found")
    }

    const result = await ReviewService.getReviewsByCourse(courseId, page, limit, sortBy, sortOrder, filters)
    
    return sendResponse(res, HTTP_STATUS.OK, result, "Reviews retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /courses/{id}/reviews:
 *   post:
 *     tags:
 *       - Course Reviews
 *     summary: Add a review to a course
 *     description: |
 *       Add a review for a specific course. Users can only review each course once.
 *       
 *       **Features:**
 *       - One review per user per course
 *       - Reviews require approval before being visible
 *       - Support for anonymous reviews
 *       - Automatic verification of course enrollment (if implemented)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - rating
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *                 example: "Excellent course with great content!"
 *                 description: "Review title (optional)"
 *               content:
 *                 type: string
 *                 minLength: 50
 *                 maxLength: 2000
 *                 example: "This course provided comprehensive coverage of the subject matter. The instructor was knowledgeable and the examples were practical and relevant to real-world scenarios."
 *                 description: "Detailed review content"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *                 description: "Rating from 1 to 5 stars"
 *               isAnonymous:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *                 description: "Whether to post the review anonymously"
 *               userId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439013"
 *                 description: "User ID (for testing, usually from auth)"
 *           examples:
 *             positiveReview:
 *               summary: Positive Review
 *               value:
 *                 title: "Outstanding course - highly recommended!"
 *                 content: "This course exceeded my expectations. The content was well-structured, the instructor was engaging, and I learned practical skills that I can apply immediately in my work. The assignments were challenging but fair, and the community support was excellent."
 *                 rating: 5
 *                 isAnonymous: false
 *             reviewWithoutTitle:
 *               summary: Review Without Title
 *               value:
 *                 content: "The course content is solid and covers the basics well. However, some of the advanced topics could use more depth. The instructor is knowledgeable but the pace is sometimes too fast for beginners. Overall, a decent learning experience."
 *                 rating: 4
 *                 isAnonymous: true
 *     responses:
 *       201:
 *         description: Review added successfully
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
 *                   example: "Review added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     rating:
 *                       type: integer
 *                     isApproved:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error or user already reviewed this course
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
 *                   example: "You have already reviewed this course"
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Course not found"
 *               data: null
 *       409:
 *         description: User already reviewed this course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "You have already reviewed this course"
 *               data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
export const addCourseReview = async (req: Request, res: Response) => {
  try {
    console.log("addCourseReview - Request body:", req.body);
    console.log("addCourseReview - Request params:", req.params);
    
    const userId = (req as any).user?.id || req.body.userId // Fallback for testing
    console.log("addCourseReview - User ID:", userId);
    
    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Authentication required")
    }

    const courseId = req.params.id
    console.log("addCourseReview - Course ID:", courseId);
    
    // Verify course exists
    const course = await CourseService.getCourseById(courseId)
    if (!course) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Course not found")
    }

    const reviewData = {
      courseId: courseId,
      content: req.body.content,
      rating: req.body.rating,
      isAnonymous: req.body.isAnonymous || false
    }

    console.log("addCourseReview - Review data to create:", reviewData);

    const review = await ReviewService.createReview(reviewData, userId)
    console.log("addCourseReview - Created review:", review);
    
    return sendResponse(res, HTTP_STATUS.CREATED, review, "Review added successfully. It will be visible after approval.")
  } catch (err: any) {
    console.error("addCourseReview - Error:", err);
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}
