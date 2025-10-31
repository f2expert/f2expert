import { Router } from "express"
import * as ScheduleClassController from "./schedule-class.controller"
import { validateBody, validateQuery } from "../../app/middlewares/validation.middleware"
import { authMiddleware } from "../../app/middlewares/auth.middleware"
import {
  createScheduleClassSchema,
  updateScheduleClassSchema,
  enrollStudentSchema,
  markAttendanceSchema,
  bulkAttendanceSchema,
  addMaterialSchema,
  addAssignmentSchema,
  addAnnouncementSchema,
  filterScheduleClassSchema
} from "./schedule-class.validation"

const router = Router()

// Main CRUD routes
router.post(
  "/",
  authMiddleware,
  validateBody(createScheduleClassSchema),
  ScheduleClassController.createScheduleClass
)

router.get(
  "/",
  validateQuery(filterScheduleClassSchema),
  ScheduleClassController.getScheduleClasses
)

router.get(
  "/:id",
  ScheduleClassController.getScheduleClassById
)

router.put(
  "/:id",
  authMiddleware,
  validateBody(updateScheduleClassSchema),
  ScheduleClassController.updateScheduleClass
)

router.delete(
  "/:id",
  authMiddleware,
  ScheduleClassController.deleteScheduleClass
)

// Enrollment management routes
router.post(
  "/:id/enroll",
  authMiddleware,
  validateBody(enrollStudentSchema),
  ScheduleClassController.enrollStudentInClass
)

router.post(
  "/:id/unenroll",
  authMiddleware,
  validateBody(enrollStudentSchema),
  ScheduleClassController.removeStudentFromClass
)

// Attendance management routes
router.post(
  "/:id/attendance",
  authMiddleware,
  validateBody(markAttendanceSchema),
  ScheduleClassController.markAttendance
)

router.post(
  "/:id/attendance/bulk",
  authMiddleware,
  validateBody(bulkAttendanceSchema),
  ScheduleClassController.markBulkAttendance
)

router.get(
  "/:id/attendance/report",
  authMiddleware,
  ScheduleClassController.getAttendanceReport
)

// Class materials routes
router.post(
  "/:id/materials",
  authMiddleware,
  validateBody(addMaterialSchema),
  ScheduleClassController.addMaterial
)

// Class assignments routes
router.post(
  "/:id/assignments",
  authMiddleware,
  validateBody(addAssignmentSchema),
  ScheduleClassController.addAssignment
)

// Class announcements routes
router.post(
  "/:id/announcements",
  authMiddleware,
  validateBody(addAnnouncementSchema),
  ScheduleClassController.addAnnouncement
)

// Filter routes by user role
router.get(
  "/instructor/:instructorId",
  validateQuery(filterScheduleClassSchema),
  ScheduleClassController.getClassesByInstructor
)

router.get(
  "/student/:studentId",
  validateQuery(filterScheduleClassSchema),
  ScheduleClassController.getClassesByStudent
)

export default router