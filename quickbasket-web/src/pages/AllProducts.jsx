import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import {
  getCategories,
  searchProducts,
} from "../services/api";

const PAGE_SIZE = 12;

const AllProducts = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryFromUrl = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl ? Number(categoryFromUrl) : null
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Price filter state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  // Mobile filter drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Sync selected category when URL param changes
  useEffect(() => {
    const urlCategory = categoryFromUrl ? Number(categoryFromUrl) : null;
    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Reset and fetch when filters change
  useEffect(() => {
    setProducts([]);
    setCurrentPage(0);
    fetchProducts(0, true);
  }, [searchQuery, selectedCategory, sortBy, sortDir]);

  const fetchProducts = async (page = 0, reset = false) => {
    try {
      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const params = {
        keyword: searchQuery || undefined,
        categoryId: selectedCategory || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy,
        sortDir,
        page,
        size: PAGE_SIZE,
      };

      const res = await searchProducts(params);
      const data = res.data;

      const newProducts = data.content || data;
      const total = data.totalElements || newProducts.length;
      const isLast = data.last !== undefined ? data.last : true;

      if (reset) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }

      setTotalElements(total);
      setHasMore(!isLast);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    fetchProducts(currentPage + 1, false);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleFilter = () => {
    setProducts([]);
    setCurrentPage(0);
    fetchProducts(0, true);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt");
    setSortDir("desc");
  };

  const activeFilterCount = [
    selectedCategory,
    minPrice,
    maxPrice,
    sortBy !== "createdAt" || sortDir !== "desc",
  ].filter(Boolean).length;

  // Group products by category (alphabetically) when no specific filters are active
  const isDefaultView = !searchQuery && !selectedCategory && !minPrice && !maxPrice && sortBy === "createdAt" && sortDir === "desc";

  const groupedProducts = useMemo(() => {
    if (!isDefaultView || products.length === 0) return null;

    const groups = {};
    products.forEach((product) => {
      const catName = product.categoryName || "Other";
      if (!groups[catName]) groups[catName] = [];
      groups[catName].push(product);
    });

    // Sort category keys alphabetically
    return Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => ({ name: key, products: groups[key] }));
  }, [products, isDefaultView]);

  // Shared filter sidebar content
  const FilterContent = () => (
    <>
      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Categories
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setIsMobileFilterOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${!selectedCategory
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                }`}
            >
              All Products
            </button>
          </li>
          {(showAllCategories ? categories : categories.slice(0, 8)).map((category) => (
            <li key={category.id}>
              <button
                onClick={() => {
                  handleCategoryClick(category.id);
                  setIsMobileFilterOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${selectedCategory === category.id
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
        {categories.length > 8 && (
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 transition-colors pl-3"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${showAllCategories ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {showAllCategories ? "Show Less" : `+${categories.length - 8} More`}
          </button>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="₹ Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition"
          />
          <span className="text-gray-300">—</span>
          <input
            type="number"
            placeholder="₹ Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition"
          />
        </div>
        <button
          onClick={() => {
            handleFilter();
            setIsMobileFilterOpen(false);
          }}
          className="w-full mt-2.5 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 active:scale-[0.98] transition-all"
        >
          Apply Price
        </button>
      </div>

      {/* Sort — only in mobile drawer */}
      <div className="md:hidden mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Sort By
        </h3>
        <select
          value={`${sortBy}-${sortDir}`}
          onChange={(e) => {
            const [s, d] = e.target.value.split("-");
            setSortBy(s);
            setSortDir(d);
          }}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition appearance-none bg-white"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          handleClearFilters();
          setIsMobileFilterOpen(false);
        }}
        className="w-full py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition"
      >
        Clear All Filters
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full shadow-xl hover:bg-green-700 active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-green-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white pt-3 pb-2 px-6 border-b border-gray-100 rounded-t-2xl">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filter & Sort</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-10">
        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8 pr-2" style={{ scrollbarWidth: "none" }}>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-100">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.name || "Category"
                    : "All Products"}
                </h1>
                {totalElements > 0 && !isLoading && (
                  <p className="text-xs text-gray-500 mt-1">
                    {products.length} of {totalElements} {totalElements === 1 ? "product" : "products"}
                  </p>
                )}
              </div>

              {/* Desktop sort */}
              <div className="hidden md:flex items-center gap-3">
                <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Sort by</span>
                <div className="relative">
                  <select
                    value={`${sortBy}-${sortDir}`}
                    onChange={(e) => {
                      const [s, d] = e.target.value.split("-");
                      setSortBy(s);
                      setSortDir(d);
                    }}
                    className="pl-3 pr-8 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:border-green-400 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="name-asc">Name: A → Z</option>
                    <option value="name-desc">Name: Z → A</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active filters pills */}
            {(selectedCategory || minPrice || maxPrice) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="ml-1 hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {minPrice && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                    Min: ₹{minPrice}
                    <button
                      onClick={() => { setMinPrice(""); handleFilter(); }}
                      className="ml-1 hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {maxPrice && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                    Max: ₹{maxPrice}
                    <button
                      onClick={() => { setMaxPrice(""); handleFilter(); }}
                      className="ml-1 hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-100"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-100 rounded w-full"></div>
                      <div className="h-5 bg-gray-100 rounded w-1/4 mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                {/* Category-grouped view (default) */}
                {groupedProducts ? (
                  <div className="space-y-12">
                    {groupedProducts.map((group) => (
                      <div key={group.name}>
                        <div className="flex items-center gap-3 mb-5">
                          <h2 className="text-lg font-bold text-gray-900">{group.name}</h2>
                          <div className="flex-1 h-px bg-gray-200"></div>
                          <span className="text-xs text-gray-400 font-medium">
                            {group.products.length} {group.products.length === 1 ? "item" : "items"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                          {group.products.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              addToCart={addToCart}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Flat grid view (when filters/sort active) */
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                      />
                    ))}
                  </div>
                )}

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="inline-flex items-center gap-2 px-8 py-3 text-sm bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:border-green-400 hover:text-green-700 active:scale-[0.98] disabled:opacity-60 transition-all"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-gray-400 mt-2">
                      {products.length} of {totalElements}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-1">No products found</p>
                <p className="text-sm text-gray-500 mb-5">Try different filters or search terms</p>
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-full hover:bg-green-100 transition"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
