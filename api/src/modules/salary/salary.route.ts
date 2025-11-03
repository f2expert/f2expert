import { Router } from "express"
import { validateBody, validateQuery } from "../../app/middlewares/validation.middleware"
import { authMiddleware } from "../../app/middlewares/auth.middleware"
import * as SalaryController from "./salary.controller"
import {
  createSalarySchema,
  updateSalarySchema,
  updatePaymentStatusSchema,
  approveSalarySchema,
  bulkCreateSalarySchema,
  getSalaryQuerySchema,
  getSalaryReportQuerySchema,
  calculateSalarySchema
} from "./salary.validation"

const router = Router()

// Apply authentication middleware to all routes
router.use(authMiddleware)

// Get all employee salaries with filtering and pagination
router.get(
  "/",
  validateQuery(getSalaryQuerySchema),
  SalaryController.getAllSalaries
)

// Get salary summary for a period
router.get(
  "/summary",
  SalaryController.getSalarySummary
)

// Get pending payments
router.get(
  "/pending-payments",
  SalaryController.getPendingPayments
)

// Generate salary reports
router.get(
  "/reports",
  validateQuery(getSalaryReportQuerySchema),
  SalaryController.generateSalaryReport
)

// Calculate automatic salary based on classes
router.post(
  "/calculate",
  validateBody(calculateSalarySchema),
  SalaryController.calculateAutomaticSalary
)

// Bulk create salaries for multiple employees
router.post(
  "/bulk",
  validateBody(bulkCreateSalarySchema),
  SalaryController.bulkCreateSalaries
)

// Create new employee salary
router.post(
  "/",
  validateBody(createSalarySchema),
  SalaryController.createSalary
)

// Get employee salary by ID
router.get(
  "/:id",
  SalaryController.getSalaryById
)

// Update employee salary
router.put(
  "/:id",
  validateBody(updateSalarySchema),
  SalaryController.updateSalary
)

// Update payment status
router.patch(
  "/:id/payment-status",
  validateBody(updatePaymentStatusSchema),
  SalaryController.updatePaymentStatus
)

// Approve or reject salary
router.patch(
  "/:id/approve",
  validateBody(approveSalarySchema),
  SalaryController.approveSalary
)

// Delete employee salary
router.delete(
  "/:id",
  SalaryController.deleteSalary
)

// Get employee salary for specific period
router.get(
  "/employee/:employeeId/period/:month/:year",
  SalaryController.getSalaryByPeriod
)

// Get employee salary history
router.get(
  "/employee/:employeeId/history",
  SalaryController.getEmployeeSalaryHistory
)

export default router