"use client";

import { useRouter } from "next/navigation";
import useCartStore from "@/stores/useCartStore";
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const [loading, setLoading] = useState(false);

  const handleUpdateQuantity = (foodId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(foodId);
    } else {
      updateQuantity(foodId, newQuantity);
    }
  };

  const handleRemoveItem = (foodId) => {
    if (window.confirm("Remove this item from cart?")) {
      removeItem(foodId);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow-sm p-12">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/items"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/items"
              className="text-gray-600 hover:text-black transition"
            >
              <FaArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Shopping Cart
            </h1>
          </div>
          <span className="text-sm text-gray-500">
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.food._id}
                className="bg-white rounded-xl shadow-sm p-4 flex gap-4 hover:shadow-md transition"
              >
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={item.food.image || "/placeholder.png"}
                    alt={item.food.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg truncate">
                        {item.food.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.food.category}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.food._id)}
                      className="text-red-500 hover:text-red-700 transition p-1"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border rounded-lg">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.food._id,
                            item.quantity - 1
                          )
                        }
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.food._id,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-1 hover:bg-gray-100 transition"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ₦{(item.food.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₦{item.food.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={() => {
                if (window.confirm("Clear all items from cart?")) {
                  clearCart();
                }
              }}
              className="text-red-500 hover:text-red-700 text-sm transition"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 border-b pb-4 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₦0</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (7.5%)</span>
                  <span>₦{Math.round(totalPrice * 0.075).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span>
                  ₦{Math.round(totalPrice * 1.075).toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className=" cursor-pointer w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </button>

              <Link
                href="/items"
                className="block text-center text-sm text-gray-500 hover:text-black mt-3 transition"
              >
                Continue Shopping →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}