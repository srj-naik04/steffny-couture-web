/**
 * Cart hooks — Phase 4
 *
 * useCart()      — full store (items + actions). Use in cart UI.
 * useCartCount() — item count only. Use in Header badge.
 * useHydrated()  — false on first SSR render, true after mount.
 *                  Prevents hydration mismatch on the cart badge.
 */

'use client';

import * as React from 'react';
import { useCartStore } from './store';

export function useCart() {
  return useCartStore();
}

export function useCartCount(): number {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
}

/**
 * Returns false on the initial server/hydration render, then true once the
 * component has mounted in the browser. Use this to gate any rendering that
 * reads from localStorage-backed state to prevent SSR/client mismatch.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
