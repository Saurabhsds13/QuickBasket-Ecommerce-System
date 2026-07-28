export default function FeaturedCategories({ categories }) {
  return (
    <section className="mt-6 px-4">
      <h2 className="text-xl font-semibold mb-2">Featured Categories</h2>
      <div className="flex space-x-4 overflow-x-auto py-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex-shrink-0 w-40 h-40 bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer relative hover:shadow-lg transition"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2">
              {cat.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
