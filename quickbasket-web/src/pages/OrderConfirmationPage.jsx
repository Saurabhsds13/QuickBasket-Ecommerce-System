import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderConfirmationPage() {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cleared = useRef(false);

  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!cleared.current) {
      clearCart();
      cleared.current = true;
    }
  }, []);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">No order found.</p>
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center px-6 py-12">
      {/* Animated check */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-600 text-lg mb-1">Thank you for shopping with QuickBasket</p>
      <p className="text-gray-500 mb-8">
        Order <span className="font-semibold text-gray-700">#{orderId}</span> confirmed
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate("/AllProducts")}
          className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition font-semibold shadow-md"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/orders")}
          className="bg-white text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-50 transition font-semibold border border-gray-200"
        >
          View My Orders
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-gray-500 px-8 py-3 rounded-xl hover:text-gray-700 transition font-medium"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
