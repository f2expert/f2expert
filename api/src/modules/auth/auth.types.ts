export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: string
      name: string
      email: string
      role: "student" | "instructor" | "admin"
      isActive: boolean
      createdAt?: Date
      updatedAt?: Date
    }
    token: string
  } | null
}
