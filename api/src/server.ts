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

// 🔹 JSON Error Handler (after express.json())
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format in request body",
      error: "Please check your JSON syntax"
    })
  }
  next(err)
})

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}))
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}))
app.use(morgan("dev"))

// Use logger before routes
app.use(loggerMiddleware)

// Swagger docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 🔹 Static file serving for uploaded photos
app.use("/uploads", (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  next();
}, express.static("uploads"))

// 🔹 API Routes
app.use("/api", routes)

// 🔹 Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date() })
})

// 🔹 404 Handler - must be after all routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    error: "Not Found"
  })
})

// Global Error Handler (must be after all routes and 404 handler)
app.use(errorMiddleware)

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
