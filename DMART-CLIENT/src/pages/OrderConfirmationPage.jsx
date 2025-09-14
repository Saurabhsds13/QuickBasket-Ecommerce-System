import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function OrderConfirmationPage() {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get orderId from navigation state
  const orderId = location.state?.orderId;

  useEffect(() => {
    clearCart(); // clear cart after placing order
  }, [clearCart]);

  if (!orderId) {
    // If someone reloads /order-confirmation directly without state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Oops! No order found.</p>
          <button
            onClick={() => navigate("/AllProducts")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center px-6 py-12 font-sans">
      {/* Success Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-green-200 animate-ping"></div>
        <div className="relative bg-green-100 text-green-600 p-6 rounded-full shadow-inner">
          <span className="material-symbols-outlined text-5xl">
            check_circle
          </span>
        </div>
      </div>

      {/* Message */}
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Thank You!</h1>
      <p className="text-gray-600 mb-6">
        Your order <span className="font-semibold">#{orderId}</span> has been
        placed successfully.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate("/AllProducts")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-lg font-medium"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
