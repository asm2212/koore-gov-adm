import api from "@/lib/api";
import { useState, useEffect } from "react";

interface CheckEmailResponse {
  available: boolean;
}

export function useCheckEmail(email: string) {
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get<CheckEmailResponse>("/users/check-email", {
          params: { email },
        } as any);
        setAvailable(res.available);
      } catch (err) {
        setAvailable(true);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [email]);

  return { available, loading };
}