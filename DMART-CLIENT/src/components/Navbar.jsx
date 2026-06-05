import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/AllProducts?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 py-3 px-4 md:px-8 lg:px-16 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-14">
            <Link to="/" className="flex items-center space-x-1">

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <span className="text-xl font-extrabold gray-900 tracking-wide">Quick
                  <span className="text-green-600">Basket</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Section */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative w-64">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Nav Links */}
            <div className="flex items-center space-x-6 text-sm font-medium text-gray-700">
              <Link to="/AllProducts" className="hover:text-green-600 transition-colors">Products</Link>
              <Link to="/About" className="hover:text-green-600 transition-colors">About</Link>
              <Link to="/Contact" className="hover:text-green-600 transition-colors">Contact</Link>
            </div>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition focus:outline-none"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-semibold text-sm">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{user?.username}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600">My Profile</Link>
                    <Link to="/orders" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600">My Orders</Link>
                    <Link to="/wishlist" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600">Wishlist</Link>
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="text-gray-700 hover:text-green-600 transition focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-700 hover:text-green-600 transition focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Sign In Button */}
            {!isAuthenticated && (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:from-green-600 hover:to-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setIsCartOpen(true)} className="relative text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={toggleMobileMenu} className="text-gray-700 hover:text-green-600 focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-green-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
            <Link to="/AllProducts" className="block px-3 py-2 text-gray-700 hover:text-green-600">Products</Link>
            <Link to="/About" className="block px-3 py-2 text-gray-700 hover:text-green-600">About</Link>
            <Link to="/Contact" className="block px-3 py-2 text-gray-700 hover:text-green-600">Contact</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:text-green-600">My Profile</Link>
                <Link to="/orders" className="block px-3 py-2 text-gray-700 hover:text-green-600">My Orders</Link>
                <Link to="/wishlist" className="block px-3 py-2 text-gray-700 hover:text-green-600">Wishlist</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600">Sign Out</button>
              </>
            ) : (
              <button
                onClick={() => { setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full bg-green-600 text-white py-2 rounded-full font-bold text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </nav>

      {/* These render outside nav to avoid z-index/overflow issues */}
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
      <AuthModal open={isAuthOpen} setOpen={setIsAuthOpen} />
    </>
  );
};

export default Navbar;
