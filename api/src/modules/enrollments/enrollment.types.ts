export interface EnrollmentDTO {
  id?: string
  userId: string
  courseId: string
  status?: "enrolled" | "completed" | "cancelled"
  enrolledAt?: Date
  updatedAt?: Date
}
