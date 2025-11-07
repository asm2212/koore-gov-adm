import { Request, Response } from "express";
import * as docsService from "../services/docs.service";
import prisma from "../prisma/client";

export const createDoc = async (req: Request, res: Response) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const fileUrl = `/uploads/docs/${req.file.filename}`;
    const fileType = req.file.mimetype;

    const doc = await docsService.createDoc(title, description, category, fileUrl, fileType);
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create document" });
  }
};

export const getDocs = async (_req: Request, res: Response) => {
  try {
    const docs = await docsService.getDocs();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

export const getDocById = async (req: Request, res: Response) => {
  try {
    const doc = await docsService.getDocById(Number(req.params.id));
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch document" });
  }
};
 // docs.controller.ts
export const updateDoc = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, description, category } = req.body;
    const updateData: any = { title, description, category };

    if (req.file) {
      updateData.fileUrl = `/uploads/docs/${req.file.filename}`;
      updateData.fileType = req.file.mimetype;
    }

    const updated = await prisma.doc.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update document" });
  }
};

export const deleteDoc = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // Optional: delete file from local storage
    const doc = await prisma.doc.findUnique({ where: { id } });
    if (!doc) return res.status(404).json({ error: "Document not found" });

    // Delete from DB
    await prisma.doc.delete({ where: { id } });

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete document" });
  }
};
