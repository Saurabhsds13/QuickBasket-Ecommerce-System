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

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/AllProducts" element={<AllProducts />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/order-confirmation"
              element={<OrderConfirmationPage />}
            />
          </Routes>
        </div>
        <FloatingChat />
        <Footer />
      </div>
    </Router>
  );
}
