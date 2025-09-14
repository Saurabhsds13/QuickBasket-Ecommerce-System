import { useState } from "react";
import HeroBanner from "../components/HeroBanner.jsx";
import Categories from "../components/Categories.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import BenefitsSection from "../components/BenefitsSection.jsx";
import PromotionsSection from "../components/PromotionsSection.jsx";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <main className="max-w-7xl mx-auto mt-4 px-4">
      <HeroBanner />
      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {/* Categories Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          Explore Our Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Category Card 1: Fresh Produce */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden transform hover:-translate-y-2 cursor-pointer">
            <img
              src="https://placehold.co/600x400/9AE6B4/2D3748?text=Fresh+Produce"
              alt="Fresh Produce"
              className="w-full h-48 object-cover rounded-t-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/9AE6B4/2D3748?text=Image+Not+Found";
              }}
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fresh Produce
              </h3>
              <p className="text-gray-600 text-sm">
                Organic fruits, seasonal vegetables, herbs
              </p>
              <button className="mt-5 w-full bg-green-600 text-white py-2.5 px-4 rounded-full hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500">
                Shop Produce
              </button>
            </div>
          </div>

          {/* Category Card 2: Dairy & Bakery */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden transform hover:-translate-y-2 cursor-pointer">
            <img
              src="https://placehold.co/600x400/BEE3F8/2D3748?text=Dairy+%26+Bakery"
              alt="Dairy & Bakery"
              className="w-full h-48 object-cover rounded-t-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/BEE3F8/2D3748?text=Image+Not+Found";
              }}
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Dairy & Bakery
              </h3>
              <p className="text-gray-600 text-sm">
                Fresh milk, artisan breads, pastries, eggs
              </p>
              <button className="mt-5 w-full bg-green-600 text-white py-2.5 px-4 rounded-full hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500">
                Shop Dairy
              </button>
            </div>
          </div>

          {/* Category Card 3: Pantry Staples */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden transform hover:-translate-y-2 cursor-pointer">
            <img
              src="https://placehold.co/600x400/FEF3C7/2D3748?text=Pantry+Staples"
              alt="Pantry Staples"
              className="w-full h-48 object-cover rounded-t-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/FEF3C7/2D3748?text=Image+Not+Found";
              }}
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pantry Staples
              </h3>
              <p className="text-gray-600 text-sm">
                Grains, spices, oils, pasta, canned goods
              </p>
              <button className="mt-5 w-full bg-green-600 text-white py-2.5 px-4 rounded-full hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500">
                Shop Pantry
              </button>
            </div>
          </div>

          {/* Category Card 4: Beverages */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden transform hover:-translate-y-2 cursor-pointer">
            <img
              src="https://placehold.co/600x400/D1FAE5/2D3748?text=Beverages"
              alt="Beverages"
              className="w-full h-48 object-cover rounded-t-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/D1FAE5/2D3748?text=Image+Not+Found";
              }}
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Beverages
              </h3>
              <p className="text-gray-600 text-sm">
                Juices, sodas, coffee, tea, water
              </p>
              <button className="mt-5 w-full bg-green-600 text-white py-2.5 px-4 rounded-full hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500">
                Shop Beverages
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Products Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#F4F9F6]">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Our Best Sellers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Product Card Template */}
          {[
            {
              title: "Organic Gala Apples",
              category: "Fresh Produce",
              price: "$3.99/lb",
              img: "https://placehold.co/600x600/FCA5A5/ffffff?text=Organic+Apples",
            },
            {
              title: "Rustic Sourdough Loaf",
              category: "Freshly Baked",
              price: "$5.49",
              img: "https://placehold.co/600x600/A7F3D0/ffffff?text=Artisanal+Bread",
            },
            {
              title: "Large Free-Range Eggs",
              category: "Dairy & Eggs",
              price: "$4.25/dozen",
              img: "https://placehold.co/600x600/FDBA74/ffffff?text=Free-Range+Eggs",
            },
            {
              title: "Extra Virgin Olive Oil",
              category: "Pantry Essentials",
              price: "$12.99",
              img: "https://placehold.co/600x600/B2F5EA/ffffff?text=Olive+Oil",
            },
          ].map((product, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border hover:border-green-200"
            >
              <img
                src={product.img}
                alt={product.title}
                className="w-full h-64 object-cover rounded-t-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/600x600/cccccc/ffffff?text=Image+Not+Found";
                }}
              />
              <div className="p-5 flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm">{product.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-green-700 font-bold px-3 py-1 rounded-full bg-green-100">
                    {product.price}
                  </span>
                  <button className="bg-gradient-to-r from-green-500 to-green-600 text-white py-1.5 px-4 rounded-full text-sm shadow-md hover:scale-105 transition-transform duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <BenefitsSection />
      <PromotionsSection />
      <NewsletterSignup />
    </main>
  );
}
