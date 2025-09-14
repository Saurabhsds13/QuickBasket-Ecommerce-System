// import { useState } from "react";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// export default function ProductCard({ product, addToCart, openQuickView }) {
//   const [hover, setHover] = useState(false);

//   if (!product) {
//     return (
//       <div className="p-4 text-red-500">⚠️ Product data not available</div>
//     );
//   }

//   const imageUrl = product.primaryImageUrl
//     ? `${API_BASE_URL}${product.primaryImageUrl}`
//     : "/fallback-product.png";

    
//   return (
//     <div
//       className="bg-white shadow-md rounded-2xl p-4 cursor-pointer relative overflow-hidden transition transform hover:scale-105 hover:shadow-lg"
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//     >
//       {/* Product Image */}
//       <img
//         src={imageUrl}
//         alt={product.name || "Product"}
//         className="w-full h-40 object-contain"
//         onError={(e) => {
//           e.currentTarget.src = "/fallback-product.png";
//         }}
//       />

//       {/* Product Info */}
//       <h3 className="text-lg font-medium mt-2">{product.name}</h3>
//       {product.categoryName && (
//         <p className="text-gray-400 text-xs">{product.categoryName}</p>
//       )}
//       <p className="text-gray-500 text-sm line-clamp-2">
//         {product.description}
//       </p>

//       <div className="flex justify-between items-center mt-2">
//         <span className="text-lg font-semibold">
//           ₹{product.price ? product.price.toFixed(2) : "N/A"}
//         </span>
//       </div>

//       {/* Hover Overlay */}
//       {hover && (
//         <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center gap-2 transition">
//           <button
//             onClick={(e) => {
//               e.stopPropagation(); // prevent card click issues
//               addToCart?.(product); // ✅ call passed addToCart
//             }}
//             className="bg-green-600 text-white px-4 py-1 rounded-xl hover:bg-green-700"
//           >
//             Add to Cart
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               openQuickView?.(product.id); // ✅ call passed quick view
//             }}
//             className="bg-white text-gray-700 px-4 py-1 rounded-xl hover:bg-gray-100"
//           >
//             Quick View
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import { useCart } from "../context/CartContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function ProductCard({ product, openQuickView }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [hover, setHover] = useState(false);

  if (!product) {
    return (
      <div className="p-4 text-red-500">⚠️ Product data not available</div>
    );
  }

  const imageUrl = product.primaryImageUrl
    ? `${API_BASE_URL}${product.primaryImageUrl}`
    : "/fallback-product.png";

  // 🔑 check if this product already exists in cart
  const inCart = cartItems.find((item) => item.id === product.id);

  return (
    <div
      className="bg-white shadow-md rounded-2xl p-4 cursor-pointer relative overflow-hidden transition transform hover:scale-105 hover:shadow-lg"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={imageUrl}
        alt={product.name || "Product"}
        className="w-full h-40 object-contain"
        onError={(e) => {
          e.target.src = "/fallback-product.png";
        }}
      />

      <h3 className="text-lg font-medium mt-2">{product.name}</h3>
      {product.categoryName && (
        <p className="text-gray-400 text-xs">{product.categoryName}</p>
      )}
      <p className="text-gray-500 text-sm">{product.description}</p>

      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-semibold">
          ₹{product.price?.toFixed(2) || "N/A"}
        </span>
      </div>

      {hover && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center gap-2 transition pointer-events-none">
          {!inCart ? (
            // 🔹 Show Add to Cart if not yet added
            <button
              onClick={() => addToCart(product)}
              className="bg-green-600 text-white px-4 py-1 rounded-xl hover:bg-green-700 pointer-events-auto"
            >
              Add to Cart
            </button>
          ) : (
            // 🔹 Show + / - if already in cart
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-md pointer-events-auto">
              <button
                onClick={() => updateQuantity(product.id, -1)}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
              >
                −
              </button>
              <span className="font-medium">{inCart.quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, 1)}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          )}
          <button
            onClick={() => openQuickView && openQuickView(product.id)}
            className="bg-white text-gray-700 px-4 py-1 rounded-xl hover:bg-gray-100 pointer-events-auto"
          >
            Quick View
          </button>
        </div>
      )}
    </div>
  );
}
