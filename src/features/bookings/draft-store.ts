/**
 * Booking wizard draft store — Phase 6
 *
 * Persists the partial form state to localStorage under
 * `steffny-booking-draft-v1` so that a user who navigates away mid-wizard
 * can return to where they left off.
 *
 * This store is for UX convenience only — it is NOT synced to Supabase.
 * On successful submit, `clearDraft()` wipes the stored state.
 *
 * The `currentStep` field persists the active wizard step (1-6).
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BookingDraft {
  /** Current wizard step (1–6) */
  currentStep: number;
  // Step 1
  type?: 'alteration' | 'custom' | 'consultation';
  // Step 2
  photoPaths?: string[];
  // Step 3
  garmentType?: string;
  description?: string;
  alterationTypeId?: string;
  // Step 4
  appointmentDate?: string;
  appointmentTime?: string;
  // Step 5
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

interface BookingDraftState {
  draft: BookingDraft;
  setDraft: (partial: Partial<BookingDraft>) => void;
  clearDraft: () => void;
}

const DEFAULT_DRAFT: BookingDraft = {
  currentStep: 1,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useBookingDraftStore = create<BookingDraftState>()(
  persist(
    (set) => ({
      draft: DEFAULT_DRAFT,

      setDraft: (partial) =>
        set((state) => ({
          draft: { ...state.draft, ...partial },
        })),

      clearDraft: () => set({ draft: DEFAULT_DRAFT }),
    }),
    {
      name: 'steffny-booking-draft-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
