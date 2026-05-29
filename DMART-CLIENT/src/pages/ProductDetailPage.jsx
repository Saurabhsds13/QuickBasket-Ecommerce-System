import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);

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
  }, [id, isAuthenticated]);

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);
      setProduct(res.data);
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
    } catch (err) {
      // ignore
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to use wishlist");
      return;
    }
    try {
      if (inWishlist) {
        await removeFromWishlist(id);
        setInWishlist(false);
      } else {
        await addToWishlist(id);
        setInWishlist(true);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
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
      fetchReviews(); // refresh
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const inCart = cartItems.find((item) => item.id === product?.id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-gray-500 mb-4">Product not found.</p>
        <button
          onClick={() => navigate("/AllProducts")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const imageUrl = product.primaryImageUrl
    ? `${API_BASE_URL}${product.primaryImageUrl}`
    : "/fallback-product.png";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-green-600">Home</a>
          <span className="mx-2">/</span>
          <a href="/AllProducts" className="hover:text-green-600">Products</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-sm p-8">
          {/* Image */}
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-8">
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-96 object-contain"
              onError={(e) => { e.target.src = "/fallback-product.png"; }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              {product.categoryName && (
                <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                  {product.categoryName}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${star <= Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {avgRating > 0 ? `${avgRating} / 5` : "No ratings yet"} ({reviews.length} reviews)
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description || "No description available."}
              </p>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-green-700">₹{product.price?.toFixed(2)}</span>
                {product.stockQuantity > 0 ? (
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                    In Stock ({product.stockQuantity})
                  </span>
                ) : (
                  <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {!inCart ? (
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stockQuantity <= 0}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center justify-center gap-4 bg-gray-100 py-3 rounded-xl">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center text-lg hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold">{inCart.quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center text-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              )}

              <button
                onClick={handleWishlistToggle}
                className={`w-full py-3 rounded-xl font-medium border transition ${
                  inWishlist
                    ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {inWishlist ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>

          {/* Write Review Form */}
          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>

              {reviewError && (
                <p className="text-sm text-red-600 mb-3">{reviewError}</p>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`text-2xl ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 transition`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="mt-3 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700 font-semibold text-sm">
                          {review.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">{review.username}</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    }) : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
