import { motion } from "motion/react";
import type { Product } from "../model/types";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ShoppingCart, Heart, Zap } from "lucide-react";
import { cn } from "@/shared/lib";
import { useState, useMemo } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick?: () => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onClick,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const { isNew, hasDiscount } = useMemo(() => {
    const hash = product.id.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    const isNew = hash % 10 < 3;
    const hasDiscount = hash % 10 >= 8;

    return { isNew, hasDiscount };
  }, [product.id]);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const imgElement = e.currentTarget.closest(".group")?.querySelector("img");
    if (imgElement) {
      const cartButton = document.querySelector(
        '[aria-label*="cart"], [aria-label*="Cart"]'
      ) as HTMLElement;
      if (cartButton) {
        const imgRect = imgElement.getBoundingClientRect();
        const cartRect = cartButton.getBoundingClientRect();

        const flyingImg = document.createElement("img");
        flyingImg.src = (imgElement as HTMLImageElement).src;
        flyingImg.style.cssText = `
          position: fixed;
          width: ${imgRect.width}px;
          height: ${imgRect.height}px;
          left: ${imgRect.left}px;
          top: ${imgRect.top}px;
          z-index: 9999;
          pointer-events: none;
          border-radius: 8px;
          object-fit: contain;
          transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        document.body.appendChild(flyingImg);

        requestAnimationFrame(() => {
          const targetX = cartRect.left + cartRect.width / 2;
          const targetY = cartRect.top + cartRect.height / 2;
          flyingImg.style.transform = `translate(${
            targetX - imgRect.left - imgRect.width / 2
          }px, ${targetY - imgRect.top - imgRect.height / 2}px) scale(0.3)`;
          flyingImg.style.opacity = "0.8";
        });

        setTimeout(() => flyingImg.remove(), 600);
      }
    }

    onAddToCart(product);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card
        className={cn(
          "group relative h-full cursor-pointer overflow-hidden",
          "bg-gradient-to-br from-card to-card/50",
          "border-2 border-transparent transition-all duration-300",
          "hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/20",
          "backdrop-blur-sm",
          "hover:scale-[1.02]"
        )}
        onClick={onClick}
      >
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-2">
          {isNew && (
            <Badge variant="success" className="gap-1">
              <Zap className="h-3 w-3" />
              New
            </Badge>
          )}
          {hasDiscount && <Badge variant="warning">-20%</Badge>}
        </div>

        <motion.button
          onClick={handleFavoriteClick}
          className={cn(
            "absolute right-2 top-2 z-10 rounded-full p-2",
            "bg-background/80 backdrop-blur-sm",
            "transition-colors",
            isFavorite
              ? "text-red-500 hover:text-red-600"
              : "text-muted-foreground hover:text-red-500"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </motion.button>

        <div className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20 p-6">
          <motion.img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="mx-auto h-32 w-32 object-contain transition-transform duration-500 group-hover:scale-110"
            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <CardContent className="p-6 pt-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground leading-tight">
            {product.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
          {product.rating && (
            <div className="mb-2 flex items-center gap-1">
              <span className="text-sm font-medium text-foreground">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">★</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-4 p-6 pt-0">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                ${(product.price * 1.25).toFixed(2)}
              </span>
            )}
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              onClick={handleAddClick}
              className="gap-2 flex-shrink-0 transition-all duration-200"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
