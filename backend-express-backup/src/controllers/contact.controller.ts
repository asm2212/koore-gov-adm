import { Request, Response } from "express";
import { ContactService } from "../services/contact.service";

export class ContactController {
  /**
   * POST: Submit a new contact message
   * Public route
   */
  static async submitContactForm(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, subject, message } = req.body;

      // Validation
      if (!firstName || !lastName || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required." });
      }
      if (message.length < 10) {
        return res.status(400).json({ error: "Message must be at least 10 characters." });
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
      }

      const savedMessage = await ContactService.createContactMessage({
        firstName,
        lastName,
        email,
        subject,
        message,
      });

      return res.status(201).json({
        message: "Message submitted successfully.",
        data: savedMessage,
      });
    } catch (error) {
      console.error("Error saving contact message:", error);
      return res.status(500).json({ error: "Failed to submit message. Please try again." });
    }
  }

  /**
   * GET: List all contact messages
   * Admin only
   */
  static async getAllMessages(req: Request, res: Response) {
    try {
      const { responded } = req.query;

      // Optional: Uncomment when authentication is implemented
      // if (!req.user || !["ADMIN", "SUPER_ADMIN"].includes(req.user.role)) {
      //   return res.status(403).json({ error: "Forbidden: Admin access required." });
      // }

      const respondedFilter = responded === "true"
        ? true
        : responded === "false"
        ? false
        : undefined;

      const messages = await ContactService.getAllMessages(respondedFilter);

      // ✅ Key Fix: Return { messages } to match frontend expectation
      return res.status(200).json({ messages });
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return res.status(500).json({ error: "Failed to retrieve messages." });
    }
  }

  /**
   * GET: Get a single message by ID
   * Admin only
   */
  static async getMessageById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid message ID." });
      }

      const message = await ContactService.getMessageById(id);
      if (!message) {
        return res.status(404).json({ error: "Message not found." });
      }

      return res.status(200).json({ message });
    } catch (error) {
      console.error("Error fetching message by ID:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  /**
   * PATCH: Mark a message as responded
   * Admin only
   */
  static async markAsResponded(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid message ID." });
      }

      const updatedMessage = await ContactService.markAsResponded(id);

      return res.status(200).json({
        message: "Message marked as responded.",
        data: updatedMessage,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Message not found." });
      }
      console.error("Error marking message as responded:", error);
      return res.status(500).json({ error: "Failed to update message status." });
    }
  }
}