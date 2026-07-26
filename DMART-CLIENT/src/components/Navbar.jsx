import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } from "../services/api";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notification count on auth change
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getUnreadNotificationCount();
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleMarkOneRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, seen: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

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
                    <Link to="/addresses" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600">My Addresses</Link>
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

            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={handleNotificationClick}
                  className="relative text-gray-700 hover:text-green-600 transition focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-green-600 hover:text-green-700 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => !notif.seen && handleMarkOneRead(notif.id)}
                            className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${
                              !notif.seen ? "bg-green-50/50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notif.seen ? "bg-green-500" : "bg-transparent"}`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notif.seen ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                                  }) : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
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
                <Link to="/addresses" className="block px-3 py-2 text-gray-700 hover:text-green-600">My Addresses</Link>
                <Link to="/orders" className="block px-3 py-2 text-gray-700 hover:text-green-600">My Orders</Link>
                <Link to="/wishlist" className="block px-3 py-2 text-gray-700 hover:text-green-600">Wishlist</Link>
                <Link to="/notifications" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                  Notifications {unreadCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>}
                </Link>
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
