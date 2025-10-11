import { Request, Response, NextFunction } from "express"
import { verifyToken, JwtPayload } from "../utils/jwt.util"
import { sendError } from "../utils/response.util"

interface AuthRequest extends Request {
  user?: JwtPayload
}

/**
 * Middleware to protect routes and verify JWT token
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "Authorization token missing")
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return sendError(res, 401, "Invalid or expired token")
    }

    // Attach user info to request object
    req.user = decoded
    next()
  } catch (error: any) {
    return sendError(res, 500, error.message)
  }
}

/**
 * Middleware to restrict routes based on user roles
 * @param roles Array of allowed roles
 */
export const authorizeRoles = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return sendError(res, 403, "Forbidden")

    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, "You do not have permission to access this resource")
    }

    next()
  }
}
