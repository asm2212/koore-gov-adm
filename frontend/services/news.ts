import axios from "axios";
import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const getNews = async () => {
  const res = await axios.get(`${API_URL}/news`, { headers: authHeader() });
  return res.data;
};

export const createNews = async (data: { title: string; content: string }) => {
  const res = await axios.post(`${API_URL}/news`, data, { headers: authHeader() });
  return res.data;
};
