export interface IUserDTO {
  id?: string
  name: string
  email: string
  password: string
  role?: "student" | "instructor" | "admin"
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}
