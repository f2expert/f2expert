import { Schema, model, Document, Types } from "mongoose"

export interface EnrollmentDocument extends Document {
  userId: Types.ObjectId
  courseId: Types.ObjectId
  status: "enrolled" | "completed" | "cancelled"
  enrolledAt: Date
  updatedAt: Date
}

const enrollmentSchema = new Schema<EnrollmentDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    status: { 
      type: String, 
      enum: ["enrolled", "completed", "cancelled"], 
      default: "enrolled" 
    }
  },
  { timestamps: true }
)

export const EnrollmentModel = model<EnrollmentDocument>("Enrollment", enrollmentSchema)
