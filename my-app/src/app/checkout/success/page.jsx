"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import useCartStore from "@/stores/useCartStore";

function VerifyingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <FaSpinner className="text-6xl text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">
          Verifying Payment...
        </h2>
        <p className="text-gray-500 mt-2">Please wait while we confirm your payment</p>
      </div>
    </div>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("verifying");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const { clearCart } = useCartStore();

  const reference = searchParams.get("reference");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setError("No payment reference found");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${reference}`);
        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setOrder(data.order);
          clearCart(); // Clear cart after successful payment
        } else {
          setStatus("error");
          setError(data.message || "Payment verification failed");
        }
      } catch (err) {
        setStatus("error");
        setError("Failed to verify payment");
      }
    };

    verifyPayment();
  }, [reference, clearCart]);

  if (status === "verifying") {
    return <VerifyingFallback />;
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/checkout"
            className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful! 🎉
        </h2>
        <p className="text-gray-600 mb-6">
          Your order has been confirmed and is being prepared.
        </p>

        {order && (
          <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono text-sm mb-2">{order._id}</p>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-bold text-lg">₦{order.totalAmount.toLocaleString()}</p>
          </div>
        )}

        <Link
          href="/orders"
          className="block w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition mb-3"
        >
          View My Orders
        </Link>
        <Link
          href="/"
          className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<VerifyingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}