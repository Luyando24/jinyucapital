"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star, Loader2, SlidersHorizontal, Search } from "lucide-react";
import { products as fallbackProducts } from "@/data/products";
import { useCurrency } from "@/components/CurrencyContext";

interface DBProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews?: number;
  is_wholesale?: boolean;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || "All Categories";

  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Featured");
  const [searchQuery, setSearchQuery] = useState("");
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    // We fall back directly to local products to maintain speed and reliability
    setProducts(fallbackProducts);
    setLoading(false);
  }, []);

  const categories = ["All Categories", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products
    .filter((p) => selectedCategory === "All Categories" || p.category === selectedCategory)
    .filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Newest") return b.id.localeCompare(a.id);
    if (sortBy === "Top Rated") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Subtle Breadcrumbs Header */}
      <div className="border-b border-neutral-150 bg-neutral-50/30 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400" style={{ fontFamily: "var(--font-display)" }}>
          <div className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-black">Products</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[9px] tracking-widest text-neutral-400">
            <span>ENGINEERING EXCELLENCE</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Sidebar: Filters */}
          <div className="w-full lg:w-64 shrink-0 space-y-8">
            {/* Search Box */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
                Search Products
              </h4>
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-lg border border-neutral-200 bg-neutral-50 outline-none transition-all focus:border-black focus:bg-white"
                />
              </div>
            </div>

            {/* Categories list */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)" }}>
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" /> Categories
              </h4>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="w-full text-left py-2.5 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: selectedCategory === cat ? "#2a6df4" : "transparent",
                      color: selectedCategory === cat ? "#FFFFFF" : "#707070",
                      borderColor: selectedCategory === cat ? "#2a6df4" : "transparent",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="space-y-2.5 pt-6 border-t border-neutral-150">
              <h4 className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
                Sort By
              </h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-xs font-bold uppercase tracking-wider border border-neutral-200 rounded-lg px-3 py-2.5 outline-none bg-neutral-50 cursor-pointer focus:border-black"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Right Main Content: Grid */}
          <div className="flex-grow">
            {/* Results Count */}
            {!loading && (
              <p className="text-xs mb-8 text-neutral-400">
                Showing <strong className="text-black">{sortedProducts.length}</strong> products
                {selectedCategory !== "All Categories" && ` in "${selectedCategory}"`}
              </p>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-black" />
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Loading products...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-32 rounded-xl border border-neutral-200 bg-neutral-50">
                <p className="font-display text-lg font-bold mb-2">No products found.</p>
                <p className="text-sm text-neutral-400 font-light">
                  Try adjusting your search terms or category filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col">
                    <div className="relative aspect-square w-full rounded-xl border border-neutral-100 bg-neutral-50 overflow-hidden flex items-center justify-center p-8 transition-all group-hover:border-neutral-300">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={220}
                        height={220}
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                        {product.category}
                      </div>
                    </div>

                    <div className="pt-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-display text-base font-bold mb-1 text-black group-hover:text-neutral-500 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex justify-end items-center mt-auto pt-2 border-t border-neutral-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-primary transition-colors">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-40 space-y-4 min-h-screen bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Loading products...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
