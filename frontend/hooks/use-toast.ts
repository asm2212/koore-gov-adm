import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description: string;
};

export function useToast() {
  const toast = {
    success: ({ description, title = "Success" }: ToastProps) =>
      sonnerToast.success(title, { description }),
    error: ({ description, title = "Error" }: ToastProps) =>
      sonnerToast.error(title, { description }),
    info: ({ description, title = "Info" }: ToastProps) =>
      sonnerToast.info(title, { description }),
    warning: ({ description, title = "Warning" }: ToastProps) =>
      sonnerToast.warning(title, { description }),
    default: ({ title, description }: ToastProps) =>
      sonnerToast(title || "", { description }),
  };

  return { toast };
}