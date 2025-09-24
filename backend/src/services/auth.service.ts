import prisma from "../prisma/client";
import { comparePassword } from "../utils/hash.util";
import { signJwt } from "../utils/jwt.util";

interface LoginInput {
  email: string;
  password: string;
}

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await comparePassword(input.password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = signJwt({ userId: user.id, role: user.role });
  return { user, token };
};
