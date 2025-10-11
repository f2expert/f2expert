import { Schema, model, Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "student" | "instructor" | "admin"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["student", "instructor", "admin"], 
      default: "student" 
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export const UserModel = model<IUser>("User", userSchema)
