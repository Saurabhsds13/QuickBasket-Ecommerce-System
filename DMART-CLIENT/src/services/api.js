import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getProducts = () => axios.get(`${API_BASE_URL}/public/products`);

export const getCategories = () =>
  axios.get(`${API_BASE_URL}/public/categories`);

export const getProductsByCategory = (categoryId) =>
  axios.get(`${API_BASE_URL}/public/products/category`, {
    params: { categoryId },
  });

export const getCart = () => axios.get(`${API_BASE_URL}/cart`);

export const addToCart = (productId) =>
  axios.post(`${API_BASE_URL}/cart/add`, { productId });

export const removeFromCart = (productId) =>
  axios.delete(`${API_BASE_URL}/cart/remove/${productId}`);
