"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, duration = 2000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 rounded-lg bg-neutral-900 px-4 py-3 text-sm text-neutral-50 shadow-lg transition-all duration-200 dark:bg-neutral-50 dark:text-neutral-900"
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
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string) => {
    const id = toastId++;
    setToasts((prev) => [...prev, { message, id }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
}
