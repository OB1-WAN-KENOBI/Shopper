/**
 * API client for fetching products from DummyJSON API
 * https://dummyjson.com/docs/products
 */

import { fetchWithRetry } from "../utils/apiHelpers";
import { cacheService } from "../cache";
import type { DummyProduct, DummyProductsResponse } from "./types";
import { productAdapter } from "../adapters/productAdapter";
import type { Product } from "@/entities/product";

export type { DummyProduct, DummyProductsResponse };

const API_BASE_URL = "https://dummyjson.com";

/**
 * Fetch products from DummyJSON API with retry and caching
 */
export async function fetchProducts(
  limit: number = 30,
  skip: number = 0,
  category?: string
): Promise<DummyProductsResponse> {
  let url = `${API_BASE_URL}/products?limit=${limit}&skip=${skip}`;

  if (category) {
    url = `${API_BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`;
  }

  const cacheKey = `products:${category || "all"}:${limit}:${skip}`;
  const cached = cacheService.get<DummyProductsResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();
  cacheService.set(cacheKey, data, 2 * 60 * 1000);
  return data;
}

/**
 * Search products by query with retry and caching
 */
export async function searchProducts(
  query: string,
  limit: number = 30
): Promise<DummyProductsResponse> {
  const url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(
    query
  )}&limit=${limit}`;

  const cacheKey = `search:${query.toLowerCase()}:${limit}`;
  const cached = cacheService.get<DummyProductsResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to search products: ${response.statusText}`);
  }

  const data = await response.json();
  cacheService.set(cacheKey, data, 1 * 60 * 1000);
  return data;
}

/**
 * Get product by ID with retry and caching
 */
export async function fetchProductById(id: number): Promise<DummyProduct> {
  const url = `${API_BASE_URL}/products/${id}`;
  const cacheKey = `product:${id}`;
  const cached = cacheService.get<DummyProduct>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const data = await response.json();
  cacheService.set(cacheKey, data, 10 * 60 * 1000);
  return data;
}

/**
 * Get all categories with retry and caching
 */
export async function fetchCategories(): Promise<string[]> {
  const url = `${API_BASE_URL}/products/category-list`;
  const cacheKey = "categories:all";
  const cached = cacheService.get<string[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  const data = await response.json();
  cacheService.set(cacheKey, data, 30 * 60 * 1000);
  return data;
}

/**
 * Get products from API, keeping only electronics
 */
export async function getProductsFromAPI(
  limit: number = 30,
  skip: number = 0,
  category: string = "smartphones"
): Promise<Product[]> {
  try {
    const response = await fetchProducts(limit, skip, category);
    const allProducts = response.products.map(
      productAdapter.mapDummyProductToProduct
    );
    const electronics = allProducts.filter(productAdapter.isElectronic);
    return electronics.slice(0, limit);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Get a single iPhone product (for Hero section)
 */
export async function getIphoneProduct(): Promise<Product | null> {
  try {
    const response = await searchProducts("iPhone", 30);
    const allProducts = response.products.map(
      productAdapter.mapDummyProductToProduct
    );
    const iphones = allProducts.filter(productAdapter.isIphone);

    if (iphones.length > 0) {
      return iphones.sort((a, b) => parseInt(b.id) - parseInt(a.id))[0];
    }

    const categoryResponse = await fetchProducts(30, 0, "smartphones");
    const categoryProducts = categoryResponse.products.map(
      productAdapter.mapDummyProductToProduct
    );
    const categoryIphones = categoryProducts.filter(productAdapter.isIphone);

    if (categoryIphones.length > 0) {
      return categoryIphones.sort((a, b) => parseInt(b.id) - parseInt(a.id))[0];
    }

    return null;
  } catch (error) {
    console.error("Error fetching iPhone product:", error);
    return null;
  }
}

/**
 * Get accessories (for Featured section)
 */
export async function getAccessories(limit: number = 3): Promise<Product[]> {
  try {
    const allAccessories: Product[] = [];
    const searches = ["case", "charger", "headphone"];

    for (const query of searches) {
      try {
        const response = await searchProducts(query, 20);
        const products = response.products.map(
          productAdapter.mapDummyProductToProduct
        );
        const accessories = products.filter(productAdapter.isAccessory);
        allAccessories.push(...accessories);
      } catch (err) {
        console.warn(`Failed to search for ${query}:`, err);
      }
    }

    const unique = Array.from(
      new Map(allAccessories.map((item) => [item.id, item])).values()
    );

    return unique.slice(0, limit);
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return [];
  }
}

/**
 * Get product by ID from API
 */
export async function getProductByIdFromAPI(
  id: string
): Promise<Product | null> {
  try {
    const product = await fetchProductById(Number(id));
    return productAdapter.mapDummyProductToProduct(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

/**
 * Search products from API, keeping only electronics
 */
export async function searchProductsFromAPI(
  query: string,
  limit: number = 30
): Promise<Product[]> {
  try {
    const response = await searchProducts(query, limit * 2);
    const allProducts = response.products.map(
      productAdapter.mapDummyProductToProduct
    );
    const electronics = allProducts.filter(productAdapter.isElectronic);
    return electronics.slice(0, limit);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}
