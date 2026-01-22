"use client";

import { useEffect, useState } from "react";
import { classNames } from "../lib/classnames";

type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, variant = "info", duration = 2000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const variantStyles = {
    info: "bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900",
    success: "bg-green-600 text-white dark:bg-green-500",
    error: "bg-red-600 text-white dark:bg-red-500",
    warning: "bg-yellow-600 text-white dark:bg-yellow-500",
  };


  return (
    <div
      className={classNames("fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm shadow-lg transition-all duration-200", variantStyles[variant as keyof typeof variantStyles])}
      style={{
        animation: "slideUp 0.2s ease-out",
      }}
    >
      {message}
    </div>
  );
}

interface ToastState {
  message: string;
  id: number;
  variant?: ToastVariant;
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, variant: ToastVariant = "info") => {
    const id = toastId++;
    setToasts((prev) => [...prev, { message, id, variant }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
}
