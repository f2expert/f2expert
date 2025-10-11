import { Request, Response } from "express"
import { MESSAGES } from "../../app/constants/message.constant"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"
import { sendError, sendResponse } from "../../app/utils/response.util"
import * as TutorialService from "./tutorial.service"
import { ApiResponse } from "../../app/types/ApiResponse.interface"

/**
 * @openapi
 * components:
 *   schemas:
 *     TutorialSummary:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         title:
 *           type: string
 *           example: "Getting Started with React Hooks"
 *         shortDescription:
 *           type: string
 *           example: "Learn React Hooks from basics to advanced patterns"
 *         author:
 *           type: string
 *           example: "Jane Doe"
 *         category:
 *           type: string
 *           example: "Web Development"
 *         level:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced, Expert]
 *           example: "Intermediate"
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["React", "JavaScript", "Hooks"]
 *         estimatedReadTime:
 *           type: number
 *           example: 15
 *         tutorialType:
 *           type: string
 *           enum: [Article, Video, Interactive, Code-Along, Step-by-Step]
 *           example: "Article"
 *         difficulty:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 3
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           example: 4.5
 *         totalViews:
 *           type: number
 *           example: 1250
 *         totalLikes:
 *           type: number
 *           example: 89
 *         thumbnailUrl:
 *           type: string
 *           format: uri
 *           example: "https://example.com/thumbnail.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         publishedAt:
 *           type: string
 *           format: date-time
 *
 *     TutorialStep:
 *       type: object
 *       properties:
 *         stepNumber:
 *           type: number
 *           example: 1
 *         title:
 *           type: string
 *           example: "Setting Up React Environment"
 *         content:
 *           type: string
 *           example: "First, let's create a new React app..."
 *         codeSnippet:
 *           type: string
 *           example: "npx create-react-app my-app"
 *         language:
 *           type: string
 *           example: "bash"
 *         imageUrl:
 *           type: string
 *           format: uri
 *
 *     CodeExample:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "useState Hook Example"
 *         language:
 *           type: string
 *           example: "javascript"
 *         code:
 *           type: string
 *           example: "const [count, setCount] = useState(0);"
 *         description:
 *           type: string
 *           example: "Basic useState hook for state management"
 *
 *     TutorialResource:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "React Official Documentation"
 *         url:
 *           type: string
 *           format: uri
 *           example: "https://reactjs.org/docs/hooks-intro.html"
 *         type:
 *           type: string
 *           enum: [Documentation, Tool, Library, Framework, Article, Video]
 *           example: "Documentation"
 *
 *     TutorialDetail:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         title:
 *           type: string
 *           example: "Getting Started with React Hooks"
 *         description:
 *           type: string
 *           example: "Comprehensive guide to understanding and using React Hooks in modern applications"
 *         shortDescription:
 *           type: string
 *           example: "Learn React Hooks from basics to advanced patterns"
 *         content:
 *           type: string
 *           example: "# Introduction to React Hooks\\n\\nReact Hooks revolutionized..."
 *         author:
 *           type: string
 *           example: "Jane Doe"
 *         authorBio:
 *           type: string
 *           example: "Senior React Developer with 8+ years experience"
 *         category:
 *           type: string
 *           example: "Web Development"
 *         subCategory:
 *           type: string
 *           example: "Frontend Frameworks"
 *         level:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced, Expert]
 *           example: "Intermediate"
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["React", "JavaScript", "Hooks"]
 *         prerequisites:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Basic React knowledge", "JavaScript ES6+"]
 *         learningObjectives:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Understand all built-in React Hooks", "Create custom hooks"]
 *         estimatedReadTime:
 *           type: number
 *           example: 25
 *         tutorialType:
 *           type: string
 *           enum: [Article, Video, Interactive, Code-Along, Step-by-Step]
 *           example: "Article"
 *         steps:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TutorialStep'
 *         codeExamples:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CodeExample'
 *         resources:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TutorialResource'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["react", "hooks", "frontend"]
 *         difficulty:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 3
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           example: 4.5
 *         totalViews:
 *           type: number
 *           example: 1250
 *         totalLikes:
 *           type: number
 *           example: 89
 *         totalComments:
 *           type: number
 *           example: 23
 *         isPublished:
 *           type: boolean
 *           example: true
 *         isFeatured:
 *           type: boolean
 *           example: true
 *         isPremium:
 *           type: boolean
 *           example: false
 *         thumbnailUrl:
 *           type: string
 *           format: uri
 *           example: "https://example.com/thumbnail.jpg"
 *         videoUrl:
 *           type: string
 *           format: uri
 *         videoDuration:
 *           type: number
 *           example: 1800
 *         relatedCourses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               level:
 *                 type: string
 *               price:
 *                 type: number
 *         relatedTutorials:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               level:
 *                 type: string
 *               estimatedReadTime:
 *                 type: number
 *         seoTitle:
 *           type: string
 *           example: "React Hooks Tutorial - Complete Guide 2024"
 *         seoDescription:
 *           type: string
 *           example: "Learn React Hooks with practical examples and best practices"
 *         seoKeywords:
 *           type: array
 *           items:
 *             type: string
 *           example: ["react hooks", "useState", "useEffect"]
 *         language:
 *           type: string
 *           example: "English"
 *         publishedAt:
 *           type: string
 *           format: date-time
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     TutorialStats:
 *       type: object
 *       properties:
 *         totalTutorials:
 *           type: number
 *           example: 150
 *         totalViews:
 *           type: number
 *           example: 25000
 *         averageRating:
 *           type: number
 *           example: 4.2
 *         categoryDistribution:
 *           type: object
 *           additionalProperties:
 *             type: number
 *           example:
 *             "Web Development": 45
 *             "Data Science": 30
 *             "Mobile Development": 25
 *         levelDistribution:
 *           type: object
 *           additionalProperties:
 *             type: number
 *           example:
 *             "Beginner": 60
 *             "Intermediate": 50
 *             "Advanced": 30
 *             "Expert": 10
 *         typeDistribution:
 *           type: object
 *           additionalProperties:
 *             type: number
 *           example:
 *             "Article": 100
 *             "Video": 30
 *             "Code-Along": 20
 *         topTechnologies:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               technology:
 *                 type: string
 *               count:
 *                 type: number
 *           example:
 *             - technology: "JavaScript"
 *               count: 75
 *             - technology: "React"
 *               count: 45
 *
 *     Tutorial:
 *       allOf:
 *         - $ref: '#/components/schemas/TutorialSummary'
 *         - type: object
 *           properties:
 *             description:
 *               type: string
 *             prerequisites:
 *               type: array
 *               items:
 *                 type: string
 *             learningObjectives:
 *               type: array
 *               items:
 *                 type: string
 */

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
    const page = parseInt(req.query.page as string) || 1
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
    )

    if (!result.tutorials.length) {
      return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.SUCCESS)
    }

    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: result
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
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
      
    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: {
        tutorials,
        count: tutorials.length,
        limit
      }
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
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
 *     summary: Retrieve tutorial by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tutorial ID
 *     responses:
 *       200:
 *         description: Tutorial details
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
 *                   $ref: '#/components/schemas/TutorialDetail'
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

    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: tutorial
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
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
    
    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: tutorials
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
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
    
    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: tutorials
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
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
    
    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: tutorials
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
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
    
    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: tutorials
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
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
    
    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: tutorials
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
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
    
    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: tutorials
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
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
    
    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: stats
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
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
    const response: ApiResponse = {
      success: true,
      message: "Tutorial created successfully",
      data: newTutorial
    }
    return sendResponse(res, HTTP_STATUS.CREATED, response)
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
    
    const response: ApiResponse = {
      success: true,
      message: "Tutorial updated successfully",
      data: updatedTutorial
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
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
    
    const response: ApiResponse = {
      success: true,
      message: "Tutorial liked successfully",
      data: { totalLikes: tutorial.totalLikes }
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
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
    
    const response: ApiResponse = {
      success: true,
      message: "Tutorial unliked successfully",
      data: { totalLikes: tutorial.totalLikes }
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}