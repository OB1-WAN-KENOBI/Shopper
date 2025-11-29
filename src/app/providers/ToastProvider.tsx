import { createContext, useContext, ReactNode } from "react";
import { useToast } from "@/shared/lib";

interface ToastContextType {
  show: (message: string, duration?: number) => void;
  isVisible: boolean;
  message: string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}
