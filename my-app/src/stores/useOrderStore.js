import { create } from "zustand";

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  setOrders: (orders) => {
    set({ orders });
  },

  setCurrentOrder: (order) => {
    set({ currentOrder: order });
  },

  addOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders],
    }));
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order._id === orderId ? { ...order, status } : order
      ),
      currentOrder: state.currentOrder?._id === orderId 
        ? { ...state.currentOrder, status }
        : state.currentOrder,
    }));
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  getOrderById: (orderId) => {
    const state = get();
    return state.orders.find((order) => order._id === orderId);
  },

  getOrdersByStatus: (status) => {
    const state = get();
    return state.orders.filter((order) => order.status === status);
  },
}));

export default useOrderStore;