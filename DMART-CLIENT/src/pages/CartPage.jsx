import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Shopping Bag
          </h1>

          <p className="text-gray-500 mt-2">
            {cartItems.length} items ready for checkout
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">
              You're ₹350 away from FREE delivery
            </span>
            <span>₹650 / ₹1000</span>
          </div>

          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: "65%" }}
            />
          </div>
        </div>
        {cartItems.length === 0 ? (
          // Empty Cart Layout
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="flex flex-col justify-center items-start space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl text-green-600 animate-pulse">
                  🛒
                </span>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 tracking-wide">
                  Your Cart is Empty
                </h1>
              </div>
              <p className="text-gray-600 text-base md:text-lg">
                You haven’t added any groceries yet. Start shopping and fill
                your cart with fresh produce!
              </p>
              <button
                onClick={() => navigate("/allproducts")}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
              >
                Start Shopping
              </button>
            </div>

            {/* Right Column: Illustration with Floating Items */}
            <div className="flex justify-center items-center relative">
              {/* Floating shapes in background */}
              <div className="absolute w-60 h-60 bg-green-100 rounded-full -top-10 -right-10 opacity-20 animate-pulse-slow"></div>
              <div className="absolute w-40 h-40 bg-yellow-100 rounded-full -bottom-10 left-10 opacity-20 animate-pulse-slow"></div>

              {/* Main empty cart image */}
              <img
                src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                alt="Empty Cart Illustration"
                className="w-64 h-64 object-contain animate-float-slow z-10"
              />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
              {cartItems.map((item) => (
                <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.primaryImageUrl
                          ? `${API_BASE_URL}${item.primaryImageUrl}`
                          : "/fallback-product.png"
                      }
                      alt={item.name}
                      className="w-28 h-28 rounded-2xl object-cover rounded-lg"
                    />

                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>

                  </div>
                  <p className="text-xs text-green-600">
                    In Stock
                  </p>

                  <p className="text-xs text-gray-500">
                    Delivery by Tomorrow
                  </p>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="mt-4 text-red-600 hover:underline"
              >
                Remove All
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="flex justify-between mb-2 text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between mb-2 text-gray-700">
                <span>Delivery</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>

              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <p className="text-green-700 font-semibold">
                  🎉 You saved ₹300 on this order
                </p>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Proceed to Checkout →
              </button>
              <div className="mt-5 space-y-2 text-sm text-gray-500">
                <p>✓ Secure Payments</p>
                <p>✓ Easy Returns</p>
                <p>✓ 100% Fresh Products</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
