import axios from "axios";
import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const getTourism = async () => {
  const res = await axios.get(`${API_URL}/tourism`, { headers: authHeader() });
  return res.data;
};

export const createTourism = async (data: { name: string; description: string }) => {
  const res = await axios.post(`${API_URL}/tourism`, data, { headers: authHeader() });
  return res.data;
};
