/**
 * Cart UI store — Phase 5
 *
 * Manages the open/closed state of the CartDrawer.
 * No persistence — drawer open state resets on reload.
 * Client-only — imported only by "use client" components.
 */

import { create } from 'zustand';

interface CartUiState {
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const useCartUiStore = create<CartUiState>()((set) => ({
  drawerOpen: false,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
}));
