import swaggerJSDoc from "swagger-jsdoc"

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN Stack API",
      version: "1.0.0",
      description: "API Documentation for MERN Stack Application",
    },
    servers: [
      { url: "http://localhost:5000/api", description: "Local Development Server" }
    ],
  },
  // Path to your API route files where swagger comments are written
  apis: ["./src/modules/**/*.ts", "./src/routes/**/*.ts"],
})
