/**
 * @openapi
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *           description: "Unique review identifier"
 *         courseId:
 *           type: string
 *           example: "507f1f77bcf86cd799439010"
 *           description: "ID of the course being reviewed"
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *           description: "ID of the user who wrote the review"
 *         title:
 *           type: string
 *           example: "Excellent course with great content!"
 *           description: "Review title"
 *         content:
 *           type: string
 *           example: "This course provided comprehensive coverage of the subject matter. The instructor was knowledgeable and the examples were practical and relevant to real-world scenarios."
 *           description: "Detailed review content"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *           description: "Rating from 1 to 5 stars"
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
 *           description: "Author information (populated from User model)"
 *         course:
 *           type: object
 *           properties:
 *             courseId:
 *               type: string
 *               example: "507f1f77bcf86cd799439010"
 *             title:
 *               type: string
 *               example: "Complete React Development Course"
 *             instructor:
 *               type: string
 *               example: "Jane Smith"
 *             category:
 *               type: string
 *               example: "Web Development"
 *           description: "Course information (populated from Course model)"
 *         isApproved:
 *           type: boolean
 *           example: true
 *           description: "Whether the review is approved for display"
 *         isVerifiedPurchase:
 *           type: boolean
 *           example: true
 *           description: "Whether the reviewer actually enrolled in the course"
 *         isAnonymous:
 *           type: boolean
 *           example: false
 *           description: "Whether the review was posted anonymously"
 *         helpfulCount:
 *           type: integer
 *           example: 12
 *           description: "Number of users who found this review helpful"
 *         unhelpfulCount:
 *           type: integer
 *           example: 1
 *           description: "Number of users who found this review unhelpful"
 *         isReported:
 *           type: boolean
 *           example: false
 *           description: "Whether the review has been reported"
 *         reportCount:
 *           type: integer
 *           example: 0
 *           description: "Number of reports against this review"
 *         isDeleted:
 *           type: boolean
 *           example: false
 *           description: "Whether the review is soft deleted"
 *         isEdited:
 *           type: boolean
 *           example: false
 *           description: "Whether the review has been edited"
 *         editHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               previousContent:
 *                 type: string
 *               previousTitle:
 *                 type: string
 *               previousRating:
 *                 type: integer
 *               editedAt:
 *                 type: string
 *                 format: date-time
 *               reason:
 *                 type: string
 *           description: "History of edits made to this review"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T10:30:00Z"
 * 
 *     CreateReviewRequest:
 *       type: object
 *       required:
 *         - content
 *         - rating
 *       properties:
 *         title:
 *           type: string
 *           minLength: 10
 *           maxLength: 200
 *           example: "Excellent course with great content!"
 *           description: "Review title (optional)"
 *         content:
 *           type: string
 *           minLength: 50
 *           maxLength: 2000
 *           example: "This course provided comprehensive coverage of the subject matter. The instructor was knowledgeable and the examples were practical and relevant to real-world scenarios."
 *           description: "Detailed review content"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *           description: "Rating from 1 to 5 stars"
 *         isAnonymous:
 *           type: boolean
 *           default: false
 *           example: false
 *           description: "Whether to post the review anonymously"
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *           description: "User ID (for testing, usually from authentication)"
 * 
 *     UpdateReviewRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 10
 *           maxLength: 200
 *           example: "Updated review title"
 *           description: "Updated review title"
 *         content:
 *           type: string
 *           minLength: 50
 *           maxLength: 2000
 *           example: "Updated review content with additional insights."
 *           description: "Updated review content"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *           description: "Updated rating from 1 to 5 stars"
 *         reason:
 *           type: string
 *           maxLength: 200
 *           example: "Fixed typos and added more details"
 *           description: "Reason for editing the review"
 * 
 *     ReviewPagination:
 *       type: object
 *       properties:
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *           description: "Array of reviews"
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *               description: "Current page number"
 *             limit:
 *               type: integer
 *               example: 10
 *               description: "Number of reviews per page"
 *             totalReviews:
 *               type: integer
 *               example: 127
 *               description: "Total number of reviews"
 *             totalPages:
 *               type: integer
 *               example: 13
 *               description: "Total number of pages"
 *             hasNext:
 *               type: boolean
 *               example: true
 *               description: "Whether there are more pages"
 *             hasPrev:
 *               type: boolean
 *               example: false
 *               description: "Whether there are previous pages"
 * 
 *     ReviewStats:
 *       type: object
 *       properties:
 *         totalReviews:
 *           type: integer
 *           example: 127
 *           description: "Total number of reviews for the course"
 *         averageRating:
 *           type: number
 *           format: float
 *           example: 4.3
 *           description: "Average rating (rounded to 1 decimal place)"
 *         ratingDistribution:
 *           type: object
 *           properties:
 *             1:
 *               type: integer
 *               example: 2
 *               description: "Number of 1-star reviews"
 *             2:
 *               type: integer
 *               example: 5
 *               description: "Number of 2-star reviews"
 *             3:
 *               type: integer
 *               example: 18
 *               description: "Number of 3-star reviews"
 *             4:
 *               type: integer
 *               example: 45
 *               description: "Number of 4-star reviews"
 *             5:
 *               type: integer
 *               example: 57
 *               description: "Number of 5-star reviews"
 *           description: "Distribution of ratings"
 *         verifiedReviews:
 *           type: integer
 *           example: 89
 *           description: "Number of reviews from verified purchasers"
 *         approvedReviews:
 *           type: integer
 *           example: 127
 *           description: "Number of approved reviews"
 *         pendingReviews:
 *           type: integer
 *           example: 3
 *           description: "Number of reviews pending approval"
 *         reportedReviews:
 *           type: integer
 *           example: 1
 *           description: "Number of reported reviews"
 * 
 *     HelpfulnessRequest:
 *       type: object
 *       required:
 *         - action
 *       properties:
 *         action:
 *           type: string
 *           enum: [helpful, unhelpful, remove]
 *           example: "helpful"
 *           description: "Action to perform on the review"
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *           description: "User ID (for testing, usually from authentication)"
 * 
 *     ReportReviewRequest:
 *       type: object
 *       required:
 *         - reason
 *       properties:
 *         reason:
 *           type: string
 *           enum: [spam, inappropriate, fake, offensive, other]
 *           example: "inappropriate"
 *           description: "Reason for reporting the review"
 *         description:
 *           type: string
 *           maxLength: 500
 *           example: "This review contains inappropriate language and violates community guidelines."
 *           description: "Additional details about the report (optional)"
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *           description: "User ID (for testing, usually from authentication)"
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
 *           example: ["Field 'title' is required", "Rating must be between 1 and 5"]
 *           description: "Array of error messages (present when success is false)"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-10-24T10:30:00Z"
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
 *   - name: Course Reviews
 *     description: Course review management operations
 *   - name: Reviews
 *     description: General review operations and management
 */