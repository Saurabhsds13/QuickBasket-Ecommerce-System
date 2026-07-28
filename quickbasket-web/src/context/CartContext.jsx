import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart, addToCartAPI, updateCartQuantityAPI, removeFromCartAPI, clearCartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Map backend CartItemViewDto to frontend cart item
  const mapCartItem = (item) => ({
    id: item.productId,
    name: item.productName || "Product",
    price: item.productPrice || 0,
    description: item.productDescription || "",
    primaryImageUrl: item.primaryImageUrl || null,
    stockQuantity: item.productStockQuantity || 0,
    quantity: item.quantity || 1,
    cartItemId: item.id,
  });

  // Fetch cart from backend when user is authenticated
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setCartLoading(true);
      const res = await getCart();
      const data = res.data;
      if (Array.isArray(data)) {
        setCartItems(data.map(mapCartItem));
      } else {
        console.warn("Cart response is not an array:", data);
        setCartItems([]);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err?.response?.status, err?.response?.data || err.message);
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated]);

  // Sync cart on login/logout
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems(getLocalCart());
    }
  }, [isAuthenticated, fetchCart]);

  // Guest cart helpers (localStorage)
  const getLocalCart = () => {
    try {
      const stored = localStorage.getItem("guest_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveLocalCart = (items) => {
    localStorage.setItem("guest_cart", JSON.stringify(items));
  };

  const addToCart = async (product) => {
    if (isAuthenticated) {
      try {
        const res = await addToCartAPI(product.id, 1);
        // Optimistically update from response
        const addedItem = mapCartItem(res.data);
        setCartItems((prev) => {
          const existing = prev.find((i) => i.id === addedItem.id);
          if (existing) {
            return prev.map((i) =>
              i.id === addedItem.id ? addedItem : i
            );
          }
          return [...prev, addedItem];
        });
      } catch (err) {
        console.error("Failed to add to cart:", err?.response?.data || err.message);
      }
    } else {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        let updated;
        if (existing) {
          updated = prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updated = [...prev, { ...product, quantity: 1 }];
        }
        saveLocalCart(updated);
        return updated;
      });
    }
  };

  const updateQuantity = async (id, delta) => {
    if (isAuthenticated) {
      const item = cartItems.find((i) => i.id === id);
      if (!item) return;

      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        await removeFromCart(id);
      } else {
        // Optimistically update UI
        setCartItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
        );
        try {
          await updateCartQuantityAPI(id, newQty);
        } catch (err) {
          console.error("Failed to update quantity:", err?.response?.data || err.message);
          // Revert on failure
          fetchCart();
        }
      }
    } else {
      setCartItems((prev) => {
        const updated = prev
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + delta } : item
          )
          .filter((item) => item.quantity > 0);
        saveLocalCart(updated);
        return updated;
      });
    }
  };

  const removeFromCart = async (id) => {
    if (isAuthenticated) {
      try {
        await removeFromCartAPI(id);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Failed to remove from cart:", err?.response?.data || err.message);
      }
    } else {
      setCartItems((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveLocalCart(updated);
        return updated;
      });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await clearCartAPI();
      } catch (err) {
        console.error("Failed to clear cart:", err?.response?.data || err.message);
      }
    } else {
      localStorage.removeItem("guest_cart");
    }
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const savings = subtotal > 1000 ? 150 : 0;
  const total = subtotal + deliveryCharge - savings;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        cartCount,
        subtotal,
        deliveryCharge,
        savings,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
