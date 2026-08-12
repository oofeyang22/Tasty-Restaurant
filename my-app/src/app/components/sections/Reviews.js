"use client";

import { useEffect, useState } from "react";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews?limit=10");
        const data = await res.json();
        // Ensure each review has an image (use placeholder if not)
        const reviewsWithImages = data.map(review => ({
          ...review,
          image: review.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&size=80&background=random`
        }));
        setReviews(reviewsWithImages);
      } catch (err) {
        console.error("Reviews fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Real stories from people who love our food
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
            <div className="animate-pulse space-y-4">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews.length) return null;

  const review = reviews[current];

  return (
    <section className="py-16 md:py-20 bg-black">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-200">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-cyan-200">
            Real stories from people who love our food
          </p>
        </div>

        {/* Review Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-500">
          <div className="p-8 md:p-10 text-center">
            {/* Avatar + Name */}
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
                {/* Rating Badge */}
                <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  ★ {review.rating}.0
                </span>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {review.name}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {review.location || "Happy Customer"}
                </p>
                {review.foodTitle && (
                  <p className="text-xs text-amber-600 mt-1">
                    Reviewed: {review.foodTitle}
                  </p>
                )}
              </div>
            </div>

            {/* Comment */}
            <blockquote className="text-gray-700 text-lg leading-relaxed italic mb-8">
              “{review.comment}”
            </blockquote>

            {/* Stars */}
            <div className="flex justify-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 ${i < review.rating ? 'fill-current' : 'fill-gray-300'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.5 7.41l6.56-.955L10 .5l2.94 5.955 6.56.955-4.745 4.135 1.123 6.545z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-3 mt-10">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  current === index
                    ? "bg-blue-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;