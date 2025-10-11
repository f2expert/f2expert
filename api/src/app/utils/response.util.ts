import { Response } from "express"

interface SendResponseOptions {
  success?: boolean
  message?: string
  data?: any
  meta?: any
}

/**
 * Standardized API Response
 * @param res Express Response object
 * @param status HTTP status code
 * @param data Data to send
 * @param message Optional message
 * @param meta Optional meta information (pagination, etc.)
 */
export const sendResponse = (
  res: Response,
  status: number,
  data: any = null,
  message: string = "",
  meta: any = null
) => {
  const response: SendResponseOptions = {
    success: status >= 200 && status < 300,
    message,
    data,
  }

  if (meta) response.meta = meta

  return res.status(status).json(response)
}

/**
 * Standardized Error Response
 * @param res Express Response object
 * @param status HTTP status code
 * @param message Error message
 */
export const sendError = (res: Response, status: number, message: string) => {
  return res.status(status).json({
    success: false,
    message,
    data: null
  })
}
