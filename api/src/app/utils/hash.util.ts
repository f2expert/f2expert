import bcrypt from "bcrypt"

const SALT_ROUNDS = 10 // you can move this to .env if you want

/**
 * Hash a plain text password
 * @param password plain password
 * @returns hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  return bcrypt.hash(password, salt)
}

/**
 * Compare plain password with hashed password
 * @param password plain password
 * @param hashedPassword stored hashed password
 * @returns boolean
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}
