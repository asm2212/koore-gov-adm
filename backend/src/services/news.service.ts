import prisma from "../prisma/client";
import { Prisma, News } from "@prisma/client";

// ✅ Just use the standard Prisma input types
export type NewsCreateData = Prisma.NewsCreateInput;
export type NewsUpdateData = Prisma.NewsUpdateInput;

// Create News
export const createNewsDB = (data: NewsCreateData): Promise<News> =>
  prisma.news.create({
    data, // ✅ Pass data directly — authorId is included as scalar
  });

// Get Many News (with filtering + pagination)
export const findNewsMany = (
  where: Prisma.NewsWhereInput = {},
  skip = 0,
  take = 10
): Promise<News[]> =>
  prisma.news.findMany({
    where: { deletedAt: null, ...where },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

// Helper to parse numeric ID
const parseNumericId = (id: string | number): number | null => {
  const num = typeof id === "string" ? parseInt(id, 10) : id;
  return isNaN(num) ? null : num;
};

// Get News by ID
export const findNewsById = (id: string | number): Promise<News | null> => {
  const numId = parseNumericId(id);
  if (!numId) return Promise.resolve(null);
  return prisma.news.findFirst({
    where: { id: numId, deletedAt: null },
  });
};

// Update News
export const updateNewsDB = (
  id: string | number,
  data: NewsUpdateData
): Promise<News> => {
  const numId = parseNumericId(id);
  if (!numId) throw new Error("Invalid ID");
  return prisma.news.update({
    where: { id: numId },
    data,
  });
};