import { Router } from "express"
import authRoutes from "../modules/auth/auth.route"
import userRoutes from "../modules/users/user.route"
import courseRoutes from "../modules/course/course.route"
import paymentRoutes from "../modules/payments/payment.route"
import notificationRoutes from "../modules/notifications/notification.route"
import enrollmentRoutes from "../modules/enrollments/enrollment.route"
import menuRoutes from "../modules/menu/menu.route"

const router = Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/courses", courseRoutes)
router.use("/payments", paymentRoutes)
router.use("/notifications", notificationRoutes)
router.use("/enrollments", enrollmentRoutes)
router.use("/menu", menuRoutes)

export default router
