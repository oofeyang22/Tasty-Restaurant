"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaImage
} from "react-icons/fa";

const categories = ["all", "Igbo", "Yoruba", "Rice", "Intercontinental dishes"];

export default function ManageItemsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [filterAvailable, setFilterAvailable] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  // Fetch items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search }),
        ...(category !== "all" && { category }),
        ...(filterAvailable !== "all" && { isAvailable: filterAvailable }),
      });

      const res = await fetch(`/api/admin/items?${queryParams}`);
      const data = await res.json();

      if (res.ok) {
        setItems(data.foods);
        setPagination(data.pagination);
      } else {
        throw new Error(data.message || "Failed to fetch items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      alert("Failed to load items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchItems();
    }
  }, [status, session, pagination.page, category, filterAvailable]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === "authenticated" && session?.user?.role === "admin") {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchItems();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/items/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete item");
      }

      // Refresh items
      fetchItems();
      setDeleteModal(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update item");
      }

      // Update local state
      setItems(items.map(item => 
        item._id === id ? { ...item, isAvailable: !currentStatus } : item
      ));
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update item availability. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="text-4xl animate-spin text-black" />
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Items</h1>
            <p className="text-gray-600 mt-1">Manage your menu items</p>
          </div>
          <Link
            href="/add-item"
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center gap-2"
          >
            <FaPlus /> Add New Item
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Items</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No items found
            </h3>
            <p className="text-gray-500">
              {search || category !== "all" || filterAvailable !== "all"
                ? "Try adjusting your filters"
                : "Start by adding your first menu item"}
            </p>
            {!search && category === "all" && filterAvailable === "all" && (
              <Link
                href="/add-item"
                className="inline-block mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Add First Item
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group"
                >
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    {!item.isAvailable && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        Unavailable
                      </div>
                    )}
                    {item.isFeatured && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-xl font-bold text-blue-600 mt-2">
                      ₦{item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <button
                        onClick={() => toggleAvailability(item._id, item.isAvailable)}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                          item.isAvailable
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </button>

                      <div className="flex gap-2">
                        <Link
                          href={`/edit-item/${item._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => setDeleteModal(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Delete Item</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteModal.title}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteModal._id)}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}