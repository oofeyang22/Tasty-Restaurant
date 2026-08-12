"use client";
import Link from "next/link";

const Logo = () => {
  return (
    <Link 
      href="/" 
      className="flex items-center gap-2"
    >
      <img 
        src="/tasty.png" 
        alt="Tasty" 
        className="w-12 h-12 object-cover rounded-full"
      />

      <span className="text-2xl font-bold text-cyan-400">
        Tasty
      </span>

      <span className="text-2xl font-bold text-cyan-400">
        Restaurants
      </span>
    </Link>
  );
};

export default Logo;