import { UserModel } from "./user.model"
import { IUserDTO } from "./user.types"

export const getAllUsers = async () => {
  return UserModel.find()
}

export const getUserById = async (id: string) => {
  return UserModel.findById(id)
}

export const createUser = async (payload: IUserDTO) => {
  return UserModel.create(payload)
}

export const updateUser = async (id: string, payload: Partial<IUserDTO>) => {
  return UserModel.findByIdAndUpdate(id, payload, { new: true })
}

export const deleteUser = async (id: string) => {
  return UserModel.findByIdAndDelete(id)
}
