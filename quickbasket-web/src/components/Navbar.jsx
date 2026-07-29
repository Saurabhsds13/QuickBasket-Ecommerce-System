import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Close dropdowns on outside click
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

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  // Notifications
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/AllProducts?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/AllProducts", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-100/80 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-16">

            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Quick<span className="text-green-600">Basket</span>
              </span>
            </Link>

            {/* Center: Nav Links (desktop) */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-sm font-medium transition-colors duration-200 py-1 ${
                    location.pathname === link.to
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-green-600 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">

              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex w-10 h-10 items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200"
                aria-label="Search"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Notification Bell */}
              {isAuthenticated && (
                <div className="relative hidden md:block" ref={notifRef}>
                  <button
                    onClick={handleNotificationClick}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200"
                    aria-label="Notifications"
                  >
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 text-[15px]">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className="text-xs text-green-600 hover:text-green-700 font-medium">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-[360px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-12 text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-500">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => !notif.seen && handleMarkOneRead(notif.id)}
                              className={`px-5 py-3.5 border-b border-gray-50 cursor-pointer hover:bg-gray-50/80 transition ${!notif.seen ? "bg-green-50/30" : ""}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notif.seen ? "bg-green-500" : "bg-transparent"}`} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[13px] leading-snug ${!notif.seen ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                                    {notif.message}
                                  </p>
                                  <p className="text-[11px] text-gray-400 mt-1">
                                    {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="block text-center py-3 text-xs font-medium text-green-600 hover:bg-gray-50 border-t border-gray-100 transition"
                      >
                        View all notifications
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200 relative"
                aria-label="Cart"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* User Avatar / Sign In */}
              {isAuthenticated ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200"
                    aria-label="Account"
                  >
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Welcome back</p>
                      </div>
                      <div className="py-1">
                        <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          Profile
                        </Link>
                        <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                          Orders
                        </Link>
                        <Link to="/addresses" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          Addresses
                        </Link>
                        <Link to="/wishlist" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                          Wishlist
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="hidden md:inline-flex ml-2 px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-green-700 transition-colors duration-200"
                >
                  Sign In
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200 ml-1"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
          <div className="relative bg-white border-b border-gray-200 shadow-lg">
            <div className="max-w-3xl mx-auto px-5 py-5">
              <form onSubmit={handleSearch} className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 text-lg text-gray-900 placeholder-gray-400 bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-[55] bg-white transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "64px" }}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Mobile Search */}
          <div className="px-6 pt-6 pb-4">
            <form onSubmit={handleSearch} className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-sm text-gray-900 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:bg-white transition"
              />
            </form>
          </div>

          {/* Nav Links */}
          <div className="px-6 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3.5 text-[17px] font-medium border-b border-gray-100 transition-colors ${
                  location.pathname === link.to ? "text-green-600" : "text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User section */}
          <div className="px-6 pt-6 mt-auto pb-8">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 py-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-semibold text-sm">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500">Manage your account</p>
                  </div>
                </div>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-[15px] text-gray-700 border-b border-gray-100">Profile</Link>
                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-[15px] text-gray-700 border-b border-gray-100">Orders</Link>
                <Link to="/addresses" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-[15px] text-gray-700 border-b border-gray-100">Addresses</Link>
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-[15px] text-gray-700 border-b border-gray-100">Wishlist</Link>
                <Link to="/notifications" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-3 text-[15px] text-gray-700 border-b border-gray-100">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 py-3.5 text-[15px] font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full py-3.5 text-[15px] font-medium text-white bg-gray-900 rounded-xl hover:bg-green-700 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Drawers & Modals */}
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
      <AuthModal open={isAuthOpen} setOpen={setIsAuthOpen} />
    </>
  );
};

export default Navbar;
