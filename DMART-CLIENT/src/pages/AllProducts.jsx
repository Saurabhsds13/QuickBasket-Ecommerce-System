import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import {
  getProducts,
  getCategories,
  getProductsByCategory,
  searchProducts,
} from "../services/api";

const AllProducts = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Price filter state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy, sortDir]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      if (searchQuery || selectedCategory || minPrice || maxPrice) {
        // Use search endpoint
        const params = {
          keyword: searchQuery || undefined,
          categoryId: selectedCategory || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sortBy,
          sortDir,
          page: 0,
          size: 50,
        };
        const res = await searchProducts(params);
        setProducts(res.data.content || res.data);
      } else {
        const res = await getProducts();
        setProducts(res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleFilter = () => {
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt");
    setSortDir("desc");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
      <main className="flex flex-1 container mx-auto py-8 px-4 md:px-8 lg:px-12">
        {/* Sidebar */}
        <aside className="w-56 hidden md:block pr-6 border-r border-gray-100 sticky top-20 self-start">
          {/* Categories */}
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Categories
          </h3>
          <ul className="space-y-1 mb-6">
            <li>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${!selectedCategory
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  }`}
              >
                All Products
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${selectedCategory === category.id
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                    }`}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>

          {/* Price Filter */}
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Price Range
          </h3>
          <div className="space-y-2 mb-4">
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
            <button
              onClick={handleFilter}
              className="w-full py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
            >
              Apply Filter
            </button>
          </div>

          {/* Sort */}
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Sort By
          </h3>
          <select
            value={`${sortBy}-${sortDir}`}
            onChange={(e) => {
              const [s, d] = e.target.value.split("-");
              setSortBy(s);
              setSortDir(d);
            }}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-green-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={handleClearFilters}
            className="w-full mt-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition"
          >
            Clear All Filters
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 pl-0 md:pl-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
            </h2>
            {products.length > 0 && (
              <span className="text-sm text-gray-500">{products.length} products</span>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading products...</p>
              </div>
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
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products found.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-green-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
