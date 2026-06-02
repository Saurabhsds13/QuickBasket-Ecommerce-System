import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl mx-4 my-6">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-green-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

      <div className="relative container mx-auto px-8 lg:px-16 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Delivering in 20 minutes
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Fresh Groceries,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                Delivered Fast
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Get your favorite groceries delivered to your doorstep in minutes.
              Fresh produce, pantry staples, and more — all at great prices.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate("/AllProducts")}
                className="group flex items-center gap-2 bg-green-600 text-white font-semibold text-base rounded-xl py-3.5 px-8 hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30 hover:-translate-y-0.5"
              >
                Shop Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                onClick={() => navigate("/about")}
                className="flex items-center gap-2 bg-white text-gray-700 font-semibold text-base rounded-xl py-3.5 px-8 border border-gray-200 hover:border-green-300 hover:text-green-700 transition-all duration-300 hover:-translate-y-0.5"
              >
                Learn More
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Free delivery over ₹500
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Fresh guarantee
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-3xl rotate-6 scale-105"></div>
              <img
                alt="Fresh groceries"
                className="relative w-full max-w-md rounded-3xl shadow-2xl object-cover"
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=500&fit=crop"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x500/d1fae5/166534?text=Fresh+Groceries";
                }}
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">🚀</div>
                <div>
                  <p className="text-xs text-gray-500">Delivery time</p>
                  <p className="font-bold text-gray-800">20 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
