import { Request, Response } from "express"
import { TestimonialService } from "./testimonial.service"
import { sendError, sendResponse } from "../../app/utils/response.util"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"
import { ICreateTestimonialRequest, IUpdateTestimonialRequest, ITestimonialQuery } from "./testimonial.types"

/**
 * @openapi
 * components:
 *   schemas:
 *     PlacementDetails:
 *       type: object
 *       properties:
 *         salary:
 *           type: number
 *           minimum: 0
 *           example: 500000
 *         company:
 *           type: string
 *           maxLength: 100
 *           example: "TechCorp Inc"
 *         role:
 *           type: string
 *           maxLength: 100
 *           example: "Software Developer"
 *         location:
 *           type: string
 *           maxLength: 100
 *           example: "Bangalore, India"
 *
 *     CreateTestimonialRequest:
 *       type: object
 *       required:
 *         - studentName
 *         - course
 *         - title
 *         - content
 *         - rating
 *       properties:
 *         studentName:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Rahul Kumar"
 *         email:
 *           type: string
 *           format: email
 *           example: "rahul.kumar@example.com"
 *         course:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Full Stack Development"
 *         batch:
 *           type: string
 *           maxLength: 50
 *           example: "Batch-2023-A"
 *         title:
 *           type: string
 *           minLength: 5
 *           maxLength: 200
 *           example: "Excellent Course with Great Placement Support"
 *         content:
 *           type: string
 *           minLength: 20
 *           maxLength: 2000
 *           example: "This course transformed my career. The instructors were knowledgeable and the placement support was outstanding."
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         isPlaced:
 *           type: boolean
 *           default: false
 *           example: true
 *         placementDetails:
 *           $ref: '#/components/schemas/PlacementDetails'
 *
 *     UpdateTestimonialRequest:
 *       type: object
 *       properties:
 *         studentName:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *         course:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         batch:
 *           type: string
 *           maxLength: 50
 *         title:
 *           type: string
 *           minLength: 5
 *           maxLength: 200
 *         content:
 *           type: string
 *           minLength: 20
 *           maxLength: 2000
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         isPlaced:
 *           type: boolean
 *         placementDetails:
 *           $ref: '#/components/schemas/PlacementDetails'
 *         isApproved:
 *           type: boolean
 *         approvedBy:
 *           type: string
 *         isFeatured:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *
 *     TestimonialResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         studentName:
 *           type: string
 *         email:
 *           type: string
 *         course:
 *           type: string
 *         batch:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         rating:
 *           type: integer
 *         isPlaced:
 *           type: boolean
 *         placementDetails:
 *           $ref: '#/components/schemas/PlacementDetails'
 *         isApproved:
 *           type: boolean
 *         approvedBy:
 *           type: string
 *         approvedAt:
 *           type: string
 *           format: date-time
 *         isFeatured:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PaginatedTestimonialResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             testimonials:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestimonialResponse'
 *             pagination:
 *               type: object
 *               properties:
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 total:
 *                   type: number
 *
 *     TestimonialStats:
 *       type: object
 *       properties:
 *         totalTestimonials:
 *           type: number
 *         approvedTestimonials:
 *           type: number
 *         pendingTestimonials:
 *           type: number
 *         featuredTestimonials:
 *           type: number
 *         averageRating:
 *           type: number
 *         placedStudents:
 *           type: number
 *         ratingDistribution:
 *           type: object
 *         courseStats:
 *           type: array
 *         placementStats:
 *           type: object
 *
 * /testimonials:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Get all testimonials
 *     description: Retrieve testimonials with filtering, pagination, and sorting options
 *     parameters:
 *       - in: query
 *         name: isApproved
 *         schema:
 *           type: boolean
 *         description: Filter by approval status
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Filter by active status
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *       - in: query
 *         name: course
 *         schema:
 *           type: string
 *         description: Filter by course name
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         description: Minimum rating filter
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         description: Maximum rating filter
 *       - in: query
 *         name: isPlaced
 *         schema:
 *           type: boolean
 *         description: Filter by placement status
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, rating, studentName, course]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedTestimonialResponse'
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Testimonials
 *     summary: Create a new testimonial
 *     description: Submit a new testimonial (requires admin approval)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTestimonialRequest'
 *     responses:
 *       201:
 *         description: Testimonial created successfully
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
 *                   $ref: '#/components/schemas/TestimonialResponse'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *
 * /testimonials/featured:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Get featured testimonials
 *     description: Retrieve approved and featured testimonials for display
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 6
 *           maximum: 20
 *         description: Number of featured testimonials to return
 *     responses:
 *       200:
 *         description: Featured testimonials retrieved successfully
 *       500:
 *         description: Internal server error
 *
 * /testimonials/search:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Search testimonials
 *     description: Search testimonials by student name, title, content, course, or company
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
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
 *       400:
 *         description: Search term is required
 *
 * /testimonials/stats:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Get testimonial statistics
 *     description: Retrieve comprehensive testimonial statistics and analytics
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
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
 *                   $ref: '#/components/schemas/TestimonialStats'
 *       500:
 *         description: Internal server error
 *
 * /testimonials/course/{course}:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Get testimonials by course
 *     description: Retrieve approved testimonials for a specific course
 *     parameters:
 *       - in: path
 *         name: course
 *         required: true
 *         schema:
 *           type: string
 *         description: Course name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *           maximum: 50
 *         description: Number of testimonials to return
 *     responses:
 *       200:
 *         description: Course testimonials retrieved successfully
 *       500:
 *         description: Internal server error
 *
 * /testimonials/{id}:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Get testimonial by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial retrieved successfully
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
 *                   $ref: '#/components/schemas/TestimonialResponse'
 *       404:
 *         description: Testimonial not found
 *       400:
 *         description: Invalid testimonial ID format
 *   put:
 *     tags:
 *       - Testimonials
 *     summary: Update testimonial
 *     description: Update testimonial information (admin only for approval fields)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimonial ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTestimonialRequest'
 *     responses:
 *       200:
 *         description: Testimonial updated successfully
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
 *                   $ref: '#/components/schemas/TestimonialResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Testimonial not found
 *   delete:
 *     tags:
 *       - Testimonials
 *     summary: Delete testimonial
 *     description: Permanently delete a testimonial (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimonial ID
 *     responses:
 *       204:
 *         description: Testimonial deleted successfully
 *       404:
 *         description: Testimonial not found
 *       400:
 *         description: Invalid testimonial ID format
 *
 * /testimonials/{id}/approve:
 *   post:
 *     tags:
 *       - Testimonial Management
 *     summary: Approve or reject testimonial
 *     description: Update approval status of a testimonial (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimonial ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isApproved
 *             properties:
 *               isApproved:
 *                 type: boolean
 *                 description: Approval status
 *               approvedBy:
 *                 type: string
 *                 description: ID of admin user approving
 *     responses:
 *       200:
 *         description: Approval status updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Testimonial not found
 *
 * /testimonials/{id}/toggle-featured:
 *   post:
 *     tags:
 *       - Testimonial Management
 *     summary: Toggle featured status
 *     description: Toggle the featured status of an approved testimonial (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Featured status toggled successfully
 *       400:
 *         description: Cannot feature unapproved testimonial
 *       404:
 *         description: Testimonial not found
 */

export const getAllTestimonials = async (req: Request, res: Response) => {
  try {
    const query: ITestimonialQuery = req.query as any
    const result = await TestimonialService.getAllTestimonials(query)
    return sendResponse(res, HTTP_STATUS.OK, result, "Testimonials retrieved successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve testimonials")
  }
}

export const getFeaturedTestimonials = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6
    const result = await TestimonialService.getFeaturedTestimonials(limit)
    return sendResponse(res, HTTP_STATUS.OK, result, "Featured testimonials retrieved successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve featured testimonials")
  }
}

export const searchTestimonials = async (req: Request, res: Response) => {
  try {
    const { q, limit = 20 } = req.query
    if (!q) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Search term is required")
    }
    const result = await TestimonialService.searchTestimonials(q as string, parseInt(limit as string))
    return sendResponse(res, HTTP_STATUS.OK, result, "Search results retrieved successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Search failed")
  }
}

export const getTestimonialStats = async (req: Request, res: Response) => {
  try {
    const result = await TestimonialService.getTestimonialStats()
    return sendResponse(res, HTTP_STATUS.OK, result, "Statistics retrieved successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve statistics")
  }
}

export const getTestimonialsByCourse = async (req: Request, res: Response) => {
  try {
    const { course } = req.params
    const limit = parseInt(req.query.limit as string) || 10
    const result = await TestimonialService.getTestimonialsByCourse(course, limit)
    return sendResponse(res, HTTP_STATUS.OK, result, "Course testimonials retrieved successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve course testimonials")
  }
}

export const getTestimonialsByRating = async (req: Request, res: Response) => {
  try {
    const minRating = parseInt(req.query.minRating as string) || 4
    const limit = parseInt(req.query.limit as string) || 10
    const result = await TestimonialService.getTestimonialsByRating(minRating, limit)
    return sendResponse(res, HTTP_STATUS.OK, result, "High-rated testimonials retrieved successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve testimonials by rating")
  }
}

export const getTestimonialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await TestimonialService.getTestimonialById(id)
    if (!result) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "Testimonial not found")
    }
    return sendResponse(res, HTTP_STATUS.OK, result, "Testimonial retrieved successfully")
  } catch (error: any) {
    if (error.name === 'CastError') {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Invalid testimonial ID format")
    }
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve testimonial")
  }
}

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonialData: ICreateTestimonialRequest = req.body
    const result = await TestimonialService.createTestimonial(testimonialData)
    return sendResponse(res, HTTP_STATUS.CREATED, result, "Testimonial created successfully")
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to create testimonial")
  }
}

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData: IUpdateTestimonialRequest = req.body
    const result = await TestimonialService.updateTestimonial(id, updateData)
    if (!result) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "Testimonial not found")
    }
    return sendResponse(res, HTTP_STATUS.OK, result, "Testimonial updated successfully")
  } catch (error: any) {
    if (error.name === 'CastError') {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Invalid testimonial ID format")
    }
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to update testimonial")
  }
}

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await TestimonialService.deleteTestimonial(id)
    if (!result) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "Testimonial not found")
    }
    return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, "Testimonial deleted successfully")
  } catch (error: any) {
    if (error.name === 'CastError') {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Invalid testimonial ID format")
    }
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to delete testimonial")
  }
}

export const updateApprovalStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { isApproved, approvedBy } = req.body
    const result = await TestimonialService.updateApprovalStatus(id, { isApproved, approvedBy })
    if (!result) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "Testimonial not found")
    }
    return sendResponse(res, HTTP_STATUS.OK, result, "Approval status updated successfully")
  } catch (error: any) {
    if (error.name === 'CastError') {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Invalid testimonial ID format")
    }
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to update approval status")
  }
}

export const toggleFeatured = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await TestimonialService.toggleFeatured(id)
    if (!result) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "Testimonial not found")
    }
    if ((result as any).error === "unapproved") {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Cannot feature unapproved testimonial")
    }
    return sendResponse(res, HTTP_STATUS.OK, result, "Featured status toggled successfully")
  } catch (error: any) {
    if (error.name === 'CastError') {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Invalid testimonial ID format")
    }
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to toggle featured status")
  }
}