const benefits = [
  {
    icon: "🍎",
    title: "Farm-Fresh Products",
    description: "Hand-picked fruits and vegetables delivered directly from local farms.",
    color: "bg-red-50",
  },
  {
    icon: "⚡",
    title: "20-Min Delivery",
    description: "Lightning-fast delivery right to your doorstep, every single time.",
    color: "bg-yellow-50",
  },
  {
    icon: "🛡️",
    title: "Quality Guaranteed",
    description: "Only the best quality products. Not happy? Get a full refund.",
    color: "bg-blue-50",
  },
  {
    icon: "🌱",
    title: "Eco-Friendly",
    description: "Sustainable packaging and support for local farming communities.",
    color: "bg-green-50",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Why Choose QuickBasket
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          We're committed to making grocery shopping effortless, affordable, and sustainable.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className="group relative bg-white rounded-2xl border border-gray-100 p-7 text-center hover:border-green-200 hover:shadow-xl hover:shadow-green-50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`w-14 h-14 mx-auto mb-5 flex items-center justify-center text-2xl ${benefit.color} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
              {benefit.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {benefit.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
