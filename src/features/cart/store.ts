/**
 * Cart store — Phase 5 (bumped from v1 → v2)
 *
 * Changes from v1:
 *   - CartItem gains `variantId?: string | null` to match InquiryItem.variantId
 *   - persist key bumped to `steffny-cart-v2`
 *   - migrate() fn maps v1 items → v2 by injecting `variantId: null`
 *
 * Zustand store persisted to localStorage.
 * Client-only — imported only by "use client" components.
 *
 * Merge logic: adding the same productId + size + colour increments quantity.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  /** Unique cart-line id (crypto.randomUUID()) */
  id: string;
  productId: string;
  /** Optional variant identifier — passed through to InquiryItem */
  variantId?: string | null;
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
// v1 → v2 migration
// ---------------------------------------------------------------------------

/**
 * Migrate a persisted v1 cart state to v2 shape.
 * v1 CartItem did not have `variantId`; add it as null.
 */
function migrateV1toV2(persistedState: unknown): CartState {
  const state = persistedState as { items?: unknown[] } | null;
  if (!state || !Array.isArray(state.items)) {
    return { items: [], addItem: () => {}, removeItem: () => {}, updateQuantity: () => {}, clear: () => {} };
  }
  return {
    ...state,
    items: state.items.map((item) => ({
      variantId: null,
      ...(item as CartItem),
    })),
  } as CartState;
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
      name: 'steffny-cart-v2',
      storage: createJSONStorage(() => localStorage),
      // Only persist the items array, not the action functions.
      partialize: (state) => ({ items: state.items }),
      // Migrate v1 data (no variantId) to v2 shape
      migrate: (persistedState, version) => {
        if (version === 0) {
          return migrateV1toV2(persistedState);
        }
        return persistedState as CartState;
      },
      version: 1,
    },
  ),
);
