import { Request, Response } from "express"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"
import { sendError, sendResponse } from "../../app/utils/response.util"
import * as CommentService from "./comment.service"

/**
 * @openapi
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         content:
 *           type: string
 *         author:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             photo:
 *               type: string
 *         tutorialId:
 *           type: string
 *         parentId:
 *           type: string
 *         isApproved:
 *           type: boolean
 *         isEdited:
 *           type: boolean
 *         likes:
 *           type: number
 *         dislikes:
 *           type: number
 *         level:
 *           type: number
 *         replyCount:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     CreateCommentRequest:
 *       type: object
 *       required:
 *         - content
 *         - tutorialId
 *       properties:
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *         tutorialId:
 *           type: string
 *         parentId:
 *           type: string
 *     
 *     UpdateCommentRequest:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 */

/**
 * @openapi
 * /comments:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Create a new comment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *     responses:
 *       201:
 *         description: Comment created successfully
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
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tutorial or parent comment not found
 */
export const createComment = async (req: Request, res: Response) => {
  try {
    // Assuming user ID comes from authentication middleware
    const userId = (req as any).user?.id || req.body.userId // Fallback for testing
    
    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Authentication required")
    }

    const comment = await CommentService.createComment(req.body, userId)
    return sendResponse(res, HTTP_STATUS.CREATED, comment, "Comment created successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /comments/{id}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
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
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 */
export const getCommentById = async (req: Request, res: Response) => {
  try {
    const comment = await CommentService.getCommentById(req.params.id)
    if (!comment) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Comment not found")
    }
    return sendResponse(res, HTTP_STATUS.OK, comment, "Comment retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /comments/tutorial/{tutorialId}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get comments for a tutorial
 *     parameters:
 *       - in: path
 *         name: tutorialId
 *         required: true
 *         schema:
 *           type: string
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, likes, replies]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
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
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *                     pagination:
 *                       type: object
 */
export const getCommentsByTutorial = async (req: Request, res: Response) => {
  try {
    const { tutorialId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const sortBy = req.query.sortBy as string || 'createdAt'
    const sortOrder = req.query.sortOrder as string || 'desc'

    const result = await CommentService.getCommentsByTutorial(tutorialId, page, limit, sortBy, sortOrder)
    return sendResponse(res, HTTP_STATUS.OK, result, "Comments retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /comments/{parentId}/replies:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get replies to a comment
 *     parameters:
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Replies retrieved successfully
 */
export const getCommentReplies = async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const result = await CommentService.getCommentReplies(parentId, page, limit)
    return sendResponse(res, HTTP_STATUS.OK, result, "Replies retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /comments/{id}:
 *   put:
 *     tags:
 *       - Comments
 *     summary: Update a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentRequest'
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       403:
 *         description: You can only edit your own comments
 *       404:
 *         description: Comment not found
 */
export const updateComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId // Fallback for testing
    
    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Authentication required")
    }

    const comment = await CommentService.updateComment(req.params.id, req.body, userId)
    return sendResponse(res, HTTP_STATUS.OK, comment, "Comment updated successfully")
  } catch (err: any) {
    if (err.message === 'You can only edit your own comments') {
      return sendError(res, HTTP_STATUS.FORBIDDEN, err.message)
    }
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /comments/{id}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: You can only delete your own comments
 *       404:
 *         description: Comment not found
 */
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId // Fallback for testing
    const isAdmin = (req as any).user?.role === 'admin' || false
    
    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Authentication required")
    }

    const result = await CommentService.deleteComment(req.params.id, userId, isAdmin)
    return sendResponse(res, HTTP_STATUS.OK, null, result.message)
  } catch (err: any) {
    if (err.message === 'You can only delete your own comments') {
      return sendError(res, HTTP_STATUS.FORBIDDEN, err.message)
    }
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /comments/{id}/like:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Like a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment liked successfully
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
 *                     likes:
 *                       type: number
 *       404:
 *         description: Comment not found
 */
export const likeComment = async (req: Request, res: Response) => {
  try {
    const comment = await CommentService.likeComment(req.params.id)
    return sendResponse(res, HTTP_STATUS.OK, { likes: comment.likes }, "Comment liked successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /comments/{id}/unlike:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Unlike a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment unliked successfully
 */
export const unlikeComment = async (req: Request, res: Response) => {
  try {
    const comment = await CommentService.unlikeComment(req.params.id)
    return sendResponse(res, HTTP_STATUS.OK, { likes: comment.likes }, "Comment unliked successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /comments/{id}/dislike:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Dislike a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment disliked successfully
 */
export const dislikeComment = async (req: Request, res: Response) => {
  try {
    const comment = await CommentService.dislikeComment(req.params.id)
    return sendResponse(res, HTTP_STATUS.OK, { dislikes: comment.dislikes }, "Comment disliked successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /comments/{id}/undislike:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Remove dislike from a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment undisliked successfully
 */
export const undislikeComment = async (req: Request, res: Response) => {
  try {
    const comment = await CommentService.undislikeComment(req.params.id)
    return sendResponse(res, HTTP_STATUS.OK, { dislikes: comment.dislikes }, "Comment undisliked successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /comments/{id}/report:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Report a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *                 enum: [spam, inappropriate, offensive, harassment, other]
 *               description:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Comment reported successfully
 *       400:
 *         description: You have already reported this comment
 */
/**
 * @openapi
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         content:
 *           type: string
 *           example: "Great tutorial! Very helpful explanation."
 *         contentType:
 *           type: string
 *           enum: [tutorial, course]
 *           example: "tutorial"
 *         contentId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         tutorialId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         courseId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         author:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               example: "507f1f77bcf86cd799439013"
 *             name:
 *               type: string
 *               example: "John Doe"
 *             email:
 *               type: string
 *               example: "john@example.com"
 *             photo:
 *               type: string
 *               example: "https://example.com/avatar.jpg"
 *         parentId:
 *           type: string
 *           nullable: true
 *           example: "507f1f77bcf86cd799439012"
 *         level:
 *           type: integer
 *           example: 0
 *           description: "Nesting level (0=comment, 1=reply, 2=sub-reply)"
 *         likes:
 *           type: integer
 *           example: 5
 *         dislikes:
 *           type: integer
 *           example: 0
 *         isApproved:
 *           type: boolean
 *           example: true
 *         isReported:
 *           type: boolean
 *           example: false
 *         reportCount:
 *           type: integer
 *           example: 0
 *         replies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T10:30:00Z"
 *     CommentPagination:
 *       type: object
 *       properties:
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 5
 *             totalComments:
 *               type: integer
 *               example: 87
 *             hasNext:
 *               type: boolean
 *               example: true
 *             hasPrev:
 *               type: boolean
 *               example: false
 *     CommentStats:
 *       type: object
 *       properties:
 *         totalComments:
 *           type: integer
 *           example: 150
 *         totalApproved:
 *           type: integer
 *           example: 145
 *         totalReported:
 *           type: integer
 *           example: 3
 *         totalLikes:
 *           type: integer
 *           example: 892
 *         totalDislikes:
 *           type: integer
 *           example: 23
 *         averageCommentsPerDay:
 *           type: number
 *           example: 12.5
 */
export const reportComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId // Fallback for testing
    
    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Authentication required")
    }

    const comment = await CommentService.reportComment(req.params.id, req.body, userId)
    return sendResponse(res, HTTP_STATUS.OK, null, "Comment reported successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}

/**
 * @openapi
 * /comments/statistics:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get comment statistics
 *     responses:
 *       200:
 *         description: Comment statistics retrieved successfully
 */
export const getCommentStats = async (req: Request, res: Response) => {
  try {
    const stats = await CommentService.getCommentStats()
    return sendResponse(res, HTTP_STATUS.OK, stats, "Comment statistics retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /comments/{id}/moderate:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Moderate a comment (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *                 enum: [approve, reject, delete, restore]
 *               reason:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Comment moderated successfully
 *       403:
 *         description: Admin access required
 */
export const moderateComment = async (req: Request, res: Response) => {
  try {
    const moderatorId = (req as any).user?.id
    const isAdmin = (req as any).user?.role === 'admin'
    
    if (!moderatorId || !isAdmin) {
      return sendError(res, HTTP_STATUS.FORBIDDEN, "Admin access required")
    }

    const moderationAction = {
      ...req.body,
      moderatorId
    }

    const comment = await CommentService.moderateComment(req.params.id, moderationAction)
    return sendResponse(res, HTTP_STATUS.OK, comment, "Comment moderated successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}