import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib";

interface ToastProps {
  isVisible: boolean;
  message: string;
}

export function Toast({ isVisible, message }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed left-1/2 top-20 z-[2000] -translate-x-1/2",
            "rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground",
            "shadow-lg ring-1 ring-black/5"
          )}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
