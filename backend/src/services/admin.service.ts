import prisma from "../prisma/client";
import { hashPassword } from "../utils/hash.util";

// ----- Types -----
export interface AdminCreateInput {
  name: string;
  email: string;
  password: string;
  role?: "SUPER_ADMIN" | "ADMIN";
}

// ----- Validation -----
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// min 8, upper, lower, number, special
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const validateEmail = (email: string) => {
  if (!EMAIL_REGEX.test(email)) throw new Error("Invalid email format");
};

const validatePassword = (password: string) => {
  if (!PASSWORD_REGEX.test(password)) {
    throw new Error(
      "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
    );
  }
};

// ----- Helpers -----
const adminSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true,
};

export const createAdmin = async (data: AdminCreateInput) => {
  validateEmail(data.email);
  validatePassword(data.password);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing && !existing.deleted) throw new Error("Email already exists");

  const hashedPassword = await hashPassword(data.password);

  const created = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || "ADMIN",
      active: true,
      deleted: false,
    },
    select: adminSelect,
  });

  return created;
};

export const getAdmins = async () => {
  return prisma.user.findMany({
    where: { deleted: false },
    orderBy: { createdAt: "desc" },
    select: adminSelect,
  });
};

export const countAdmins = async () => {
  return prisma.user.count({
    where: { deleted: false },
  });
};

export const getAdminById = async (id: string) => {
  const adminId = Number(id);
  if (Number.isNaN(adminId)) throw new Error("Invalid admin id");

  const admin = await prisma.user.findFirst({
    where: { id: adminId, deleted: false },
    select: adminSelect,
  });

  if (!admin) throw new Error("Admin not found");
  return admin;
};

export const updateAdmin = async (id: string, data: Partial<AdminCreateInput> & { active?: boolean }) => {
  const adminId = Number(id);
  if (Number.isNaN(adminId)) throw new Error("Invalid admin id");

  const updateData: any = {};

  if (typeof data.name === "string") updateData.name = data.name;
  if (typeof data.email === "string") {
    validateEmail(data.email);
    updateData.email = data.email;
  }
  if (typeof data.role === "string") updateData.role = data.role;
  if (typeof data.active === "boolean") updateData.active = data.active;

  if (typeof data.password === "string" && data.password.length > 0) {
    validatePassword(data.password);
    updateData.password = await hashPassword(data.password);
  }

  const updated = await prisma.user.update({
    where: { id: adminId },
    data: updateData,
    select: adminSelect,
  });

  return updated;
};

// Soft delete (keeps row, hides from lists)
export const deleteAdmin = async (id: string) => {
  const adminId = Number(id);
  if (Number.isNaN(adminId)) throw new Error("Invalid admin id");

  await prisma.user.update({
    where: { id: adminId },
    data: { deleted: true, active: false },
  });
};

// Toggle active
export const toggleActiveStatus = async (id: string, isActive: boolean) => {
  const adminId = Number(id);
  if (Number.isNaN(adminId)) throw new Error("Invalid admin id");

  const updated = await prisma.user.update({
    where: { id: adminId },
    data: { active: isActive },
    select: adminSelect,
  });

  return updated;
};

// Reset password (returning the temp password is OK for dev; in prod email it)
export const resetAdminPassword = async (id: string) => {
  const adminId = Number(id);
  if (Number.isNaN(adminId)) throw new Error("Invalid admin id");

  const newPassword = generateTempPassword();
  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: adminId },
    data: { password: hashedPassword },
  });

  return newPassword;
};

// Very basic temp password generator (improve if you like)
function generateTempPassword() {
  // Ensures at least 1 upper, lower, number, special; length 12
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const nums = "0123456789";
  const special = "!@#$%^&*()-_=+[]{};:,.<>?";
  const all = upper + lower + nums + special;

  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  let pwd = pick(upper) + pick(lower) + pick(nums) + pick(special);
  while (pwd.length < 12) pwd += pick(all);
  return pwd;
}
