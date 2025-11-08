import jwt from "jsonwebtoken"
import { envConfig } from "../config/env.config"

export interface JwtPayload {
  id: string
  email: string
  role: string
}

export interface RefreshTokenPayload {
  id: string
  email: string
  tokenVersion: number
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
 * Generate a refresh token
 * @param payload user data for refresh token
 * @returns signed refresh JWT token
 */
export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, envConfig.jwtRefreshSecret, { expiresIn: envConfig.jwtRefreshExpiresIn })
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
 * Verify a refresh token
 * @param token refresh token string
 * @returns decoded payload or null if invalid
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    return jwt.verify(token, envConfig.jwtRefreshSecret) as RefreshTokenPayload
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
