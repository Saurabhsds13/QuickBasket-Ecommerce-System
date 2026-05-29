import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { placeOrder, applyCoupon } from "../services/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function CheckoutPage() {
  const { cartItems, subtotal, deliveryCharge, savings, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [couponError, setCouponError] = useState("");

  const handlePlaceOrder = async () => {
    try {
      setPlacing(true);
      const res = await placeOrder();
      const orderId = res.data?.id || res.data?.orderId;
      clearCart();
      navigate("/order-confirmation", { state: { orderId } });
    } catch (err) {
      console.error("Failed to place order:", err);
      alert(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponResult(null);
    try {
      const res = await applyCoupon(couponCode.trim());
      setCouponResult(res.data);
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon code.");
    }
  };

  const finalTotal = couponResult ? couponResult.finalTotal : total;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-6 md:px-12 lg:px-20 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">🛒 Checkout</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate("/AllProducts")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Payment Method */}
            <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:border-green-500 transition cursor-pointer">
                  <input type="radio" name="payment" defaultChecked />
                  <span className="text-gray-700">💳 Credit / Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:border-green-500 transition cursor-pointer">
                  <input type="radio" name="payment" />
                  <span className="text-gray-700">📱 UPI / Wallets</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:border-green-500 transition cursor-pointer">
                  <input type="radio" name="payment" />
                  <span className="text-gray-700">💵 Cash on Delivery</span>
                </label>
              </div>
            </section>

            {/* Coupon Code */}
            <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. Apply Coupon
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="mt-2 text-sm text-red-600">{couponError}</p>
              )}
              {couponResult && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Coupon <strong>{couponResult.code}</strong> applied!
                    You save ₹{couponResult.discountAmount}
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Bill Summary */}
            <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                3. Bill Summary
              </h2>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span>-₹{savings}</span>
                  </div>
                )}
                {couponResult && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({couponResult.code})</span>
                    <span>-₹{couponResult.discountAmount}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-lg text-gray-800">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </section>

            {/* Order Items */}
            <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                4. Order Items ({cartItems.length})
              </h2>
              <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.primaryImageUrl
                            ? `${API_BASE_URL}${item.primaryImageUrl}`
                            : "/fallback-product.png"
                        }
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-800">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? "Placing Order..." : "Place Order →"}
              </button>
            </section>

            {/* Cancellation Policy */}
            <section className="bg-gradient-to-r from-green-50 to-white rounded-2xl p-6 border border-green-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                📌 Cancellation Policy
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Orders can be cancelled within{" "}
                <span className="font-medium">15 minutes</span> of placing them.
                Refunds will be processed to your original payment method.
              </p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
