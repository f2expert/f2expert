import { Router } from "express"
import { validateBody, validateQuery } from "../../app/middlewares/validation.middleware"
import { authMiddleware } from "../../app/middlewares/auth.middleware"
import * as TrainerSalaryController from "./trainer-salary.controller"
import {
  createTrainerSalarySchema,
  updateTrainerSalarySchema,
  updatePaymentStatusSchema,
  approveSalarySchema,
  bulkCreateSalarySchema,
  getSalaryQuerySchema,
  getSalaryReportQuerySchema,
  calculateSalarySchema
} from "./trainer-salary.validation"

const router = Router()

// Apply authentication middleware to all routes
router.use(authMiddleware)

// Get all trainer salaries with filtering and pagination
router.get(
  "/",
  validateQuery(getSalaryQuerySchema),
  TrainerSalaryController.getAllTrainerSalaries
)

// Get salary summary for a period
router.get(
  "/summary",
  TrainerSalaryController.getSalarySummary
)

// Get pending payments
router.get(
  "/pending-payments",
  TrainerSalaryController.getPendingPayments
)

// Generate salary reports
router.get(
  "/reports",
  validateQuery(getSalaryReportQuerySchema),
  TrainerSalaryController.generateSalaryReport
)

// Calculate automatic salary based on classes
router.post(
  "/calculate",
  validateBody(calculateSalarySchema),
  TrainerSalaryController.calculateAutomaticSalary
)

// Bulk create salaries for multiple trainers
router.post(
  "/bulk",
  validateBody(bulkCreateSalarySchema),
  TrainerSalaryController.bulkCreateSalaries
)

// Create new trainer salary
router.post(
  "/",
  validateBody(createTrainerSalarySchema),
  TrainerSalaryController.createTrainerSalary
)

// Get trainer salary by ID
router.get(
  "/:id",
  TrainerSalaryController.getTrainerSalaryById
)

// Update trainer salary
router.put(
  "/:id",
  validateBody(updateTrainerSalarySchema),
  TrainerSalaryController.updateTrainerSalary
)

// Update payment status
router.patch(
  "/:id/payment-status",
  validateBody(updatePaymentStatusSchema),
  TrainerSalaryController.updatePaymentStatus
)

// Approve or reject salary
router.patch(
  "/:id/approve",
  validateBody(approveSalarySchema),
  TrainerSalaryController.approveSalary
)

// Delete trainer salary
router.delete(
  "/:id",
  TrainerSalaryController.deleteTrainerSalary
)

// Get trainer salary for specific period
router.get(
  "/trainer/:trainerId/period/:month/:year",
  TrainerSalaryController.getTrainerSalaryByPeriod
)

// Get trainer salary history
router.get(
  "/trainer/:trainerId/history",
  TrainerSalaryController.getTrainerSalaryHistory
)

export default router