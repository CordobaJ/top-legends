import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (item) => item.productId === newItem.productId && item.size === newItem.size
        );

        if (existingIndex >= 0) {
          const updated = [...items];
          const current = updated[existingIndex];
          const newQty = Math.min(current.quantity + newItem.quantity, current.maxStock);
          updated[existingIndex] = { ...current, quantity: newQty };
          set({ items: updated });
        } else {
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.productId === productId && item.size === size)
          ),
        });
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: Math.min(quantity, item.maxStock) }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    { name: "top-legends-cart" }
  )
);
