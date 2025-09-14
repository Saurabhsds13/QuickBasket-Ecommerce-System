import { useEffect, useState } from "react";
import axios from "axios";
import { getProducts } from "../services/api";

export default function QuickViewModal({
  productId,
  isOpen,
  setIsOpen,
  addToCart,
}) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId || !isOpen) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await axios.get(getProducts());
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-2xl relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
        >
          ✖
        </button>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : product ? (
          <div className="flex flex-col md:flex-row p-6 gap-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full md:w-1/2 h-64 object-contain"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-500 mb-2">{product.category}</p>
                <p className="text-gray-700 mb-4">
                  {product.description || "No description available."}
                </p>
                <p className="text-lg font-bold mb-4">₹{product.price}</p>
              </div>
              <button
                onClick={() => {
                  addToCart(product);
                  setIsOpen(false);
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-red-500">Product not found.</div>
        )}
      </div>
    </div>
  );
}
