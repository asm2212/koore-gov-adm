
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  UploadedImage,
} from "../utils/cloudinary.util";
import * as newsService from "../services/news.service";
import { Prisma } from "@prisma/client";
import prisma from "../prisma/client";

const NEWS_FOLDER = "koorezone/news";

const checkPermission = (userId: number, userRole: string, authorId: number) => {
  if (userId !== authorId && userRole !== "ADMIN") {
    const err = new Error("Forbidden: You don't have permission to delete this news");
    (err as any).status = 403;
    throw err;
  }
};

// Create News
export const createNews = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category, language } = req.body;
    const authorId = req.user!.userId;

    const validCategories = ["TRENDING", "TODAY", "WEEKLY", "GENERAL"] as const;
    type ValidCategory = typeof validCategories[number];

    const newsCategory: ValidCategory = validCategories.includes(category?.toUpperCase() as any)
      ? (category.toUpperCase() as ValidCategory)
      : "GENERAL";

    const files = (req.files as Express.Multer.File[]) || [];
    const uploaded: UploadedImage[] = [];

    for (const file of files) {
      uploaded.push(await uploadBufferToCloudinary(file.buffer, NEWS_FOLDER));
    }

    // Properly typed data
    const createData: newsService.NewsCreateData = {
      title,
      content,
      category: newsCategory,
      language: language as "EN" | "AM" | undefined,
      images: uploaded.length > 0 ? (uploaded as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
      authorId,
    };

    const news = await newsService.createNewsDB(createData);
    res.status(201).json({ data: news });
  } catch (err: any) {
    console.error("Create News Error:", err);
    res.status(err.status || 500).json({ 
      error: err.message || "Failed to create news",
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Get News (with pagination & filtering)
export const getNews = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (req.query.category) where.category = req.query.category;
    if (req.query.language) where.language = req.query.language;

    const [list, total] = await Promise.all([
      newsService.findNewsMany(where, skip, limit),
      prisma.news.count({ where: { deletedAt: null, ...where } }),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: list,
    });
  } catch (err) {
    console.error("Get News Error:", err);
    res.status(500).json({ 
      error: "Failed to load news",
      details: process.env.NODE_ENV === 'development' ? (err as Error).message : undefined
    });
  }
};

// Get single news
export const getNewsById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Invalid ID" });

    const news = await newsService.findNewsById(id);
    if (!news) return res.status(404).json({ error: "News not found" });

    res.json({ data: news });
  } catch (err) {
    console.error("Get News By ID Error:", err);
    res.status(500).json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? (err as Error).message : undefined
    });
  }
};

// Update News
export const updateNews = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Invalid ID" });

    const existing = await newsService.findNewsById(id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    checkPermission(req.user!.userId, req.user!.role, existing.authorId);

    const files = (req.files as Express.Multer.File[]) || [];
    let newImages: UploadedImage[] | null = existing.images as UploadedImage[] ?? null;

    if (files.length > 0) {
      // Delete old images from Cloudinary
      if (Array.isArray(existing.images)) {
        for (const img of existing.images as UploadedImage[]) {
          if (img.publicId) await deleteFromCloudinary(img.publicId);
        }
      }
      // Upload new ones
      newImages = [];
      for (const file of files) {
        newImages.push(await uploadBufferToCloudinary(file.buffer, NEWS_FOLDER));
      }
    }

    const { title, content, category, language } = req.body;
    const validCategories = ["TRENDING", "TODAY", "WEEKLY", "GENERAL"] as const;
    type ValidCategory = typeof validCategories[number];

    const newsCategory: ValidCategory = validCategories.includes(category?.toUpperCase() as any)
      ? (category.toUpperCase() as ValidCategory)
      : existing.category;

    const updateData: newsService.NewsUpdateData = {
      title,
      content,
      category: newsCategory,
      language: language as "EN" | "AM" | undefined,
      images: newImages
        ? (newImages as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull,
    };

    const updated = await newsService.updateNewsDB(id, updateData);
    res.json({ data: updated });
  } catch (err: any) {
    console.error("Update News Error:", err);
    res.status(err.status || 500).json({ 
      error: err.message || "Failed to update news",
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Delete News
export const deleteNews = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Invalid ID" });

    const existing = await newsService.findNewsById(id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    // Check permission before attempting to delete images
    checkPermission(req.user!.userId, req.user!.role, existing.authorId);

    // Delete images from Cloudinary
    if (Array.isArray(existing.images)) {
      for (const img of existing.images as UploadedImage[]) {
        if (img.publicId) {
          try {
            await deleteFromCloudinary(img.publicId);
          } catch (cloudinaryErr) {
            console.error(`Failed to delete image ${img.publicId} from Cloudinary:`, cloudinaryErr);
            // Don't throw - we still want to soft delete the news item
          }
        }
      }
    }

    // Soft delete
    await newsService.updateNewsDB(id, {
      deletedAt: new Date(),
    });

    res.status(204).send();
  } catch (err: any) {
    console.error("Delete News Error:", err);
    res.status(err.status || 500).json({ 
      error: err.message || "Failed to delete news",
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};