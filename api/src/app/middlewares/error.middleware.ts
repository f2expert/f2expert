import { Request, Response, NextFunction } from "express"
import { sendError } from "../utils/response.util"

/**
 * Custom Error Interface
 */
export interface ApiError extends Error {
  status?: number
  details?: any
}

/**
 * Global Error Handling Middleware
 */
export const errorMiddleware = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.status || 500
  const message = err.message || "Internal Server Error"
  const details = err.details || null

  console.error("❌ Error:", err)

  return sendError(res, statusCode, message)
}
