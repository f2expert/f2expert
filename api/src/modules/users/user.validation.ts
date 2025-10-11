import Joi from "joi"

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("student", "instructor", "admin").optional(),
  isActive: Joi.boolean().optional()
})

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid("student", "instructor", "admin").optional(),
  isActive: Joi.boolean().optional()
})
