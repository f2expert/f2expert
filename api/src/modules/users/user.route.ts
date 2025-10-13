import { Router } from "express"
import * as UserController from "./user.controller"
import { validateBody, validateQuery } from "../../app/middlewares/validation.middleware"
import { 
  createUserSchema, 
  updateUserSchema, 
  updateStudentInfoSchema,
  updateTrainerInfoSchema,
  updateAdminInfoSchema,
  changePasswordSchema 
} from "./user.validation"
import Joi from "joi"

const router = Router()

// Basic CRUD Operations
router.get("/", 
  validateQuery(Joi.object({
    role: Joi.string().valid('admin', 'trainer', 'student').optional(),
    isActive: Joi.boolean().optional()
  })), 
  UserController.getAllUsers
)

router.get("/search", 
  validateQuery(Joi.object({
    q: Joi.string().required(),
    role: Joi.string().valid('admin', 'trainer', 'student').optional(),
    limit: Joi.number().min(1).max(100).optional()
  })), 
  UserController.searchUsers
)

router.get("/stats", UserController.getUserStats)

router.get("/:id", 
  UserController.getUserById
)

router.post("/", 
  validateBody(createUserSchema), 
  UserController.createUser
)

router.put("/:id", 
  validateBody(updateUserSchema), 
  UserController.updateUser
)

router.delete("/:id", UserController.deleteUser)

// Role-specific endpoints
router.put("/:id/student-info", 
  validateBody(updateStudentInfoSchema), 
  UserController.updateStudentInfo
)

router.put("/:id/trainer-info", 
  validateBody(updateTrainerInfoSchema), 
  UserController.updateTrainerInfo
)

router.put("/:id/admin-info", 
  validateBody(updateAdminInfoSchema), 
  UserController.updateAdminInfo
)

// Password management
router.post("/:id/change-password", 
  validateBody(changePasswordSchema), 
  UserController.changePassword
)

export default router
