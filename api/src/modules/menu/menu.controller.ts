/**
 * @openapi
 * /menus:
 *   post:
 *     tags:
 *       - Menu
 *     summary: Create a new menu item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IMenuDTO'
 *     responses:
 *       201:
 *         description: Menu created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IMenuDTO'
 *
 * /menus:
 *   get:
 *     tags:
 *       - Menu
 *     summary: Get all menu items
 *     responses:
 *       200:
 *         description: List of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IMenuDTO'
 *
 * /menus/{id}:
 *   get:
 *     tags:
 *       - Menu
 *     summary: Get menu item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IMenuDTO'
 *
 * /menus/{id}:
 *   put:
 *     tags:
 *       - Menu
 *     summary: Update menu item by ID
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
 *             $ref: '#/components/schemas/IMenuDTO'
 *     responses:
 *       200:
 *         description: Menu updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IMenuDTO'
 *
 * /menus/{id}:
 *   delete:
 *     tags:
 *       - Menu
 *     summary: Delete menu item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Menu deleted successfully
 *
 * components:
 *   schemas:
 *     IMenuDTO:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         path:
 *           type: string
 *         icon:
 *           type: string
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *         parentId:
 *           type: string
 *         order:
 *           type: number
 */
import { Request, Response } from 'express';
import { MenuService } from './menu.service';
import { HTTP_STATUS } from '../../app/constants/http-status.constant';

export class MenuController {
  static async createMenu(req: Request, res: Response) {
    const menu = await MenuService.createMenu(req.body);
    res.status(HTTP_STATUS.CREATED).json(menu);
  }

  static async getAllMenus(req: Request, res: Response) {
    const menus = await MenuService.getAllMenus();
    res.status(HTTP_STATUS.OK).json(menus);
  }

  static async getMenuById(req: Request, res: Response) {
    const menu = await MenuService.getMenuById(req.params.id);
    res.status(HTTP_STATUS.OK).json(menu);
  }

  static async updateMenu(req: Request, res: Response) {
    const menu = await MenuService.updateMenu(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json(menu);
  }

  static async deleteMenu(req: Request, res: Response) {
    await MenuService.deleteMenu(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}
