import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderConfirmationPage() {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cleared = useRef(false);
  const [showCheck, setShowCheck] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!cleared.current) {
      clearCart();
      cleared.current = true;
    }
    // Staggered animation
    setTimeout(() => setShowCheck(true), 200);
    setTimeout(() => setShowContent(true), 600);
  }, []);

  if (!orderId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 mb-6">No order found</p>
        <button
          onClick={() => navigate("/AllProducts")}
          className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-green-700 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-50/60 rounded-full blur-3xl" />
      </div>

      {/* Confetti dots (decorative) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-green-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }} />
        <div className="absolute top-[20%] right-[12%] w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-50 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "2.5s" }} />
        <div className="absolute top-[30%] left-[25%] w-2.5 h-2.5 bg-green-300 rounded-full opacity-40 animate-bounce" style={{ animationDelay: "1s", animationDuration: "3.5s" }} />
        <div className="absolute bottom-[25%] right-[20%] w-2 h-2 bg-teal-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: "0.3s", animationDuration: "2.8s" }} />
        <div className="absolute bottom-[35%] left-[15%] w-1.5 h-1.5 bg-green-500 rounded-full opacity-40 animate-bounce" style={{ animationDelay: "0.7s", animationDuration: "3.2s" }} />
        <div className="absolute top-[45%] right-[30%] w-2 h-2 bg-emerald-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: "1.2s", animationDuration: "2.6s" }} />
      </div>

      {/* Main content */}
      <div className="relative text-center max-w-md mx-auto">

        {/* Animated checkmark */}
        <div className={`mb-8 transition-all duration-700 ease-out ${showCheck ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <div className="relative inline-flex">
            {/* Outer ring pulse */}
            <div className="absolute inset-0 w-24 h-24 bg-green-200/50 rounded-full animate-ping opacity-20" />
            {/* Inner circle */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className={`transition-all duration-700 ease-out delay-200 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Order Confirmed
          </h1>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-2">
            Thank you for shopping with QuickBasket.
            <br />
            Your order is being prepared with care.
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mt-3 mb-8">
            <span className="text-xs text-gray-500">Order ID</span>
            <span className="text-sm font-bold text-gray-900">#{orderId}</span>
          </div>
        </div>

        {/* Timeline preview */}
        <div className={`transition-all duration-700 ease-out delay-500 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs font-medium text-green-700">Placed</span>
            </div>
            <div className="w-8 h-[2px] bg-gray-200" />
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
              </div>
              <span className="text-xs text-gray-400">Confirmed</span>
            </div>
            <div className="w-8 h-[2px] bg-gray-200" />
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
              </div>
              <span className="text-xs text-gray-400">Delivered</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex flex-col sm:flex-row gap-3 justify-center transition-all duration-700 ease-out delay-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <button
            onClick={() => navigate("/orders")}
            className="px-7 py-3.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-gray-900/10"
          >
            Track Order
          </button>
          <button
            onClick={() => navigate("/AllProducts")}
            className="px-7 py-3.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:border-green-400 hover:text-green-700 transition-all"
          >
            Continue Shopping
          </button>
        </div>

        {/* Subtle note */}
        <p className={`text-[11px] text-gray-400 mt-8 transition-all duration-700 ease-out delay-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
          You'll receive an order update notification when your order status changes.
        </p>
      </div>
    </div>
  );
}
