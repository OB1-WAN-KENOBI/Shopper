import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { useCartContext } from "@/app/providers";
import { cn } from "@/shared/lib";

interface FloatingCartButtonProps {
  onClick: () => void;
}

export function FloatingCartButton({ onClick }: FloatingCartButtonProps) {
  const { itemCount } = useCartContext();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "flex h-14 w-14 items-center justify-center",
            "rounded-full bg-primary text-primary-foreground",
            "shadow-2xl shadow-primary/50",
            "md:hidden"
          )}
          aria-label="Open cart"
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground"
            >
              {itemCount}
            </motion.span>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
