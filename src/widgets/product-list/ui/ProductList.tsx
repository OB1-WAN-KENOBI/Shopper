import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import type { Product } from "@/entities/product";
import {
  ProductCard,
  ProductCardSkeleton,
  useProducts,
} from "@/entities/product";
import { useCartContext } from "@/app/providers";
import { useToastContext } from "@/app/providers";
import { useModal } from "@/shared/lib";
import { ProductModal } from "@/widgets/cart-modal";
import { ArrowRight } from "lucide-react";

interface ProductListProps {
  title?: string;
  description?: string;
  category?: string;
  limit?: number;
  showViewAll?: boolean;
}

export function ProductList({
  title = "Top Sellers",
  description = "Discover our best-selling smartphones and electronics, trusted by thousands of customers worldwide",
  category = "smartphones",
  limit = 8,
  showViewAll = true,
}: ProductListProps) {
  const { products, loading } = useProducts(category, limit);
  const { addItem } = useCartContext();
  const { show } = useToastContext();
  const { isOpen, open, close } = useModal();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    show("Added to cart!");
  };

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product);
    open();
  };

  return (
    <>
      <section id="products" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {title}
              </h2>
              <p className="mt-2 text-muted-foreground">{description}</p>
            </div>
            {showViewAll && (
              <Link to="/products">
                <motion.span
                  className="flex items-center gap-2 text-primary transition-colors hover:text-primary/80 font-medium"
                  whileHover={{ x: 5 }}
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
            )}
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: limit }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : products.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">
                  No products found. Try refreshing the page.
                </p>
              </div>
            ) : (
              products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onClick={() => handleCardClick(product)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
      {selectedProduct && (
        <ProductModal
          isOpen={isOpen}
          onClose={close}
          product={selectedProduct}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
}
