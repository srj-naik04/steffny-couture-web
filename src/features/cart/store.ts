/**
 * Cart store — Phase 4 (minimal stub; Phase 5 will extend with drawer UI)
 *
 * Zustand store persisted to localStorage.
 * Client-only — imported only by "use client" components.
 *
 * Merge logic: adding the same productId + size + colour increments quantity.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  /** Unique cart-line id (crypto.randomUUID()) */
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  size: string | null;
  colour: string | null;
  quantity: number;
  imagePath: string | null;
}

type AddItemInput = Omit<CartItem, 'id' | 'quantity'> & { quantity?: number };

interface CartState {
  items: CartItem[];
  addItem: (item: AddItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clear: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(input) {
        const { items } = get();
        const existing = items.find(
          (item) =>
            item.productId === input.productId &&
            item.size === input.size &&
            item.colour === input.colour,
        );

        if (existing) {
          set({
            items: items.map((item) =>
              item.id === existing.id
                ? { ...item, quantity: item.quantity + (input.quantity ?? 1) }
                : item,
            ),
          });
        } else {
          const newItem: CartItem = {
            ...input,
            id: crypto.randomUUID(),
            quantity: input.quantity ?? 1,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem(id) {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity(id, qty) {
        if (qty < 1) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: qty } : item,
          ),
        });
      },

      clear() {
        set({ items: [] });
      },
    }),
    {
      name: 'steffny-cart-v1', // version suffix lets us migrate cart shape in later phases without silent rehydration of stale data
      // Only persist what we need — not the action functions.
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
