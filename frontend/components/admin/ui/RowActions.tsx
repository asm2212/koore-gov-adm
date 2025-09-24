import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ✅ Fix: Allow string | number as key
const pendingDeletes = new Map<string | number, { timeoutId: NodeJS.Timeout }>();

export default function RowActions({
  onEdit,
  onDelete,
  deleting = false,
}: {
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);

    // Show confirmation toast with "Undo"
    const toastId = toast.warning("Delete this item?", {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => {
          setIsDeleting(false);
          toast.success("Delete cancelled.");
          cleanup();
        },
      },
      onDismiss: () => {
        if (isDeleting && !pendingDeletes.has(toastId)) {
          finalizeDelete();
        }
      },
    });

    const timeoutId = setTimeout(() => {
      if (pendingDeletes.has(toastId)) {
        finalizeDelete();
      }
    }, 5000);

    // ✅ Now this works: toastId can be string or number
    pendingDeletes.set(toastId, { timeoutId });

    function cleanup() {
      const data = pendingDeletes.get(toastId);
      if (data) {
        clearTimeout(data.timeoutId);
        pendingDeletes.delete(toastId);
      }
    }

    function finalizeDelete() {
      cleanup();
      onDelete();
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 border border-border hover:bg-accent/20"
        onClick={onEdit}
        disabled={isDeleting}
        aria-label="Edit"
      >
        <Edit className="h-4 w-4 text-accent" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 border border-border hover:bg-red-600/20 text-red-500"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label={isDeleting ? "Deleting..." : "Delete"}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}