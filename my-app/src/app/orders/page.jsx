"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  FaBox, 
  FaSpinner, 
  FaChevronDown, 
  FaChevronUp,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUtensils,
  FaEye,
  FaSearch,
  FaFilter
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

const statusOptions = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "delivering", label: "Delivering" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login?redirect=/orders");
    }
  }, [authStatus, router]);

  // Fetch orders
  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchOrders();
    }
  }, [authStatus, statusFilter, pagination.page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        status: statusFilter,
        page: pagination.page,
        limit: pagination.limit,
      });

      const res = await fetch(`/api/orders?${queryParams}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
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

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="text-4xl animate-spin text-black" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">
              Track and manage all your orders
            </p>
          </div>
          <Link
            href="/items"
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center gap-2"
          >
            <FaUtensils /> Order Now
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-auto flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {pagination.total > 0 && (
              <span className="text-sm text-gray-500">
                {pagination.total} order{pagination.total !== 1 ? "s" : ""} found
              </span>
            )}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 mb-6">
              {statusFilter !== "all"
                ? `You don't have any ${statusFilter} orders`
                : "You haven't placed any orders yet"}
            </p>
            <Link
              href="/items"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
              >
                {/* Order Header */}
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleExpand(order._id)}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        {statusIcons[order.status] || <FaBox />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        <span className="font-bold text-lg">
                          ₦{order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 transition">
                        {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Details (Expanded) */}
                {expandedOrder === order._id && (
                  <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Items */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <img
                                src={item.food.image || "/placeholder.png"}
                                alt={item.food.title}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.food.title}</p>
                                <p className="text-xs text-gray-500">
                                  Quantity: {item.quantity} × ₦{item.price.toLocaleString()}
                                </p>
                              </div>
                              <span className="font-medium text-sm">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Order Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>₦{order.subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax (7.5%)</span>
                            <span>₦{order.tax.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span>₦{order.deliveryFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-2">
                            <span>Total</span>
                            <span>₦{order.totalAmount.toLocaleString()}</span>
                          </div>

                          {order.shippingAddress && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="font-medium text-gray-700">Delivery Address</p>
                              <p className="text-gray-600 text-xs">
                                {order.shippingAddress.address}
                                {order.shippingAddress.city && `, ${order.shippingAddress.city}`}
                                {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                                {order.shippingAddress.country && `, ${order.shippingAddress.country}`}
                              </p>
                            </div>
                          )}

                          {order.deliveryInstructions && (
                            <div className="mt-2">
                              <p className="font-medium text-gray-700">Special Instructions</p>
                              <p className="text-gray-600 text-xs">{order.deliveryInstructions}</p>
                            </div>
                          )}

                          <div className="mt-4 pt-4 border-t">
                            <Link
                              href={`/orders/${order._id}`}
                              className="inline-flex items-center gap-2 text-black font-medium hover:underline text-sm"
                            >
                              <FaEye /> View Full Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}