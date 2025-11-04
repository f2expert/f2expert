import { Request, Response } from "express"
import { MESSAGES } from "../../app/constants/message.constant"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"
import { sendError, sendResponse } from "../../app/utils/response.util"
import * as SalaryService from "./salary.service"
import { ApiResponse } from "../../app/types/ApiResponse.interface"
import {
  SalaryDTO,
  UpdateSalaryDTO,
  PaymentStatusUpdateDTO,
  SalaryApprovalDTO,
  BulkSalaryCreationDTO,
  SalaryQueryParams,
  SalaryReportParams,
  SalaryCalculationParams
} from "./salary.types"

/**
 * @openapi
 * components:
 *   schemas:
 *     SalaryDeductions:
 *       type: object
 *       properties:
 *         tax:
 *           type: number
 *           minimum: 0
 *           description: Income tax deduction
 *         pf:
 *           type: number
 *           minimum: 0
 *           description: Provident Fund deduction
 *         esi:
 *           type: number
 *           minimum: 0
 *           description: Employee State Insurance deduction
 *         advance:
 *           type: number
 *           minimum: 0
 *           description: Advance salary deduction
 *         loan:
 *           type: number
 *           minimum: 0
 *           description: Loan deduction
 *         other:
 *           type: number
 *           minimum: 0
 *           description: Other deductions
 *
 *     CreateSalaryRequest:
 *       type: object
 *       required:
 *         - employeeId
 *         - salaryMonth
 *         - salaryYear
 *         - baseSalary
 *       properties:
 *         employeeId:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *           description: Valid ObjectId of the employee
 *         salaryMonth:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           description: Month for which salary is being created (1-12)
 *         salaryYear:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2030
 *           description: Year for which salary is being created
 *         baseSalary:
 *           type: number
 *           minimum: 0
 *           description: Base salary amount
 *         performanceBonus:
 *           type: number
 *           minimum: 0
 *           description: Performance-based bonus
 *         housingAllowance:
 *           type: number
 *           minimum: 0
 *           description: Housing allowance
 *         transportAllowance:
 *           type: number
 *           minimum: 0
 *           description: Transport allowance
 *         mealAllowance:
 *           type: number
 *           minimum: 0
 *           description: Meal allowance
 *         specialAllowance:
 *           type: number
 *           minimum: 0
 *           description: Special allowance
 *         overtimeAmount:
 *           type: number
 *           minimum: 0
 *           description: Overtime compensation
 *         deductions:
 *           $ref: '#/components/schemas/SalaryDeductions'
 *         classesAssigned:
 *           type: integer
 *           minimum: 0
 *           description: Number of classes assigned (primarily for trainers)
 *         classesCompleted:
 *           type: integer
 *           minimum: 0
 *           description: Number of classes completed (primarily for trainers)
 *         hourlyRate:
 *           type: number
 *           minimum: 0
 *           description: Hourly rate for classes (primarily for trainers)
 *         totalHours:
 *           type: number
 *           minimum: 0
 *           description: Total hours worked
 *         paymentMethod:
 *           type: string
 *           enum: [bank_transfer, cash, cheque, upi]
 *           description: Preferred payment method
 *         remarks:
 *           type: string
 *           maxLength: 1000
 *           description: Additional remarks or notes
 *
 *     UpdateSalaryRequest:
 *       type: object
 *       properties:
 *         baseSalary:
 *           type: number
 *           minimum: 0
 *         performanceBonus:
 *           type: number
 *           minimum: 0
 *         housingAllowance:
 *           type: number
 *           minimum: 0
 *         transportAllowance:
 *           type: number
 *           minimum: 0
 *         mealAllowance:
 *           type: number
 *           minimum: 0
 *         specialAllowance:
 *           type: number
 *           minimum: 0
 *         overtimeAmount:
 *           type: number
 *           minimum: 0
 *         deductions:
 *           $ref: '#/components/schemas/SalaryDeductions'
 *         classesAssigned:
 *           type: integer
 *           minimum: 0
 *         classesCompleted:
 *           type: integer
 *           minimum: 0
 *         hourlyRate:
 *           type: number
 *           minimum: 0
 *         totalHours:
 *           type: number
 *           minimum: 0
 *         paymentMethod:
 *           type: string
 *           enum: [bank_transfer, cash, cheque, upi]
 *         remarks:
 *           type: string
 *           maxLength: 1000
 *
 *     PaymentStatusUpdate:
 *       type: object
 *       required:
 *         - paymentStatus
 *       properties:
 *         paymentStatus:
 *           type: string
 *           enum: [pending, processing, paid, cancelled]
 *           description: New payment status
 *         paymentMethod:
 *           type: string
 *           enum: [bank_transfer, cash, cheque, upi]
 *           description: Payment method (required for processing/paid status)
 *         paymentReference:
 *           type: string
 *           description: Payment reference number (required for paid status)
 *         remarks:
 *           type: string
 *           maxLength: 1000
 *           description: Additional remarks about payment
 *
 *     SalaryApproval:
 *       type: object
 *       required:
 *         - approved
 *       properties:
 *         approved:
 *           type: boolean
 *           description: Whether to approve or reject the salary
 *         remarks:
 *           type: string
 *           maxLength: 1000
 *           description: Approval/rejection remarks
 *
 *     BulkSalaryCreation:
 *       type: object
 *       required:
 *         - salaryMonth
 *         - salaryYear
 *         - employees
 *       properties:
 *         salaryMonth:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         salaryYear:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2030
 *         employees:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: object
 *             required:
 *               - employeeId
 *               - baseSalary
 *             properties:
 *               employeeId:
 *                 type: string
 *                 pattern: "^[0-9a-fA-F]{24}$"
 *               baseSalary:
 *                 type: number
 *                 minimum: 0
 *               performanceBonus:
 *                 type: number
 *                 minimum: 0
 *               housingAllowance:
 *                 type: number
 *                 minimum: 0
 *               transportAllowance:
 *                 type: number
 *                 minimum: 0
 *               mealAllowance:
 *                 type: number
 *                 minimum: 0
 *               specialAllowance:
 *                 type: number
 *                 minimum: 0
 *               overtimeAmount:
 *                 type: number
 *                 minimum: 0
 *               deductions:
 *                 $ref: '#/components/schemas/SalaryDeductions'
 *               classesAssigned:
 *                 type: integer
 *                 minimum: 0
 *               classesCompleted:
 *                 type: integer
 *                 minimum: 0
 *               hourlyRate:
 *                 type: number
 *                 minimum: 0
 *               totalHours:
 *                 type: number
 *                 minimum: 0
 *               remarks:
 *                 type: string
 *                 maxLength: 1000
 *
 *     SalaryResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Salary record ID
 *         employeeId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *             trainerInfo:
 *               type: object
 *               properties:
 *                 employeeId:
 *                   type: string
 *                 department:
 *                   type: string
 *         salaryMonth:
 *           type: integer
 *         salaryYear:
 *           type: integer
 *         salaryPeriod:
 *           type: string
 *           description: Human-readable period (e.g., "January 2024")
 *         baseSalary:
 *           type: number
 *         performanceBonus:
 *           type: number
 *         housingAllowance:
 *           type: number
 *         transportAllowance:
 *           type: number
 *         mealAllowance:
 *           type: number
 *         specialAllowance:
 *           type: number
 *         overtimeAmount:
 *           type: number
 *         deductions:
 *           $ref: '#/components/schemas/SalaryDeductions'
 *         grossSalary:
 *           type: number
 *           description: Total salary before deductions
 *         totalDeductions:
 *           type: number
 *           description: Sum of all deductions
 *         netSalary:
 *           type: number
 *           description: Final salary after deductions
 *         classesAssigned:
 *           type: integer
 *         classesCompleted:
 *           type: integer
 *         completionPercentage:
 *           type: number
 *           description: Class completion percentage (primarily for trainers)
 *         hourlyRate:
 *           type: number
 *         totalHours:
 *           type: number
 *         classBasedEarnings:
 *           type: number
 *         paymentStatus:
 *           type: string
 *           enum: [pending, processing, paid, cancelled]
 *         paymentStatusDisplay:
 *           type: string
 *           description: Human-readable payment status
 *         paymentMethod:
 *           type: string
 *           enum: [bank_transfer, cash, cheque, upi]
 *         paymentDate:
 *           type: string
 *           format: date-time
 *         paymentReference:
 *           type: string
 *         remarks:
 *           type: string
 *         approvedBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *         approvalDate:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PaginatedSalaryResponse:
 *       type: object
 *       properties:
 *         salaries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SalaryResponse'
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *             totalPages:
 *               type: integer
 *             totalCount:
 *               type: integer
 *             hasNext:
 *               type: boolean
 *             hasPrev:
 *               type: boolean
 *
 *     SalarySummary:
 *       type: object
 *       properties:
 *         totalSalaries:
 *           type: integer
 *         totalGrossSalary:
 *           type: number
 *         totalDeductions:
 *           type: number
 *         totalNetSalary:
 *           type: number
 *         avgNetSalary:
 *           type: number
 *         pendingPayments:
 *           type: integer
 *         processingPayments:
 *           type: integer
 *         paidPayments:
 *           type: integer
 */

/**
 * @openapi
 * /api/salary:
 *   get:
 *     summary: Get all employee salaries with filtering and pagination
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Filter by employee ID
 *       - in: query
 *         name: salaryMonth
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filter by salary month
 *       - in: query
 *         name: salaryYear
 *         schema:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2030
 *         description: Filter by salary year
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [pending, processing, paid, cancelled]
 *         description: Filter by payment status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, salaryMonth, salaryYear, netSalary, paymentStatus]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Successfully retrieved employee salaries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PaginatedSalaryResponse'
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
export const getAllSalaries = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams: SalaryQueryParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      employeeId: req.query.employeeId as string,
      salaryMonth: req.query.salaryMonth ? parseInt(req.query.salaryMonth as string) : undefined,
      salaryYear: req.query.salaryYear ? parseInt(req.query.salaryYear as string) : undefined,
      paymentStatus: req.query.paymentStatus as any,
      sortBy: (req.query.sortBy as any) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    }

    const result = await SalaryService.getAllSalaries(queryParams)

    sendResponse(res, HTTP_STATUS.OK, result, MESSAGES.SUCCESS)
  } catch (error) {
    console.error('Error fetching employee salaries:', error)
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
  }
}

/**
 * @openapi
 * /api/salary/{id}:
 *   get:
 *     summary: Get employee salary by ID
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Employee salary ID
 *     responses:
 *       200:
 *         description: Successfully retrieved employee salary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SalaryResponse'
 *       404:
 *         description: Employee salary not found
 *       500:
 *         description: Internal server error
 */
export const getSalaryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const salary = await SalaryService.getSalaryById(id)

    if (!salary) {
      sendError(res, HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
      return
    }

    const response: ApiResponse<typeof salary> = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: salary
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error) {
    console.error('Error fetching employee salary by ID:', error)
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
  }
}

/**
 * @openapi
 * /api/salary/employee/{employeeId}/period/{month}/{year}:
 *   get:
 *     summary: Get employee salary for specific month and year
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Employee ID
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Salary month (1-12)
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2030
 *         description: Salary year
 *     responses:
 *       200:
 *         description: Successfully retrieved employee salary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SalaryResponse'
 *       404:
 *         description: Employee salary not found for specified period
 *       500:
 *         description: Internal server error
 */
export const getSalaryByPeriod = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId, month, year } = req.params

    const salary = await SalaryService.getSalaryByPeriod(
      employeeId,
      parseInt(month),
      parseInt(year)
    )

    if (!salary) {
      sendError(res, HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND)
      return
    }

    const response: ApiResponse<typeof salary> = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: salary
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error) {
    console.error('Error fetching employee salary by period:', error)
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
  }
}

/**
 * @openapi
 * /api/salary:
 *   post:
 *     summary: Create new employee salary
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSalaryRequest'
 *           examples:
 *             basic_salary:
 *               summary: Basic salary creation
 *               value:
 *                 employeeId: "674efb123456789abcdef123"
 *                 salaryMonth: 1
 *                 salaryYear: 2024
 *                 baseSalary: 50000
 *                 housingAllowance: 10000
 *                 transportAllowance: 5000
 *                 deductions:
 *                   tax: 5000
 *                   pf: 2000
 *             employee_with_classes:
 *               summary: Employee salary with class-based earnings (e.g., trainers)
 *               value:
 *                 employeeId: "674efb123456789abcdef123"
 *                 salaryMonth: 1
 *                 salaryYear: 2024
 *                 baseSalary: 40000
 *                 performanceBonus: 5000
 *                 classesAssigned: 20
 *                 classesCompleted: 18
 *                 hourlyRate: 500
 *                 totalHours: 60
 *                 deductions:
 *                   tax: 4500
 *                   pf: 2000
 *                 remarks: "Excellent performance with 90% completion rate"
 *     responses:
 *       201:
 *         description: Employee salary created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SalaryResponse'
 *       400:
 *         description: Invalid input data or salary already exists for the period
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
export const createSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload: SalaryDTO = req.body
    const userId = (req as any).user?.id

    const salaryData = {
      ...payload,
      createdBy: userId
    }

    const salary = await SalaryService.createSalary(salaryData)

    const response: ApiResponse<typeof salary> = {
      success: true,
      message: "Employee salary created successfully",
      data: salary
    }

    sendResponse(res, HTTP_STATUS.CREATED, response)
  } catch (error: any) {
    console.error('Error creating employee salary:', error)
    
    if (error.message.includes('already exists') || error.message.includes('not found')) {
      sendError(res, HTTP_STATUS.BAD_REQUEST, error.message)
    } else {
      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
    }
  }
}

/**
 * @openapi
 * /api/salary/{id}:
 *   put:
 *     summary: Update employee salary
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Employee salary ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSalaryRequest'
 *           examples:
 *             update_salary_components:
 *               summary: Update salary components
 *               value:
 *                 baseSalary: 55000
 *                 performanceBonus: 7000
 *                 housingAllowance: 12000
 *                 deductions:
 *                   tax: 5500
 *                   pf: 2200
 *             update_class_info:
 *               summary: Update class-related information (for trainers)
 *               value:
 *                 classesCompleted: 20
 *                 totalHours: 65
 *                 remarks: "Updated after final class completion"
 *     responses:
 *       200:
 *         description: Employee salary updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SalaryResponse'
 *       400:
 *         description: Invalid input data or cannot update paid salary
 *       404:
 *         description: Employee salary not found
 *       500:
 *         description: Internal server error
 */
export const updateSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const payload: UpdateSalaryDTO = req.body
    const userId = (req as any).user?.id

    const updateData = {
      ...payload,
      updatedBy: userId
    }

    const salary = await SalaryService.updateSalary(id, updateData)

    const response: ApiResponse<typeof salary> = {
      success: true,
      message: "Employee salary updated successfully",
      data: salary
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error: any) {
    console.error('Error updating employee salary:', error)
    
    if (error.message.includes('not found')) {
      sendError(res, HTTP_STATUS.NOT_FOUND, error.message)
    } else if (error.message.includes('Cannot update')) {
      sendError(res, HTTP_STATUS.BAD_REQUEST, error.message)
    } else {
      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
    }
  }
}

/**
 * @openapi
 * /api/salary/{id}/payment-status:
 *   patch:
 *     summary: Update payment status of employee salary
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Employee salary ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentStatusUpdate'
 *           examples:
 *             mark_as_paid:
 *               summary: Mark salary as paid
 *               value:
 *                 paymentStatus: "paid"
 *                 paymentMethod: "bank_transfer"
 *                 paymentReference: "TXN123456789"
 *                 remarks: "Salary paid via NEFT transfer"
 *             mark_as_processing:
 *               summary: Mark salary as processing
 *               value:
 *                 paymentStatus: "processing"
 *                 paymentMethod: "bank_transfer"
 *                 remarks: "Payment initiated through bank"
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SalaryResponse'
 *       400:
 *         description: Invalid payment status update
 *       404:
 *         description: Employee salary not found
 *       500:
 *         description: Internal server error
 */
export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const body = req.body
    const userId = (req as any).user?.id

    // Support both new and old formats
    const paymentStatus = body.status || body.paymentStatus
    const paymentMethod = body.paymentMode || body.paymentMethod
    const paymentReference = body.paymentReference
    const remarks = body.remarks

    const paymentDetails = {
      paymentMethod,
      paymentReference,
      remarks
    }

    const salary = await SalaryService.updatePaymentStatus(
      id,
      paymentStatus,
      paymentDetails,
      userId
    )

    sendResponse(res, HTTP_STATUS.OK, salary, 'Payment status updated successfully')
  } catch (error: any) {
    console.error('Error updating payment status:', error)
    
    if (error.message.includes('not found')) {
      sendError(res, HTTP_STATUS.NOT_FOUND, error.message)
    } else {
      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
    }
  }
}

/**
 * @openapi
 * /api/salary/{id}/approve:
 *   patch:
 *     summary: Approve or reject employee salary
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Employee salary ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalaryApproval'
 *           examples:
 *             approve_salary:
 *               summary: Approve salary
 *               value:
 *                 approved: true
 *                 remarks: "Salary approved after verification"
 *             reject_salary:
 *               summary: Reject salary
 *               value:
 *                 approved: false
 *                 remarks: "Incorrect calculation in overtime hours"
 *     responses:
 *       200:
 *         description: Salary approval processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SalaryResponse'
 *       400:
 *         description: Salary already processed for approval
 *       404:
 *         description: Employee salary not found
 *       500:
 *         description: Internal server error
 */
export const approveSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { approved, remarks }: SalaryApprovalDTO = req.body
    const userId = (req as any).user?.id

    const salary = await SalaryService.approveSalary(id, approved, userId, remarks)

    const message = approved ? 'Salary approved successfully' : 'Salary rejected successfully'

    const response: ApiResponse<typeof salary> = {
      success: true,
      message,
      data: salary
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error: any) {
    console.error('Error processing salary approval:', error)
    
    if (error.message.includes('not found')) {
      sendError(res, HTTP_STATUS.NOT_FOUND, error.message)
    } else if (error.message.includes('already processed')) {
      sendError(res, HTTP_STATUS.BAD_REQUEST, error.message)
    } else {
      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
    }
  }
}

/**
 * @openapi
 * /api/salary/{id}:
 *   delete:
 *     summary: Delete employee salary
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Employee salary ID
 *     responses:
 *       200:
 *         description: Employee salary deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Cannot delete paid salary
 *       404:
 *         description: Employee salary not found
 *       500:
 *         description: Internal server error
 */
export const deleteSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    await SalaryService.deleteSalary(id)

    const response: ApiResponse<null> = {
      success: true,
      message: "Employee salary deleted successfully",
      data: null
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error: any) {
    console.error('Error deleting employee salary:', error)
    
    if (error.message.includes('not found')) {
      sendError(res, HTTP_STATUS.NOT_FOUND, error.message)
    } else if (error.message.includes('Cannot delete')) {
      sendError(res, HTTP_STATUS.BAD_REQUEST, error.message)
    } else {
      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
    }
  }
}

/**
 * @openapi
 * /api/salary/bulk:
 *   post:
 *     summary: Create salaries for multiple employees
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkSalaryCreation'
 *           examples:
 *             bulk_creation:
 *               summary: Create salaries for multiple employees
 *               value:
 *                 salaryMonth: 1
 *                 salaryYear: 2024
 *                 employees:
 *                   - employeeId: "674efb123456789abcdef123"
 *                     baseSalary: 50000
 *                     housingAllowance: 10000
 *                     transportAllowance: 5000
 *                     deductions:
 *                       tax: 5000
 *                       pf: 2000
 *                   - employeeId: "674efb123456789abcdef124"
 *                     baseSalary: 55000
 *                     performanceBonus: 5000
 *                     housingAllowance: 12000
 *                     deductions:
 *                       tax: 5500
 *                       pf: 2200
 *     responses:
 *       201:
 *         description: Bulk salaries created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SalaryResponse'
 *       400:
 *         description: Invalid input data or salaries already exist for some employees
 *       500:
 *         description: Internal server error
 */
export const bulkCreateSalaries = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload: BulkSalaryCreationDTO = req.body
    const userId = (req as any).user?.id

    const bulkData = {
      ...payload,
      createdBy: userId
    }

    const salaries = await SalaryService.bulkCreateSalaries(bulkData)

    const response: ApiResponse<typeof salaries> = {
      success: true,
      message: `Successfully created ${salaries.length} employee salaries`,
      data: salaries
    }

    sendResponse(res, HTTP_STATUS.CREATED, response)
  } catch (error: any) {
    console.error('Error creating bulk salaries:', error)
    
    if (error.message.includes('already exist') || error.message.includes('not found')) {
      sendError(res, HTTP_STATUS.BAD_REQUEST, error.message)
    } else {
      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
    }
  }
}

/**
 * @openapi
 * /api/salary/summary:
 *   get:
 *     summary: Get salary summary for a period
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filter by month (optional)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2030
 *         description: Filter by year (optional)
 *     responses:
 *       200:
 *         description: Successfully retrieved salary summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SalarySummary'
 *       500:
 *         description: Internal server error
 */
export const getSalarySummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const month = req.query.month ? parseInt(req.query.month as string) : undefined
    const year = req.query.year ? parseInt(req.query.year as string) : undefined

    const summary = await SalaryService.getSalarySummary(month, year)

    const response: ApiResponse<typeof summary> = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: summary
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error) {
    console.error('Error fetching salary summary:', error)
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
  }
}

/**
 * @openapi
 * /api/salary/calculate:
 *   post:
 *     summary: Calculate automatic salary based on classes (primarily for trainers)
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - salaryMonth
 *               - salaryYear
 *             properties:
 *               employeeId:
 *                 type: string
 *                 pattern: "^[0-9a-fA-F]{24}$"
 *               salaryMonth:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               salaryYear:
 *                 type: integer
 *                 minimum: 2020
 *                 maximum: 2030
 *               includeClassBasedEarnings:
 *                 type: boolean
 *                 default: true
 *               includePerformanceBonus:
 *                 type: boolean
 *                 default: true
 *           examples:
 *             calculate_salary:
 *               summary: Calculate salary with all components
 *               value:
 *                 employeeId: "674efb123456789abcdef123"
 *                 salaryMonth: 1
 *                 salaryYear: 2024
 *                 includeClassBasedEarnings: true
 *                 includePerformanceBonus: true
 *     responses:
 *       200:
 *         description: Successfully calculated automatic salary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     employeeId:
 *                       type: string
 *                     baseSalary:
 *                       type: number
 *                     hourlyRate:
 *                       type: number
 *                     classesAssigned:
 *                       type: integer
 *                     classesCompleted:
 *                       type: integer
 *                     totalHours:
 *                       type: number
 *                     classBasedEarnings:
 *                       type: number
 *                     performanceBonus:
 *                       type: number
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
export const calculateAutomaticSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId, salaryMonth, salaryYear, includeClassBasedEarnings, includePerformanceBonus }: SalaryCalculationParams = req.body

    const calculatedData = await SalaryService.calculateAutomaticSalary(
      employeeId,
      salaryMonth,
      salaryYear,
      includeClassBasedEarnings,
      includePerformanceBonus
    )

    const response: ApiResponse<typeof calculatedData> = {
      success: true,
      message: 'Salary calculated successfully',
      data: calculatedData
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error: any) {
    console.error('Error calculating automatic salary:', error)
    
    if (error.message.includes('not found')) {
      sendError(res, HTTP_STATUS.NOT_FOUND, error.message)
    } else {
      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
    }
  }
}

/**
 * @openapi
 * /api/salary/employee/{employeeId}/history:
 *   get:
 *     summary: Get employee salary history
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Employee ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved employee salary history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PaginatedSalaryResponse'
 *       500:
 *         description: Internal server error
 */
export const getEmployeeSalaryHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const result = await SalaryService.getEmployeeSalaryHistory(employeeId, page, limit)

    const response: ApiResponse<typeof result> = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: result
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error) {
    console.error('Error fetching employee salary history:', error)
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
  }
}

/**
 * @openapi
 * /api/salary/pending-payments:
 *   get:
 *     summary: Get all pending payments
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved pending payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SalaryResponse'
 *       500:
 *         description: Internal server error
 */
export const getPendingPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const pendingPayments = await SalaryService.getPendingPayments()

    const response: ApiResponse<typeof pendingPayments> = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: pendingPayments
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error) {
    console.error('Error fetching pending payments:', error)
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
  }
}

/**
 * @openapi
 * /api/salary/reports:
 *   get:
 *     summary: Generate salary reports
 *     tags: [Salary Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startMonth
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Start month for report period
 *       - in: query
 *         name: endMonth
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: End month for report period
 *       - in: query
 *         name: startYear
 *         schema:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2030
 *         description: Start year for report period
 *       - in: query
 *         name: endYear
 *         schema:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2030
 *         description: End year for report period
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Filter by specific employee
 *       - in: query
 *         name: departmentFilter
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [pending, processing, paid, cancelled]
 *         description: Filter by payment status
 *       - in: query
 *         name: reportType
 *         schema:
 *           type: string
 *           enum: [summary, detailed, employee_wise, department_wise]
 *           default: summary
 *         description: Type of report to generate
 *     responses:
 *       200:
 *         description: Successfully generated salary report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   oneOf:
 *                     - type: array
 *                       items:
 *                         $ref: '#/components/schemas/SalarySummary'
 *                     - type: array
 *                       items:
 *                         type: object
 *       500:
 *         description: Internal server error
 */
export const generateSalaryReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      startMonth,
      endMonth,
      startYear,
      endYear,
      employeeId,
      departmentFilter,
      paymentStatus,
      reportType = 'summary'
    }: SalaryReportParams = req.query as any

    const reportData = await SalaryService.generateSalaryReport(
      startMonth ? parseInt(startMonth as any) : undefined,
      endMonth ? parseInt(endMonth as any) : undefined,
      startYear ? parseInt(startYear as any) : undefined,
      endYear ? parseInt(endYear as any) : undefined,
      employeeId,
      departmentFilter,
      paymentStatus,
      reportType
    )

    const response: ApiResponse<typeof reportData> = {
      success: true,
      message: `${reportType} report generated successfully`,
      data: reportData
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error) {
    console.error('Error generating salary report:', error)
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
  }
}