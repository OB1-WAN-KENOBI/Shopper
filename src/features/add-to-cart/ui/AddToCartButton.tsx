import { Button } from "@/shared/ui/button";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/entities/product";

interface AddToCartButtonProps {
  product: Product;
  onAdd: (product: Product) => void;
  size?: "sm" | "lg" | "default";
  className?: string;
}

export function AddToCartButton({
  product,
  onAdd,
  size = "sm",
  className,
}: AddToCartButtonProps) {
  const handleClick = () => {
    onAdd(product);
  };

  return (
    <Button size={size} onClick={handleClick} className={className}>
      <ShoppingCart className="h-4 w-4" />
      <span className="hidden sm:inline">Add</span>
    </Button>
  );
}
