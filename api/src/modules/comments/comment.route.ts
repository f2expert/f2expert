import { Router } from "express"
import * as CommentController from "./comment.controller"
import { validateBody, validateQuery } from "../../app/middlewares/validation.middleware"
import {
  createCommentSchema,
  updateCommentSchema,
  commentReportSchema,
  commentFilterSchema,
  commentModerationSchema
} from "./comment.validation"

const router = Router()

// Basic CRUD operations
router.post("/", 
  validateBody(createCommentSchema),
  CommentController.createComment
)

router.get("/:id", 
  CommentController.getCommentById
)

router.put("/:id", 
  validateBody(updateCommentSchema),
  CommentController.updateComment
)

router.delete("/:id", 
  CommentController.deleteComment
)

// Tutorial-specific comments
router.get("/tutorial/:tutorialId", 
  validateQuery(commentFilterSchema),
  CommentController.getCommentsByTutorial
)

// Comment replies
router.get("/:parentId/replies", 
  CommentController.getCommentReplies
)

// Comment interactions (unified toggle endpoints)
router.post("/:id/like", 
  CommentController.toggleLike
)

router.post("/:id/dislike", 
  CommentController.toggleDislike
)

// Comment reporting
router.post("/:id/report", 
  validateBody(commentReportSchema),
  CommentController.reportComment
)

// Statistics
router.get("/statistics", 
  CommentController.getCommentStats
)

// Moderation (Admin only)
router.post("/:id/moderate", 
  validateBody(commentModerationSchema),
  CommentController.moderateComment
)

export default router