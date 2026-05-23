'use server';

/**
 * Booking server action — Phase 6
 *
 * Validates the submitted booking form and writes a row to the shared
 * `bookings` table (same table the mobile app reads from).
 *
 * Required insert shape per docs/DATABASE_WEB.md:
 *   reference, type, garment_type, description, appointment_date,
 *   appointment_time, guest_name, guest_phone, guest_email,
 *   source='web', status='new', user_id=null
 * Optional: alteration_type_id, photo_paths
 *
 * Demo mode: if Supabase is not configured, logs reference + timestamp only
 * (no PII) and returns success so the demo flow works end-to-end.
 *
 * Photo upload decision:
 *   The `dress-photos` bucket only allows authenticated writes (RLS migration
 *   20260521_0005_web_storage.sql). Anon users cannot upload to Storage.
 *   Decision: photo uploads happen client-side via PhotoUploader.tsx using the
 *   browser Supabase client. In demo mode (no Supabase), PhotoUploader returns
 *   demo:// paths and the action receives those as photo_paths — accepted and
 *   written verbatim (demo rows are not production data). In live mode, the
 *   client must succeed in uploading to a bucket with anon-write policy before
 *   calling this action. A `booking-photos` bucket with anon-write is needed
 *   for production; the existing `dress-photos` bucket does not permit it.
 *   See PROGRESS.md open questions for the bucket decision.
 */

import { serverBookingSchema, type ServerBookingValues } from './schema';
import { hasSupabase, isDemoMode } from '@/lib/env';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SubmitBookingResult =
  | { success: true; reference: string }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Helper: generate SC-XXXXXX reference
// ---------------------------------------------------------------------------

function generateReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  for (const byte of array) {
    id += chars[byte % chars.length];
  }
  return `SC-${id}`;
}

// ---------------------------------------------------------------------------
// Server action
// ---------------------------------------------------------------------------

export async function submitBooking(
  input: ServerBookingValues,
): Promise<SubmitBookingResult> {
  // Validate (defence-in-depth — the client already validates per-step)
  const parsed = serverBookingSchema.safeParse(input);
  if (!parsed.success) {
    const firstError =
      parsed.error.issues[0]?.message ?? 'Please check your details and try again.';
    return { success: false, error: firstError };
  }

  const {
    type,
    garmentType,
    description,
    alterationTypeId,
    photoPaths,
    appointmentDate,
    appointmentTime,
    guestName,
    guestEmail,
    guestPhone,
  } = parsed.data;

  const reference = generateReference();

  if (!hasSupabase || isDemoMode) {
    // Demo mode — log reference + timestamp only (no PII in server logs)
    console.warn('[Booking] Demo mode — booking not persisted to Supabase.', {
      reference,
      timestamp: new Date().toISOString(),
      type,
    });
    return { success: true, reference };
  }

  // Live mode — write to shared bookings table
  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from('bookings').insert({
      reference,
      type,
      garment_type: garmentType,
      description,
      alteration_type_id: alterationTypeId || null,
      photo_paths: photoPaths ?? [],
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      user_id: null,
      source: 'web',
      status: 'new',
    });

    if (error) {
      console.error('[Booking] Supabase insert error:', error.message);
      return {
        success: false,
        error:
          'Something went wrong while sending your booking. Please try again, or contact us directly via WhatsApp.',
      };
    }

    return { success: true, reference };
  } catch (err) {
    console.error(
      '[Booking] Unexpected error:',
      err instanceof Error ? err.message : String(err),
    );
    return {
      success: false,
      error:
        'Something went wrong while sending your booking. Please try again, or contact us directly via WhatsApp.',
    };
  }
}
