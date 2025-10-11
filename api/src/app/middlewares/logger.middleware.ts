import { Request, Response, NextFunction } from "express"
import { logger } from "../config/logger.config"

/**
 * Logger middleware to log request details
 */
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  const { method, originalUrl } = req

  res.on("finish", () => {
    const duration = Date.now() - start
    const log = `[${new Date().toISOString()}] ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`
    logger.info(log)
  })

  next()
}
