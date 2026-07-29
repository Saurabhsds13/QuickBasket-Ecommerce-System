import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { placeOrder, applyCoupon, createPaymentOrder, verifyPayment, getAddresses } from "../services/api";
import { useToast } from "../components/Toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function CheckoutPage() {
  const { cartItems, subtotal, deliveryCharge, savings, total, clearCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [showCoupon, setShowCoupon] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await getAddresses();
        setAddresses(res.data);
        const defaultAddr = res.data.find((a) => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr.id);
        else if (res.data.length > 0) setSelectedAddress(res.data[0].id);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      } finally {
        setAddressLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress && addresses.length > 0) {
      toast.error("Please select a delivery address");
      return;
    }
    if (addresses.length === 0) {
      toast.error("Please add a delivery address before placing order");
      return;
    }
    try {
      setPlacing(true);
      const orderRes = await placeOrder();
      const orderId = orderRes.data?.id;

      if (paymentMethod === "COD") {
        clearCart();
        navigate("/order-confirmation", { state: { orderId } });
        return;
      }

      const paymentRes = await createPaymentOrder(orderId);
      const { razorpayOrderId, amount, currency, keyId } = paymentRes.data;

      const options = {
        key: keyId,
        amount: amount * 100,
        currency,
        name: "QuickBasket",
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId,
            });
            clearCart();
            navigate("/order-confirmation", { state: { orderId } });
          } catch {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        prefill: { name: "Customer", email: "customer@example.com" },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: function () {
            toast.warning("Payment cancelled. Order saved as pending.");
            navigate("/orders");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order.");
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
  const selectedAddr = addresses.find((a) => a.id === selectedAddress);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Nothing to checkout</h2>
        <p className="text-sm text-gray-500 mb-6">Add some items to your bag first.</p>
        <button
          onClick={() => navigate("/AllProducts")}
          className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-green-700 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/cart" className="text-gray-500 hover:text-gray-900 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Checkout</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column — Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-semibold text-gray-900">Delivery Address</h2>
                <Link to="/addresses" className="text-xs text-green-600 hover:text-green-700 font-medium">
                  Manage
                </Link>
              </div>

              {addressLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                  <div className="w-4 h-4 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin" />
                  Loading...
                </div>
              ) : addresses.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <p className="text-sm text-gray-500 mb-3">No delivery address saved yet</p>
                  <Link
                    to="/addresses"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Address
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`relative flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddress === addr.id
                          ? "border-green-500 bg-green-50/30"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="sr-only"
                      />
                      {/* Selected indicator */}
                      {selectedAddress === addr.id && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                            {addr.type || "Home"}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 font-medium leading-snug">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {addr.city}, {addr.state} — {addr.postalCode}
                        </p>
                        {addr.phone && (
                          <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-4">Payment Method</h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "ONLINE"
                      ? "border-green-500 bg-green-50/30"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pay Online</p>
                    <p className="text-[11px] text-gray-500">UPI · Cards · Net Banking</p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-green-500 bg-green-50/30"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-[11px] text-gray-500">Pay when it arrives</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Promo Code — collapsible */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <button
                onClick={() => setShowCoupon(!showCoupon)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l3-3m0 0l3 3m-3-3v8.25M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                  </svg>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {couponResult ? `Promo applied: ${couponResult.code}` : "Have a promo code?"}
                  </span>
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${showCoupon ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showCoupon && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-5 py-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="mt-2 text-xs text-red-500">{couponError}</p>}
                  {couponResult && (
                    <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Saving ₹{couponResult.discountAmount} on this order
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Order Summary (sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">

              {/* Summary Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-[15px] font-semibold text-gray-900 mb-4">
                  Order Summary
                  <span className="text-gray-400 font-normal ml-1">({cartItems.length})</span>
                </h2>

                {/* Items mini list */}
                <div className="space-y-3 max-h-52 overflow-y-auto mb-5 pr-1 pt-1 pl-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.primaryImageUrl ? `${API_BASE_URL}${item.primaryImageUrl}` : "https://placehold.co/48x48/f3f4f6/9ca3af?text=·"}
                          alt={item.name}
                          className="w-11 h-11 rounded-lg object-cover bg-gray-100"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/f3f4f6/9ca3af?text=·"; }}
                        />
                        <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-gray-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 truncate">{item.name}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
                      {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings</span>
                      <span>−₹{savings}</span>
                    </div>
                  )}
                  {couponResult && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo</span>
                      <span>−₹{couponResult.discountAmount}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivering to mini-card */}
              {selectedAddr && (
                <div className="bg-green-50/60 rounded-xl px-4 py-3 border border-green-100">
                  <p className="text-[11px] font-medium text-green-700 uppercase tracking-wide mb-0.5">Delivering to</p>
                  <p className="text-sm text-gray-900">{selectedAddr.line1}, {selectedAddr.city} — {selectedAddr.postalCode}</p>
                </div>
              )}

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full py-4 text-[15px] font-semibold text-white bg-gray-900 rounded-full hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-900/10"
              >
                {placing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Place Order — ₹${finalTotal.toFixed(2)}`
                )}
              </button>

              {/* Policy note */}
              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                By placing this order you agree to our terms. Cancel within 15 min for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
