import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner.jsx";
import BenefitsSection from "../components/BenefitsSection.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { getProducts, getCategories } from "../services/api";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setFeaturedProducts(productsRes.data.slice(0, 8)); // Show first 8
        setCategories(categoriesRes.data.slice(0, 6)); // Show first 6
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4">
      {/* Hero */}
      <HeroBanner />

      {/* Categories Section */}
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 mt-1">Browse our wide selection of fresh groceries</p>
          </div>
          <button
            onClick={() => navigate("/AllProducts")}
            className="hidden md:flex items-center gap-1 text-green-600 font-medium hover:text-green-700 transition"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(`/AllProducts?category=${category.id}`)}
                className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-green-50 group-hover:bg-green-100 rounded-2xl flex items-center justify-center transition-colors duration-300">
                  <span className="text-2xl">🛒</span>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 text-center transition-colors">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        ) : (
          !loading && <p className="text-gray-400 text-center">No categories available</p>
        )}
      </section>

      {/* Featured Products */}
      <section className="py-16 border-t border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-1">Handpicked fresh items just for you</p>
          </div>
          <button
            onClick={() => navigate("/AllProducts")}
            className="hidden md:flex items-center gap-1 text-green-600 font-medium hover:text-green-700 transition"
          >
            See All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-100"></div>
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-5 bg-gray-100 rounded w-1/4 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-12">No products available yet.</p>
        )}

        {/* Mobile view all button */}
        <div className="md:hidden text-center mt-8">
          <button
            onClick={() => navigate("/AllProducts")}
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition"
          >
            View All Products
          </button>
        </div>
      </section>

      {/* Benefits */}
      <BenefitsSection />

      {/* Stats Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10K+", label: "Happy Customers" },
            { value: "500+", label: "Products" },
            { value: "20 min", label: "Avg Delivery" },
            { value: "4.8★", label: "App Rating" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-green-600">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />
    </main>
  );
}
