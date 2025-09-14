import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function Contact() {
  return (
    <section className="bg-gradient-to-r from-green-50 to-white min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-700 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We’d love to hear from you! Whether you have a question about your order,
            need assistance, or just want to give feedback — our team is ready to help.
          </p>
        </div>

        {/* Contact Section */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info Sidebar */}
          <div className="bg-white shadow-md rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600">
              Reach out to us anytime — we usually respond within a few hours.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-6 h-6 text-green-600" />
                <span className="text-gray-700">+91 7972227009</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-green-600" />
                <span className="text-gray-700">saurabhsds13@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-green-600" />
                <span className="text-gray-700">
                  Mumbai, Maharashtra, India
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-green-600 hover:text-green-700">
                <Facebook />
              </a>
              <a href="#" className="text-green-600 hover:text-green-700">
                <Twitter />
              </a>
              <a href="#" className="text-green-600 hover:text-green-700">
                <Instagram />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-white shadow-md rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Send Us a Message
            </h2>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            ></textarea>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
              Send Message
            </button>
          </form>
        </div>

        {/* Google Map */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Our Location
          </h2>
          <iframe
            className="w-full h-72 rounded-xl shadow-md"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609828454!2d72.74109964409414!3d19.082197839474873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c63076c17c4f%3A0xf1c8c1f5cf3aebf2!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
