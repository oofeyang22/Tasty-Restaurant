import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      // Add item to cart
      addItem: (food, quantity = 1, specialInstructions = "") => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.food._id === food._id
          );

          let newItems;
          if (existingItem) {
            newItems = state.items.map((item) =>
              item.food._id === food._id
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    specialInstructions:
                      specialInstructions || item.specialInstructions,
                  }
                : item
            );
          } else {
            newItems = [
              ...state.items,
              {
                food,
                quantity,
                specialInstructions,
              },
            ];
          }

          const totals = calculateTotals(newItems);
          return {
            items: newItems,
            ...totals,
          };
        });
      },

      // Remove item from cart
      removeItem: (foodId) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.food._id !== foodId
          );
          const totals = calculateTotals(newItems);
          return {
            items: newItems,
            ...totals,
          };
        });
      },

      // Update item quantity
      updateQuantity: (foodId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.items.filter(
              (item) => item.food._id !== foodId
            );
            const totals = calculateTotals(newItems);
            return {
              items: newItems,
              ...totals,
            };
          }

          const newItems = state.items.map((item) =>
            item.food._id === foodId ? { ...item, quantity } : item
          );
          const totals = calculateTotals(newItems);
          return {
            items: newItems,
            ...totals,
          };
        });
      },

      // Update special instructions
      updateInstructions: (foodId, instructions) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.food._id === foodId
              ? { ...item, specialInstructions: instructions }
              : item
          );
          return { items: newItems };
        });
      },

      // Clear cart
      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      // Get cart item count
      getItemCount: () => {
        const state = get();
        return state.totalItems;
      },

      // Get cart total
      getTotal: () => {
        const state = get();
        return state.totalPrice;
      },

      // Check if item is in cart
      isInCart: (foodId) => {
        const state = get();
        return state.items.some((item) => item.food._id === foodId);
      },

      // Get item quantity
      getItemQuantity: (foodId) => {
        const state = get();
        const item = state.items.find((item) => item.food._id === foodId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: "cart-storage", // unique name for localStorage
      getStorage: () => localStorage,
    }
  )
);

// Helper function to calculate totals
const calculateTotals = (items) => {
  let totalItems = 0;
  let totalPrice = 0;

  items.forEach((item) => {
    totalItems += item.quantity;
    totalPrice += item.food.price * item.quantity;
  });

  return { totalItems, totalPrice };
};

export default useCartStore;