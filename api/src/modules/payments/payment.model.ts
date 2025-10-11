import { Schema, model, Document, Types } from "mongoose"

export interface PaymentDocument extends Document {
  userId: Types.ObjectId
  enrollmentId: Types.ObjectId
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
  paymentMethod: "card" | "upi" | "netbanking" | "wallet"
  transactionId: string
  createdAt: Date
  updatedAt: Date
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    enrollmentId: { type: Schema.Types.ObjectId, ref: "Enrollment", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { 
      type: String, 
      enum: ["pending", "completed", "failed"], 
      default: "pending" 
    },
    paymentMethod: { 
      type: String, 
      enum: ["card", "upi", "netbanking", "wallet"], 
      required: true 
    },
    transactionId: { type: String, required: true }
  },
  { timestamps: true }
)

export const PaymentModel = model<PaymentDocument>("Payment", paymentSchema)
