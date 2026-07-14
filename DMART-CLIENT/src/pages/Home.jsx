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

  // Map category names to relevant emojis and colors
  const getCategoryStyle = (name, index) => {
    const n = name.toLowerCase();
    const styles = [
      { emoji: "🥬", bg: "bg-green-50", iconBg: "bg-green-100" },
      { emoji: "🍎", bg: "bg-red-50", iconBg: "bg-red-100" },
      { emoji: "🥛", bg: "bg-blue-50", iconBg: "bg-blue-100" },
      { emoji: "🍞", bg: "bg-amber-50", iconBg: "bg-amber-100" },
      { emoji: "🧴", bg: "bg-purple-50", iconBg: "bg-purple-100" },
      { emoji: "🍖", bg: "bg-orange-50", iconBg: "bg-orange-100" },
      { emoji: "🍪", bg: "bg-yellow-50", iconBg: "bg-yellow-100" },
      { emoji: "🧊", bg: "bg-cyan-50", iconBg: "bg-cyan-100" },
      { emoji: "☕", bg: "bg-stone-50", iconBg: "bg-stone-100" },
      { emoji: "🧹", bg: "bg-teal-50", iconBg: "bg-teal-100" },
    ];

    // Keyword-based matching
    if (n.includes("vegetable") || n.includes("veggie") || n.includes("green"))
      return { emoji: "🥬", bg: "bg-green-50", iconBg: "bg-green-100" };
    if (n.includes("fruit"))
      return { emoji: "🍎", bg: "bg-red-50", iconBg: "bg-red-100" };
    if (n.includes("dairy") || n.includes("milk"))
      return { emoji: "🥛", bg: "bg-blue-50", iconBg: "bg-blue-100" };
    if (n.includes("bread") || n.includes("bakery") || n.includes("bake"))
      return { emoji: "🍞", bg: "bg-amber-50", iconBg: "bg-amber-100" };
    if (n.includes("meat") || n.includes("chicken") || n.includes("fish") || n.includes("seafood"))
      return { emoji: "🍖", bg: "bg-orange-50", iconBg: "bg-orange-100" };
    if (n.includes("snack") || n.includes("chip") || n.includes("biscuit"))
      return { emoji: "🍪", bg: "bg-yellow-50", iconBg: "bg-yellow-100" };
    if (n.includes("beverage") || n.includes("drink") || n.includes("juice"))
      return { emoji: "🧃", bg: "bg-pink-50", iconBg: "bg-pink-100" };
    if (n.includes("coffee") || n.includes("tea"))
      return { emoji: "☕", bg: "bg-stone-50", iconBg: "bg-stone-100" };
    if (n.includes("frozen") || n.includes("ice"))
      return { emoji: "🧊", bg: "bg-cyan-50", iconBg: "bg-cyan-100" };
    if (n.includes("clean") || n.includes("household") || n.includes("detergent"))
      return { emoji: "🧹", bg: "bg-teal-50", iconBg: "bg-teal-100" };
    if (n.includes("personal") || n.includes("care") || n.includes("hygiene") || n.includes("beauty"))
      return { emoji: "🧴", bg: "bg-purple-50", iconBg: "bg-purple-100" };
    if (n.includes("rice") || n.includes("grain") || n.includes("dal") || n.includes("pulse") || n.includes("atta"))
      return { emoji: "🌾", bg: "bg-lime-50", iconBg: "bg-lime-100" };
    if (n.includes("oil") || n.includes("ghee") || n.includes("masala") || n.includes("spice"))
      return { emoji: "🫒", bg: "bg-emerald-50", iconBg: "bg-emerald-100" };
    if (n.includes("baby") || n.includes("infant"))
      return { emoji: "🍼", bg: "bg-pink-50", iconBg: "bg-pink-100" };
    if (n.includes("pet"))
      return { emoji: "🐾", bg: "bg-amber-50", iconBg: "bg-amber-100" };
    if (n.includes("organic") || n.includes("natural"))
      return { emoji: "🌿", bg: "bg-emerald-50", iconBg: "bg-emerald-100" };
    if (n.includes("noodle") || n.includes("pasta") || n.includes("instant"))
      return { emoji: "🍜", bg: "bg-orange-50", iconBg: "bg-orange-100" };
    if (n.includes("sweet") || n.includes("chocolate") || n.includes("candy"))
      return { emoji: "🍫", bg: "bg-rose-50", iconBg: "bg-rose-100" };
    if (n.includes("egg"))
      return { emoji: "🥚", bg: "bg-yellow-50", iconBg: "bg-yellow-100" };

    // Fallback — cycle through styles based on index
    return styles[index % styles.length];
  };

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
        <div className="flex items-center justify-between mb-10">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((category, index) => {
              const categoryStyle = getCategoryStyle(category.name, index);
              return (
                <button
                  key={category.id}
                  onClick={() => navigate(`/AllProducts?category=${category.id}`)}
                  className="group relative flex flex-col items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${categoryStyle.bg}`} />

                  {/* Icon */}
                  <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${categoryStyle.iconBg} group-hover:scale-110`}>
                    <span className="text-3xl">{categoryStyle.emoji}</span>
                  </div>

                  {/* Name */}
                  <span className="relative text-sm font-semibold text-gray-800 group-hover:text-gray-900 text-center transition-colors leading-tight">
                    {category.name}
                  </span>

                  {/* Arrow indicator on hover */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            })}
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
