import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="text-xl font-bold text-white">QuickBasket</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted online grocery partner. Fresh produce, pantry staples,
              and daily essentials delivered to your doorstep in minutes.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-gray-400 hover:text-green-400 transition-colors">Home</Link></li>
              <li><Link to="/AllProducts" className="text-sm text-gray-400 hover:text-green-400 transition-colors">All Products</Link></li>
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-green-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-green-400 transition-colors">Contact</Link></li>
              <li><Link to="/orders" className="text-sm text-gray-400 hover:text-green-400 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Categories</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">Fruits & Vegetables</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">Dairy & Bakery</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">Snacks & Beverages</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">Household Items</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">Personal Care</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">123 Green Street, Mumbai, India 400076</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">support@quickbasket.in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} QuickBasket. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
