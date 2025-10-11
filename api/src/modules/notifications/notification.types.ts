export interface NotificationDTO {
  id?: string
  userId: string
  title: string
  message: string
  type?: "info" | "success" | "warning" | "error"
  isRead?: boolean
  createdAt?: Date
  updatedAt?: Date
}
