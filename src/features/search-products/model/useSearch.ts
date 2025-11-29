import { useState, useEffect, useMemo } from "react";
import { searchProductsFromAPI } from "@/shared/api";
import type { Product } from "@/entities/product";

export function useSearch(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useMemo(() => {
    if (!query.trim()) return "";
    return query;
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await searchProductsFromAPI(debouncedQuery, 5);
        setResults(products);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [debouncedQuery]);

  return { results, loading, error };
}
