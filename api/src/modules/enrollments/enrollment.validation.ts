import Joi from "joi"

export const createEnrollmentSchema = Joi.object({
  userId: Joi.string().required(),
  courseId: Joi.string().required(),
  status: Joi.string().valid("enrolled", "completed", "cancelled").optional()
})

export const updateEnrollmentSchema = Joi.object({
  status: Joi.string().valid("enrolled", "completed", "cancelled").optional()
})
