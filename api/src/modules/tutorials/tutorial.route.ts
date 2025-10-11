import { Router } from "express"
import * as TutorialController from "./tutorial.controller"
import { validateBody, validateQuery } from "../../app/middlewares/validation.middleware"
import { createTutorialSchema, updateTutorialSchema, tutorialFilterSchema } from "./tutorial.validation"

const router = Router()

// Public routes
router.get("/", validateQuery(tutorialFilterSchema), TutorialController.getAll)
router.get("/limited/:limit", TutorialController.getLimited)
router.get("/featured", TutorialController.getFeatured)
router.get("/popular", TutorialController.getPopular)
router.get("/latest", TutorialController.getLatest)
router.get("/search", TutorialController.search)
router.get("/statistics", TutorialController.getStatistics)
router.get("/category/:category", TutorialController.getByCategory)
router.get("/technology/:technology", TutorialController.getByTechnology)
router.get("/:id", TutorialController.getById)

// Tutorial interaction routes
router.post("/:id/like", TutorialController.likeTutorial)
router.post("/:id/unlike", TutorialController.unlikeTutorial)

// Admin/Author routes (should be protected with authentication middleware)
router.post("/", validateBody(createTutorialSchema), TutorialController.create)
router.put("/:id", validateBody(updateTutorialSchema), TutorialController.update)
router.delete("/:id", TutorialController.remove)

export default router