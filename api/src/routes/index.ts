import { Router } from "express"
import userRoutes from "../modules/users/user.route"
import courseRoutes from "../modules/course/course.route"
import tutorialRoutes from "../modules/tutorials/tutorial.route"
import commentRoutes from "../modules/comments/comment.route"
import reviewRoutes from "../modules/course/review.route"
import paymentRoutes from "../modules/payments/payment.route"
import notificationRoutes from "../modules/notifications/notification.route"
import enrollmentRoutes from "../modules/enrollments/enrollment.route"
import menuRoutes from "../modules/menu/menu.route"
import testimonialRoutes from "../modules/testimonials/testimonial.route"

const router = Router()

router.use("/users", userRoutes)
router.use("/courses", courseRoutes)
router.use("/tutorials", tutorialRoutes)
router.use("/comments", commentRoutes)
router.use("/reviews", reviewRoutes)
router.use("/payments", paymentRoutes)
router.use("/notifications", notificationRoutes)
router.use("/enrollments", enrollmentRoutes)
router.use("/menu", menuRoutes)
router.use("/testimonials", testimonialRoutes)

export default router
