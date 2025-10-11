import { Request, Response, NextFunction } from "express"
import { AuthResponse } from "./auth.types"
import { sendResponse, sendError } from "../../app/utils/response.util"
import { generateToken } from "../../app/utils/jwt.util"
import { comparePassword } from "../../app/utils/hash.util"
import { MESSAGES } from "../../app/constants/message.constant"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"
import * as AuthService from "./auth.service"

// Register User
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  try {
    const user = await AuthService.registerUser(name, email, password );
    const token = generateToken({ id: user.id, email: user.email, role: user.role })
    const response: AuthResponse = {
      success: true,
      message: MESSAGES.REGISTER_SUCCESS,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token
      }
    }
    sendResponse(res, HTTP_STATUS.CREATED, response);
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await AuthService.loginUser(email)
    if (!user) return sendError(res, HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND)

    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) return sendError(res, HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS)

    const token = generateToken({ id: user.id, email: user.email, role: user.role })
    const response: AuthResponse = {
      success: true,
      message: MESSAGES.LOGIN_SUCCESS,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token
      }
    }
    return sendResponse(res, HTTP_STATUS.OK, response)
  } catch (err: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
  }
}
