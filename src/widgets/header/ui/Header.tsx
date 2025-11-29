import { useState } from "react";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { SearchAutocomplete } from "@/features/search-products";
import { ThemeToggle } from "@/features/toggle-theme";
import { useCartContext } from "@/app/providers";
import { useModal } from "@/shared/lib";
import { ProductModal } from "@/widgets/cart-modal";
import { useToastContext } from "@/app/providers";
import type { Product } from "@/entities/product";
import { cn } from "@/shared/lib";

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount, total, formatPrice, formatItemCount, addItem } =
    useCartContext();
  const { show } = useToastContext();
  const productModal = useModal();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    productModal.open();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b",
        "bg-background/80 backdrop-blur-md",
        "supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl font-bold text-primary">Shopp</span>
            <span className="text-2xl font-bold italic text-foreground">
              er
            </span>
          </motion.div>
        </Link>

        <div className="relative hidden flex-1 max-w-md items-center md:flex">
          <SearchAutocomplete onSelect={handleProductSelect} />
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {[
            { name: "Features", path: "/features" },
            { name: "Products", path: "/products" },
            { name: "Blog", path: "/blog" },
            { name: "About", path: "/about" },
          ].map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path}>
                <motion.span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                  whileHover={{ y: -2 }}
                >
                  {item.name}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            onClick={onCartClick}
            aria-label={`Shopping cart with ${itemCount} items`}
            className={cn(
              "relative flex items-center gap-2 rounded-full border-2 border-primary bg-background px-4 py-2",
              "text-sm font-medium text-primary transition-all",
              "hover:bg-primary hover:text-primary-foreground",
              "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">
              {formatItemCount(itemCount)} | {formatPrice(total)}
            </span>
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground shadow-lg"
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>
          <Button size="sm" variant="default" className="gap-2 hidden sm:flex">
            <User className="h-4 w-4" />
            Log in
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full border-t md:hidden overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <div className="py-4 md:hidden">
              <SearchAutocomplete onSelect={handleProductSelect} />
            </div>
            <nav className="flex flex-col gap-4 pb-4">
              {[
                { name: "Features", path: "/features" },
                { name: "Products", path: "/products" },
                { name: "Blog", path: "/blog" },
                { name: "About", path: "/about" },
              ].map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </motion.div>
      )}
      {selectedProduct && (
        <ProductModal
          isOpen={productModal.isOpen}
          onClose={() => {
            productModal.close();
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onAddToCart={(product) => {
            addItem(product);
            show("Added to cart!");
            productModal.close();
            setSelectedProduct(null);
          }}
        />
      )}
    </header>
  );
}
