import { UserModel } from "../users/user.model"
import { hashPassword } from "../../app/utils/hash.util"

export const registerUser = async (name: string, email: string, password: string) => {
  const hashed = await hashPassword(password)
  return UserModel.create({ name, email, password: hashed }) 
}

export const loginUser = async (email: string) => {
  return UserModel.findOne({ email })
}
