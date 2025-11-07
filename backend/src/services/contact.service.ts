import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateContactData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export class ContactService {
  // Create new message
  static async createContactMessage(data: CreateContactData) {
    return await prisma.contactMessage.create({ data });
  }

  // Get all messages (with optional filter for responded)
  static async getAllMessages(responded?: boolean) {
    return await prisma.contactMessage.findMany({
      where: responded !== undefined ? { responded } : {},
      orderBy: { createdAt: "desc" },
    });
  }

  // Get single message by ID
  static async getMessageById(id: number) {
    return await prisma.contactMessage.findUnique({
      where: { id },
    });
  }

  // Mark as responded
  static async markAsResponded(id: number) {
    return await prisma.contactMessage.update({
      where: { id },
      data: { responded: true },
    });
  }
}