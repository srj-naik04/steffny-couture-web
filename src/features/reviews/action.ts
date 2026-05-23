'use server';

/**
 * Reviews server action — Phase 7
 *
 * Validates a review submission and writes it to the `reviews` table
 * with published=false, featured=false. Steffi reviews every submission
 * before publishing via the mobile app.
 *
 * Demo mode: logs reference + timestamp only (no PII). Returns success
 * so the demo flow works end-to-end.
 *
 * RLS note: the `reviews` table has an anon INSERT policy (migration 0003)
 * with WITH CHECK (published = false AND featured = false). Both fields
 * default to false on the DB, so the insert always satisfies the check.
 */

import { submitReviewSchema, type SubmitReviewValues } from './schema';
import { hasSupabase, isDemoMode } from '@/lib/env';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SubmitReviewResult =
  | { success: true }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Server action
// ---------------------------------------------------------------------------

export async function submitReview(
  input: SubmitReviewValues,
): Promise<SubmitReviewResult> {
  // Validate — defence-in-depth
  const parsed = submitReviewSchema.safeParse(input);
  if (!parsed.success) {
    const firstError =
      parsed.error.issues[0]?.message ?? 'Please check your details and try again.';
    return { success: false, error: firstError };
  }

  const { author_name, rating, body, occasion, author_location } = parsed.data;

  if (!hasSupabase || isDemoMode) {
    // Demo mode — log submission timestamp only (no PII in server logs)
    console.warn('[Reviews] Demo mode — review not persisted to Supabase.', {
      timestamp: new Date().toISOString(),
      rating,
    });
    return { success: true };
  }

  // Live mode — write to reviews table
  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from('reviews').insert({
      author_name,
      author_location: author_location || null,
      rating,
      body,
      occasion: occasion || null,
      published: false,
      featured: false,
    });

    if (error) {
      console.error('[Reviews] Supabase insert error:', error.message);
      return {
        success: false,
        error:
          'Something went wrong while submitting your review. Please try again, or contact us directly.',
      };
    }

    return { success: true };
  } catch (err) {
    console.error(
      '[Reviews] Unexpected error:',
      err instanceof Error ? err.message : String(err),
    );
    return {
      success: false,
      error:
        'Something went wrong while submitting your review. Please try again, or contact us directly.',
    };
  }
}
