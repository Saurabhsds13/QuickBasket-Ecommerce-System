import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">QuickBasket</h2>
          <p className="text-gray-400">
            Your trusted online grocery partner delivering essentials 
            at your doorstep with speed and reliability.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-green-400">Home</Link></li>
            <li><Link to="/products" className="hover:text-green-400">Products</Link></li>
            <li><Link to="/about" className="hover:text-green-400">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-green-400">Contact Us</Link></li>
          </ul>
        </div>

        {/* Categories (static for now, can be dynamic later from API) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-green-400">Fruits & Vegetables</a></li>
            <li><a href="#" className="hover:text-green-400">Dairy & Bakery</a></li>
            <li><a href="#" className="hover:text-green-400">Snacks & Beverages</a></li>
            <li><a href="#" className="hover:text-green-400">Household Items</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-green-400"><Facebook /></a>
            <a href="#" className="hover:text-green-400"><Twitter /></a>
            <a href="#" className="hover:text-green-400"><Instagram /></a>
            <a href="#" className="hover:text-green-400"><Linkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} QuickBasket. All Rights Reserved.
      </div>
    </footer>
  );
}
