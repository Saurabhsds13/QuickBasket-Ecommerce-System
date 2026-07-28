import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import AuthModal from "../components/AuthModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryCharge,
    savings,
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
      navigate("/checkout");
    }
  }, [isAuthenticated, navigate]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      pendingCheckout.current = true;
      setShowAuth(true);
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8 lg:px-16">
      {/* Auth Modal for unauthenticated checkout */}
      <AuthModal open={showAuth} setOpen={setShowAuth} />

      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate("/")} className="hover:text-green-600 transition">
            Home
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 mt-1">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={() => navigate("/AllProducts")}
              className="mt-3 sm:mt-0 text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </button>
          )}
        </div>

        {/* Free Delivery Progress */}
        {cartItems.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {subtotal >= 500
                  ? "🎉 You've unlocked FREE delivery!"
                  : `🚚 Add ₹${(500 - subtotal).toFixed(0)} more for FREE delivery`}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                ₹{subtotal.toFixed(0)} / ₹500
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-lg mx-auto">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">
              Browse our fresh products and add your favorites to get started.
            </p>
            <button
              onClick={() => navigate("/AllProducts")}
              className="bg-green-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-700 transition shadow-sm"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Cart Items Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <span className="col-span-5">Product</span>
                  <span className="col-span-2 text-center">Price</span>
                  <span className="col-span-3 text-center">Quantity</span>
                  <span className="col-span-2 text-right">Total</span>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition"
                    >
                      {/* Product Info */}
                      <div className="col-span-5 flex items-center gap-4">
                        <img
                          src={
                            item.primaryImageUrl
                              ? `${API_BASE_URL}${item.primaryImageUrl}`
                              : "/fallback-product.png"
                          }
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                          <p className="text-xs text-green-600 mt-1 font-medium">In Stock</p>
                          <p className="text-xs text-gray-400">Delivery by Tomorrow</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center">
                        <span className="text-sm font-medium text-gray-700">₹{item.price.toFixed(2)}</span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-3 flex justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-9 w-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-9 w-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Total + Remove */}
                      <div className="col-span-2 text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-gray-400 hover:text-red-500 mt-1 transition font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear Cart */}
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-400 hover:text-red-500 font-medium transition flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={deliveryCharge === 0 ? "text-green-600 font-semibold" : "font-medium"}>
                      {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings</span>
                      <span className="font-semibold">−₹{savings}</span>
                    </div>
                  )}
                </div>

                {savings > 0 && (
                  <div className="mt-4 bg-green-50 rounded-lg p-3 border border-green-100">
                    <p className="text-xs text-green-700 font-semibold">
                      🎉 You're saving ₹{savings} on this order!
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center font-bold text-lg text-gray-900 mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-5 h-12 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Proceed to Checkout
                </button>

                {/* Trust Badges */}
                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure SSL Payments</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Easy Returns & Refunds</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>100% Fresh Products Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
