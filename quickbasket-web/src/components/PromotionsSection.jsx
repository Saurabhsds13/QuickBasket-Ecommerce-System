const promotions = [
  {
    title: "Spring Fresh Picks",
    description:
      "Discover seasonal fruits and vegetables at unbeatable prices, hand-picked for freshness.",
    imageUrl: "/images/spring-fresh.png",
    ctaText: "Shop Now",
  },
  {
    title: "Organic Pantry Essentials",
    description:
      "Stock up your pantry with our premium organic staples and enjoy healthy cooking every day.",
    imageUrl: "/images/pantry-essentials.png",
    ctaText: "Shop Pantry",
  },
];

const PromotionsSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-green-50 via-white to-green-50 overflow-hidden">
      {promotions.map((promo, idx) => (
        <div
          key={idx}
          className={`flex flex-col lg:flex-row items-center lg:justify-between max-w-6xl mx-auto px-6 lg:px-20 mb-16 ${
            idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
          }`}
        >
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
              {promo.title}
            </h3>
            <p className="text-gray-600 mb-6">{promo.description}</p>
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
              {promo.ctaText}
            </button>
          </div>

          {/* Image Content */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end relative">
            <img
              src={promo.imageUrl}
              alt={promo.title}
              className="w-full max-w-md rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      ))}

      {/* Floating Geometric Shapes */}
      <div className="absolute top-10 left-10 w-12 h-12 bg-green-200 opacity-20 rounded-full animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-20 h-20 bg-green-300 opacity-15 rounded-full animate-float-delay pointer-events-none"></div>

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
      `}</style>
    </section>
  );
};

export default PromotionsSection;
