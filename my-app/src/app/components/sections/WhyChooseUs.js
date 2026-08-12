import Image from "next/image";
const features = [
  {
    emoji: "/vegetable.png",
    title: "Fresh & Hygienic Ingredients",
    description: "We source only the finest, cleanest ingredients daily — quality you can taste.",
  },
  {
    emoji: "/family.png",
    title: "Traditional Family Recipe",
    description: "Handed down through generations — authentic taste with love in every bite.",
  },
  {
    emoji: "/thunder.png",
    title: "Fast Delivery Service",
    description: "Hot & fresh to your door in record time — satisfaction guaranteed.",
  },
  {
    emoji: "/affordable.png",
    title: "Affordable Premium Quality",
    description: "Luxury taste that doesn't break the bank — value you’ll love.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 md:mb-20">
          
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-cyan-400">
            Why Choose Us
          </h2>
          <p className="mt-5 text-cyan-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We combine tradition, quality, speed, and value — delivering an experience worth coming back for.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                group relative bg-gray-800/60 backdrop-blur-sm 
                border border-gray-700/50 rounded-2xl p-7 md:p-8 
                transition-all duration-300 ease-out
                hover:bg-gray-800/80 hover:border-cyan-500/30
                hover:shadow-xl hover:shadow-cyan-500/10
                hover:-translate-y-1
              `}
            >
              {/* Icon */}
              <div className="text-5xl md:text-6xl mb-6 text-cyan-400/90 group-hover:text-cyan-300 transition-colors duration-300">
                <Image src={feature.emoji} alt="emoji" width={50} height={50}/> 
              </div>

              {/* Content */}
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-white group-hover:text-cyan-100 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-300 leading-relaxed text-base">
                {feature.description}
              </p>

              {/* Optional subtle shine effect on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-500 bg-gradient-to-br from-yellow-400/20 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;