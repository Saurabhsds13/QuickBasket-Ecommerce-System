import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 with silent refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh/login/register requests
      if (originalRequest.url?.includes("/auth/")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) {
        // No refresh token — force logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new Event("auth-expired"));
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: storedRefreshToken,
        });

        const { token: newToken } = res.data;
        localStorage.setItem("token", newToken);

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new Event("auth-expired"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ============ AUTH ============
export const login = (username, password) =>
  api.post("/auth/login", { username, password });

export const register = (username, email, password, phone) =>
  api.post("/auth/register", { username, email, password, phone });

export const refreshToken = (refreshToken) =>
  api.post("/auth/refresh", { refreshToken });

export const logoutAPI = (refreshToken) =>
  api.post("/auth/logout", { refreshToken });

// ============ USER PROFILE ============
export const getMyProfile = () => api.get("/users/me");

export const updateProfile = (data) => api.put("/users/me", data);

export const deleteAccount = () => api.delete("/users/me");

// ============ PRODUCTS (Public) ============
export const getProducts = () => api.get("/public/products");

export const getProductById = (id) => api.get(`/public/products/${id}`);

export const getCategories = () => api.get("/public/categories");

export const getProductsByCategory = (categoryId) =>
  api.get("/public/products/category", { params: { categoryId } });

export const searchProducts = (params) =>
  api.get("/public/products/search", { params });

// ============ PRODUCT REVIEWS (Public read, Auth write) ============
export const getProductReviews = (productId) =>
  api.get(`/public/products/${productId}/reviews`);

export const getProductRating = (productId) =>
  api.get(`/public/products/${productId}/rating`);

export const addReview = (productId, rating, comment) =>
  api.post("/user/reviews", { productId, rating, comment });

export const deleteReview = (reviewId) =>
  api.delete(`/user/reviews/${reviewId}`);

// ============ CART (Authenticated) ============
export const getCart = () => api.get("/public/cart");

export const addToCartAPI = (productId, quantity = 1) =>
  api.post("/public/cart/add", { productId, quantity });

export const removeFromCartAPI = (productId) =>
  api.delete(`/public/cart/remove/${productId}`);

// ============ ORDERS (Authenticated) ============
export const placeOrder = () => api.post("/user/orders/place");

export const getMyOrders = () => api.get("/user/orders");

export const getOrderById = (orderId) => api.get(`/user/orders/${orderId}`);

export const cancelOrder = (orderId, reason) => api.put(`/user/orders/${orderId}/cancel`, { reason });

// ============ WISHLIST (Authenticated) ============
export const getWishlist = () => api.get("/user/wishlist");

export const addToWishlist = (productId) =>
  api.post(`/user/wishlist/${productId}`);

export const removeFromWishlist = (productId) =>
  api.delete(`/user/wishlist/${productId}`);

export const checkWishlist = (productId) =>
  api.get(`/user/wishlist/${productId}/check`);

// ============ ADDRESSES (Authenticated) ============
export const getAddresses = () => api.get("/user/addresses");

export const addAddress = (data) => api.post("/user/addresses", data);

export const updateAddress = (id, data) => api.put(`/user/addresses/${id}`, data);

export const deleteAddress = (id) => api.delete(`/user/addresses/${id}`);

// ============ COUPONS (Authenticated) ============
export const applyCoupon = (code) =>
  api.post("/user/coupons/apply", null, { params: { code } });

// ============ PAYMENTS (Authenticated) ============
export const createPaymentOrder = (orderId) =>
  api.post(`/user/payments/create/${orderId}`);

export const verifyPayment = (data) =>
  api.post("/user/payments/verify", data);

export default api;
