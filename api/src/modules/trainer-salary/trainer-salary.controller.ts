import { Request, Response } from "express"
import { MESSAGES } from "../../app/constants/message.constant"
import { HTTP_STATUS } from "../../app/constants/http-status.constant"
import { sendError, sendResponse } from "../../app/utils/response.util"
import * as TrainerSalaryService from "./trainer-salary.service"
import { ApiResponse } from "../../app/types/ApiResponse.interface"
import {
  TrainerSalaryDTO,
  UpdateTrainerSalaryDTO,
  PaymentStatusUpdateDTO,
  SalaryApprovalDTO,
  BulkSalaryCreationDTO,
  SalaryQueryParams,
  SalaryReportParams,
  SalaryCalculationParams
} from "./trainer-salary.types"

/**
 * @openapi
 * components:
 *   schemas:
 *     TrainerSalaryDeductions:
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
 *     CreateTrainerSalaryRequest:
 *       type: object
 *       required:
 *         - trainerId
 *         - salaryMonth
 *         - salaryYear
 *         - baseSalary
 *       properties:
 *         trainerId:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *           description: Valid ObjectId of the trainer
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
 *           $ref: '#/components/schemas/TrainerSalaryDeductions'
 *         classesAssigned:
 *           type: integer
 *           minimum: 0
 *           description: Number of classes assigned
 *         classesCompleted:
 *           type: integer
 *           minimum: 0
 *           description: Number of classes completed
 *         hourlyRate:
 *           type: number
 *           minimum: 0
 *           description: Hourly rate for classes
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
 *     UpdateTrainerSalaryRequest:
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
 *           $ref: '#/components/schemas/TrainerSalaryDeductions'
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
 *         - trainers
 *       properties:
 *         salaryMonth:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         salaryYear:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2030
 *         trainers:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: object
 *             required:
 *               - trainerId
 *               - baseSalary
 *             properties:
 *               trainerId:
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
 *                 $ref: '#/components/schemas/TrainerSalaryDeductions'
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
 *     TrainerSalaryResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Salary record ID
 *         trainerId:
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
 *           $ref: '#/components/schemas/TrainerSalaryDeductions'
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
 *           description: Class completion percentage
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
 *             $ref: '#/components/schemas/TrainerSalaryResponse'
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
 * /api/trainer-salary:
 *   get:
 *     summary: Get all trainer salaries with filtering and pagination
 *     tags: [Trainer Salary]
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
 *         name: trainerId
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Filter by trainer ID
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
 *         description: Successfully retrieved trainer salaries
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
export const getAllTrainerSalaries = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams: SalaryQueryParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      trainerId: req.query.trainerId as string,
      salaryMonth: req.query.salaryMonth ? parseInt(req.query.salaryMonth as string) : undefined,
      salaryYear: req.query.salaryYear ? parseInt(req.query.salaryYear as string) : undefined,
      paymentStatus: req.query.paymentStatus as any,
      sortBy: (req.query.sortBy as any) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    }

    const result = await TrainerSalaryService.getAllTrainerSalaries(queryParams)

    const response: ApiResponse<typeof result> = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: result
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error) {
    console.error('Error fetching trainer salaries:', error)
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
  }
}

/**
 * @openapi
 * /api/trainer-salary/{id}:
 *   get:
 *     summary: Get trainer salary by ID
 *     tags: [Trainer Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Trainer salary ID
 *     responses:
 *       200:
 *         description: Successfully retrieved trainer salary
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
 *                   $ref: '#/components/schemas/TrainerSalaryResponse'
 *       404:
 *         description: Trainer salary not found
 *       500:
 *         description: Internal server error
 */
export const getTrainerSalaryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const salary = await TrainerSalaryService.getTrainerSalaryById(id)

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
    console.error('Error fetching trainer salary by ID:', error)
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
  }
}

/**
 * @openapi
 * /api/trainer-salary/trainer/{trainerId}/period/{month}/{year}:
 *   get:
 *     summary: Get trainer salary for specific month and year
 *     tags: [Trainer Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trainerId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Trainer ID
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
 *         description: Successfully retrieved trainer salary
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
 *                   $ref: '#/components/schemas/TrainerSalaryResponse'
 *       404:
 *         description: Trainer salary not found for specified period
 *       500:
 *         description: Internal server error
 */
export const getTrainerSalaryByPeriod = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trainerId, month, year } = req.params

    const salary = await TrainerSalaryService.getTrainerSalaryByPeriod(
      trainerId,
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
    console.error('Error fetching trainer salary by period:', error)
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
  }
}

/**
 * @openapi
 * /api/trainer-salary:
 *   post:
 *     summary: Create new trainer salary
 *     tags: [Trainer Salary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTrainerSalaryRequest'
 *           examples:
 *             basic_salary:
 *               summary: Basic salary creation
 *               value:
 *                 trainerId: "674efb123456789abcdef123"
 *                 salaryMonth: 1
 *                 salaryYear: 2024
 *                 baseSalary: 50000
 *                 housingAllowance: 10000
 *                 transportAllowance: 5000
 *                 deductions:
 *                   tax: 5000
 *                   pf: 2000
 *             class_based_salary:
 *               summary: Class-based salary with hours
 *               value:
 *                 trainerId: "674efb123456789abcdef123"
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
 *         description: Trainer salary created successfully
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
 *                   $ref: '#/components/schemas/TrainerSalaryResponse'
 *       400:
 *         description: Invalid input data or salary already exists for the period
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Trainer not found
 *       500:
 *         description: Internal server error
 */
export const createTrainerSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload: TrainerSalaryDTO = req.body
    const userId = (req as any).user?.id

    const salaryData = {
      ...payload,
      createdBy: userId
    }

    const salary = await TrainerSalaryService.createTrainerSalary(salaryData)

    const response: ApiResponse<typeof salary> = {
      success: true,
      message: "Trainer salary created successfully",
      data: salary
    }

    sendResponse(res, HTTP_STATUS.CREATED, response)
  } catch (error: any) {
    console.error('Error creating trainer salary:', error)
    
    if (error.message.includes('already exists') || error.message.includes('not found')) {
      sendError(res, HTTP_STATUS.BAD_REQUEST, error.message)
    } else {
      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
    }
  }
}

/**
 * @openapi
 * /api/trainer-salary/{id}:
 *   put:
 *     summary: Update trainer salary
 *     tags: [Trainer Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Trainer salary ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTrainerSalaryRequest'
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
 *               summary: Update class-related information
 *               value:
 *                 classesCompleted: 20
 *                 totalHours: 65
 *                 remarks: "Updated after final class completion"
 *     responses:
 *       200:
 *         description: Trainer salary updated successfully
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
 *                   $ref: '#/components/schemas/TrainerSalaryResponse'
 *       400:
 *         description: Invalid input data or cannot update paid salary
 *       404:
 *         description: Trainer salary not found
 *       500:
 *         description: Internal server error
 */
export const updateTrainerSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const payload: UpdateTrainerSalaryDTO = req.body
    const userId = (req as any).user?.id

    const updateData = {
      ...payload,
      updatedBy: userId
    }

    const salary = await TrainerSalaryService.updateTrainerSalary(id, updateData)

    const response: ApiResponse<typeof salary> = {
      success: true,
      message: "Trainer salary updated successfully",
      data: salary
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error: any) {
    console.error('Error updating trainer salary:', error)
    
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
 * /api/trainer-salary/{id}/payment-status:
 *   patch:
 *     summary: Update payment status of trainer salary
 *     tags: [Trainer Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Trainer salary ID
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
 *                   $ref: '#/components/schemas/TrainerSalaryResponse'
 *       400:
 *         description: Invalid payment status update
 *       404:
 *         description: Trainer salary not found
 *       500:
 *         description: Internal server error
 */
export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { paymentStatus, paymentMethod, paymentReference, remarks }: PaymentStatusUpdateDTO = req.body
    const userId = (req as any).user?.id

    const paymentDetails = {
      paymentMethod,
      paymentReference,
      remarks
    }

    const salary = await TrainerSalaryService.updatePaymentStatus(
      id,
      paymentStatus,
      paymentDetails,
      userId
    )

    const response: ApiResponse<typeof salary> = {
      success: true,
      message: 'Payment status updated successfully',
      data: salary
    }

    sendResponse(res, HTTP_STATUS.OK, response)
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
 * /api/trainer-salary/{id}/approve:
 *   patch:
 *     summary: Approve or reject trainer salary
 *     tags: [Trainer Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Trainer salary ID
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
 *                   $ref: '#/components/schemas/TrainerSalaryResponse'
 *       400:
 *         description: Salary already processed for approval
 *       404:
 *         description: Trainer salary not found
 *       500:
 *         description: Internal server error
 */
export const approveSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { approved, remarks }: SalaryApprovalDTO = req.body
    const userId = (req as any).user?.id

    const salary = await TrainerSalaryService.approveSalary(id, approved, userId, remarks)

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
 * /api/trainer-salary/{id}:
 *   delete:
 *     summary: Delete trainer salary
 *     tags: [Trainer Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Trainer salary ID
 *     responses:
 *       200:
 *         description: Trainer salary deleted successfully
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
 *         description: Trainer salary not found
 *       500:
 *         description: Internal server error
 */
export const deleteTrainerSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    await TrainerSalaryService.deleteTrainerSalary(id)

    const response: ApiResponse<null> = {
      success: true,
      message: "Trainer salary deleted successfully",
      data: null
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error: any) {
    console.error('Error deleting trainer salary:', error)
    
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
 * /api/trainer-salary/bulk:
 *   post:
 *     summary: Create salaries for multiple trainers
 *     tags: [Trainer Salary]
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
 *               summary: Create salaries for multiple trainers
 *               value:
 *                 salaryMonth: 1
 *                 salaryYear: 2024
 *                 trainers:
 *                   - trainerId: "674efb123456789abcdef123"
 *                     baseSalary: 50000
 *                     housingAllowance: 10000
 *                     transportAllowance: 5000
 *                     deductions:
 *                       tax: 5000
 *                       pf: 2000
 *                   - trainerId: "674efb123456789abcdef124"
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
 *                     $ref: '#/components/schemas/TrainerSalaryResponse'
 *       400:
 *         description: Invalid input data or salaries already exist for some trainers
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

    const salaries = await TrainerSalaryService.bulkCreateSalaries(bulkData)

    const response: ApiResponse<typeof salaries> = {
      success: true,
      message: `Successfully created ${salaries.length} trainer salaries`,
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
 * /api/trainer-salary/summary:
 *   get:
 *     summary: Get salary summary for a period
 *     tags: [Trainer Salary]
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

    const summary = await TrainerSalaryService.getSalarySummary(month, year)

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
 * /api/trainer-salary/calculate:
 *   post:
 *     summary: Calculate automatic salary based on classes
 *     tags: [Trainer Salary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trainerId
 *               - salaryMonth
 *               - salaryYear
 *             properties:
 *               trainerId:
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
 *                 trainerId: "674efb123456789abcdef123"
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
 *                     trainerId:
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
 *         description: Trainer not found
 *       500:
 *         description: Internal server error
 */
export const calculateAutomaticSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trainerId, salaryMonth, salaryYear, includeClassBasedEarnings, includePerformanceBonus }: SalaryCalculationParams = req.body

    const calculatedData = await TrainerSalaryService.calculateAutomaticSalary(
      trainerId,
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
 * /api/trainer-salary/trainer/{trainerId}/history:
 *   get:
 *     summary: Get trainer salary history
 *     tags: [Trainer Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trainerId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Trainer ID
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
 *         description: Successfully retrieved trainer salary history
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
export const getTrainerSalaryHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trainerId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const result = await TrainerSalaryService.getTrainerSalaryHistory(trainerId, page, limit)

    const response: ApiResponse<typeof result> = {
      success: true,
      message: MESSAGES.SUCCESS,
      data: result
    }

    sendResponse(res, HTTP_STATUS.OK, response)
  } catch (error) {
    console.error('Error fetching trainer salary history:', error)
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.FAILURE)
  }
}

/**
 * @openapi
 * /api/trainer-salary/pending-payments:
 *   get:
 *     summary: Get all pending payments
 *     tags: [Trainer Salary]
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
 *                     $ref: '#/components/schemas/TrainerSalaryResponse'
 *       500:
 *         description: Internal server error
 */
export const getPendingPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const pendingPayments = await TrainerSalaryService.getPendingPayments()

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
 * /api/trainer-salary/reports:
 *   get:
 *     summary: Generate salary reports
 *     tags: [Trainer Salary]
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
 *         name: trainerId
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Filter by specific trainer
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
 *           enum: [summary, detailed, trainer_wise, department_wise]
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
      trainerId,
      departmentFilter,
      paymentStatus,
      reportType = 'summary'
    }: SalaryReportParams = req.query as any

    const reportData = await TrainerSalaryService.generateSalaryReport(
      startMonth ? parseInt(startMonth as any) : undefined,
      endMonth ? parseInt(endMonth as any) : undefined,
      startYear ? parseInt(startYear as any) : undefined,
      endYear ? parseInt(endYear as any) : undefined,
      trainerId,
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