"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const categories = [
  "Igbo",
  "Yoruba",
  "Rice",
  "Intercontinental dishes"
];

const FeaturedItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/items");
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();

        // Take one representative item per category
        const featured = categories
          .map((cat) => data.find((item) => item.category === cat))
          .filter(Boolean);

        setItems(featured);
      } catch (error) {
        console.error("Error fetching featured items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <section className="py-20 
    bg-pink-900  text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-cyan-400">
            Our Featured Delights
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
            Handpicked favorites that bring the authentic Nigerian taste to your table
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-pink-700 rounded-2xl h-96 animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No featured items available at the moment.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-9">
            {items.map((item) => (
              <div
                key={item._id || item.title}
                className="group bg-gray-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/10"
              >
                {/* Image */}
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-4 py-1.5 bg-cyan-500/90 text-black font-medium text-sm rounded-full shadow-md backdrop-blur-sm border border-cyan-400/30">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-gray-300 text-sm line-clamp-2">
                    {item.short_description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-2xl font-bold text-cyan-400">
                      ₦{item.price}
                    </span>
                 <Link href={`/items/${item._id}`} className="block mt-6">
                <button className="w-full text-cyan-600 cursor-pointer
                hover:text-cyan-500 text-lg
                 font-semibold py-3 px-6 rounded-xl
                  transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2">
                  <span>View Details</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedItems;