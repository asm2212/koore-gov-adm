// hooks/useContentData.ts
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useContentData<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("portal_token");
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to load ${endpoint}`);

      const { data: result } = await res.json();
      setData(result || []);
    } catch (err) {
      console.error(`Error loading ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [endpoint]);

  return { data, loading, refresh };
}