import { NotificationModel } from "./notification.model"
import { NotificationDTO } from "./notification.types"

export const getAllNotifications = async (userId: string) => {
  return NotificationModel.find({ userId }).sort({ createdAt: -1 })
}

export const getNotificationById = async (id: string) => {
  return NotificationModel.findById(id)
}

export const createNotification = async (payload: NotificationDTO) => {
  return NotificationModel.create(payload)
}

export const markAsRead = async (id: string) => {
  return NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true })
}

export const deleteNotification = async (id: string) => {
  return NotificationModel.findByIdAndDelete(id)
}
