/**
 * @openapi
 * components:
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
 * /menus:
 *   post:
 *     tags:
 *       - Menu
 *     summary: Create a new menu item
 *     description: Create a new menu item for the navigation system. Can be a parent menu or child menu by specifying parentId.
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
 * /menus/{id}:
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
 *     parameters:
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID to delete
 *     responses:
 *       204:
 *         description: Menu deleted successfully
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *
 * /menus/{id}/children:
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
 * /menus/root/list:
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
}
