"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useCartStore from "@/stores/useCartStore";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import Link from "next/link";

export default function ItemDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addItem, getItemQuantity } = useCartStore();

  // src/app/items/[id]/page.jsx

  useEffect(() => {
  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/items/${params.id}`);
      
      // Check if response is successful before setting state
      if (!res.ok) {
        setItem(null);
        return;
      }

      const data = await res.json();
      setItem(data);

      const existingQty = getItemQuantity(data._id);
      if (existingQty > 0) {
        setQuantity(existingQty);
      }
    } catch (err) {
      console.error(err);
      setItem(null);
    } finally {
      setLoading(false);
    }
  };
  fetchItem();
}, [params.id, getItemQuantity]);

  const handleAddToCart = () => {
    if (!item) return;
    
    addItem(item, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 99) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 99) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <div className="w-full h-96 bg-gray-300 animate-pulse rounded"></div>
        <div className="h-8 bg-gray-300 animate-pulse rounded w-3/4"></div>
        <div className="h-20 bg-gray-300 animate-pulse rounded"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 animate-pulse rounded w-1/2"></div>
          <div className="h-6 bg-gray-300 animate-pulse rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return <p className="p-10 text-center text-red-500">Item not found 😢</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Image */}
      <div className="relative">
        <img
          src={item.image || "/placeholder.png"}
          alt={item.title}
          className="w-full h-96 object-contain rounded-lg bg-gray-100"
        />
        {item.isAvailable === false && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
            Unavailable
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-cyan-400">{item.title}</h1>

      {/* Description */}
      <p className="text-cyan-500 text-lg leading-relaxed">{item.full_description}</p>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-xl font-bold text-blue-600">₦{item.price?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Category</p>
          <p className="text-lg font-semibold text-gray-800">{item.category}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Preparation Time</p>
          <p className="text-lg font-semibold text-cyan-400">{item.preparationTime || 30} mins</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Rating</p>
          <p className="text-lg font-semibold text-green-600">⭐ {item.rating || 4.5}/5</p>
        </div>
      </div>

      {/* Ingredients */}
      {item.ingredients && item.ingredients.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {item.ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}


      <div className="border-t pt-6 mt-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="quantity" className="font-medium">
              Quantity:
            </label>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={decrementQuantity}
                className="px-3 py-2 hover:bg-gray-100 transition"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 text-center border-x py-2 focus:outline-none"
                min="1"
                max="99"
              />
              <button
                onClick={incrementQuantity}
                className="px-3 py-2 hover:bg-gray-100 transition"
                disabled={quantity >= 99}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className={`flex-1 w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              addedToCart
                ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                : item.isAvailable
                ? "bg-black hover:bg-gray-800 text-white"
                : "bg-gray-400 cursor-not-allowed text-gray-600"
            }`}
          >
            {addedToCart ? (
              <>
                <FaCheck /> Added to Cart
              </>
            ) : (
              <>
                <FaShoppingCart /> Add to Cart
              </>
            )}
          </button>
        </div>

        {addedToCart && (
          <p className="text-cyan-600 text-sm mt-2 text-center">
            ✓ Item added to cart! <Link href="/cart" className="underline font-semibold">View Cart</Link>
          </p>
        )}

        <p className="text-sm text-gray-500 mt-4 text-center">
          {item.isAvailable ? "Ready to order" : "Currently unavailable"}
        </p>
      </div>
    </div>
  );
}