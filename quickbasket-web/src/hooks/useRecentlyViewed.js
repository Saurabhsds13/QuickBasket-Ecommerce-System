import { useState, useCallback } from "react";

const STORAGE_KEY = "recently_viewed";
const MAX_ITEMS = 10;

/**
 * Hook for managing recently viewed products in localStorage.
 * Stores minimal product data (id, name, price, image, category).
 */
export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState(() => getStoredItems());

  const addProduct = useCallback((product) => {
    if (!product || !product.id) return;

    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      primaryImageUrl: product.primaryImageUrl || null,
      categoryName: product.categoryName || null,
      stockQuantity: product.stockQuantity,
      viewedAt: Date.now(),
    };

    const stored = getStoredItems();
    // Remove duplicate if exists
    const filtered = stored.filter((p) => p.id !== item.id);
    // Add to front
    const updated = [item, ...filtered].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRecentlyViewed(updated);
  }, []);

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentlyViewed([]);
  }, []);

  return { recentlyViewed, addProduct, clearAll };
}

function getStoredItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Static helper to get recently viewed without the hook (for SSR-safe reads).
 */
export function getRecentlyViewedProducts() {
  return getStoredItems();
}
