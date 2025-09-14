import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import {
  getProducts,
  getCategories,
  getProductsByCategory,
} from "../services/api";

const AllProducts = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productsRes.data);
        setCategories(
          categoriesRes.data.sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    try {
      setIsLoading(true);
      setSelectedCategory(categoryId);
      const res = await getProductsByCategory(categoryId);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching category products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
      <main className="flex flex-1 container mx-auto py-8 px-4 md:px-8 lg:px-12">
        {/* Sidebar */}
        {/* <aside className="w-55 hidden md:block pr-6 border-r border-gray-100 sticky top-24 self-start">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
            Categories
          </h3>
          <ul className="space-y-1">
            {categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.id}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium
              ${
                selectedCategory === category.id
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
              }`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.name}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-sm">No categories</li>
            )}
          </ul>
        </aside> */}
        <aside className="w-52 hidden md:block pr-6 border-r border-gray-100 sticky top-20 self-start">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Categories
          </h3>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
            }`}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content Area - Product Grid */}
        <div className="flex-1 pl-0 md:pl-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            All Products
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl text-gray-500">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No products available.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
