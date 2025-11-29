import { motion } from "motion/react";
import type { Product } from "@/entities/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
}: ProductModalProps) {
  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          <motion.img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-48 w-48 rounded-lg object-contain bg-muted p-4"
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          />
          <div className="text-center">
            <h3 className="mb-2 text-xl font-semibold">{product.title}</h3>
            <p className="mb-4 text-muted-foreground">{product.description}</p>
            <p className="mb-6 text-3xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
