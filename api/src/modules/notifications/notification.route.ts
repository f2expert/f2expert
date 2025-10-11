import { Router } from "express"
import * as NotificationController from "./notification.controller"

const router = Router()

router.get("/", NotificationController.getAll)
router.get("/:id", NotificationController.getById)
router.post("/", NotificationController.create)
router.patch("/:id/read", NotificationController.markAsRead)
router.delete("/:id", NotificationController.remove)

export default router
