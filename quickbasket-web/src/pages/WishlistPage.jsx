import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../services/api";
import { useCart } from "../context/CartContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  const handleMoveToCart = async (item) => {
    await addToCart({
      id: item.productId,
      name: item.productName,
      price: item.productPrice,
      primaryImageUrl: item.productImage,
    });
    await handleRemove(item.productId);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-12 md:py-16">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Wishlist</h1>
          {items.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State — clean and minimal */
          <div className="flex flex-col items-center justify-center py-24 md:py-32">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 text-center max-w-sm mb-8">
              Save items you love to your wishlist. Review them anytime and easily move them to your cart.
            </p>
            <button
              onClick={() => navigate("/AllProducts")}
              className="px-8 py-3 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white border border-gray-150 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-gray-200/60 transition-all duration-300"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Image */}
                <div
                  className="aspect-square bg-gray-50 flex items-center justify-center p-6 cursor-pointer"
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  <img
                    src={
                      item.productImage
                        ? `${API_BASE_URL}${item.productImage}`
                        : "https://placehold.co/300x300/f3f4f6/9ca3af?text=No+Image"
                    }
                    alt={item.productName}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/f3f4f6/9ca3af?text=No+Image"; }}
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3
                      className="text-sm font-medium text-gray-900 line-clamp-1 cursor-pointer hover:text-green-700 transition-colors"
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      {item.productName}
                    </h3>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      ₹{item.productPrice?.toFixed(2)}
                    </p>
                  </div>

                  {/* Move to Cart */}
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-green-700 active:scale-[0.98] transition-all"
                  >
                    Move to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
