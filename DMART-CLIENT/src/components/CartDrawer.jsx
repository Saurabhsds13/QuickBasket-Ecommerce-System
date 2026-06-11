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
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-[60] ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] lg:w-[460px]
bg-white
shadow-[0_0_40px_rgba(0,0,0,0.12)] z-[70] flex flex-col transform transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Shopping Bag
            </h2>

            <p className="text-sm text-gray-500">
              {cartItems.length} items
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <b>X</b>
          </button>
        </div>

        <div
          className="mx-4 mt-4 rounded-xl bg-green-50 border border-green-100 p-3"
        >
          <p className="text-sm font-medium text-green-700">
            🚚 Free delivery on this order
          </p>
        </div>
        {/* Items */}
        <div className="flex-1 p-5 overflow-y-auto">
          {cartItems.length === 0 ? (
           <div className="h-full flex flex-col justify-center items-center">
  <div className="text-6xl mb-4">
    🛍️
  </div>

  <h3 className="font-semibold text-lg">
    Your bag is empty
  </h3>

  <p className="text-sm text-gray-500 mt-2">
    Add products you love and they'll appear here.
  </p>
</div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="mb-3 rounded-2xl border border-gray-100 p-3 hover:shadow-md transition-all"
              >
                <img
                  src={
                    item.primaryImageUrl
                      ? `${API_BASE_URL}${item.primaryImageUrl}`
                      : "/fallback-product.png"
                  }
                  alt={item.name}
                 className="w-20 h-20 rounded-xl object-cover bg-gray-100"
                />

                <div className="flex-1 px-3">
                  <h3  className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                  <p className="text-sm text-gray-600">₹{item.price}</p>
                </div>

                <div className="flex items-center rounded-full border bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded-l-full"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded-r-full"
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
            <div className="space-y-2">

          
            <div className="flex justify-between">
  <span>Subtotal</span>
  <span>₹{total}</span>
</div>

<div className="flex justify-between">
  <span>Delivery</span>
  <span className="text-green-600">
    FREE
  </span>
</div>
<div className="flex justify-between text-lg font-bold">
  <span>Total</span>
  <span>₹{total}</span>
</div>
            
            <button
              onClick={clearCart}
              className="w-full mb-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
              Remove All
            </button>
            
                </div>
            <button
              onClick={() => {
                setIsOpen(false); // close drawer
                navigate("/cart"); // go to cart page
              }}
              className="
 w-full
 h-12
 rounded-xl
 bg-black
 text-white
 font-medium
 hover:opacity-90
 transition
 "
              >
              Secure Checkout →
            </button>
            <button
 className="
 w-full
 h-12
 rounded-xl
 border
 border-gray-300
 font-medium
 "
>
 View Cart
</button>
          </div>
        )}
      </div>
    </>
  );
}
