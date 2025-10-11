import Joi from "joi"

export const createNotificationSchema = Joi.object({
  userId: Joi.string().required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
  type: Joi.string().valid("info", "success", "warning", "error").optional(),
  isRead: Joi.boolean().optional()
})
