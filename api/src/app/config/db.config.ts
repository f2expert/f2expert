import mongoose from "mongoose"
import { envConfig } from "../config/env.config"

/**
 * Connect to MongoDB
 */
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envConfig.mongoUri)
    console.log("✅ MongoDB connected successfully")
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error)
    process.exit(1) // Exit process with failure
  }
}

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect()
    console.log("✅ MongoDB disconnected successfully")
  } catch (error) {
    console.error("❌ MongoDB disconnection failed:", error)
  }
}
