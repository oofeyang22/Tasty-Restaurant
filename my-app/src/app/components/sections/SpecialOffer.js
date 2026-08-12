const SpecialOffer = () => {
  return (
    <section className="py-16 md:py-20 bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 tracking-tight">
            Special Offers
          </h2>
          <p className="mt-4 text-lg text-cyan-500 max-w-3xl mx-auto">
            Enjoy exclusive savings on your favorite dishes, platters, and more.  
            New deals added regularly — don't miss out!
          </p>
        </div>

        {/* Offers List */}
        <div className="space-y-12">
          {/* Offer 1 */}
          <div className="relative pl-10 md:pl-12">
            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
              1
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
              Weekend Special
              <span className="ml-3 text-cyan-600 font-bold text-2xl">20% OFF</span>
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Every Friday, Saturday, and Sunday — get up to 20% discount on all menu items.  
              Perfect for family meals, weekend cravings, or treating friends.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-10"></div>

          {/* Offer 2 */}
          <div className="relative pl-10 md:pl-12">
            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
              2
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
              Festive & Holiday Deals
              <span className="ml-3 text-cyan-600 font-bold text-2xl">Up to 25% OFF</span>
            </h3>
            <p className="text-gray-700 leading-relaxed">
              During national/festive holidays —  
              enjoy exclusive discounts on selected dishes and party platters.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-10"></div>

          {/* Offer 3 */}
          <div className="relative pl-10 md:pl-12">
            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
              3
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
              Flash Sales
              <span className="ml-3 text-cyan-600 font-bold text-xl">Limited Time Only</span>
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Surprise flash sales appear randomly throughout the month.  
              Follow our page or enable notifications to catch them before they end!
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-10"></div>

          {/* Offer 4 */}
          <div className="relative pl-10 md:pl-12">
            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
              4
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
              Member Exclusive Benefits
              <span className="ml-3 text-cyan-600 font-bold text-xl">Priority Access</span>
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Registered members get early access to new menu items, special member pricing,  
              and exclusive promo codes available only to our loyal customers.
            </p>
          </div>
        </div>

        {/* Final CTA - Updated to /items */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6 text-lg">
            Offers change regularly — come back often or sign up for updates!
          </p>
          <a
            href="/items"
            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg px-10 py-4 rounded-full transition-colors shadow-md hover:shadow-lg"
          >
            <span>Order Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;