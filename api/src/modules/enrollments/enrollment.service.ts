import { EnrollmentModel } from "./enrollment.model"
import { EnrollmentDTO } from "./enrollment.types"
import { Types } from "mongoose"

export const getAllEnrollments = async () => {
  return EnrollmentModel.find().populate("userId").populate("courseId")
}

export const getEnrollmentById = async (id: string) => {
  return EnrollmentModel.findById(id).populate("userId").populate("courseId")
}

export const createEnrollment = async (payload: EnrollmentDTO) => {
  return EnrollmentModel.create(payload)
}

export const updateEnrollment = async (id: string, payload: Partial<EnrollmentDTO>) => {
  return EnrollmentModel.findByIdAndUpdate(id, payload, { new: true })
}

export const deleteEnrollment = async (id: string) => {
  return EnrollmentModel.findByIdAndDelete(id)
}

export const getEnrollmentsByUserId = async (userId: string) => {
  try {
    console.log("Searching enrollments for userId:", userId)
    
    // Convert string to ObjectId for proper comparison
    const userObjectId = new Types.ObjectId(userId)
    console.log("Converted to ObjectId:", userObjectId)
    
    const enrollments = await EnrollmentModel.find({ userId: userObjectId }).populate("courseId", "title description instructor category level price thumbnailUrl duration totalHours rating totalStudents")
    console.log("Enrollment service found:", enrollments?.length || 0, "enrollments")
    return enrollments
  } catch (error) {
    console.error("Error in getEnrollmentsByUserId:", error)
    return []
  }
}
