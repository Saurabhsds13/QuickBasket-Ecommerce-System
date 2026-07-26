import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FloatingChat from "./components/FloatingChat";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AllProducts from "./pages/AllProducts.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AddressesPage from "./pages/AddressesPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import InvoicePage from "./pages/InvoicePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/AllProducts" element={<AllProducts />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Protected Routes — require authentication */}
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
        </div>
        <FloatingChat />
        <Footer />
      </div>
    </Router>
  );
}
