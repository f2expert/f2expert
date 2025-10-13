import { Request, Response, NextFunction } from "express"
import { ObjectSchema } from "joi"
import { HTTP_STATUS } from "../constants/http-status.constant"
import { sendError } from "../utils/response.util"

export const validateBody = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // First check if request body exists
      if (!req.body || Object.keys(req.body).length === 0) {
        return sendError(res, HTTP_STATUS.BAD_REQUEST, "Request body is required")
      }

      const { error, value } = schema.validate(req.body)
      
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(", ")
        return sendError(res, HTTP_STATUS.BAD_REQUEST, errorMessage)
      }
      
      req.body = value
      next()
    } catch (err: any) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, "Invalid JSON format in request body")
    }
  }
}

export const validateParams = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params)
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(", ")
      return sendError(res, HTTP_STATUS.BAD_REQUEST, errorMessage)
    }
    
    req.params = value
    next()
  }
}

export const validateQuery = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query)
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(", ")
      return sendError(res, HTTP_STATUS.BAD_REQUEST, errorMessage)
    }
    
    // Don't overwrite req.query as it's read-only, just validate
    next()
  }
}