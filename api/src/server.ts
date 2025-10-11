import express, { Application, Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import swaggerUi from "swagger-ui-express"
import routes from "./routes" // main routes/index.ts

import { envConfig } from "./app/config/env.config"
import { connectDB } from "./app/config/db.config"
import { swaggerSpec } from "./app/config/swagger.config"

import { errorMiddleware } from "./app/middlewares/error.middleware"
import { loggerMiddleware } from "./app/middlewares/logger.middleware"

// Load environment variables
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 5000
// 🔹 Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))

// Use logger before routes
app.use(loggerMiddleware)

// Global Error Handler (must be after routes)
app.use(errorMiddleware)

// Swagger docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 🔹 API Routes
app.use("/api", routes)

// 🔹 Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date() })
})

// 🔹 Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Error:", err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  })
})

// 🔹 MongoDB Connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
})
