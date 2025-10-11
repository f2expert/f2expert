import { Router } from "express"
import * as PaymentController from "./payment.controller"

const router = Router()

router.get("/", PaymentController.getAll)
router.get("/:id", PaymentController.getById)
router.post("/", PaymentController.create)
router.patch("/:id/status", PaymentController.updateStatus)
router.delete("/:id", PaymentController.remove)

export default router
