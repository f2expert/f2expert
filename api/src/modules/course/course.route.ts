import { Router } from "express"
import * as CourseController from "./course.controller"
import { validateBody } from "../../app/middlewares/validation.middleware"
import { createCourseSchema, updateCourseSchema } from "./course.validation"
import { createReviewSchema } from "./review.validation"

const router = Router()

router.get("/", CourseController.getAll)
router.get("/debug/all", CourseController.getAllCoursesDebug)
router.get("/debug/create-sample", CourseController.createSampleData)
router.get("/limited/:limit", CourseController.getLimited)
router.get("/category/:category", CourseController.getByCategory)
router.get("/:id", CourseController.getById)

// Course comment routes
router.get("/:id/comments", CourseController.getCourseComments)
router.post("/:id/comments", CourseController.addCourseComment)

// Course review routes
router.get("/:id/reviews", CourseController.getCourseReviews)
router.post("/:id/reviews", validateBody(createReviewSchema), CourseController.addCourseReview)

router.post("/", validateBody(createCourseSchema), CourseController.create)
router.put("/:id", validateBody(updateCourseSchema), CourseController.update)
router.delete("/:id", CourseController.remove)

export default router
