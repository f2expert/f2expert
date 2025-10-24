// This file has been moved to prevent TypeScript compilation errors
// The swagger documentation should be integrated into the main swagger config
// instead of being a standalone .ts file in the root directory
/*
 * This file contains the complete Swagger/OpenAPI documentation for the enhanced comment system
 * that supports both tutorials and courses with unified architecture.
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
 *           description: "Unique comment identifier"
 *         content:
 *           type: string
 *           example: "Great tutorial! Very helpful explanation."
 *           description: "Comment content text"
 *         contentType:
 *           type: string
 *           enum: [tutorial, course]
 *           example: "tutorial"
 *           description: "Type of content being commented on"
 *         contentId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *           description: "ID of the tutorial or course"
 *         tutorialId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *           description: "Tutorial ID (for tutorial comments)"
 *         courseId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *           description: "Course ID (for course comments)"
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *           description: "ID of the user who created the comment"
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
 *           description: "Parent comment ID for replies (null for top-level comments)"
 *         level:
 *           type: integer
 *           example: 0
 *           description: "Nesting level (0=comment, 1=reply, 2=sub-reply, max=2)"
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
 *           description: "Array of user IDs who liked the comment"
 *         dislikes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f1f77bcf86cd799439015"]
 *           description: "Array of user IDs who disliked the comment"
 *         likeCount:
 *           type: integer
 *           example: 5
 *           description: "Total number of likes"
 *         dislikeCount:
 *           type: integer
 *           example: 1
 *           description: "Total number of dislikes"
 *         isApproved:
 *           type: boolean
 *           example: true
 *           description: "Whether the comment is approved for display"
 *         isReported:
 *           type: boolean
 *           example: false
 *           description: "Whether the comment has been reported"
 *         isDeleted:
 *           type: boolean
 *           example: false
 *           description: "Whether the comment is marked as deleted"
 *         reportCount:
 *           type: integer
 *           example: 0
 *           description: "Number of reports against this comment"
 *         reports:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               reason:
 *                 type: string
 *               description:
 *                 type: string
 *               reportedAt:
 *                 type: string
 *                 format: date-time
 *         replies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: "Nested replies to this comment"
 *         replyCount:
 *           type: integer
 *           example: 3
 *           description: "Total number of replies"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T10:30:00Z"
 * 
 *     CreateCommentRequest:
 *       type: object
 *       required:
 *         - content
 *         - contentType
 *         - contentId
 *       properties:
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           example: "Great content! Very helpful and informative."
 *           description: "The comment text content"
 *         contentType:
 *           type: string
 *           enum: [tutorial, course]
 *           example: "tutorial"
 *           description: "Type of content being commented on"
 *         contentId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *           description: "ID of the tutorial or course"
 *         tutorialId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *           description: "Tutorial ID (legacy support, auto-filled for tutorial comments)"
 *         courseId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *           description: "Course ID (auto-filled for course comments)"
 *         parentId:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *           description: "Parent comment ID for replies (optional)"
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *           description: "User ID (usually from authentication, can be provided for testing)"
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
 *           example: "Updated comment content with more details."
 *           description: "Updated comment text content"
 * 
 *     CommentPagination:
 *       type: object
 *       properties:
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: "Array of comments with nested replies"
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *               example: 1
 *               description: "Current page number"
 *             totalPages:
 *               type: integer
 *               example: 5
 *               description: "Total number of pages"
 *             totalComments:
 *               type: integer
 *               example: 87
 *               description: "Total number of top-level comments"
 *             hasNext:
 *               type: boolean
 *               example: true
 *               description: "Whether there are more pages"
 *             hasPrev:
 *               type: boolean
 *               example: false
 *               description: "Whether there are previous pages"
 * 
 *     CommentStats:
 *       type: object
 *       properties:
 *         totalComments:
 *           type: integer
 *           example: 150
 *           description: "Total number of comments for the content"
 *         totalApproved:
 *           type: integer
 *           example: 145
 *           description: "Number of approved comments"
 *         totalPending:
 *           type: integer
 *           example: 2
 *           description: "Number of pending approval comments"
 *         totalReported:
 *           type: integer
 *           example: 3
 *           description: "Number of reported comments"
 *         totalLikes:
 *           type: integer
 *           example: 892
 *           description: "Total likes across all comments"
 *         totalDislikes:
 *           type: integer
 *           example: 23
 *           description: "Total dislikes across all comments"
 *         averageCommentsPerDay:
 *           type: number
 *           format: float
 *           example: 12.5
 *           description: "Average number of comments per day"
 *         topContributors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               name:
 *                 type: string
 *               commentCount:
 *                 type: integer
 *           description: "Top comment contributors"
 * 
 *     CommentReportRequest:
 *       type: object
 *       required:
 *         - reason
 *         - userId
 *       properties:
 *         reason:
 *           type: string
 *           enum: [spam, inappropriate, offensive, harassment, misinformation, copyright, other]
 *           example: "inappropriate"
 *           description: "Reason for reporting the comment"
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *           description: "ID of the user reporting the comment"
 *         description:
 *           type: string
 *           maxLength: 500
 *           example: "This comment contains inappropriate language and violates community guidelines."
 *           description: "Additional details about the report (optional)"
 * 
 *     CommentModerationRequest:
 *       type: object
 *       required:
 *         - action
 *         - moderatorId
 *       properties:
 *         action:
 *           type: string
 *           enum: [approve, reject, delete, restore, flag]
 *           example: "approve"
 *           description: "Moderation action to perform"
 *         moderatorId:
 *           type: string
 *           example: "507f1f77bcf86cd799439014"
 *           description: "ID of the moderator performing the action"
 *         reason:
 *           type: string
 *           example: "Content approved after review for community guidelines compliance"
 *           description: "Reason for the moderation action (optional)"
 *         notes:
 *           type: string
 *           example: "Reviewed content meets all community standards"
 *           description: "Additional moderator notes (optional)"
 * 
 *     LikeDislikeRequest:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *           description: "ID of the user performing the like/dislike action"
 * 
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *           description: "Whether the request was successful"
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *           description: "Human-readable message"
 *         data:
 *           type: object
 *           description: "Response data (varies by endpoint)"
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Field 'content' is required", "Invalid content type"]
 *           description: "Array of error messages (present when success is false)"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T10:30:00Z"
 *           description: "Response timestamp"
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "JWT token obtained from login endpoint"
 */

/**
 * @openapi
 * tags:
 *   - name: Comments
 *     description: Comment management operations for tutorials and courses
 *   - name: Tutorial Comments
 *     description: Tutorial-specific comment operations
 *   - name: Course Comments  
 *     description: Course-specific comment operations
 */

/**
 * @openapi
 * /comments:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Create a new comment for tutorial or course
 *     description: |
 *       Create a comment on a tutorial or course. Supports nested replies up to 3 levels deep.
 *       
 *       **Features:**
 *       - Support for both tutorial and course comments
 *       - Hierarchical nested replies (comment → reply → sub-reply)
 *       - Automatic content validation
 *       - User authentication required
 *       - Auto-moderation for approved users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *           examples:
 *             tutorialComment:
 *               summary: Tutorial Comment
 *               value:
 *                 content: "Great tutorial! The explanation of React hooks is very clear."
 *                 contentType: "tutorial"
 *                 contentId: "507f1f77bcf86cd799439011"
 *             courseComment:
 *               summary: Course Comment  
 *               value:
 *                 content: "Excellent course structure and comprehensive content."
 *                 contentType: "course"
 *                 contentId: "507f1f77bcf86cd799439011"
 *             replyComment:
 *               summary: Reply to Comment
 *               value:
 *                 content: "I agree! This section was particularly helpful."
 *                 contentType: "tutorial"
 *                 contentId: "507f1f77bcf86cd799439011"
 *                 parentId: "507f1f77bcf86cd799439012"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Comment'
 *             example:
 *               success: true
 *               message: "Comment created successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 content: "Great tutorial! Very helpful."
 *                 contentType: "tutorial"
 *                 contentId: "507f1f77bcf86cd799439010"
 *                 author:
 *                   userId: "507f1f77bcf86cd799439013"
 *                   name: "John Doe"
 *                   email: "john@example.com"
 *                 level: 0
 *                 isApproved: true
 *                 createdAt: "2025-10-23T10:30:00Z"
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Validation error"
 *               errors: ["Content is required", "Invalid content type"]
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Authentication required"
 *       404:
 *         description: Tutorial, course, or parent comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Tutorial not found"
 *       429:
 *         description: Too many requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Rate limit exceeded. Please try again later."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 */

/**
 * @openapi
 * /tutorials/{id}/comments:
 *   get:
 *     tags:
 *       - Tutorial Comments
 *     summary: Get comments for a tutorial
 *     description: |
 *       Retrieve paginated comments for a specific tutorial with nested replies.
 *       
 *       **Features:**
 *       - Hierarchical comment structure with nested replies
 *       - Pagination support
 *       - Multiple sorting options
 *       - Only approved comments are returned
 *       - Includes like/dislike counts and user interactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutorial ID
 *         example: "507f1f77bcf86cd799439011"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of comments per page
 *         example: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, likes, updatedAt]
 *           default: createdAt
 *         description: Field to sort by
 *         example: "createdAt"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *         example: "desc"
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CommentPagination'
 *       404:
 *         description: Tutorial not found
 *   post:
 *     tags:
 *       - Tutorial Comments
 *     summary: Add a comment to a tutorial
 *     description: |
 *       Add a comment or reply to a specific tutorial.
 *       
 *       **Features:**
 *       - Direct tutorial comment creation
 *       - Support for nested replies
 *       - Automatic tutorial validation
 *       - User authentication required
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutorial ID
 *         example: "507f1f77bcf86cd799439011"
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
 *                 example: "Great tutorial! Very helpful explanation."
 *                 description: "Comment content"
 *               parentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *                 description: "Parent comment ID for replies (optional)"
 *               userId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439013"
 *                 description: "User ID (for testing, usually from auth)"
 *           examples:
 *             newComment:
 *               summary: New Tutorial Comment
 *               value:
 *                 content: "Excellent tutorial! The examples are very clear."
 *             replyComment:
 *               summary: Reply to Comment
 *               value:
 *                 content: "I agree! This helped me understand the concept."
 *                 parentId: "507f1f77bcf86cd799439012"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Tutorial not found
 */

/**
 * @openapi
 * /courses/{id}/comments:
 *   get:
 *     tags:
 *       - Course Comments
 *     summary: Get comments for a course
 *     description: |
 *       Retrieve paginated comments for a specific course with nested replies.
 *       Same functionality as tutorial comments but for course content.
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
 *           maximum: 100
 *           default: 20
 *         description: Number of comments per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, likes, updatedAt]
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
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CommentPagination'
 *       404:
 *         description: Course not found
 *   post:
 *     tags:
 *       - Course Comments
 *     summary: Add a comment to a course
 *     description: |
 *       Add a comment or reply to a specific course.
 *       Same functionality as tutorial comments but for course content.
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
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *                 example: "Great course! Very comprehensive and well-structured."
 *               parentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *                 description: "Parent comment ID for replies (optional)"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required  
 *       404:
 *         description: Course not found
 */

/**
 * @openapi
 * /comments/{id}/like:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Like a comment
 *     description: |
 *       Add a like to a comment. If the user has already liked the comment, the like will be removed.
 *       If the user has disliked the comment, the dislike will be removed and a like will be added.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LikeDislikeRequest'
 *     responses:
 *       200:
 *         description: Comment like status updated
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
 *                         likes:
 *                           type: integer
 *                           example: 15
 *                         dislikes:
 *                           type: integer  
 *                           example: 2
 *                         userAction:
 *                           type: string
 *                           enum: [liked, unliked]
 *                           example: "liked"
 *       404:
 *         description: Comment not found
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Remove like from a comment
 *     description: Remove a user's like from a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LikeDislikeRequest'
 *     responses:
 *       200:
 *         description: Like removed successfully
 *       404:
 *         description: Comment not found
 */

/**
 * @openapi
 * /comments/{id}/dislike:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Dislike a comment
 *     description: |
 *       Add a dislike to a comment. If the user has already disliked the comment, the dislike will be removed.
 *       If the user has liked the comment, the like will be removed and a dislike will be added.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LikeDislikeRequest'
 *     responses:
 *       200:
 *         description: Comment dislike status updated
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
 *                         likes:
 *                           type: integer
 *                           example: 13
 *                         dislikes:
 *                           type: integer
 *                           example: 3
 *                         userAction:
 *                           type: string
 *                           enum: [disliked, undisliked]
 *                           example: "disliked"
 *       404:
 *         description: Comment not found
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Remove dislike from a comment
 *     description: Remove a user's dislike from a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LikeDislikeRequest'
 *     responses:
 *       200:
 *         description: Dislike removed successfully
 *       404:
 *         description: Comment not found
 */

/**
 * @openapi
 * /comments/{id}/report:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Report a comment for moderation
 *     description: |
 *       Report a comment that violates community guidelines or contains inappropriate content.
 *       Multiple reports from different users can be submitted for the same comment.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentReportRequest'
 *           examples:
 *             spam:
 *               summary: Spam Report
 *               value:
 *                 reason: "spam"
 *                 userId: "507f1f77bcf86cd799439013"
 *                 description: "This comment is promotional spam and not relevant to the content."
 *             inappropriate:
 *               summary: Inappropriate Content
 *               value:
 *                 reason: "inappropriate"
 *                 userId: "507f1f77bcf86cd799439013"
 *                 description: "This comment contains inappropriate language."
 *     responses:
 *       200:
 *         description: Comment reported successfully
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
 *                         reportId:
 *                           type: string
 *                           example: "507f1f77bcf86cd799439020"
 *                         reportCount:
 *                           type: integer
 *                           example: 3
 *       400:
 *         description: Invalid report data or user has already reported this comment
 *       404:
 *         description: Comment not found
 */

/**
 * @openapi
 * /comments/{id}/moderate:
 *   put:
 *     tags:
 *       - Comments
 *     summary: Moderate a comment (Admin/Moderator only)
 *     description: |
 *       Perform moderation actions on comments including approve, reject, delete, or restore.
 *       This endpoint requires admin or moderator privileges.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentModerationRequest'
 *           examples:
 *             approve:
 *               summary: Approve Comment
 *               value:
 *                 action: "approve"
 *                 moderatorId: "507f1f77bcf86cd799439014"
 *                 reason: "Content meets community guidelines"
 *             delete:
 *               summary: Delete Comment
 *               value:
 *                 action: "delete"
 *                 moderatorId: "507f1f77bcf86cd799439014"
 *                 reason: "Violates community guidelines - inappropriate content"
 *                 notes: "Multiple reports received for offensive language"
 *     responses:
 *       200:
 *         description: Comment moderated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Comment'
 *       403:
 *         description: Insufficient permissions - Admin/Moderator access required
 *       404:
 *         description: Comment not found
 */

/**
 * @openapi
 * /comments/statistics/{contentId}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get comment statistics for tutorial or course
 *     description: |
 *       Retrieve comprehensive statistics about comments for a specific piece of content.
 *       Includes counts, engagement metrics, and trend data.
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutorial or Course ID
 *         example: "507f1f77bcf86cd799439011"
 *       - in: query
 *         name: contentType
 *         schema:
 *           type: string
 *           enum: [tutorial, course]
 *           default: tutorial
 *         description: Type of content
 *         example: "tutorial"
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y, all]
 *           default: 30d
 *         description: Time period for statistics
 *         example: "30d"
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CommentStats'
 *       404:
 *         description: Content not found
 */

/**
 * @openapi
 * /comments/user/{userId}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get comments by user
 *     description: |
 *       Retrieve all comments made by a specific user across all tutorials and courses.
 *       Supports pagination and filtering.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "507f1f77bcf86cd799439013"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of comments per page
 *       - in: query
 *         name: contentType
 *         schema:
 *           type: string
 *           enum: [tutorial, course, all]
 *           default: all
 *         description: Filter by content type
 *     responses:
 *       200:
 *         description: User comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CommentPagination'
 *       404:
 *         description: User not found
 */