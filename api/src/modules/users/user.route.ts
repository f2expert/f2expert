import { Router } from "express"
import * as UserController from "./user.controller"

const router = Router()

router.get("/", UserController.getAll)
router.get("/:id", UserController.getById)
router.post("/", UserController.create)
router.put("/:id", UserController.update)
router.delete("/:id", UserController.remove)

export default router
