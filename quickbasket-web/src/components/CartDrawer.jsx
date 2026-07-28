import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import AuthModal from "./AuthModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function CartDrawer({ isOpen, setIsOpen }) {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryCharge,
    total,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const pendingCheckout = useRef(false);

  // After login succeeds, redirect to checkout if it was pending
  useEffect(() => {
    if (isAuthenticated && pendingCheckout.current) {
      pendingCheckout.current = false;
      setShowAuth(false);
      setIsOpen(false);
      navigate("/checkout");
    }
  }, [isAuthenticated, navigate, setIsOpen]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      pendingCheckout.current = true;
      setIsOpen(false); // Close drawer so auth modal is fully visible
      setShowAuth(true);
      return;
    }
    setIsOpen(false);
    navigate("/checkout");
  };

  const handleViewCart = () => {
    setIsOpen(false);
    navigate("/cart");
  };

  const handleContinueShopping = () => {
    setIsOpen(false);
    navigate("/AllProducts");
  };

  return (
    <>
      {/* Auth Modal for unauthenticated checkout */}
      <AuthModal open={showAuth} setOpen={setShowAuth} />

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-[60] ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] lg:w-[440px] bg-white shadow-2xl z-[70] flex flex-col transform transition-transform duration-400 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Shopping Bag</h2>
              <p className="text-xs text-gray-500">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
            aria-label="Close cart"
          >
            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free delivery banner — only when cart has items */}
        {cartItems.length > 0 && (
          <div className="mx-4 mt-3 rounded-lg bg-green-50 border border-green-100 px-4 py-2.5 flex items-center gap-2">
            <span className="text-green-600 text-sm">🚚</span>
            <p className="text-sm font-medium text-green-700">
              {subtotal >= 500
                ? "Free delivery on this order!"
                : `Add ₹${(500 - subtotal).toFixed(0)} more for free delivery`}
            </p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center px-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Your bag is empty</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Looks like you haven't added anything yet. Browse our products and find something you love.
              </p>
              <button
                onClick={handleContinueShopping}
                className="mt-6 px-6 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition shadow-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 p-3 hover:border-green-100 hover:bg-green-50/30 transition-all duration-200"
                >
                  {/* Product Image */}
                  <img
                    src={
                      item.primaryImageUrl
                        ? `${API_BASE_URL}${item.primaryImageUrl}`
                        : "/fallback-product.png"
                    }
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-green-600 font-semibold mt-0.5">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded-l-lg text-gray-600 text-sm font-medium"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded-r-lg text-gray-600 text-sm font-medium"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4">
            {/* Price Summary */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : "text-gray-600"}>
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full h-11 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout
              </button>
              <button
                onClick={handleViewCart}
                className="w-full h-11 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-100 hover:border-gray-400 transition flex items-center justify-center gap-2"
              >
                View Full Cart
              </button>
              <button
                onClick={clearCart}
                className="w-full text-xs text-gray-400 hover:text-red-500 py-1.5 transition font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
