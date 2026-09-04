import { useState, useRef } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("error");
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Floating shapes */}
        <div className="absolute top-12 left-[10%] w-3 h-3 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute top-24 right-[15%] w-2 h-2 bg-white/30 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-16 left-[20%] w-4 h-4 bg-white/10 rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/2 right-[8%] w-2.5 h-2.5 bg-emerald-300/30 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-20 right-[30%] w-3 h-3 bg-white/15 rounded-full animate-pulse delay-1000" />

        {/* Diagonal lines accent */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.04]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px)`,
        }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-[0.04]" style={{
          backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 8px, white 8px, white 9px)`,
        }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight">
            We'd Love to Hear<br className="hidden sm:block" /> From You
          </h1>
          <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about your order, need assistance, or want to
            share feedback — our team is ready to help.
          </p>
        </div>
      </div>

      {/* Contact Cards Row */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="tel:+917972227009"
            className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Call Us</h3>
            <p className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">
              +91 7972227009
            </p>
          </a>

          <a
            href="mailto:saurabh.sds.1397@gmail.com"
            className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Email Us</h3>
            <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
              saurabh.sds.1397@gmail.com
            </p>
          </a>

          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Visit Us</h3>
            <p className="text-sm text-gray-500">Mumbai, Maharashtra, India</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Working Hours</h3>
            <p className="text-sm text-gray-500">Mon - Sat, 9AM - 8PM</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Form */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Send Us a Message
              </h2>
              <p className="text-gray-500">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
            </div>

            {/* Status Banners */}
            {status === "success" && (
              <div className="flex items-start gap-3 p-4 mb-6 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Message sent!</p>
                  <p className="text-sm text-green-600 mt-0.5">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Failed to send</p>
                  <p className="text-sm text-red-600 mt-0.5">
                    Please try again or email us directly.
                  </p>
                </div>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3.5 text-sm bg-gray-50 border rounded-xl outline-none transition-all duration-200 placeholder:text-gray-400
                      ${errors.name
                        ? "border-red-300 bg-red-50/50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
                        : "border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300"
                      }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3.5 text-sm bg-gray-50 border rounded-xl outline-none transition-all duration-200 placeholder:text-gray-400
                      ${errors.email
                        ? "border-red-300 bg-red-50/50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
                        : "border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300"
                      }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300 transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  className={`w-full px-4 py-3.5 text-sm bg-gray-50 border rounded-xl outline-none transition-all duration-200 resize-none placeholder:text-gray-400
                    ${errors.message
                      ? "border-red-300 bg-red-50/50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
                      : "border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300"
                    }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-green-600/25 hover:shadow-green-600/40 transition-all duration-200"
              >
                {status === "sending" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right - Map + FAQ */}
          <div className="space-y-8">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-100">
              <iframe
                className="w-full h-72"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609828454!2d72.74109964409414!3d19.082197839474873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c63076c17c4f%3A0xf1c8c1f5cf3aebf2!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
                title="QuickBasket Location"
              ></iframe>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {[
                  { q: "How do I track my order?", a: "Go to My Orders in your account to see real-time status updates." },
                  { q: "What is the return policy?", a: "We offer hassle-free returns within 7 days of delivery for most items." },
                  { q: "How long does delivery take?", a: "Standard delivery takes 2-5 business days depending on your location." },
                  { q: "Is cash on delivery available?", a: "Yes, COD is available for orders under ₹5,000 in select areas." },
                ].map((item, i) => (
                  <details
                    key={i}
                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden"
                  >
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-gray-800 hover:text-green-700 transition-colors">
                      {item.q}
                      <svg
                        className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
