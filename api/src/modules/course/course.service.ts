import { CourseModel } from "./course.model"
import { CourseDTO } from "./course.types"

export const getAllCourses = async () => {
  return CourseModel.find()
}

export const getCourseById = async (id: string) => {
  return CourseModel.findById(id)
}

export const createCourse = async (payload: CourseDTO) => {
  return CourseModel.create(payload)
}

export const updateCourse = async (id: string, payload: Partial<CourseDTO>) => {
  return CourseModel.findByIdAndUpdate(id, payload, { new: true })
}

export const deleteCourse = async (id: string) => {
  return CourseModel.findByIdAndDelete(id)
}
