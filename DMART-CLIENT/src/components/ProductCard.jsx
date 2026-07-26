import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function ProductCard({ product }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (!product) {
    return null;
  }

  const imageUrl = product.primaryImageUrl
    ? `${API_BASE_URL}${product.primaryImageUrl}`
    : "/fallback-product.png";

  const inCart = cartItems.find((item) => item.id === product.id);

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Container */}
      <div className="relative bg-gray-50 p-6 flex items-center justify-center h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name || "Product"}
          className="max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = "/fallback-product.png"; }}
        />

        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          {!inCart ? (
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              className="bg-white text-green-700 font-medium px-5 py-2 rounded-full text-sm shadow-lg hover:bg-green-600 hover:text-white transition-all duration-200 transform translate-y-4 group-hover:translate-y-0"
            >
              + Add to Cart
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-200">
              <button
                onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, -1); }}
                className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full text-gray-700 hover:bg-red-100 hover:text-red-600 transition"
              >
                −
              </button>
              <span className="font-semibold text-gray-800 min-w-[20px] text-center">{inCart.quantity}</span>
              <button
                onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, 1); }}
                className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full text-gray-700 hover:bg-green-100 hover:text-green-600 transition"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Stock badge */}
        {product.stockQuantity !== undefined && product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <span className="absolute top-3 left-3 bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full">
            Only {product.stockQuantity} left
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {product.categoryName && (
          <p className="text-xs font-medium text-green-600 uppercase tracking-wide">
            {product.categoryName}
          </p>
        )}
        <h3 className="font-semibold text-gray-800 text-base leading-snug line-clamp-1 group-hover:text-green-700 transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        {/* Rating */}
        {product.averageRating && product.averageRating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xs ${star <= Math.round(product.averageRating) ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-400">{product.averageRating}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price?.toFixed(2)}
          </span>
          {inCart && (
            <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
              In cart: {inCart.quantity}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
