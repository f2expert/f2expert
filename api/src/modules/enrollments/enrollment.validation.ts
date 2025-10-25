import Joi from "joi"

export const createEnrollmentSchema = Joi.object({
  userId: Joi.string().required(),
  courseId: Joi.string().required(),
  status: Joi.string().valid("enrolled", "completed", "cancelled").optional()
})

export const updateEnrollmentSchema = Joi.object({
  userId: Joi.string().optional(),
  courseId: Joi.string().optional(),
  status: Joi.string().valid("enrolled", "completed", "cancelled").optional()
}).min(1)
