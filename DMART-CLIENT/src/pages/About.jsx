import { motion } from "framer-motion";
import CountUp from "react-countup";

import {
  Zap,
  Leaf,
  ShieldCheck,
  Handshake,
} from "lucide-react";

export default function About() {
  const team = [
    {
      name: "Saurabh Sonawane",
      role: "Founder & CEO",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
      name: "Aarav Mehta",
      role: "Chief Technology Officer",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
    },
    {
      name: "Priya Sharma",
      role: "Head of Marketing",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Rohan Desai",
      role: "Operations Manager",
      image: "https://randomuser.me/api/portraits/men/80.jpg",
    },
  ];

  const values = [
    {
      icon: Zap,
      title: "Speed",
      description:
        "Delivering essentials in minutes so customers spend less time waiting.",
    },
    {
      icon: Leaf,
      title: "Freshness",
      description:
        "Quality-checked products sourced and delivered at peak freshness.",
    },
    {
      icon: ShieldCheck,
      title: "Trust",
      description:
        "Transparent pricing and dependable service every day.",
    },
    {
      icon: Handshake,
      title: "Sustainability",
      description:
        "Supporting local suppliers and responsible sourcing.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "10K+", label: "Products Available" },
    { value: "25+", label: "Cities Served" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  };
  return (
    <section className="bg-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-24">
        <div className="max-w-5xl">
          <span className="inline-flex items-center px-4 py-2 rounded-full border border-green-200 bg-green-50 text-green-700 text-sm font-medium">
            About QuickBasket
          </span>

          <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-gray-900">
            Making grocery shopping
            <span className="block text-green-600">
              effortless for modern families.
            </span>
          </h1>

          <p className="mt-8 text-xl text-gray-600 max-w-3xl leading-relaxed">
            We believe everyday essentials should be available faster,
            fresher, and more reliably. QuickBasket exists to remove
            friction from grocery shopping and give people more time
            for what truly matters.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-12 pb-28"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="rounded-[40px] bg-gradient-to-br from-green-50 to-white border border-green-100 p-10 lg:p-16">
          <h2 className="text-4xl font-bold text-center mb-14">
            Our Journey
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                year: "2025",
                title: "Founded",
                desc: "Started with a vision to simplify grocery shopping.",
              },
              {
                year: "2026",
                title: "10K Customers",
                desc: "Built trust through reliable service and fresh products.",
              },
              {
                year: "2027",
                title: "Multi-City Expansion",
                desc: "Expanded operations to serve more communities.",
              },
              {
                year: "2028",
                title: "50K+ Deliveries",
                desc: "Delivering happiness to thousands every day.",
              },
            ].map((item) => (
              <div key={item.year}>
                <div className="text-green-600 font-bold text-2xl">
                  {item.year}
                </div>

                <h3 className="font-semibold text-xl mt-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 mt-3">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-12 pb-28"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
          <div className="relative overflow-hidden rounded-[40px] group">

  <img
    src="https://images.unsplash.com/photo-1542838132-92c53300491e"
    alt="Fresh Groceries"
    className="
      h-[550px]
      w-full
      object-cover
      transition-all
      duration-700
      group-hover:scale-110
    "
  />

  <div
    className="
      absolute
      inset-0
      bg-gradient-to-t
      from-black/40
      via-transparent
      to-transparent
    "
  />

  <div
    className="
      absolute
      bottom-8
      left-8
      bg-white/90
      backdrop-blur-md
      rounded-3xl
      p-5
      shadow-2xl
    "
  >
    <p className="text-3xl font-bold text-green-600">
      15 Min
    </p>

    <p className="text-gray-600">
      Average Delivery
    </p>
  </div>

  <div
    className="
      absolute
      top-8
      right-8
      bg-white/90
      backdrop-blur-md
      rounded-2xl
      px-5
      py-3
      shadow-xl
    "
  >
    ⭐ 4.9 Rating
  </div>

</div>

            <div className="absolute bottom-6 left-6 bg-white rounded-3xl p-5 shadow-xl">
              <div className="text-2xl font-bold text-green-600">
                15 Min
              </div>
              <div className="text-gray-500 text-sm">
                Average Delivery Time
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Our Mission
            </h2>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              At QuickBasket, we're building a future where quality
              groceries are always within reach.
            </p>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Through technology, efficient logistics, and a relentless
              focus on customer experience, we make grocery shopping
              simple, fast, and dependable.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Values */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-12 pb-28"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">
            What We Stand For
          </h2>

          <p className="text-gray-500 mt-4">
            The principles that guide every decision we make.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((value) => {
  const Icon = value.icon;

  return (
    <div
      key={value.title}
      className="
      bg-white
      border
      border-gray-100
      rounded-[32px]
      p-8
      hover:shadow-2xl
      hover:-translate-y-2
      transition-all
      duration-300
    "
    >
      <div
        className="
        w-14
        h-14
        rounded-2xl
        bg-green-50
        flex
        items-center
        justify-center
        mb-6
      "
      >
        <Icon
          size={28}
          className="text-green-600"
        />
      </div>

      <h3 className="text-xl font-bold mb-3">
        {value.title}
      </h3>

      <p className="text-gray-600">
        {value.description}
      </p>
    </div>
  );
})}
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-12 pb-28"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-[32px] p-8 text-center"
            >
              <div className="text-5xl font-bold text-green-600">
                {stat.label === "Happy Customers" && (
                  <CountUp end={50} suffix="K+" duration={3} />
                )}

                {stat.label === "Products Available" && (
                  <CountUp end={10} suffix="K+" duration={3} />
                )}

                {stat.label === "Cities Served" && (
                  <CountUp end={25} suffix="+" duration={3} />
                )}

                {stat.label === "Average Rating" && (
                  <>4.9★</>
                )}
              </div>

              <div className="text-gray-600 mt-3">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Vision */}
      <section className="max-w-5xl mx-auto px-6 text-center pb-28">
        <h2 className="text-5xl font-bold leading-tight">
          Building the future of
          <span className="block text-green-600">
            hyperlocal commerce.
          </span>
        </h2>

        <p className="mt-8 text-xl text-gray-600 leading-relaxed">
          Our vision is to become the most trusted platform for
          everyday essentials, empowering local communities while
          creating a faster and more sustainable shopping experience.
        </p>
      </section>

      {/* Team */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-12 pb-28"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">
            Meet Our Leadership
          </h2>

          <p className="text-gray-500 mt-4">
            Passionate people building exceptional experiences.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="group overflow-hidden rounded-[32px] bg-white border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition duration-700"
                />
              </div>

              <div className="p-6">
                <h3 className="font-bold text-xl">
                  {member.name}
                </h3>

                <p className="mt-2 text-green-600">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="rounded-[40px] bg-gradient-to-r from-green-600 to-emerald-500 text-white text-center py-20 px-8">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Ready to experience QuickBasket?
          </h2>

          <p className="mt-6 text-lg opacity-90 max-w-2xl mx-auto">
            Fresh groceries, transparent pricing, and delivery
            designed around your lifestyle.
          </p>

          <button className="mt-8 px-8 py-4 bg-white text-green-700 rounded-2xl font-semibold hover:scale-105 transition">
            Start Shopping
          </button>
        </div>
      </section>
    </section>
  );
}