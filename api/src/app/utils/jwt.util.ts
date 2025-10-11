import jwt from "jsonwebtoken"
import { envConfig } from "../config/env.config"

export interface JwtPayload {
  id: string
  email: string
  role: string
}

/**
 * Generate a JWT token
 * @param payload user data (id, email, role, etc.)
 * @returns signed JWT token
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, envConfig.jwtSecret, { expiresIn: envConfig.jwtExpiresIn })
}

/**
 * Verify a JWT token
 * @param token JWT token string
 * @returns decoded payload or null if invalid
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, envConfig.jwtSecret) as JwtPayload
  } catch {
    return null
  }
}

/**
 * Decode a JWT token (without verifying signature)
 * @param token JWT token string
 * @returns decoded payload or null
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload
  } catch {
    return null
  }
}
