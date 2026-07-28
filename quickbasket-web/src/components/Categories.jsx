const categories = [
  { id: 1, name: "Fruits", icon: "🍎" },
  { id: 2, name: "Vegetables", icon: "🥦" },
  { id: 3, name: "Dairy", icon: "🥛" },
  { id: 4, name: "Beverages", icon: "🧃" },
  { id: 5, name: "Snacks", icon: "🍪" },
  { id: 6, name: "Bakery", icon: "🥐" },
  { id: 7, name: "Meat", icon: "🍗" },
  { id: 8, name: "Frozen", icon: "❄️" },
];

export default function Categories() {
  return (
    <section className="mt-4 px-4">
      <h2 className="text-xl font-semibold mb-2">All Categories</h2>
      <div className="flex space-x-4 overflow-x-auto py-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex-shrink-0 bg-white p-4 rounded-2xl shadow-md flex flex-col items-center cursor-pointer hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">{cat.icon}</div>
            <span className="text-sm font-medium">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
