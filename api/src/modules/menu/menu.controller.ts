/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     MenuRequest:
 *       type: object
 *       required:
 *         - title
 *         - path
 *         - roles
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "Dashboard"
 *           description: "Menu item title/label"
 *         path:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           example: "/dashboard"
 *           description: "Menu item route path"
 *         icon:
 *           type: string
 *           maxLength: 50
 *           example: "dashboard-icon"
 *           description: "Icon class or identifier for the menu item (optional)"
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           minItems: 1
 *           example: ["admin", "user"]
 *           description: "User roles that can access this menu item"
 *         parentId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *           description: "Parent menu item ID for creating sub-menus (optional)"
 *         order:
 *           type: number
 *           minimum: 0
 *           example: 1
 *           description: "Display order of the menu item (optional, defaults to 0)"
 *         menuType:
 *           type: string
 *           enum: [main, submenu, setting, link, action]
 *           example: "main"
 *           description: "Type of menu item for UI rendering (optional, defaults to 'main')"
 *
 *     MenuResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         title:
 *           type: string
 *           example: "Dashboard"
 *         path:
 *           type: string
 *           example: "/dashboard"
 *         icon:
 *           type: string
 *           example: "dashboard-icon"
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           example: ["admin", "user"]
 *         parentId:
 *           type: string
 *           example: "507f1f77bcf86cd799439010"
 *         order:
 *           type: number
 *           example: 1
 *         menuType:
 *           type: string
 *           enum: [main, submenu, setting, link, action]
 *           example: "main"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     MenuTree:
 *       allOf:
 *         - $ref: '#/components/schemas/MenuResponse'
 *         - type: object
 *           properties:
 *             children:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuTree'
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Success"
 *         data:
 *           type: object
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error message"
 *         data:
 *           type: null
 *
 * /menu:
 *   post:
 *     tags:
 *       - Menu
 *     summary: Create a new menu item
 *     description: Create a new menu item for the navigation system. Can be a parent menu or child menu by specifying parentId.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     requestBody:
 *       required: true
 *       description: Menu item details
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuRequest'
 *     responses:
 *       201:
 *         description: Menu created successfully
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
 *                   example: "Menu created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/MenuResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     tags:
 *       - Menu
 *     summary: Get all menu items
 *     description: Retrieve all menu items. Returns flat list of all menus with parent-child relationships.
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter menus by user role
 *       - in: query
 *         name: tree
 *         schema:
 *           type: boolean
 *         description: Return hierarchical tree structure if true
 *     responses:
 *       200:
 *         description: List of menu items
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
 *                     $ref: '#/components/schemas/MenuResponse'
 *       500:
 *         description: Internal server error
 *
 * /menu/{id}:
 *   get:
 *     tags:
 *       - Menu
 *     summary: Get menu item by ID
 *     description: Retrieve a specific menu item by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item details
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
 *                   $ref: '#/components/schemas/MenuResponse'
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     tags:
 *       - Menu
 *     summary: Update menu item by ID
 *     description: Update an existing menu item. All fields are optional for updates.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID to update
 *     requestBody:
 *       required: true
 *       description: Updated menu item details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Dashboard"
 *               path:
 *                 type: string
 *                 example: "/new-dashboard"
 *               icon:
 *                 type: string
 *                 example: "new-dashboard-icon"
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["admin"]
 *               parentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               order:
 *                 type: number
 *                 example: 5
 *               menuType:
 *                 type: string
 *                 enum: [main, submenu, setting, link, action]
 *                 example: "submenu"
 *     responses:
 *       200:
 *         description: Menu updated successfully
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
 *                   example: "Menu updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/MenuResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     tags:
 *       - Menu
 *     summary: Delete menu item by ID
 *     description: Delete a menu item. Note - deleting a parent menu will also delete all its children.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID to delete
 *     responses:
 *       204:
 *         description: Menu deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *
 * /menu/{id}/children:
 *   get:
 *     tags:
 *       - Menu
 *     summary: Get child menu items of a parent menu
 *     description: Retrieve all direct child menu items for a specific parent menu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent menu item ID
 *     responses:
 *       200:
 *         description: Child menu items retrieved successfully
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
 *                   example: "Child menus retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MenuResponse'
 *       500:
 *         description: Internal server error
 *
 * /menu/root/list:
 *   get:
 *     tags:
 *       - Menu
 *     summary: Get all root menu items
 *     description: Retrieve all top-level menu items (menus without a parent).
 *     responses:
 *       200:
 *         description: Root menu items retrieved successfully
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
 *                   example: "Root menus retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MenuResponse'
 *       500:
 *         description: Internal server error
 */
import { Request, Response } from 'express';
import { MenuService } from './menu.service';
import { IMenuDTO } from './menu.types';
import { sendResponse, sendError } from '../../app/utils/response.util';
import { HTTP_STATUS } from '../../app/constants/http-status.constant';

export class MenuController {
  static async createMenu(req: Request, res: Response) {
    try {
      const menuData: IMenuDTO = req.body;
      const menu = await MenuService.createMenu(menuData);
      return sendResponse(res, HTTP_STATUS.CREATED, menu, "Menu created successfully");
    } catch (error: any) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message || "Failed to create menu");
    }
  }

  static async getAllMenus(req: Request, res: Response) {
    try {
      const { role, tree } = req.query as { role?: string; tree?: boolean };
      const menus = await MenuService.getAllMenus(role, tree);
      return sendResponse(res, HTTP_STATUS.OK, menus, "Menus retrieved successfully");
    } catch (error: any) {
      return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve menus");
    }
  }

  static async getMenuById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const menu = await MenuService.getMenuById(id);
      if (!menu) {
        return sendError(res, HTTP_STATUS.NOT_FOUND, "Menu not found");
      }
      return sendResponse(res, HTTP_STATUS.OK, menu, "Menu retrieved successfully");
    } catch (error: any) {
      return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve menu");
    }
  }

  static async updateMenu(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: Partial<IMenuDTO> = req.body;
      const menu = await MenuService.updateMenu(id, updateData);
      if (!menu) {
        return sendError(res, HTTP_STATUS.NOT_FOUND, "Menu not found");
      }
      return sendResponse(res, HTTP_STATUS.OK, menu, "Menu updated successfully");
    } catch (error: any) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message || "Failed to update menu");
    }
  }

  static async deleteMenu(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await MenuService.deleteMenu(id);
      if (!deleted) {
        return sendError(res, HTTP_STATUS.NOT_FOUND, "Menu not found");
      }
      return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error: any) {
      return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to delete menu");
    }
  }

  static async getChildMenus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const childMenus = await MenuService.getChildMenus(id);
      return sendResponse(res, HTTP_STATUS.OK, childMenus, "Child menus retrieved successfully");
    } catch (error: any) {
      return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve child menus");
    }
  }

  static async getRootMenus(req: Request, res: Response) {
    try {
      const rootMenus = await MenuService.getRootMenus();
      return sendResponse(res, HTTP_STATUS.OK, rootMenus, "Root menus retrieved successfully");
    } catch (error: any) {
      return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve root menus");
    }
  }

  /**
   * @openapi
   * /menu/user-navigation/{userId}:
   *   get:
   *     tags:
   *       - Menu
   *     summary: Get user navigation data with course progress
   *     description: Retrieve personalized navigation data including enrolled courses, progress, and lesson details for a specific user.
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID to fetch navigation data for
   *         example: "68f21bbfcc61757d1a5a287c"
   *     responses:
   *       200:
   *         description: User navigation data retrieved successfully
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
   *                   example: "User navigation data retrieved successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     userId:
   *                       type: string
   *                       example: "68f21bbfcc61757d1a5a287c"
   *                       description: "The user ID for which navigation data is fetched"
   *                     navMain:
   *                       type: array
   *                       description: "Main navigation items representing enrolled courses"
   *                       items:
   *                         type: object
   *                         properties:
   *                           title:
   *                             type: string
   *                             example: "HTML Fundamentals"
   *                             description: "Course title"
   *                           url:
   *                             type: string
   *                             example: "#"
   *                             description: "Course URL (typically # for parent items)"
   *                           icon:
   *                             type: string
   *                             example: "GrHtml5"
   *                             description: "Icon identifier for the course"
   *                           isActive:
   *                             type: boolean
   *                             example: true
   *                             description: "Whether this course is currently active/selected"
   *                           courseId:
   *                             type: string
   *                             example: "course_html_001"
   *                             description: "Unique course identifier"
   *                           enrollmentStatus:
   *                             type: string
   *                             enum: [active, enrolled, completed, paused]
   *                             example: "active"
   *                             description: "Current enrollment status"
   *                           progress:
   *                             type: number
   *                             minimum: 0
   *                             maximum: 100
   *                             example: 75
   *                             description: "Course completion percentage"
   *                           items:
   *                             type: array
   *                             description: "List of lessons/modules within the course"
   *                             items:
   *                               type: object
   *                               properties:
   *                                 title:
   *                                   type: string
   *                                   example: "Introduction to HTML"
   *                                   description: "Lesson title"
   *                                 url:
   *                                   type: string
   *                                   example: "/dashboard/html/introduction"
   *                                   description: "Lesson URL path"
   *                                 contentId:
   *                                   type: string
   *                                   example: "Ok3TQXserUI"
   *                                   description: "Unique content identifier (e.g., video ID)"
   *                                 lessonId:
   *                                   type: string
   *                                   example: "lesson_html_001"
   *                                   description: "Unique lesson identifier"
   *                                 isCompleted:
   *                                   type: boolean
   *                                   example: true
   *                                   description: "Whether the lesson is completed"
   *                                 duration:
   *                                   type: string
   *                                   example: "15 mins"
   *                                   description: "Estimated lesson duration"
   *                                 type:
   *                                   type: string
   *                                   enum: [video, interactive, text, quiz, assignment]
   *                                   example: "video"
   *                                   description: "Type of lesson content"
   *                     lastAccessed:
   *                       type: object
   *                       description: "Information about the user's last accessed lesson"
   *                       properties:
   *                         courseId:
   *                           type: string
   *                           example: "course_html_001"
   *                           description: "Course ID of last accessed lesson"
   *                         lessonId:
   *                           type: string
   *                           example: "lesson_html_002"
   *                           description: "Lesson ID of last accessed lesson"
   *                         timestamp:
   *                           type: string
   *                           format: date-time
   *                           example: "2025-10-17T10:45:00.000Z"
   *                           description: "Timestamp of last access"
   *                     enrolledCourses:
   *                       type: array
   *                       description: "Summary of all enrolled courses"
   *                       items:
   *                         type: object
   *                         properties:
   *                           courseId:
   *                             type: string
   *                             example: "course_html_001"
   *                             description: "Unique course identifier"
   *                           courseName:
   *                             type: string
   *                             example: "HTML Fundamentals"
   *                             description: "Course display name"
   *                           enrollmentDate:
   *                             type: string
   *                             format: date-time
   *                             example: "2025-10-15T08:00:00.000Z"
   *                             description: "Date when user enrolled in the course"
   *                           status:
   *                             type: string
   *                             enum: [active, completed, paused, dropped]
   *                             example: "active"
   *                             description: "Current enrollment status"
   *                           progress:
   *                             type: number
   *                             minimum: 0
   *                             maximum: 100
   *                             example: 75
   *                             description: "Course completion percentage"
   *       404:
   *         description: User not found
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
   *                   example: "User not found"
   *                 data:
   *                   type: null
   *       500:
   *         description: Internal server error
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
   *                   example: "Failed to retrieve user navigation data"
   *                 data:
   *                   type: null
   */
  static async getUserNavigation(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      // TODO: In production, implement the following data fetching logic:
      // 1. Fetch user enrollments from enrollment service
      // 2. Get course details and lessons from course service  
      // 3. Calculate progress based on completed lessons
      // 4. Get last accessed lesson from user activity logs
      // 5. Build navigation structure dynamically
      
      // For now, returning the mock data structure that matches UI requirements
      const navigationData = {
        userId: userId,
        navMain: [
          {
            title: "HTML Fundamentals",
            url: "#",
            icon: "GrHtml5",
            isActive: true,
            courseId: "course_html_001",
            enrollmentStatus: "active",
            progress: 75,
            items: [
              {
                title: "Introduction to HTML",
                url: "/dashboard/html/introduction",
                contentId: "Ok3TQXserUI",
                lessonId: "lesson_html_001",
                isCompleted: true,
                duration: "15 mins",
                type: "video"
              },
              {
                title: "HTML Elements",
                url: "/dashboard/html/elements", 
                contentId: "QQZNZ-vDW5U",
                lessonId: "lesson_html_002",
                isCompleted: true,
                duration: "20 mins",
                type: "video"
              },
              {
                title: "Forms and Inputs",
                url: "/dashboard/html/forms",
                contentId: "PJAWLl92J3U", 
                lessonId: "lesson_html_003",
                isCompleted: false,
                duration: "25 mins",
                type: "interactive"
              }
            ]
          },
          {
            title: "CSS Styling",
            url: "#",
            icon: "TbFileTypeCss",
            isActive: false,
            courseId: "course_css_001",
            enrollmentStatus: "active",
            progress: 45,
            items: [
              {
                title: "CSS Basics",
                url: "/dashboard/css/basics",
                contentId: "CSS_BASICS_001",
                lessonId: "lesson_css_001", 
                isCompleted: true,
                duration: "18 mins",
                type: "video"
              },
              {
                title: "Flexbox Layout",
                url: "/dashboard/css/flexbox",
                contentId: "CSS_FLEX_001",
                lessonId: "lesson_css_002",
                isCompleted: false,
                duration: "30 mins", 
                type: "video"
              }
            ]
          },
          {
            title: "JavaScript Programming",
            url: "#",
            icon: "FaReact",
            isActive: false,
            courseId: "course_js_001",
            enrollmentStatus: "enrolled",
            progress: 0,
            items: [
              {
                title: "Variables and Data Types",
                url: "/dashboard/javascript/variables",
                contentId: "JS_VAR_001",
                lessonId: "lesson_js_001",
                isCompleted: false,
                duration: "22 mins",
                type: "video"
              }
            ]
          }
        ],
        lastAccessed: {
          courseId: "course_html_001",
          lessonId: "lesson_html_002",
          timestamp: new Date().toISOString()
        },
        enrolledCourses: [
          {
            courseId: "course_html_001",
            courseName: "HTML Fundamentals", 
            enrollmentDate: "2025-10-15T08:00:00.000Z",
            status: "active",
            progress: 75
          },
          {
            courseId: "course_css_001",
            courseName: "CSS Styling",
            enrollmentDate: "2025-10-16T09:30:00.000Z", 
            status: "active",
            progress: 45
          }
        ]
      };

      return sendResponse(res, HTTP_STATUS.OK, navigationData, "User navigation data retrieved successfully");
    } catch (error: any) {
      return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || "Failed to retrieve user navigation data");
    }
  }
}
