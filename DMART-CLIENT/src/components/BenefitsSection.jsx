const benefits = [
  {
    icon: "🍎",
    title: "Farm-Fresh Products",
    description:
      "Hand-picked fruits and vegetables delivered directly from farms.",
  },
  {
    icon: "⚡",
    title: "Fast Delivery",
    description:
      "Get your groceries delivered within hours, right at your doorstep.",
  },
  {
    icon: "🛡️",
    title: "Premium Quality",
    description: "Only the best quality products for your healthy lifestyle.",
  },
  {
    icon: "🌱",
    title: "Sustainable Practices",
    description: "Eco-friendly packaging and support for local farmers.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Diagonal Split Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50 via-white to-green-100 rotate-2 transform origin-top-left pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-12">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl shadow-lg p-8 text-center transition-transform transform hover:-translate-y-3 hover:shadow-2xl relative overflow-hidden"
            >
              {/* Animated Icon Bubble */}
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-3xl bg-green-100 rounded-full animate-bounce-slow">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Floating Circles */}
      <div className="absolute top-10 left-10 w-10 h-10 bg-green-200 opacity-20 rounded-full animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-green-300 opacity-15 rounded-full animate-float-delay pointer-events-none"></div>

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
        .animate-float-slow {
          animation: float 12s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 10s ease-in-out 2s infinite;
        }
        .animate-bounce-slow {
          animation: bounce 2.5s infinite;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
};

export default BenefitsSection;
