export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-cyan-50 to-cyan-100 text-gray-800 py-16 md:py-24 px-5 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-cyan-400 mb-10 md:mb-16 text-center leading-tight">
          Tasty Restaurants
        </h1>

        <div className="space-y-10 md:space-y-14 text-lg sm:text-xl leading-relaxed">
          
          <p className="font-medium">
            Welcome to <span className="text-cyan-400 font-bold">Tasty Restaurants</span> — 
            where tradition meets bold, unforgettable flavor in every bite.
          </p>

          <p>
            We specialize in cooking delicious delicacies inspired by the rich culinary heritage of Nigeria. 
            Using premium Basmati rice, tender meat, and freshly ground spices, every dish is slow-cooked to perfection, 
            allowing the aromas and layers of flavor to develop fully — just the way it’s been done for generations.
          </p>

          <p>
            At Tasty Restaurants, we believe food is more than a meal — it’s a way to bring people together. 
            Whether you’re sharing a hearty family platter, celebrating a special occasion, or simply craving 
            something warm, spicy, and deeply satisfying after a long day, we’re here to make every visit memorable.
          </p>

          <div className="pt-8 border-t border-cyan-200/70">
            <p className="text-cyan-400 font-semibold text-xl sm:text-2xl mb-4">
              Our Promise
            </p>
            <p>
              We will use only the freshest ingredients and time-honored techniques. 
              No shortcuts, no artificial flavors — just pure passion in every pot we cook.
            </p>
          </div>

          <p>
            From the first whiff of curry to the final spoonful of perfectly spiced rice, 
            we want you to leave with a full stomach and a smile.
          </p>

        </div>

        {/* Closing touch */}
        <div className="mt-16 md:mt-20 text-center">
          <p className="text-cyan-400 font-medium text-xl sm:text-2xl italic">
            Come join us — let's celebrate flavor, one aromatic plate at a time!
          </p>
        </div>

      </div>
    </div>
  );
}