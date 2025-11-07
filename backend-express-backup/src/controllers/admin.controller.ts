import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/admin.service";

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await adminService.createAdmin(req.body);
    res.status(201).json({ message: "Admin created", admin });
  } catch (err) {
    next(err);
  }
};

export const getAdmins = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await adminService.getAdmins();
    res.json(admins);
  } catch (err) {
    next(err);
  }
};

export const countAdmins = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await adminService.countAdmins();
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

export const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await adminService.getAdminById(req.params.id);
    res.json(admin);
  } catch (err) {
    next(err);
  }
};

export const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await adminService.updateAdmin(req.params.id, req.body);
    res.json({ message: "Admin updated", admin });
  } catch (err) {
    next(err);
  }
};

export const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await adminService.deleteAdmin(req.params.id);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    next(err);
  }
};

export const activateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await adminService.toggleActiveStatus(req.params.id, true);
    res.json({ message: "Admin activated", admin });
  } catch (err) {
    next(err);
  }
};

export const deactivateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await adminService.toggleActiveStatus(req.params.id, false);
    res.json({ message: "Admin deactivated", admin });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPassword = await adminService.resetAdminPassword(req.params.id);
    // In production, email this instead of returning it
    res.json({ message: "Password reset successfully", newPassword });
  } catch (err) {
    next(err);
  }
};
