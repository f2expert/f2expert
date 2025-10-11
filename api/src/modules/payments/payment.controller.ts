import { Request, Response } from "express"
import * as PaymentService from "./payment.service"
import { sendError, sendResponse } from "../../app/utils/response.util"
import { ApiResponse } from "../../app/types/ApiResponse.interface"
import { MESSAGES } from "../../app/constants/message.constant"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"/**
/** 
* @openapi
 * /payments:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Retrieve all payments
 *     responses:
 *       200:
 *         description: List of payments
 */
export const getAll = async (_req: Request, res: Response) => {
  try {
    const payments = await PaymentService.getAllPayments()
    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: payments
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /payments/{id}:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Retrieve payment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment details
 */
export const getById = async (req: Request, res: Response) => {
  try {
    const payment = await PaymentService.getPaymentById(req.params.id)
    if (!payment) return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.PAYMENT_NOT_FOUND)

    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: payment
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /payments:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Create a new payment
 *     requestBody:
 *       required: true
 *       description: New payment details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - courseId
 *               - amount
 *               - status
 *             properties:
 *               userId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               amount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed]
 *     responses:
 *       201:
 *         description: Payment created successfully
 */
export const create = async (req: Request, res: Response) => {
  try {
    const newPayment = await PaymentService.createPayment(req.body)
    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: newPayment
    }
    return sendResponse(res, HTTP_STATUS.CREATED, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /payments/{id}:
 *   put:
 *     tags:
 *       - Payment
 *     summary: Update payment status by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Fields to update (userId, courseId, amount, status)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               amount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed]
 *     responses:
 *       200:
 *         description: Payment updated successfully
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
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     courseId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     status:
 *                       type: string
 */
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const updatedPayment = await PaymentService.updatePaymentStatus(req.params.id, req.body.status)
    if (!updatedPayment) return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.PAYMENT_NOT_FOUND)

    const response:ApiResponse = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: updatedPayment
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
/**
 * @openapi
 * /payments/{id}:
 *   delete:
 *     tags:
 *       - Payment
 *     summary: Delete payment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment deleted successfully
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
    await PaymentService.deletePayment(req.params.id)
    return sendResponse(res, HTTP_STATUS.NO_CONTENT, null, MESSAGES.SUCCESS)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
