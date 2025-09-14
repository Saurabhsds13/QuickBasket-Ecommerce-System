import { useState } from "react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // Integrate with newsletter API here
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <section className="relative bg-[#F4F9F6] py-20 px-6 lg:px-20 flex justify-center items-center overflow-hidden">
      {/* Floating Leaf Decorations */}
      <div className="absolute top-10 left-5 w-6 h-6 bg-green-400 rounded-full opacity-30 animate-float-slow pointer-events-none"></div>
      <div className="absolute top-32 right-10 w-8 h-8 bg-green-500 rounded-full opacity-20 animate-float pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/2 w-10 h-10 bg-green-300 rounded-full opacity-25 animate-float-delay pointer-events-none"></div>

      {/* Subtle Wave Background */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[rgba(76,175,80,0.1)] to-transparent pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl w-full text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
          Stay Fresh with Our Weekly Updates
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl">
          Subscribe to get exclusive deals, fresh arrivals, and the latest
          recipes delivered directly to your inbox.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="w-full flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:flex-1 rounded-full border border-gray-300 py-3 px-5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Floating Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 10s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 8s ease-in-out 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default NewsletterSignup;
