import { Schema, model, Document, Types } from "mongoose"

export interface NotificationDocument extends Document {
  userId: Types.ObjectId
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["info", "success", "warning", "error"], 
      default: "info" 
    },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
)

export const NotificationModel = model<NotificationDocument>("Notification", notificationSchema)
