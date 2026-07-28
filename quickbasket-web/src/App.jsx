import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FloatingChat from "./components/FloatingChat";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Lazy-loaded pages for code-splitting
const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const AllProducts = lazy(() => import("./pages/AllProducts.jsx"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.jsx"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage.jsx"));
const OrdersPage = lazy(() => import("./pages/OrdersPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const AddressesPage = lazy(() => import("./pages/AddressesPage.jsx"));
const WishlistPage = lazy(() => import("./pages/WishlistPage.jsx"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage.jsx"));
const InvoicePage = lazy(() => import("./pages/InvoicePage.jsx"));

// Minimal page loader
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/AllProducts" element={<AllProducts />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />

              {/* Protected Routes */}
              <Route path="/checkout" element={
                <ProtectedRoute><CheckoutPage /></ProtectedRoute>
              } />
              <Route path="/order-confirmation" element={
                <ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><OrdersPage /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />
              <Route path="/addresses" element={
                <ProtectedRoute><AddressesPage /></ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute><WishlistPage /></ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute><NotificationsPage /></ProtectedRoute>
              } />
              <Route path="/invoice/:orderId" element={
                <ProtectedRoute><InvoicePage /></ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </div>
        <FloatingChat />
        <Footer />
      </div>
    </Router>
  );
}
