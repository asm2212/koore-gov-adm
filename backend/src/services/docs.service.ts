import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createDoc = async (
  title: string,
  description: string,
  category: string,
  fileUrl: string,
  fileType: string
) => {
  return prisma.doc.create({
    data: { title, description, category, fileUrl, fileType },
  });
};

export const getDocs = async () => {
  return prisma.doc.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getDocById = async (id: number) => {
  return prisma.doc.findUnique({ where: { id } });
};
