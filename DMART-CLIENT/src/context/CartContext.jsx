import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart, addToCartAPI, removeFromCartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart from backend when user is authenticated
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setCartLoading(true);
      const res = await getCart();
      // Backend returns CartItem objects with product nested
      const items = res.data.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        description: item.product.description,
        primaryImageUrl: item.product.primaryImageUrl || null,
        quantity: item.quantity,
        cartItemId: item.id,
      }));
      setCartItems(items);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated]);

  // Sync cart on login
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart on logout (or load from localStorage for guest)
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
      // Call backend
      try {
        await addToCartAPI(product.id, 1);
        await fetchCart(); // refresh from backend
      } catch (err) {
        console.error("Failed to add to cart:", err);
      }
    } else {
      // Guest mode — local state + localStorage
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
      // For backend: if quantity becomes 0, remove; otherwise re-add
      const item = cartItems.find((i) => i.id === id);
      if (!item) return;

      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        await removeFromCart(id);
      } else {
        try {
          // Backend doesn't have update qty endpoint, so remove and re-add
          await removeFromCartAPI(id);
          await addToCartAPI(id, newQty);
          await fetchCart();
        } catch (err) {
          console.error("Failed to update quantity:", err);
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
        await fetchCart();
      } catch (err) {
        console.error("Failed to remove from cart:", err);
      }
    } else {
      setCartItems((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveLocalCart(updated);
        return updated;
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (!isAuthenticated) {
      localStorage.removeItem("guest_cart");
    }
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
