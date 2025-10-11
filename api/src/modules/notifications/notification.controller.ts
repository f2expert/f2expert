import { Request, Response } from "express"
import * as NotificationService from "./notification.service"
import { sendError, sendResponse } from "../../app/utils/response.util"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"
import { MESSAGES } from "../../app/constants/message.constant"
import { ApiResponse } from "../../app/types/ApiResponse.interface"
/**
 * @openapi
 * /notifications:
 *   get:
 *     tags:
 *       - Notification
 *     summary: Retrieve all notifications
 *     responses:
 *       200:
 *         description: List of notifications
 */
export const getAll = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string
    const notifications = await NotificationService.getAllNotifications(userId)
    if(!notifications.length) return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.NOTIFICATION_NOT_FOUND)

      const response:ApiResponse = {
        success: true,
        message: MESSAGES.SUCCESS,
        data: notifications
      }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /notifications/{id}:
 *   get:
 *     tags:
 *       - Notification
 *     summary: Retrieve notification by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification details
 */
export const getById = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationService.getNotificationById(req.params.id)
    if(!notification) return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.NOTIFICATION_NOT_FOUND)

    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: notification
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /notifications:
 *   post:
 *     tags:
 *       - Notification
 *     summary: Create a new notification
 *     requestBody:
 *       required: true
 *       description: New notification details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               userId:
 *                 type: string
 *               isRead:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Notification created successfully
 */
export const create = async (req: Request, res: Response) => {
  try {
    const newNotification = await NotificationService.createNotification(req.body)
    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: newNotification
    }
    return sendResponse(res, HTTP_STATUS.CREATED, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const updatedNotification = await NotificationService.markAsRead(req.params.id)
    if(!updatedNotification) return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.NOTIFICATION_NOT_FOUND)

    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: updatedNotification
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /notifications/{id}:
 *   delete:
 *     tags:
 *       - Notification
 *     summary: Delete notification by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
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
    await NotificationService.deleteNotification(req.params.id)
    return sendResponse(res, HTTP_STATUS.OK, null, MESSAGES.NOTIFICATION_DELETED)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
