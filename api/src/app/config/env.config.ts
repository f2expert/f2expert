import dotenv from "dotenv"
import Joi from "joi"

dotenv.config()

// Validation schema for environment variables
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").required(),
  PORT: Joi.number().default(5000),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("7d"),
  STRIPE_SECRET_KEY: Joi.string().optional(),
  RAZORPAY_KEY_ID: Joi.string().optional(),
  RAZORPAY_KEY_SECRET: Joi.string().optional(),
  PAYPAL_CLIENT_ID: Joi.string().optional(),
  PAYPAL_CLIENT_SECRET: Joi.string().optional(),
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().optional(),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASS: Joi.string().optional(),
  EMAIL_FROM: Joi.string().optional(),
})
  .unknown()
  .required()

// Validate environment variables
const { value: envVars, error } = envSchema.validate(process.env)

if (error) {
  throw new Error(`❌ Config validation error: ${error.message}`)
}

// Export typed config
export const envConfig = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoUri: envVars.MONGO_URI,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  stripeSecretKey: envVars.STRIPE_SECRET_KEY,
  razorpayKeyId: envVars.RAZORPAY_KEY_ID,
  razorpayKeySecret: envVars.RAZORPAY_KEY_SECRET,
  paypalClientId: envVars.PAYPAL_CLIENT_ID,
  paypalClientSecret: envVars.PAYPAL_CLIENT_SECRET,
  smtpHost: envVars.SMTP_HOST,
  smtpPort: envVars.SMTP_PORT,
  smtpUser: envVars.SMTP_USER,
  smtpPass: envVars.SMTP_PASS,
  emailFrom: envVars.EMAIL_FROM,
}
