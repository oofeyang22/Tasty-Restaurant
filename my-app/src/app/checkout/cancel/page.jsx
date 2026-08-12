"use client";

import Link from "next/link";
import { FaTimesCircle } from "react-icons/fa";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
        <FaTimesCircle className="text-6xl text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Cancelled
        </h2>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges have been made.
        </p>
        <Link
          href="/checkout"
          className="block w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition mb-3"
        >
          Try Again
        </Link>
        <Link
          href="/cart"
          className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Return to Cart
        </Link>
      </div>
    </div>
  );
}