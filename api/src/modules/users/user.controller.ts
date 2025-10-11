import { Request, Response } from "express";
import * as UserService from "./user.service";
import { sendError, sendResponse } from "../../app/utils/response.util";
import { HTTP_STATUS } from "../../app/constants/http-status.constant";
import { MESSAGES } from "../../app/constants/message.constant";
import { ApiResponse } from "../../app/types/ApiResponse.interface";
import { IUserDTO } from "./user.types";
/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - User
 *     summary: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: List of users
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IUserDTO'
 * components:
 *   schemas:
 *     IUserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [student, instructor, admin]
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export const getAll = async (_req: Request, res: Response) => {
  try {
    const users: IUserDTO[] = await UserService.getAllUsers();
    if (!users.length)
      return sendResponse(
        res,
        HTTP_STATUS.NO_CONTENT,
        null,
        MESSAGES.USER_NOT_FOUND
      );

    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: users,
    };
    return sendResponse(res, HTTP_STATUS.OK, response, MESSAGES.SUCCESS);
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
};
/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Retrieve user details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
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
 *                   $ref: '#/components/schemas/IUserDTO'
 */
export const getById = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user)
      return sendResponse(
        res,
        HTTP_STATUS.NO_CONTENT,
        null,
        MESSAGES.USER_NOT_FOUND
      );

    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: user,
    };
    return sendResponse(res, HTTP_STATUS.OK, response);
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
};
/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       description: New user details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, instructor, admin]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   $ref: '#/components/schemas/IUserDTO'
 */
export const create = async (req: Request, res: Response) => {
  try {
    const newUser = await UserService.createUser(req.body);
    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: newUser,
    };
    return sendResponse(res, HTTP_STATUS.CREATED, response);
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
};
/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Fields to update (name, email, role, etc.)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, instructor, admin]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 */
export const update = async (req: Request, res: Response) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    if (!updatedUser)
      return sendResponse(
        res,
        HTTP_STATUS.NO_CONTENT,
        null,
        MESSAGES.USER_NOT_FOUND
      );
    const response: ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: updatedUser,
    };
    return sendResponse(res, HTTP_STATUS.OK, response);
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
};
/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
export const remove = async (req: Request, res: Response) => {
  try {
    await UserService.deleteUser(req.params.id);
    return sendResponse(res, HTTP_STATUS.NO_CONTENT, null);
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
};
