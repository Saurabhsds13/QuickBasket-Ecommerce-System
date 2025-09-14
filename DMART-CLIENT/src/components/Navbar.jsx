import React, { useState } from "react";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount,cartItems, removeFromCart } = useCart();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pincode, setPincode] = useState("400076"); // Default pincode
  const [isEditingPincode, setIsEditingPincode] = useState(false); // To toggle input visibility
  const [pincodeAlert, setPincodeAlert] = useState(null); // For custom messages
  const [showAlert, setShowAlert] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handlePincodeChange = (e) => {
    // Basic validation to ensure only numbers and max 6 digits
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPincode(value);
      if (showAlert) setShowAlert(false); // Hide alert if user starts typing again
    }
  };

  const handlePincodeSubmit = () => {
    if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
      console.log("Pincode submitted:", pincode);
      setPincodeAlert({
        type: "success",
        message: `Delivery set for ${pincode} in 20 minutes!`,
      });
      setIsEditingPincode(false); // Hide input after submission
    } else {
      setPincodeAlert({
        type: "error",
        message: "Please enter a valid 6-digit pincode.",
      });
    }
    setShowAlert(true);
    // Hide the alert after a few seconds
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Pincode display area is now clickable to activate editing
  const handlePincodeDisplayClick = () => {
    if (!isEditingPincode) {
      // Only toggle to edit mode if not already editing
      setIsEditingPincode(true);
    }
  };

  // Common Pincode Display/Input Component to avoid repetition
  const PincodeSelector = ({ isMobile = false }) => (
    <div
      className={`flex items-start cursor-pointer p-1 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-300
        ${
          isMobile ? "w-full max-w-[200px] text-center" : "min-w-[200px] w-32"
        } /* Further reduced width */
        border border-gray-150 focus-within:ring-2 focus-within:ring-green-400`}
    >
      <svg
        className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        ></path>
      </svg>
      <div className="flex flex-col flex-grow ml-1.5">
        {" "}
        {/* Adjusted margin-left */}
        {/* First line: Delivering in 20 minutes! */}
        <span className="text-green-700 text-[8px] md:text-[15px] font-bold leading-tight -mt-0.9">
          {" "}
          {/* Smaller text, tighter line height */}
          Delivering in 20 min!
        </span>
        {/* Second line: Pincode */}
        <div className="flex items-center justify-between w-full">
          {isEditingPincode ? (
            <input
              type="text"
              className="bg-transparent outline-none text-gray-700 placeholder-gray-500 font-medium text-xs md:text-sm w-full"
              placeholder="Pincode"
              value={pincode}
              onChange={handlePincodeChange}
              onBlur={handlePincodeSubmit} // Submit on blur
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.target.blur(); // Trigger blur to submit
                }
              }}
              maxLength="6"
              autoFocus // Automatically focus when rendered for editing
            />
          ) : (
            <span
              onClick={handlePincodeDisplayClick}
              className="text-gray-700 font-semibold text-sm md:text-xs"
            >
              {pincode}
            </span>
          )}
          {/* No Change/Set button here, interaction is through clicking/blur/Enter */}
        </div>
      </div>
    </div>
  );

  return (
    <nav className="bg-white shadow-lg py-4 px-4 md:px-8 lg:px-16 relative z-50">
      {/*  <nav className="bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 py-4 px-4 md:px-8 lg:px-16 sticky top-0 z-50  h-[calc(100%-64px)]"> */}
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Section: Logo and Pincode */}
        <div className="flex items-center space-x-2 md:space-x-14">
          <a href="/" className="flex items-center space-x-1">
            <svg
              className="w-7 h-7 text-green-600"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <span className="text-xl font-extrabold text-gray-900 tracking-wide">
              Quick<span className="text-green-600">Basket</span>
            </span>
          </a>

          {/* Pincode Selection (Desktop) */}
          <div className="hidden md:flex items-center space-x-5 ">
            <PincodeSelector />
          </div>
        </div>

        {/* Desktop Utility Icons & Auth Buttons */}
        <div className="hidden md:flex items-center space-x-9">
          {/* Search Icon */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-200"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>

          {/* Center Section: Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
            <a
              href="/About"
              className="hover:text-green-600 transition-colors duration-200"
            >
              About Us
            </a>
            <a
              href="/Contact"
              className="hover:text-green-600 transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>

          {/* User Icon */}
          <button className="text-gray-700 hover:text-green-600 transition duration-300 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </button>

          <button
            onClick={() => setIsCartOpen(true)} // 👈 opens drawer
            className="relative text-gray-700 hover:text-green-600 transition duration-300 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </button>

          {/* Cart Drawer */}
          {isCartOpen && (
            <CartDrawer
              isOpen={isCartOpen}
              setIsOpen={setIsCartOpen}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
          )}
          {/* Single "Sign In" Button */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:from-green-600 hover:to-green-700 transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
          <AuthModal open={isAuthOpen} setOpen={setIsAuthOpen} />
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 hover:text-green-600 focus:outline-none"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Custom Pincode Alert/Message Box */}
      {showAlert && pincodeAlert && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl text-white z-[100] transition-all duration-300 ease-in-out transform
              ${pincodeAlert.type === "success" ? "bg-green-600" : "bg-red-600"}
              ${
                showAlert
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0"
              }`}
        >
          {pincodeAlert.message}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
