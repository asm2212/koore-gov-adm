
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface LoginInput {
  email: string;
  password: string;
}

const login = async (data: LoginInput) => {
  const res = await axios.post(`${API_URL}/auth/login`, data);
  return res.data; // { token, user }
};

export const logout = async () => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const authService = {
  login,
  logout,
};
