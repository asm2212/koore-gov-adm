import { useState } from "react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface UseDeleteItemOptions {
  onSuccess?: () => void;
  entityName?: string; // For user-friendly messages
}

export function useDeleteItem({ onSuccess, entityName = "Item" }: UseDeleteItemOptions) {
  const [deleting, setDeleting] = useState<number | null>(null); // Track which ID is being deleted

  const deleteItem = async (type: "news" | "tourism", id: number) => {
    if (!confirm(`Are you sure you want to delete this ${entityName.toLowerCase()}? This cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem("portal_token");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch(`${API_BASE}/${type}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || `Failed to delete ${entityName.toLowerCase()}`);
      }

      toast.success(`${entityName} deleted successfully.`);
      onSuccess?.();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.message || `Failed to delete ${entityName.toLowerCase()}.`);
    } finally {
      setDeleting(null);
    }
  };

  return { deleteItem, deleting };
}