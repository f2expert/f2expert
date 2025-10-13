import { Router } from "express"
import * as TestimonialController from "./testimonial.controller"
import { validateBody, validateQuery } from "../../app/middlewares/validation.middleware"
import { 
  createTestimonialSchema, 
  updateTestimonialSchema,
  approvalSchema,
  testimonialQuerySchema 
} from "./testimonial.validation"
import Joi from "joi"

const router = Router()

// Public endpoints for viewing testimonials
router.get("/", 
  validateQuery(testimonialQuerySchema), 
  TestimonialController.getAllTestimonials
)

router.get("/featured", 
  validateQuery(Joi.object({
    limit: Joi.number().integer().min(1).max(20).optional().default(6)
  })), 
  TestimonialController.getFeaturedTestimonials
)

router.get("/search", 
  validateQuery(Joi.object({
    q: Joi.string().required(),
    limit: Joi.number().integer().min(1).max(100).optional().default(20)
  })), 
  TestimonialController.searchTestimonials
)

router.get("/stats", 
  TestimonialController.getTestimonialStats
)

router.get("/course/:course", 
  validateQuery(Joi.object({
    limit: Joi.number().integer().min(1).max(50).optional().default(10)
  })), 
  TestimonialController.getTestimonialsByCourse
)

router.get("/rating", 
  validateQuery(Joi.object({
    minRating: Joi.number().integer().min(1).max(5).optional().default(4),
    limit: Joi.number().integer().min(1).max(50).optional().default(10)
  })), 
  TestimonialController.getTestimonialsByRating
)

// CRUD operations
router.get("/:id", 
  TestimonialController.getTestimonialById
)

router.post("/", 
  validateBody(createTestimonialSchema), 
  TestimonialController.createTestimonial
)

router.put("/:id", 
  validateBody(updateTestimonialSchema), 
  TestimonialController.updateTestimonial
)

router.delete("/:id", 
  TestimonialController.deleteTestimonial
)

// Admin management endpoints
router.post("/:id/approve", 
  validateBody(approvalSchema), 
  TestimonialController.updateApprovalStatus
)

router.post("/:id/toggle-featured", 
  TestimonialController.toggleFeatured
)

export default router