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

// Add logging middleware for debugging
router.use((req, res, next) => {
  console.log(`[SALARY ROUTES] ${req.method} ${req.path} - Full URL: ${req.originalUrl}`)
  next()
})

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

// Get employee salary for specific period (must be before /:id)
router.get(
  "/employee/:employeeId/period/:month/:year",
  SalaryController.getSalaryByPeriod
)

// Get employee salary history (must be before /:id)
router.get(
  "/employee/:employeeId/history",
  SalaryController.getEmployeeSalaryHistory
)

// Update payment status (must be before /:id routes)
router.patch(
  "/:id/payment-status",
  validateBody(updatePaymentStatusSchema),
  SalaryController.updatePaymentStatus
)

router.post(
  "/:id/payment-status",
  validateBody(updatePaymentStatusSchema),
  SalaryController.updatePaymentStatus
)

// Approve or reject salary (must be before /:id routes)
router.patch(
  "/:id/approve",
  validateBody(approveSalarySchema),
  SalaryController.approveSalary
)

// Get employee salary by ID (must be after all specific routes)
router.get(
  "/:id",
  SalaryController.getSalaryById
)

// Update employee salary (must be after all specific routes)
router.put(
  "/:id",
  validateBody(updateSalarySchema),
  SalaryController.updateSalary
)

// Delete employee salary (must be after all specific routes)
router.delete(
  "/:id",
  SalaryController.deleteSalary
)

export default router