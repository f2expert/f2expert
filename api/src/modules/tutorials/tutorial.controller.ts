import { Request, Response } from "express"
import { MESSAGES } from "../../app/constants/message.constant"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"
import { sendError, sendResponse } from "../../app/utils/response.util"
import * as TutorialService from "./tutorial.service"
import * as CommentService from "../comments/comment.service"
import { ApiResponse } from "../../app/types/ApiResponse.interface"

/**
 * @openapi
 * /tutorials:
 *   get:
 *     tags:
 *       - Tutorials
 *     summary: Retrieve all published tutorials
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Number of tutorials per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced, Expert]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: tutorialType
 *         schema:
 *           type: string
 *           enum: [Article, Video, Interactive, Code-Along, Step-by-Step]
 *         description: Filter by tutorial type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for full-text search
 *     responses:
 *       200:
 *         description: List of tutorials with pagination
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
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     tutorials:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Tutorial'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalTutorials:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       204:
 *         description: No tutorials found
 *       500:
 *         description: Internal server error
 */
export const getAll = async (req: Request, res: Response) => {
  try {
    /*const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const { category, level, tutorialType, search } = req.query

    const filters: any = {}
    if (category) filters.category = category
    if (level) filters.level = level
    if (tutorialType) filters.tutorialType = tutorialType

    const sort = {
      field: (req.query.sortBy as any) || 'createdAt',
      order: (req.query.sortOrder as any) || 'desc'
    }

    const result = await TutorialService.getTutorialsWithFilters(
      filters,
      sort,
      page,
      limit,
      search as string
    )*/

    // Always return 200 with data, even if empty array
 const result = await TutorialService.getAllTutorials();   
    return sendResponse(res, HTTP_STATUS.OK, result, "Tutorials retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/limited/{limit}:
 *   get:
 *     tags:
 *       - Tutorials
 *     summary: Retrieve limited number of tutorials
 *     parameters:
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Maximum number of tutorials to retrieve
 *     responses:
 *       200:
 *         description: Limited list of tutorials
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
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     tutorials:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TutorialSummary'
 *                     count:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       400:
 *         description: Invalid limit parameter
 *       204:
 *         description: No tutorials found
 */
export const getLimited = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.params.limit)
    
    if (isNaN(limit) || limit <= 0 || limit > 50) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Limit must be a number between 1 and 50")
    }
    
    const tutorials = await TutorialService.getLimitedTutorials(limit)
    if (!tutorials.length) {
      return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, "No tutorials found")
    }
      
    const responseData = {
      tutorials,
      count: tutorials.length,
      limit
    }
    return sendResponse(res, HTTP_STATUS.OK, responseData, MESSAGES.SUCCESS)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/{id}:
 *   get:
 *     tags:
 *       - Tutorials
 *     summary: Retrieve tutorial by ID with associated comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutorial ID
 *       - in: query
 *         name: includeComments
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Whether to include comments in the response
 *       - in: query
 *         name: commentPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for comments pagination
 *       - in: query
 *         name: commentLimit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of comments per page
 *     responses:
 *       200:
 *         description: Tutorial details with embedded comments
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
 *                   example: "Success"
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/TutorialDetail'
 *                     - type: object
 *                       properties:
 *                         comments:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Comment'
 *                           description: "Array of comments for this tutorial"
 *                         commentsPagination:
 *                           type: object
 *                           properties:
 *                             currentPage:
 *                               type: integer
 *                               example: 1
 *                             totalPages:
 *                               type: integer
 *                               example: 1
 *                             totalComments:
 *                               type: integer
 *                               example: 2
 *                             hasNext:
 *                               type: boolean
 *                               example: false
 *                             hasPrev:
 *                               type: boolean
 *                               example: false
 *                             limit:
 *                               type: integer
 *                               example: 10
 *                           description: "Pagination information for comments"
 *       404:
 *         description: Tutorial not found
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
 *                   example: "Tutorial not found"
 *                 data:
 *                   type: null
 */
export const getById = async (req: Request, res: Response) => {
  try {
    const tutorial = await TutorialService.getTutorialById(req.params.id)
    if (!tutorial) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Tutorial not found")
    }

    // Increment view count
    await TutorialService.incrementTutorialViews(req.params.id)

    // Check if comments should be included (default: true)
    const includeComments = req.query.includeComments !== 'false'
    
    // Convert tutorial to plain object to add comments
    const tutorialData: any = tutorial.toObject ? tutorial.toObject() : { ...tutorial }

    if (includeComments) {
      try {
        const commentPage = parseInt(req.query.commentPage as string) || 1
        const commentLimit = parseInt(req.query.commentLimit as string) || 10
        const sortBy = 'createdAt'
        const sortOrder = 'desc'

        const commentsResult = await CommentService.getCommentsByTutorial(
          req.params.id, 
          commentPage, 
          commentLimit, 
          sortBy, 
          sortOrder
        )

        // Add comments directly to tutorial object
        tutorialData.comments = commentsResult.comments
        tutorialData.commentsPagination = commentsResult.pagination
      } catch (commentErr: any) {
        // If comment fetching fails, still return tutorial data but log the error
        console.error('Error fetching comments for tutorial:', commentErr.message)
        tutorialData.comments = []
        tutorialData.commentsPagination = {
          currentPage: 1,
          totalPages: 0,
          totalComments: 0,
          hasNext: false,
          hasPrev: false,
          limit: 10
        }
      }
    }

    return sendResponse(res, HTTP_STATUS.OK, tutorialData, MESSAGES.SUCCESS)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/featured:
 *   get:
 *     tags:
 *       - Tutorials
 *     summary: Retrieve featured tutorials
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *         description: Number of featured tutorials to retrieve
 *     responses:
 *       200:
 *         description: List of featured tutorials
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
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TutorialSummary'
 */
export const getFeatured = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6
    const tutorials = await TutorialService.getFeaturedTutorials(limit)
    
    return sendResponse(res, HTTP_STATUS.OK, tutorials, MESSAGES.SUCCESS)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/popular:
 *   get:
 *     tags:
 *       - Tutorials
 *     summary: Retrieve popular tutorials
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *         description: Number of popular tutorials to retrieve
 *     responses:
 *       200:
 *         description: List of popular tutorials
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
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TutorialSummary'
 */
export const getPopular = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    const tutorials = await TutorialService.getPopularTutorials(limit)
    
    return sendResponse(res, HTTP_STATUS.OK, tutorials, MESSAGES.SUCCESS)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/latest:
 *   get:
 *     tags:
 *       - Tutorials
 *     summary: Retrieve latest tutorials
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *         description: Number of latest tutorials to retrieve
 *     responses:
 *       200:
 *         description: List of latest tutorials
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
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TutorialSummary'
 */
export const getLatest = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    const tutorials = await TutorialService.getLatestTutorials(limit)
    
    return sendResponse(res, HTTP_STATUS.OK, tutorials, MESSAGES.SUCCESS)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/category/{category}:
 *   get:
 *     tags:
 *       - Tutorials
 *     summary: Retrieve tutorials by category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutorial category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of tutorials to retrieve
 *     responses:
 *       200:
 *         description: List of tutorials in category
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
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TutorialSummary'
 */
export const getByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined
    
    const tutorials = await TutorialService.getTutorialsByCategory(category, limit)
    
    return sendResponse(res, HTTP_STATUS.OK, tutorials, MESSAGES.SUCCESS)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/technology/{technology}:
 *   get:
 *     tags:
 *       - Tutorials
 *     summary: Retrieve tutorials by technology
 *     parameters:
 *       - in: path
 *         name: technology
 *         required: true
 *         schema:
 *           type: string
 *         description: Technology name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of tutorials to retrieve
 *     responses:
 *       200:
 *         description: List of tutorials for technology
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
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TutorialSummary'
 */
export const getByTechnology = async (req: Request, res: Response) => {
  try {
    const { technology } = req.params
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined
    
    const tutorials = await TutorialService.getTutorialsByTechnology(technology, limit)
    
    return sendResponse(res, HTTP_STATUS.OK, tutorials, MESSAGES.SUCCESS)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/search:
 *   get:
 *     tags:
 *       - Tutorials
 *     summary: Search tutorials
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results to return
 *     responses:
 *       200:
 *         description: Search results
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
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TutorialSummary'
 *       400:
 *         description: Search query is required
 */
export const search = async (req: Request, res: Response) => {
  try {
    const { q } = req.query
    const limit = parseInt(req.query.limit as string) || 20
    
    if (!q) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Search query is required")
    }
    
    const tutorials = await TutorialService.searchTutorials(q as string, limit)
    
    return sendResponse(res, HTTP_STATUS.OK, tutorials, MESSAGES.SUCCESS)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/statistics:
 *   get:
 *     tags:
 *       - Tutorials
 *     summary: Get tutorial statistics
 *     responses:
 *       200:
 *         description: Tutorial statistics and analytics
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
 *                   example: "Success"
 *                 data:
 *                   $ref: '#/components/schemas/TutorialStats'
 */
export const getStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await TutorialService.getTutorialStatistics()
    
    return sendResponse(res, HTTP_STATUS.OK, stats, MESSAGES.SUCCESS)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials:
 *   post:
 *     tags:
 *       - Tutorials
 *     summary: Create a new tutorial
 *     requestBody:
 *       required: true
 *       description: Tutorial details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - content
 *               - author
 *               - category
 *               - level
 *               - technologies
 *               - estimatedReadTime
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 example: "Getting Started with React Hooks"
 *                 description: "Tutorial title"
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 1000
 *                 example: "Learn React Hooks from basics to advanced patterns with practical examples and real-world use cases"
 *                 description: "Tutorial description (will be used to auto-generate shortDescription if not provided)"
 *               content:
 *                 type: string
 *                 minLength: 50
 *                 example: "# Introduction to React Hooks\\n\\nReact Hooks are functions that let you use state and other React features without writing a class component..."
 *                 description: "Main tutorial content (supports Markdown)"
 *               author:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "Jane Doe"
 *                 description: "Tutorial author name"
 *               category:
 *                 type: string
 *                 enum: [Web Development, Mobile Development, Data Science, AI/ML, Cloud Computing, DevOps, Cybersecurity, Database, Programming Languages, Software Testing, UI/UX Design, Game Development, Blockchain, IoT, Big Data, Tools & Setup, Other]
 *                 example: "Web Development"
 *                 description: "Tutorial category"
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced, Expert]
 *                 example: "Intermediate"
 *                 description: "Tutorial difficulty level"
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 example: ["React", "JavaScript", "Hooks"]
 *                 description: "Technologies covered in the tutorial (minimum 1 required)"
 *               estimatedReadTime:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 300
 *                 example: 15
 *                 description: "Estimated reading time in minutes"
 *               tutorialType:
 *                 type: string
 *                 enum: [Article, Video, Interactive, Code-Along, Step-by-Step]
 *                 default: "Article"
 *                 example: "Article"
 *                 description: "Type of tutorial (optional, defaults to Article)"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["react", "hooks", "frontend"]
 *                 description: "Tutorial tags (optional, will auto-generate from technologies if not provided)"
 *               difficulty:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 default: 2
 *                 example: 3
 *                 description: "Difficulty rating on 1-5 scale (optional, defaults to 2)"
 *               isPublished:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *                 description: "Whether to publish the tutorial immediately (optional, defaults to false)"
 *               thumbnailUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/react-hooks-thumbnail.jpg"
 *                 description: "Tutorial thumbnail image URL (optional)"
 *               videoUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://youtube.com/watch?v=abc123"
 *                 description: "Video tutorial URL (optional, for video-based tutorials)"
 *               videoDuration:
 *                 type: number
 *                 minimum: 0
 *                 example: 1800
 *                 description: "Video duration in seconds (optional, only relevant for video tutorials)"
 *     responses:
 *       201:
 *         description: Tutorial created successfully
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
 *                   example: "Tutorial created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/TutorialDetail'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Tutorial already exists
 *       500:
 *         description: Internal server error
 */
export const create = async (req: Request, res: Response) => {
  try {
    const newTutorial = await TutorialService.createTutorial(req.body)
    
    return sendResponse(res, HTTP_STATUS.CREATED, newTutorial, "Tutorial created successfully")
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map((error: any) => error.message).join(', ')
      return sendError(res, HTTP_STATUS.BAD_REQUEST, validationErrors)
    }
    
    if (err.code === 11000) {
      return sendError(res, HTTP_STATUS.CONFLICT, "Tutorial with this data already exists")
    }
    
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/{id}:
 *   put:
 *     tags:
 *       - Tutorials
 *     summary: Update tutorial by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutorial ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tutorial updated successfully
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
 *                   example: "Tutorial updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/TutorialDetail'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tutorial not found
 */
export const update = async (req: Request, res: Response) => {
  try {
    const updatedTutorial = await TutorialService.updateTutorial(req.params.id, req.body)
    if (!updatedTutorial) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Tutorial not found")
    }
    
    return sendResponse(res, HTTP_STATUS.OK, updatedTutorial, "Tutorial updated successfully")
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map((error: any) => error.message).join(', ')
      return sendError(res, HTTP_STATUS.BAD_REQUEST, validationErrors)
    }
    
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/{id}:
 *   delete:
 *     tags:
 *       - Tutorials
 *     summary: Delete tutorial by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutorial ID
 *     responses:
 *       204:
 *         description: Tutorial deleted successfully
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
 *                   example: "Tutorial deleted successfully"
 *                 data:
 *                   type: null
 *       404:
 *         description: Tutorial not found
 */
export const remove = async (req: Request, res: Response) => {
  try {
    const deletedTutorial = await TutorialService.deleteTutorial(req.params.id)
    if (!deletedTutorial) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Tutorial not found")
    }
    
    return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, "Tutorial deleted successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/{id}/like:
 *   post:
 *     tags:
 *       - Tutorials
 *     summary: Like a tutorial
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutorial ID
 *     responses:
 *       200:
 *         description: Tutorial liked successfully
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
 *                   example: "Tutorial liked successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalLikes:
 *                       type: number
 *                       example: 90
 *       404:
 *         description: Tutorial not found
 */
export const likeTutorial = async (req: Request, res: Response) => {
  try {
    const tutorial = await TutorialService.incrementTutorialLikes(req.params.id)
    if (!tutorial) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Tutorial not found")
    }
    
    return sendResponse(res, HTTP_STATUS.OK, { totalLikes: tutorial.totalLikes }, "Tutorial liked successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/{id}/unlike:
 *   post:
 *     tags:
 *       - Tutorials
 *     summary: Unlike a tutorial
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutorial ID
 *     responses:
 *       200:
 *         description: Tutorial unliked successfully
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
 *                   example: "Tutorial unliked successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalLikes:
 *                       type: number
 *                       example: 88
 *       404:
 *         description: Tutorial not found
 */
export const unlikeTutorial = async (req: Request, res: Response) => {
  try {
    const tutorial = await TutorialService.decrementTutorialLikes(req.params.id)
    if (!tutorial) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Tutorial not found")
    }
    
    return sendResponse(res, HTTP_STATUS.OK, { totalLikes: tutorial.totalLikes }, "Tutorial unliked successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/{id}/comments:
 *   get:
 *     tags:
 *       - Tutorials
 *     summary: Get comments for a tutorial
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutorial ID
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
 *         description: Tutorial not found
 */
export const getTutorialComments = async (req: Request, res: Response) => {
  try {
    const tutorialId = req.params.id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const sortBy = req.query.sortBy as string || 'createdAt'
    const sortOrder = req.query.sortOrder as string || 'desc'

    // Verify tutorial exists
    const tutorial = await TutorialService.getTutorialById(tutorialId)
    if (!tutorial) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Tutorial not found")
    }

    const result = await CommentService.getCommentsByTutorial(tutorialId, page, limit, sortBy, sortOrder)
    return sendResponse(res, HTTP_STATUS.OK, result, "Comments retrieved successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

/**
 * @openapi
 * /tutorials/{id}/comments:
 *   post:
 *     tags:
 *       - Tutorials
 *     summary: Add a comment to a tutorial
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutorial ID
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
 *                 example: "Great tutorial! Very helpful."
 *               parentId:
 *                 type: string
 *                 description: "Parent comment ID for replies"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tutorial not found
 */
export const addTutorialComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId // Fallback for testing
    
    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Authentication required")
    }

    const tutorialId = req.params.id
    
    // Verify tutorial exists
    const tutorial = await TutorialService.getTutorialById(tutorialId)
    if (!tutorial) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, "Tutorial not found")
    }

    const commentData = {
      content: req.body.content,
      contentType: 'tutorial' as const,
      contentId: tutorialId,
      tutorialId: tutorialId,
      parentId: req.body.parentId
    }

    const comment = await CommentService.createComment(commentData, userId)
    return sendResponse(res, HTTP_STATUS.CREATED, comment, "Comment added successfully")
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, err.message)
  }
}
