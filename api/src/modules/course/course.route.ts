import { Router } from "express"
import * as CourseController from "./course.controller"
import { validateBody } from "../../app/middlewares/validation.middleware"
import { createCourseSchema, updateCourseSchema } from "./course.validation"

const router = Router()

router.get("/", CourseController.getAll)
router.get("/debug/all", CourseController.getAllCoursesDebug)
router.get("/debug/create-sample", CourseController.createSampleData)
router.get("/limited/:limit", CourseController.getLimited)
router.get("/:id", CourseController.getById)
router.post("/", validateBody(createCourseSchema), CourseController.create)
router.put("/:id", validateBody(updateCourseSchema), CourseController.update)
router.delete("/:id", CourseController.remove)

export default router
