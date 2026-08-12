"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Logo from "./Logo";
import { FaShoppingCart } from "react-icons/fa";
import useCartStore from "@/stores/useCartStore";

const Navbar = () => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { totalItems } = useCartStore();
  

  const isAdmin = session?.user?.role === "admin";

  return (
    <nav className="bg-purple-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="hover:text-cyan-400 transition">
            Home
          </Link>
          <Link href="/items" className="hover:text-cyan-400 transition">
            Menu
          </Link>
          <Link href="/about" className="hover:text-cyan-400 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-cyan-400 transition">
            Contact
          </Link>

          {session && (
            <>

              {isAdmin ? (
                <>
                  <Link
                    href="/add-item"
                    className="hover:text-cyan-400 transition"
                  >
                    Add Item
                  </Link>
                  <Link
                    href="/manage-items"
                    className="hover:text-cyan-400 transition"
                  >
                    Manage Items
                  </Link>
                </>
              ) : (
                <Link
                  href="/orders"
                  className="hover:text-cyan-400 transition"
                >
                  My Orders
                </Link>
              )}
            </>
          )}

          {/* Cart Icon with Badge */}
          <Link href="/cart" className="relative hover:text-black transition">
            <FaShoppingCart className="text-2xl" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {!session ? (
            <>
              <Link href="/login" className="hover:text-cyan-400">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-cyan-400 text-black px-4 py-2 rounded-md hover:bg-cyan-500 transition font-bold"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-cyan-400 text-black px-4 py-2 rounded-md hover:bg-cyan-500 transition font-bold"
              >
                {session.user?.name}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-md shadow-lg p-4 space-y-3">
                  <p className="text-sm border-b pb-2">
                    {session.user?.email}
                  </p>

                  <button
                    onClick={() => signOut()}
                    className="text-red-500 text-sm hover:text-red-600 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl flex items-center gap-4"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Link href="/cart" className="relative hover:text-cyan-400 transition">
            <FaShoppingCart className="text-2xl" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <span>☰</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 text-black pb-4 flex flex-col gap-3">
          <Link className="hover:text-cyan-500" href="/">
            Home
          </Link>
          <Link className="hover:text-cyan-500" href="/items">
            Menu
          </Link>
          <Link className="hover:text-cyan-500" href="/about">
            About
          </Link>
          <Link className="hover:text-cyan-500" href="/contact">
            Contact
          </Link>

          {session && (
            <>

              {isAdmin ? (
                <>
                  <Link className="hover:text-cyan-500" href="/add-item">
                    Add Item
                  </Link>
                  <Link className="hover:text-cyan-500" href="/manage-items">
                    Manage Items
                  </Link>
                </>
              ) : (
                <Link className="hover:text-cyan-500" href="/orders">
                  My Orders
                </Link>
              )}
            </>
          )}

          {!session ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          ) : (
            <>
              <p className="text-sm border-t pt-2">{session.user?.email}</p>
              <button
                onClick={() => signOut()}
                className="text-red-400 font-bold text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;