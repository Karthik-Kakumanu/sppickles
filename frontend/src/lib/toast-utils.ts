/**
 * Toast notifications using Sonner
 * Centralized toast notification utilities
 */
import { toast } from "sonner";

export const toastSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 3000,
  });
};

export const toastError = (message: string, description?: string) => {
  toast.error(message, {
    description,
    duration: 4000,
  });
};

export const toastInfo = (message: string, description?: string) => {
  toast.info(message, {
    description,
    duration: 3000,
  });
};

export const toastLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (id: string | number) => {
  toast.dismiss(id);
};

export const toastPromise = (
  promise: Promise<any>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  toast.promise(promise, messages);
};
