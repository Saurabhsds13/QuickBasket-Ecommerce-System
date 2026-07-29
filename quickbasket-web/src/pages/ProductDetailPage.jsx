import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getProductById,
  getProductReviews,
  getProductRating,
  addReview,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const { addProduct: addToRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef(null);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    if (isAuthenticated) {
      checkIfInWishlist();
    }
    window.scrollTo(0, 0);
  }, [id, isAuthenticated]);

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);
      setProduct(res.data);
      addToRecentlyViewed(res.data);
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const [reviewsRes, ratingRes] = await Promise.all([
        getProductReviews(id),
        getProductRating(id),
      ]);
      setReviews(reviewsRes.data);
      setAvgRating(ratingRes.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const checkIfInWishlist = async () => {
    try {
      const res = await checkWishlist(id);
      setInWishlist(res.data);
    } catch (err) {}
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to use wishlist");
      return;
    }
    try {
      if (inWishlist) {
        await removeFromWishlist(id);
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(id);
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to bag");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setReviewError("Please sign in to write a review");
      return;
    }
    setReviewSubmitting(true);
    setReviewError("");
    try {
      await addReview(Number(id), reviewRating, reviewComment);
      setReviewComment("");
      setReviewRating(5);
      fetchReviews();
      toast.success("Review submitted");
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleImageMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const inCart = cartItems.find((item) => item.id === product?.id);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-lg text-gray-500 mb-4">Product not found.</p>
        <button
          onClick={() => navigate("/AllProducts")}
          className="px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const imageUrl = product.primaryImageUrl
    ? `${API_BASE_URL}${product.primaryImageUrl}`
    : "https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image";

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-gray-900 transition">Home</Link>
            <span>/</span>
            <Link to="/AllProducts" className="hover:text-gray-900 transition">Products</Link>
            {product.categoryName && (
              <>
                <span>/</span>
                <Link to={`/AllProducts?category=${product.categoryId || ""}`} className="hover:text-gray-900 transition">
                  {product.categoryName}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-8 md:py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Left: Image */}
          <div className="relative">
            <div
              ref={imageRef}
              className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden cursor-zoom-in relative"
              onMouseEnter={() => setImageZoomed(true)}
              onMouseLeave={() => setImageZoomed(false)}
              onMouseMove={handleImageMouseMove}
            >
              <img
                src={imageUrl}
                alt={product.name}
                className={`max-w-[85%] max-h-[85%] object-contain transition-transform duration-300 ${
                  imageZoomed ? "scale-150" : "scale-100"
                }`}
                style={imageZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image"; }}
              />
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-3 hidden lg:block">Hover to zoom</p>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            {/* Category */}
            {product.categoryName && (
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                {product.categoryName}
              </p>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(avgRating) ? "text-yellow-400" : "text-gray-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {avgRating > 0 ? avgRating.toFixed(1) : "0"} · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">₹{product.price?.toFixed(2)}</span>
              <span className="text-sm text-gray-500">incl. of all taxes</span>
            </div>

            {/* Stock */}
            <div className="mt-3">
              {product.stockQuantity > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-green-700 font-medium">In Stock</span>
                  {product.stockQuantity <= 10 && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-medium">
                      Only {product.stockQuantity} left
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-6 text-[15px] text-gray-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100 my-6" />

            {/* Actions */}
            <div className="space-y-3">
              {!inCart ? (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity <= 0}
                  className="w-full py-4 text-[15px] font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add to Bag
                </button>
              ) : (
                <div className="flex items-center justify-between bg-gray-100 rounded-full px-4 py-2">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-lg font-medium hover:bg-gray-50 transition"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold text-gray-900">{inCart.quantity} in bag</span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-lg font-medium hover:bg-gray-50 transition"
                  >
                    +
                  </button>
                </div>
              )}

              <button
                onClick={handleWishlistToggle}
                className={`w-full py-4 text-[15px] font-medium rounded-full border transition-all ${
                  inWishlist
                    ? "border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100"
                    : "border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className={`w-5 h-5 ${inWishlist ? "fill-red-500 text-red-500" : "fill-none text-gray-600"}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {inWishlist ? "Saved to Wishlist" : "Save to Wishlist"}
                </span>
              </button>
            </div>

            {/* Delivery info */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span>Free delivery on orders above ₹500</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span>Easy 7-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span>100% genuine products</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Add to Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-3 z-40 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-gray-500">Price</p>
          <p className="text-lg font-bold text-gray-900">₹{product.price?.toFixed(2)}</p>
        </div>
        {!inCart ? (
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0}
            className="px-8 py-3 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition disabled:opacity-40"
          >
            Add to Bag
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1.5">
            <button onClick={() => updateQuantity(product.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-sm">−</button>
            <span className="font-semibold text-sm">{inCart.quantity}</span>
            <button onClick={() => updateQuantity(product.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-sm">+</button>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              Reviews ({reviews.length})
            </h2>
            {avgRating > 0 && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">{avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Write Review */}
          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-2xl p-6 mb-10">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Write a review</h3>

              {reviewError && (
                <p className="text-sm text-red-600 mb-3">{reviewError}</p>
              )}

              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-0.5"
                  >
                    <svg
                      className={`w-6 h-6 transition ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts on this product..."
                rows={3}
                className="w-full px-4 py-3 text-sm border-0 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-none"
              />

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="mt-3 px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition disabled:opacity-50"
              >
                {reviewSubmitting ? "Posting..." : "Post Review"}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No reviews yet. Be the first to share your thoughts.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs">
                          {review.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{review.username}</p>
                        <p className="text-[11px] text-gray-400">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          }) : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= review.rating ? "text-yellow-400" : "text-gray-200"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 leading-relaxed ml-11">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
