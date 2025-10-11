import Joi from "joi"

export const createPaymentSchema = Joi.object({
  userId: Joi.string().required(),
  enrollmentId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().default("INR"),
  status: Joi.string().valid("pending", "completed", "failed").optional(),
  paymentMethod: Joi.string().valid("card", "upi", "netbanking", "wallet").required(),
  transactionId: Joi.string().required()
})

export const updatePaymentStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "completed", "failed").required()
})
