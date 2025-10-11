export interface PaymentDTO {
  id?: string
  userId: string
  enrollmentId: string
  amount: number
  currency?: string
  status?: "pending" | "completed" | "failed"
  paymentMethod: "card" | "upi" | "netbanking" | "wallet"
  transactionId: string
  createdAt?: Date
  updatedAt?: Date
}
