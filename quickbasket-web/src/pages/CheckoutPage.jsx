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

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await getAddresses();
        setAddresses(res.data);
        // Auto-select default address
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
      // Step 1: Place order in backend
      const orderRes = await placeOrder();
      const orderId = orderRes.data?.id;

      if (paymentMethod === "COD") {
        // Cash on Delivery — just confirm
        clearCart();
        navigate("/order-confirmation", { state: { orderId } });
        return;
      }

      // Step 2: Create Razorpay payment order
      const paymentRes = await createPaymentOrder(orderId);
      const { razorpayOrderId, amount, currency, keyId } = paymentRes.data;

      // Step 3: Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount * 100, // in paise
        currency: currency,
        name: "QuickBasket",
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          // Step 4: Verify payment
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderId,
            });
            clearCart();
            navigate("/order-confirmation", { state: { orderId } });
          } catch (err) {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
        },
        theme: {
          color: "#16a34a",
        },
        modal: {
          ondismiss: function () {
            toast.warning("Payment cancelled. Your order is saved as pending.");
            navigate("/orders");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Failed to place order:", err);
      toast.error(err.response?.data?.message || "Failed to place order. Please try again.");
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
            {/* Delivery Address */}
            <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. Delivery Address
              </h2>
              {addressLoading ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  Loading addresses...
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-3">No saved addresses found.</p>
                  <Link
                    to="/addresses"
                    className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition"
                  >
                    + Add Address
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedAddress === addr.id
                          ? "border-green-400 bg-green-50/50 ring-1 ring-green-200"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {addr.type || "HOME"}
                          </span>
                          {addr.isDefault && (
                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-800 font-medium">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
                        </p>
                        <p className="text-sm text-gray-500">
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        {addr.phone && (
                          <p className="text-xs text-gray-400 mt-1">📞 {addr.phone}</p>
                        )}
                      </div>
                    </label>
                  ))}
                  <Link
                    to="/addresses"
                    className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium mt-2"
                  >
                    + Add new address
                  </Link>
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:border-green-500 transition cursor-pointer">
                  <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === "ONLINE"} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span className="text-gray-700">💳 Pay Online (Razorpay)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:border-green-500 transition cursor-pointer">
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span className="text-gray-700">💵 Cash on Delivery</span>
                </label>
              </div>
            </section>

            {/* Coupon Code */}
            <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                3. Apply Coupon
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
                4. Bill Summary
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
                5. Order Items ({cartItems.length})
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
