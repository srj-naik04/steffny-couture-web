'use server';

/**
 * Contact form server action — Phase 3
 *
 * Writes a general inquiry to the Supabase inquiries table.
 * Falls back to console logging in demo mode (no Supabase credentials).
 *
 * Schema lives in ./schema.ts (no 'use server') to avoid the Next.js
 * restriction that every export from a 'use server' file must be an async fn.
 */

import { contactFormSchema, type ContactFormValues } from './schema';
import { hasSupabase, isDemoMode } from '@/lib/env';

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

export type ContactFormResult =
  | { success: true; message: string }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Server action
// ---------------------------------------------------------------------------

export async function submitContactForm(
  values: ContactFormValues,
): Promise<ContactFormResult> {
  // Validate (defence-in-depth — the client also validates)
  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: 'The form has validation errors. Please check and try again.',
    };
  }

  const { name, email, phone, message } = parsed.data;

  // Generate a short reference
  const reference = `WEB-${Date.now().toString(36).toUpperCase()}`;

  if (!hasSupabase || isDemoMode) {
    // Demo mode (env missing or NEXT_PUBLIC_DEMO_MODE=true) — log reference only (no PII in function logs)
    console.info('[Contact] Demo mode — inquiry not persisted', {
      reference,
      timestamp: new Date().toISOString(),
    });
    return {
      success: true,
      message:
        'Thank you for getting in touch. Steffi will reply within one working day.',
    };
  }

  // Live mode — write to Supabase
  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from('inquiries').insert({
      reference,
      type: 'general',
      customer_name: name,
      customer_email: email,
      customer_phone: phone ?? '',
      message,
      status: 'new',
      source: 'web',
    });

    if (error) {
      console.error('[Contact] Supabase insert error:', error.message);
      return {
        success: false,
        error:
          'Something went wrong. Please try again, or contact us directly via WhatsApp.',
      };
    }

    return {
      success: true,
      message:
        'Thank you for getting in touch. Steffi will reply within one working day.',
    };
  } catch (err) {
    console.error('[Contact] Unexpected error:', err instanceof Error ? err.message : String(err));
    return {
      success: false,
      error:
        'Something went wrong. Please try again, or contact us directly via WhatsApp.',
    };
  }
}
