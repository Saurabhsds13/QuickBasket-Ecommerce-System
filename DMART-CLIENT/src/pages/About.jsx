export default function About() {
  const team = [
    {
      name: "Saurabh Sonawane",
      role: "Founder & CEO",
      image:
        "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
      name: "Aarav Mehta",
      role: "Chief Technology Officer",
      image:
        "https://randomuser.me/api/portraits/men/76.jpg",
    },
    {
      name: "Priya Sharma",
      role: "Head of Marketing",
      image:
        "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Rohan Desai",
      role: "Operations Manager",
      image:
        "https://randomuser.me/api/portraits/men/80.jpg",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-green-50 to-white min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-700 mb-4">About QuickBasket</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are redefining grocery shopping with fast delivery, fresh products,
            and a seamless online experience—bringing your daily essentials right
            to your doorstep.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <img
            src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Groceries"
            className="rounded-2xl shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-semibold text-green-600 mb-3">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              At QuickBasket, we aim to deliver groceries within minutes while ensuring 
              quality and affordability. We believe in supporting local farmers, 
              sustainable sourcing, and providing a delightful customer experience.
            </p>

            <h2 className="text-2xl font-semibold text-green-600 mb-3">Why Choose Us?</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>⚡ Ultra-fast delivery (within 15-30 mins)</li>
              <li>🍏 Fresh & quality-checked groceries</li>
              <li>💳 Secure payments & offers</li>
              <li>📦 Easy returns & refunds</li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-700">Meet Our Team</h2>
          <p className="text-gray-600 mt-2">The people behind QuickBasket</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-green-100"
              />
              <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
              <p className="text-green-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
