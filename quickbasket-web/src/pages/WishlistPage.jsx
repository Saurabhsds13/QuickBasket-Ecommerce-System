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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">❤️ My Wishlist</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Your wishlist is empty.</p>
            <button
              onClick={() => navigate("/AllProducts")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                <img
                  src={
                    item.productImage
                      ? `${API_BASE_URL}${item.productImage}`
                      : "/fallback-product.png"
                  }
                  alt={item.productName}
                  className="w-full h-48 object-contain bg-gray-50 p-4"
                  onError={(e) => { e.target.src = "/fallback-product.png"; }}
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 mb-1">{item.productName}</h3>
                  <p className="text-green-700 font-semibold text-lg mb-3">
                    ₹{item.productPrice?.toFixed(2)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
