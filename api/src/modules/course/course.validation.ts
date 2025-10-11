import Joi from "joi"

export const createCourseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  duration: Joi.string().required()
})

export const updateCourseSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  duration: Joi.string().optional()
})
