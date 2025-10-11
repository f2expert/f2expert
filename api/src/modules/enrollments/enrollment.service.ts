import { EnrollmentModel } from "./enrollment.model"
import { EnrollmentDTO } from "./enrollment.types"

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
