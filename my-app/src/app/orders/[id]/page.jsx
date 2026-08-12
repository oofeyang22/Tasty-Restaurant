"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  FaArrowLeft, 
  FaSpinner, 
  FaBox,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUtensils,
  FaPrint,
  FaDownload
} from "react-icons/fa";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  ready: "bg-indigo-100 text-indigo-800",
  delivering: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusIcons = {
  pending: <FaClock className="text-yellow-600" />,
  confirmed: <FaCheckCircle className="text-blue-600" />,
  preparing: <FaUtensils className="text-purple-600" />,
  ready: <FaCheckCircle className="text-indigo-600" />,
  delivering: <FaTruck className="text-orange-600" />,
  delivered: <FaCheckCircle className="text-green-600" />,
  cancelled: <FaTimesCircle className="text-red-600" />,
};

const statusSteps = ["pending", "confirmed", "preparing", "ready", "delivering", "delivered"];

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status: authStatus } = useSession();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login?redirect=/orders");
      return;
    }

    if (authStatus === "authenticated") {
      fetchOrder();
    }
  }, [authStatus, params.id]);

  const fetchOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch order");
      }

      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
      setError(error.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getCurrentStepIndex = () => {
    return statusSteps.indexOf(order?.status || "");
  };

  const handlePrint = () => {
    window.print();
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="text-4xl animate-spin text-black" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/orders"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition mb-6"
        >
          <FaArrowLeft /> Back to Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                {getStatusLabel(order.status)}
              </span>
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition"
              >
                <FaPrint className="text-xl" />
              </button>
            </div>
          </div>

          {/* Order Status Progress */}
          <div className="mt-6">
            <div className="relative">
              <div className="flex justify-between">
                {statusSteps.map((step, index) => {
                  const currentStep = getCurrentStepIndex();
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div key={step} className="flex flex-col items-center flex-1">
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-400"
                          } ${isCurrent ? "ring-4 ring-green-200" : ""}`}
                        >
                          {isCompleted ? <FaCheckCircle /> : index + 1}
                        </div>
                      </div>
                      <span className="text-xs mt-2 text-center capitalize">
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Progress Bar */}
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-0">
                    <img
                      src={item.food.image || "/placeholder.png"}
                      alt={item.food.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Link
                        href={`/items/${item.food._id}`}
                        className="font-semibold hover:underline"
                      >
                        {item.food.title}
                      </Link>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      {item.specialInstructions && (
                        <p className="text-sm text-gray-600">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    <span className="font-bold">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (7.5%)</span>
                  <span>₦{order.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₦{order.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>₦{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-700 mb-2">Payment Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`capitalize ${
                      order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              {order.shippingAddress && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.address}
                    {order.shippingAddress.city && `, ${order.shippingAddress.city}`}
                    {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                    {order.shippingAddress.country && `, ${order.shippingAddress.country}`}
                  </p>
                </div>
              )}

              {order.deliveryInstructions && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-gray-700 mb-2">Delivery Instructions</h3>
                  <p className="text-sm text-gray-600">{order.deliveryInstructions}</p>
                </div>
              )}

              {/* Actions */}
              {order.status === "pending" && (
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to cancel this order?")) {
                      // Implement cancel order functionality
                      alert("Order cancellation feature coming soon");
                    }
                  }}
                  className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}