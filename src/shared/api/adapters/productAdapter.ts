/**
 * Product adapter - converts DummyJSON products to our Product type
 * and provides filtering logic
 */

import type { DummyProduct } from "../clients/dummyJsonClient";
import type { Product } from "@/entities/product";

/**
 * Convert DummyJSON product to our Product type
 */
export function mapDummyProductToProduct(dummyProduct: DummyProduct): Product {
  return {
    id: dummyProduct.id.toString(),
    title: dummyProduct.title,
    description: dummyProduct.description,
    price: dummyProduct.price,
    image: dummyProduct.thumbnail || dummyProduct.images[0] || "",
    category: dummyProduct.category,
    rating: dummyProduct.rating,
    stock: dummyProduct.stock,
    brand: dummyProduct.brand,
  };
}

const ELECTRONIC_CATEGORIES = [
  "smartphones",
  "laptops",
  "tablets",
  "mobile-accessories",
  "electronics",
  "audio",
];

const ELECTRONIC_KEYWORDS = [
  "phone",
  "iphone",
  "galaxy",
  "pixel",
  "xiaomi",
  "mi ",
  "redmi",
  "poco",
  "laptop",
  "notebook",
  "macbook",
  "tablet",
  "airpods",
  "earbuds",
  "headphone",
  "earphone",
  "charger",
  "power bank",
  "smartwatch",
  "watch",
];

export function isElectronic(product: Product): boolean {
  const category = product.category?.toLowerCase() || "";
  if (ELECTRONIC_CATEGORIES.some((c) => category.includes(c))) {
    return true;
  }

  const text = `${product.title} ${product.description}`.toLowerCase();
  return ELECTRONIC_KEYWORDS.some((keyword) => text.includes(keyword));
}

/**
 * Check if product is an iPhone
 */
export function isIphone(product: Product): boolean {
  const title = product.title.toLowerCase();
  const description = product.description?.toLowerCase() || "";
  const category = product.category?.toLowerCase() || "";

  // Must be in smartphones category or have iPhone in title
  if (category === "smartphones" && title.includes("iphone")) {
    return true;
  }

  if (title.includes("iphone") || description.includes("iphone")) {
    // Exclude accessories (cases, chargers, etc.)
    const accessoryKeywords = [
      "case",
      "charger",
      "cable",
      "cover",
      "protector",
      "stand",
      "mount",
    ];
    const hasAccessoryKeyword = accessoryKeywords.some(
      (keyword) => title.includes(keyword) || description.includes(keyword)
    );
    return !hasAccessoryKeyword;
  }

  return false;
}

/**
 * Check if product is an accessory (not a smartphone)
 */
export function isAccessory(product: Product): boolean {
  const title = product.title.toLowerCase();
  const description = product.description?.toLowerCase() || "";
  const category = product.category?.toLowerCase() || "";

  // Explicitly exclude watches, clocks, and timepieces
  const watchKeywords = [
    "watch",
    "clock",
    "timepiece",
    "wristwatch",
    "smartwatch",
  ];
  if (
    watchKeywords.some(
      (keyword) =>
        title.includes(keyword) ||
        description.includes(keyword) ||
        category.includes(keyword)
    )
  ) {
    return false;
  }

  // Exclude smartphones category
  if (category === "smartphones") {
    // But allow if it's clearly an accessory (case, charger, etc.)
    const accessoryKeywords = [
      "case",
      "charger",
      "cable",
      "cover",
      "protector",
      "stand",
      "mount",
      "adapter",
      "power bank",
    ];
    const hasAccessoryKeyword = accessoryKeywords.some(
      (keyword) => title.includes(keyword) || description.includes(keyword)
    );
    return hasAccessoryKeyword;
  }

  // Exclude actual phones
  if (
    title.includes("iphone") &&
    !title.includes("case") &&
    !title.includes("charger") &&
    !title.includes("cover")
  ) {
    return false;
  }
  if (
    (title.includes("samsung") || title.includes("galaxy")) &&
    !title.includes("case") &&
    !title.includes("charger")
  ) {
    return false;
  }
  if (
    (title.includes("xiaomi") || title.includes("mi ")) &&
    !title.includes("case") &&
    !title.includes("charger")
  ) {
    const phonePattern =
      /\b(mi\s*\d+|redmi\s*(?:note\s*)?\d+|poco\s*(x|f|m)\d+)\b/i;
    if (phonePattern.test(title)) {
      return false;
    }
  }

  // Exclude clothing and other non-accessory items
  const excludeKeywords = [
    "dress",
    "shirt",
    "pants",
    "jacket",
    "perfume",
    "fragrance",
    "skincare",
    "lotion",
    "cream",
    "food",
    "groceries",
    "furniture",
  ];
  if (
    excludeKeywords.some(
      (keyword) =>
        title.includes(keyword) ||
        description.includes(keyword) ||
        category.includes(keyword)
    )
  ) {
    return false;
  }

  // Must be electronic and have accessory keywords
  if (!isElectronic(product)) {
    return false;
  }

  const accessoryKeywords = [
    "case",
    "charger",
    "cable",
    "headphone",
    "earphone",
    "earbud",
    "protector",
    "stand",
    "mount",
    "cover",
    "adapter",
    "power bank",
    "wireless charger",
    "bluetooth",
    "speaker",
    "dock",
    "holder",
    "grip",
    "ring",
    "sticker",
    "skin",
    "tempered glass",
    "screen protector",
    "airpods",
    "earbuds",
  ];

  return accessoryKeywords.some(
    (keyword) => title.includes(keyword) || description.includes(keyword)
  );
}

export const productAdapter = {
  mapDummyProductToProduct,
  isElectronic,
  isIphone,
  isAccessory,
};
