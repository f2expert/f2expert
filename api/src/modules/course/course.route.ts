import { Router } from "express";
import * as CourseController from "./course.controller";
import {
  authMiddleware,
  authorizeRoles,
} from "../../app/middlewares/auth.middleware";
import { validateBody } from "../../app/middlewares/validation.middleware";
import { createCourseSchema, updateCourseSchema } from "./course.validation";
import { createReviewSchema } from "./review.validation";

const router = Router();

router.get("/", CourseController.getAll);
router.get("/debug/all", CourseController.getAllCoursesDebug);
router.get("/debug/create-sample", CourseController.createSampleData);
router.get("/limited/:limit", CourseController.getLimited);
router.get("/category/:category", CourseController.getByCategory);
router.get("/:id", CourseController.getById);

// Course comment routes
router.get("/:id/comments", CourseController.getCourseComments);
router.post("/:id/comments", CourseController.addCourseComment);

// Course review routes
router.get("/:id/reviews", CourseController.getCourseReviews);
router.post(
  "/:id/reviews",
  validateBody(createReviewSchema),
  CourseController.addCourseReview
);

router.post(
  "/",
  authMiddleware,
  authorizeRoles(["admin"]),
  validateBody(createCourseSchema),
  CourseController.create
);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(["admin"]),
  validateBody(updateCourseSchema),
  CourseController.update
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(["admin"]),
  CourseController.remove
);

export default router;
