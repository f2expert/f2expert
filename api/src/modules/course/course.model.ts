import { Schema, model, Document } from "mongoose"

export interface CourseDocument extends Document {
  title: string
  description: string
  price: number
  duration: string
  createdAt: Date
  updatedAt: Date
}

const courseSchema = new Schema<CourseDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true }
  },
  { timestamps: true }
)

export const CourseModel = model<CourseDocument>("Course", courseSchema)
