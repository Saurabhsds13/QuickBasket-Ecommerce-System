import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  // Prices
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    const orderId = Math.floor(100000 + Math.random() * 900000); // stable 6-digit ID
    navigate("/order-confirmation", { state: { orderId } });
  };

  const delivery = subtotal > 500 ? 0 : 40; // free delivery if > 500
  const savings = subtotal > 800 ? 100 : 0; // demo savings
  const total = subtotal + delivery - savings;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-6 md:px-12 lg:px-20 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">🛒 Checkout</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Address Selection */}
          <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              1. Delivery Address
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:border-green-500 transition cursor-pointer">
                <input type="radio" name="address" defaultChecked />
                <span className="text-gray-700">
                  Home – 123 Green Street, City
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:border-green-500 transition cursor-pointer">
                <input type="radio" name="address" />
                <span className="text-gray-700">
                  Office – 456 Work Avenue, City
                </span>
              </label>
              <button className="mt-3 text-green-600 font-medium hover:underline">
                + Add New Address
              </button>
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              3. Payment Method
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
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Bill Summary */}
          <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              2. Bill Summary
            </h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Savings</span>
                <span>-₹{savings}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg text-gray-800">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </section>

          {/* Order Summary */}
          <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              4. Order Summary
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
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-lg"
            >
              Place Order →
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
              Refunds will be processed to your original payment method. For
              assistance, contact our support anytime.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
