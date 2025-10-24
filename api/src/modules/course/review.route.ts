import { Router } from "express"
import { Request, Response } from "express"
import { validateBody, validateQuery } from "../../app/middlewares/validation.middleware"
import { 
  updateReviewSchema, 
  reviewFilterSchema, 
  helpfulnessSchema, 
  reportReviewSchema, 
  moderationSchema 
} from "./review.validation"
import * as ReviewService from "./review.service"
import { sendError, sendResponse } from "../../app/utils/response.util"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"

const router = Router()

/**
 * @openapi
 * /reviews/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get a specific review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Review'
 *             example:
 *               success: true
 *               message: "Review retrieved successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 title: "Excellent course with great content!"
 *                 content: "This course provided comprehensive coverage..."
 *                 rating: 5
 *                 author:
 *                   name: "John Doe"
 *                   photo: "https://example.com/avatar.jpg"
 *                 helpfulCount: 12
 *                 unhelpfulCount: 1
 *                 createdAt: "2025-10-24T10:30:00Z"
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Review not found"
 *               data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const review = await ReviewService.getReviewById(req.params.id)
    if (!review) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Review not found")
    }
    
    return sendResponse(res, HTTP_STATUS.OK, review, "Review retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
})

/**
 * @openapi
 * /reviews/{id}:
 *   put:
 *     tags:
 *       - Reviews
 *     summary: Update a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *               content:
 *                 type: string
 *                 minLength: 50
 *                 maxLength: 2000
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               reason:
 *                 type: string
 *                 maxLength: 200
 *                 description: Reason for editing the review
 *     responses:
 *       200:
 *         description: Review updated successfully (requires re-approval)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Review'
 *             example:
 *               success: true
 *               message: "Review updated successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 title: "Updated review title"
 *                 content: "Updated review content..."
 *                 rating: 4
 *                 isApproved: false
 *                 isEdited: true
 *                 updatedAt: "2025-10-24T11:30:00Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Review title must be at least 10 characters long"
 *               errors: ["Review title must be at least 10 characters long"]
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Authentication required"
 *       404:
 *         description: Review not found or permission denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Review not found or you don't have permission to edit it"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put("/:id", validateBody(updateReviewSchema), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId
    
    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Authentication required")
    }
    
    const review = await ReviewService.updateReview(req.params.id, req.body, userId)
    return sendResponse(res, HTTP_STATUS.OK, review, "Review updated successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
})

/**
 * @openapi
 * /reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Review deleted successfully"
 *               data: null
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Authentication required"
 *       404:
 *         description: Review not found or permission denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Review not found or you don't have permission to delete it"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    
    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Authentication required")
    }
    
    await ReviewService.deleteReview(req.params.id, userId)
    return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, "Review deleted successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
})

/**
 * @openapi
 * /reviews/{id}/helpful:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Mark review as helpful/unhelpful
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [helpful, unhelpful, remove]
 *                 description: Action to perform
 *               userId:
 *                 type: string
 *                 description: User ID (for testing)
 *     responses:
 *       200:
 *         description: Helpfulness updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         helpfulCount:
 *                           type: integer
 *                           example: 13
 *                         unhelpfulCount:
 *                           type: integer
 *                           example: 1
 *             example:
 *               success: true
 *               message: "Helpfulness updated successfully"
 *               data:
 *                 helpfulCount: 13
 *                 unhelpfulCount: 1
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Authentication required"
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Review not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post("/:id/helpful", validateBody(helpfulnessSchema), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId
    
    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Authentication required")
    }
    
    const review = await ReviewService.handleHelpfulness(req.params.id, {
      userId,
      action: req.body.action
    })
    
    return sendResponse(res, HTTP_STATUS.OK, {
      helpfulCount: review?.helpfulCount,
      unhelpfulCount: review?.unhelpfulCount
    }, "Helpfulness updated successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
})

/**
 * @openapi
 * /reviews/{id}/report:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Report a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 enum: [spam, inappropriate, fake, offensive, other]
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               userId:
 *                 type: string
 *                 description: User ID (for testing)
 *     responses:
 *       200:
 *         description: Review reported successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Review reported successfully"
 *               data: null
 *       400:
 *         description: Already reported or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "You have already reported this review"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Authentication required"
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Review not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post("/:id/report", validateBody(reportReviewSchema), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId
    
    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Authentication required")
    }
    
    await ReviewService.reportReview(req.params.id, {
      ...req.body,
      userId
    })
    
    return sendResponse(res, HTTP_STATUS.OK, null, "Review reported successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
})

/**
 * @openapi
 * /reviews/user/{userId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get reviews by user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: User reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ReviewPagination'
 *             example:
 *               success: true
 *               message: "User reviews retrieved successfully"
 *               data:
 *                 reviews:
 *                   - _id: "507f1f77bcf86cd799439011"
 *                     title: "Great course!"
 *                     content: "Really enjoyed this course..."
 *                     rating: 5
 *                     course:
 *                       title: "Complete React Development"
 *                       instructor: "Jane Smith"
 *                     createdAt: "2025-10-24T10:30:00Z"
 *                 pagination:
 *                   page: 1
 *                   totalPages: 2
 *                   totalReviews: 15
 *                   hasNext: true
 *                   hasPrev: false
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    
    const result = await ReviewService.getReviewsByUser(req.params.userId, page, limit)
    return sendResponse(res, HTTP_STATUS.OK, result, "User reviews retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
})

/**
 * @openapi
 * /reviews/course/{courseId}/stats:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get review statistics for a course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Review statistics retrieved successfully
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
 *                     totalReviews:
 *                       type: integer
 *                     averageRating:
 *                       type: number
 *                     ratingDistribution:
 *                       type: object
 *                       properties:
 *                         1:
 *                           type: integer
 *                         2:
 *                           type: integer
 *                         3:
 *                           type: integer
 *                         4:
 *                           type: integer
 *                         5:
 *                           type: integer
 *       404:
 *         description: Course not found
 */
router.get("/course/:courseId/stats", async (req: Request, res: Response) => {
  try {
    const stats = await ReviewService.getReviewStats(req.params.courseId)
    return sendResponse(res, HTTP_STATUS.OK, stats, "Review statistics retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
})

export default router