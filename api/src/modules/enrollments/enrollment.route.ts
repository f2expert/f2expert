import { Router } from "express"
import * as EnrollmentController from "./enrollment.controller"
import { validateBody } from "../../app/middlewares/validation.middleware"
import { createEnrollmentSchema, updateEnrollmentSchema } from "./enrollment.validation"

const router = Router()

router.get("/", EnrollmentController.getAll)
router.get("/user/:userId", EnrollmentController.getEnrollmentsByUserId)
router.get("/:id", EnrollmentController.getById)
router.post("/", validateBody(createEnrollmentSchema), EnrollmentController.create)
router.put("/:id", validateBody(updateEnrollmentSchema), EnrollmentController.update)
router.delete("/:id", EnrollmentController.remove)

export default router
