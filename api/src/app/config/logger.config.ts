import { createLogger, format, transports } from "winston"

const { combine, timestamp, printf, colorize, errors } = format

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`
})

// Create Winston logger
export const logger = createLogger({
  level: "info", // default log level
  format: combine(
    colorize(),          // colorize logs in console
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // log stack trace for errors
    logFormat
  ),
  transports: [
    new transports.Console(), // log to console
    new transports.File({ filename: "logs/error.log", level: "error" }), // error logs
    new transports.File({ filename: "logs/combined.log" }) // all logs
  ],
  exitOnError: false, // do not exit on handled exceptions
})
