import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";

const router = Router();

// Public route
router.post("/", ContactController.submitContactForm); // POST /api/contact

// Admin-only routes
router.get("/", ContactController.getAllMessages);           // GET /api/contact
router.get("/:id", ContactController.getMessageById);       // GET /api/contact/1
router.patch("/:id/responded", ContactController.markAsResponded); // PATCH /api/contact/1/responded

export default router;