"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetch("/api/items")
      .then(res => res.json())
      .then(data => {
        const fixedData = data.map(item => ({
          ...item,
          _id: item._id.$oid ? item._id.$oid : item._id
        }));
        setItems(fixedData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false)); // stop loading
  }, []);

  const filtered = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // Skeleton component
  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-md h-100"></div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-800">
          Our Delicious Menu
        </h1>
        <p className="mt-3 text-lg text-gray-800 dark:text-gray-800">
          Authentic Nigerian Flavour • Made with love
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search Jollof, Amala..."
          className="w-full px-5 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm text-lg dark:bg-gray-800 dark:text-gray-100"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map(item => (
            <div
              key={item._id}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg line-clamp-2">
                    {item.title}
                  </h2>
                </div>
                <div className="absolute top-4 right-4 bg-cyan-600 text-white font-bold px-4 py-2 rounded-full shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                  ₦{item.price}
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base line-clamp-3 min-h-18">
                  {item.short_description || "A delicious preparation made with premium ingredients..."}
                </p>

                <Link href={`/items/${item._id}`} className="block mt-6">
                  <button className="w-full bg-cyan-400 hover:bg-cyan-500 cursor-pointer text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2">
                    <span>View Details</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          ))
        }
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500 dark:text-gray-300 text-xl">
          No items found matching your search 😔
        </div>
      )}
    </div>
  );
}