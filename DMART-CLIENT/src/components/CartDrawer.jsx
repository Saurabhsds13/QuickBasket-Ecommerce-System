import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function CartDrawer({ isOpen, setIsOpen }) {
  const { cartItems, updateQuantity, clearCart, total } = useCart();
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">🛒 Your Cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            ✖
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 p-5 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-3"
              >
                <img
                  src={
                    item.primaryImageUrl
                      ? `${API_BASE_URL}${item.primaryImageUrl}`
                      : "/fallback-product.png"
                  }
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded"
                />

                <div className="flex-1 px-3">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">₹{item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t bg-gray-50">
            <div className="flex justify-between mb-4 font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button
              onClick={clearCart}
              className="w-full mb-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
              Remove All
            </button>
            <button
              onClick={() => {
                setIsOpen(false); // close drawer
                navigate("/cart"); // go to cart page
              }}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Go to Cart Page →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
