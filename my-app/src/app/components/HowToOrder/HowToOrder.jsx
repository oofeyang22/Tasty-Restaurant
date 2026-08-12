"use client";

import { FaShoppingCart, FaUtensils, FaTruck, FaSmile } from "react-icons/fa";

const steps = [
  {
    id: 1,
    title: "Order",
    description: "Choose your favorite  dish and place your order online.",
    icon: <FaShoppingCart className="w-10 h-10 text-yellow-500" />,
  },
  {
    id: 2,
    title: "Cook",
    description: "Our skilled chefs prepare your meal fresh with premium ingredients.",
    icon: <FaUtensils className="w-10 h-10 text-red-500" />,
  },
  {
    id: 3,
    title: "Deliver",
    description: "Fast and safe delivery right to your doorstep.",
    icon: <FaTruck className="w-10 h-10 text-blue-500" />,
  },
  {
    id: 4,
    title: "Enjoy",
    description: "Savor the flavors and enjoy every bite of your meal.",
    icon: <FaSmile className="w-10 h-10 text-green-500" />,
  },
];

const HowToOrderGraph = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
        🍽️ How to Order
      </h2>

      {/* Desktop / Horizontal Flow */}
      <div className="hidden md:flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center text-center relative w-1/4">
            <div className="bg-white rounded-full p-5 shadow-lg flex items-center justify-center mb-4">
              {step.icon}
            </div>
            <h3 className="font-semibold text-lg text-gray-800">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>

            {/* Arrow between steps */}
            {index !== steps.length - 1 && (
              <div className="absolute top-1/2 right-0 w-full h-0.5 bg-gray-300 transform translate-x-1/2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile / Vertical Flow */}
      <div className="md:hidden flex flex-col items-center space-y-10">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center text-center relative">
            <div className="bg-white rounded-full p-5 shadow-lg flex items-center justify-center mb-4">
              {step.icon}
            </div>
            <h3 className="font-semibold text-lg text-gray-800">{step.title}</h3>
            <p className="text-gray-600 text-sm max-w-xs">{step.description}</p>

            {/* Arrow between steps */}
            {index !== steps.length - 1 && (
              <div className="w-1 h-10 border-l-4 border-yellow-400 mt-4"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowToOrderGraph;