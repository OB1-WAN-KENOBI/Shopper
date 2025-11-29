import { useState, useEffect } from "react";
import type { Product } from "./types";
import { getProducts } from "../api/productApi";

export function useProducts(
  category: string = "smartphones",
  limit: number = 30
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts(category, limit);
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [category, limit]);

  return { products, loading, error };
}
