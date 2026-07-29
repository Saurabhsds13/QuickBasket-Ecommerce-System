import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { getCategories, getBestSellingProducts, getTopRatedProducts, getMyOrders } from "../services/api";
import { getRecentlyViewedProducts } from "../hooks/useRecentlyViewed";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [buyAgainProducts, setBuyAgainProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cartItems, cartCount, total } = useCart();
  const { isAuthenticated } = useAuth();
  const categoryScrollRef = useRef(null);
  const recentScrollRef = useRef(null);
  const buyAgainScrollRef = useRef(null);

  const getCategoryEmoji = (name) => {
    const n = name.toLowerCase();
    if (n.includes("electronic")) return "📱";
    if (n.includes("fashion")) return "👕";
    if (n.includes("home") || n.includes("kitchen")) return "🏠";
    if (n.includes("sport") || n.includes("fitness")) return "🏋️";
    if (n.includes("book")) return "📚";
    if (n.includes("beauty") || n.includes("personal care")) return "✨";
    if (n.includes("toy") || n.includes("game")) return "🎮";
    if (n.includes("auto")) return "🚗";
    if (n.includes("health") || n.includes("wellness")) return "💊";
    if (n.includes("pet")) return "🐾";
    if (n.includes("fruit") || n.includes("vegetable")) return "🥬";
    if (n.includes("dairy") || n.includes("egg")) return "🥛";
    if (n.includes("beverage") || n.includes("drink")) return "☕";
    if (n.includes("snack") || n.includes("bakery")) return "🍪";
    if (n.includes("staple") || n.includes("grain")) return "🌾";
    if (n.includes("frozen") || n.includes("ready")) return "🧊";
    if (n.includes("meat") || n.includes("seafood")) return "🍖";
    if (n.includes("personal")) return "🧴";
    if (n.includes("household") || n.includes("essential")) return "🧹";
    if (n.includes("baby") || n.includes("kid")) return "🍼";
    return "🛒";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bestSellingRes, topRatedRes, categoriesRes] = await Promise.all([
          getBestSellingProducts(8),
          getTopRatedProducts(8),
          getCategories(),
        ]);
        setFeaturedProducts(bestSellingRes.data);
        setTopRatedProducts(topRatedRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setRecentlyViewed(getRecentlyViewedProducts());
  }, []);

  // Fetch "Buy Again" products from past orders
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchBuyAgain = async () => {
      try {
        const res = await getMyOrders();
        const orders = res.data || [];
        // Extract unique products from all past orders
        const productsMap = new Map();
        orders.forEach((order) => {
          if (order.items) {
            order.items.forEach((item) => {
              if (!productsMap.has(item.productId)) {
                productsMap.set(item.productId, {
                  id: item.productId,
                  name: item.productName,
                  primaryImageUrl: item.productImage,
                  price: item.price / (item.quantity || 1),
                });
              }
            });
          }
        });
        setBuyAgainProducts(Array.from(productsMap.values()).slice(0, 12));
      } catch (err) {
        // silently fail — not critical
      }
    };
    fetchBuyAgain();
  }, [isAuthenticated]);

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction * 300, behavior: "smooth" });
    }
  };

  return (
    <main>
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4">
        <HeroBanner />
      </div>

      {/* Cart Reminder — only if items in cart */}
      {cartCount > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-8">
          <div className="flex items-center justify-between bg-white border border-green-200 rounded-2xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {cartCount} {cartCount === 1 ? "item" : "items"} in your bag
                </p>
                <p className="text-xs text-gray-500">Total: ₹{total.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/cart")}
              className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-green-700 transition flex-shrink-0"
            >
              View Bag
            </button>
          </div>
        </section>
      )}

      {/* Popular Search Chips */}
      <section className="max-w-7xl mx-auto px-4 mt-8 md:mt-10">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Popular searches</p>
        <div className="flex flex-wrap gap-2">
          {["Milk", "Rice", "Atta", "Eggs", "Paneer", "Bread", "Fruits", "Coffee", "Diapers", "Chips"].map((term) => (
            <button
              key={term}
              onClick={() => navigate(`/AllProducts?search=${encodeURIComponent(term)}`)}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* Categories — Horizontal scroll */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
            <button
              onClick={() => navigate("/AllProducts")}
              className="text-sm text-green-600 font-medium hover:text-green-700 transition flex items-center gap-1"
            >
              View all
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scrollContainer(categoryScrollRef, -1)}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md hover:shadow-lg hover:border-green-300 transition"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollContainer(categoryScrollRef, 1)}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md hover:shadow-lg hover:border-green-300 transition"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={categoryScrollRef}
            className="flex gap-4 overflow-x-auto px-4 md:px-[max(1rem,calc((100%-80rem)/2+1rem))] pb-2 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(`/AllProducts?category=${category.id}`)}
                className="flex-shrink-0 flex flex-col items-center gap-2.5 w-[90px] group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-2xl transition-colors duration-200 group-hover:scale-105 transform">
                  {getCategoryEmoji(category.name)}
                </div>
                <span className="text-xs font-medium text-gray-700 group-hover:text-green-700 text-center leading-tight transition-colors line-clamp-2">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-10 md:py-14 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Best Sellers</h2>
              <p className="text-sm text-gray-500 mt-1">Most loved by our customers</p>
            </div>
            <button
              onClick={() => navigate("/AllProducts")}
              className="hidden md:flex items-center gap-1 text-sm text-green-600 font-medium hover:text-green-700 transition"
            >
              See all
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-5 bg-gray-100 rounded w-1/4 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">No products available yet.</p>
          )}

          <div className="md:hidden text-center mt-8">
            <button
              onClick={() => navigate("/AllProducts")}
              className="px-6 py-2.5 text-sm font-medium text-gray-900 border border-gray-300 rounded-full hover:border-green-500 hover:text-green-700 transition"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Limited time offer</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Free Delivery on orders above ₹500
              </h3>
              <p className="text-green-100 mt-2 text-sm">Plus get ₹150 off on orders above ₹1000</p>
            </div>
            <button
              onClick={() => navigate("/AllProducts")}
              className="flex-shrink-0 px-7 py-3 bg-white text-green-700 font-semibold text-sm rounded-full hover:bg-green-50 transition shadow-lg"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Top Rated */}
      {topRatedProducts.length > 0 && (
        <section className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Top Rated</h2>
                <p className="text-sm text-gray-500 mt-1">Highest rated by our community</p>
              </div>
              <button
                onClick={() => navigate("/AllProducts")}
                className="hidden md:flex items-center gap-1 text-sm text-green-600 font-medium hover:text-green-700 transition"
              >
                View all
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {topRatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Buy Again — Horizontal scroll (logged in users only) */}
      {buyAgainProducts.length > 0 && (
        <section className="py-10 md:py-14 bg-green-50/30 border-t border-green-100/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Buy Again</h2>
                <p className="text-sm text-gray-500 mt-1">Quickly reorder your favorites</p>
              </div>
              <button
                onClick={() => navigate("/orders")}
                className="text-sm text-green-600 font-medium hover:text-green-700 transition flex items-center gap-1"
              >
                Order history
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => scrollContainer(buyAgainScrollRef, -1)}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md hover:shadow-lg hover:border-green-300 transition"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollContainer(buyAgainScrollRef, 1)}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md hover:shadow-lg hover:border-green-300 transition"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div
              ref={buyAgainScrollRef}
              className="flex gap-4 overflow-x-auto px-4 md:px-[max(1rem,calc((100%-80rem)/2+1rem))] pb-2 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {buyAgainProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[180px] md:w-[220px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed — Horizontal scroll */}
      {recentlyViewed.length > 0 && (
        <section className="py-10 md:py-14 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Recently Viewed</h2>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => scrollContainer(recentScrollRef, -1)}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md hover:shadow-lg hover:border-green-300 transition"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollContainer(recentScrollRef, 1)}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md hover:shadow-lg hover:border-green-300 transition"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div
              ref={recentScrollRef}
              className="flex gap-4 overflow-x-auto px-4 md:px-[max(1rem,calc((100%-80rem)/2+1rem))] pb-2 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {recentlyViewed.slice(0, 10).map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[180px] md:w-[220px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits — Compact inline row */}
      <section className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: "🚀", title: "20-Min Delivery", sub: "Lightning fast to your door" },
              { icon: "🍎", title: "Farm Fresh", sub: "Directly from local farms" },
              { icon: "🔄", title: "Easy Returns", sub: "7-day hassle-free returns" },
              { icon: "🛡️", title: "Secure Payment", sub: "100% protected checkout" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-4">
        <NewsletterSignup />
      </div>
    </main>
  );
}
