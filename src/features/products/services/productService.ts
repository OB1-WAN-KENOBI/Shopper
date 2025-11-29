import type { Product } from "@/entities/product";
import {
  getProductsFromAPI,
  getIphoneProduct,
  getAccessories,
  getProductByIdFromAPI,
  searchProductsFromAPI,
} from "@/shared/api";

/**
 * Get products by category
 */
export async function getProducts(
  category: string = "smartphones",
  limit: number = 30
): Promise<Product[]> {
  return getProductsFromAPI(limit, 0, category);
}

/**
 * Get a single iPhone product
 */
export async function getIphone(): Promise<Product | null> {
  return getIphoneProduct();
}

/**
 * Get accessories
 */
export async function getAccessoriesList(
  limit: number = 3
): Promise<Product[]> {
  return getAccessories(limit);
}

/**
 * Get product by ID
 */
export async function getProduct(id: string): Promise<Product | null> {
  return getProductByIdFromAPI(id);
}

/**
 * Search products
 */
export async function searchProducts(
  query: string,
  limit: number = 30
): Promise<Product[]> {
  return searchProductsFromAPI(query, limit);
}
