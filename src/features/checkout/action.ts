'use server';

/**
 * Checkout server action — Phase 5
 *
 * Validates the submitted checkout form, generates a reference id,
 * and writes the order as an `inquiries` row with type = 'product_order'.
 *
 * The `items` payload comes from the client-side cart store (passed as JSON
 * from sessionStorage in the client component).
 *
 * Security notes:
 * - Card details are NEVER persisted — they are dropped before the DB write.
 * - Server action validates with Zod (defence-in-depth).
 * - Demo mode: if Supabase is not configured, logs only the reference (no PII).
 */

import { serverCheckoutSchema, type ServerCheckoutValues } from './schema';
import { hasSupabase, isDemoMode } from '@/lib/env';
import type { InquiryItem } from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrderItem {
  productId: string;
  variantId?: string | null;
  name: string;
  price: number;
  size?: string | null;
  colour?: string | null;
  quantity: number;
  imagePath?: string | null;
}

export type PlaceOrderInput = ServerCheckoutValues & {
  items: OrderItem[];
  subtotal: number;
};

export type PlaceOrderResult =
  | { success: true; reference: string }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Helper: generate short reference id
// ---------------------------------------------------------------------------

function generateReference(): string {
  // Produces e.g. "SC-A3F9B2"
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

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  // Validate the form fields (contact + delivery only; card data never reaches this function)
  const parsed = serverCheckoutSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Please check your details and try again.';
    return { success: false, error: firstError };
  }

  // Validate items array
  if (!Array.isArray(input.items) || input.items.length === 0) {
    return { success: false, error: 'Your cart appears to be empty. Please add items before placing an order.' };
  }

  const { fullName, email, phone, addressLine1, addressLine2, city, postcode, country, notes } =
    parsed.data;

  const reference = generateReference();

  // Build the delivery address string
  const deliveryAddress = [
    addressLine1,
    addressLine2,
    city,
    postcode,
    country,
  ]
    .filter(Boolean)
    .join(', ');

  // Build the inquiry items (card data deliberately excluded)
  const inquiryItems: InquiryItem[] = input.items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId ?? null,
    name: item.name,
    price: item.price,
    qty: item.quantity,
  }));

  const total = input.subtotal;

  // Build the message field — includes notes if provided
  const message = [
    `Order reference: ${reference}`,
    notes ? `Customer notes: ${notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  if (!hasSupabase || isDemoMode) {
    // Demo mode (env missing or NEXT_PUBLIC_DEMO_MODE=true) — log reference only (no PII in server logs)
    console.warn('[Checkout] Demo mode — order not persisted to Supabase.', {
      reference,
      timestamp: new Date().toISOString(),
      itemCount: inquiryItems.length,
    });
    return { success: true, reference };
  }

  // Live mode — write to Supabase
  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from('inquiries').insert({
      reference,
      type: 'product_order',
      customer_name: fullName,
      customer_email: email,
      customer_phone: phone,
      delivery_address: deliveryAddress,
      items: inquiryItems,
      total,
      message,
      status: 'new',
      source: 'web',
    });

    if (error) {
      console.error('[Checkout] Supabase insert error:', error.message);
      return {
        success: false,
        error: 'Something went wrong while placing your order. Please try again, or contact us directly via WhatsApp.',
      };
    }

    return { success: true, reference };
  } catch (err) {
    console.error('[Checkout] Unexpected error:', err instanceof Error ? err.message : String(err));
    return {
      success: false,
      error: 'Something went wrong while placing your order. Please try again, or contact us directly via WhatsApp.',
    };
  }
}
