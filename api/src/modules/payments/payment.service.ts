import { PaymentModel } from "./payment.model"
import { PaymentDTO } from "./payment.types"

export const getAllPayments = async () => {
  return PaymentModel.find().populate("userId").populate("enrollmentId")
}

export const getPaymentById = async (id: string) => {
  return PaymentModel.findById(id).populate("userId").populate("enrollmentId")
}

export const createPayment = async (payload: PaymentDTO) => {
  return PaymentModel.create(payload)
}

export const updatePaymentStatus = async (id: string, status: "pending" | "completed" | "failed") => {
  return PaymentModel.findByIdAndUpdate(id, { status }, { new: true })
}

export const deletePayment = async (id: string) => {
  return PaymentModel.findByIdAndDelete(id)
}
