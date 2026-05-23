/**
 * Checkout form validation schema — Phase 5
 *
 * Two schemas live here:
 *   - checkoutSchema        — full form schema used CLIENT-SIDE only (includes card fields)
 *   - serverCheckoutSchema  — server action schema (contact + delivery ONLY; no card fields)
 *
 * Card details must never reach the server action. Validate them client-side only.
 *
 * Steps:
 *   1. Contact — name, email, phone
 *   2. Delivery — UK address
 *   3. Payment — mock card fields (client-side validation only)
 *   4. Review — confirmed via the form's submit
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Reusable field schemas
// ---------------------------------------------------------------------------

const nameField = z
  .string()
  .min(2, 'Please enter your name — at least 2 characters.')
  .max(100, 'Name must be 100 characters or fewer.');

const emailField = z
  .string()
  .min(1, 'Email address is required.')
  .email('That email address does not look right.');

const phoneField = z
  .string()
  .min(1, 'Phone number is required.')
  .refine(
    (v) => /^[\d\s+\-().]{7,20}$/.test(v),
    'Please enter a valid phone number.',
  );

const postcodeField = z
  .string()
  .min(1, 'Postcode is required.')
  .refine(
    (v) => /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(v.trim()),
    'That postcode does not look right.',
  );

// ---------------------------------------------------------------------------
// Contact step
// ---------------------------------------------------------------------------

export const contactStepSchema = z.object({
  fullName: nameField,
  email: emailField,
  phone: phoneField,
});

export type ContactStepValues = z.infer<typeof contactStepSchema>;

// ---------------------------------------------------------------------------
// Delivery step
// ---------------------------------------------------------------------------

export const deliveryStepSchema = z.object({
  addressLine1: z.string().min(3, 'Please enter your street address.').max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2, 'Please enter your city.').max(100),
  postcode: postcodeField,
  country: z.literal('United Kingdom'),
  notes: z.string().max(500).optional(),
});

export type DeliveryStepValues = z.infer<typeof deliveryStepSchema>;

// ---------------------------------------------------------------------------
// Payment step (mock — no real card validation)
// ---------------------------------------------------------------------------

export const paymentStepSchema = z.object({
  cardName: nameField,
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s/g, ''))
    .pipe(z.string().min(13, 'Card number looks too short.').max(19, 'Card number looks too long.')),
  expiry: z
    .string()
    .refine(
      (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
      'Please enter expiry as MM/YY.',
    ),
  cvc: z
    .string()
    .refine((v) => /^\d{3,4}$/.test(v), 'CVC should be 3 or 4 digits.'),
});

export type PaymentStepValues = z.infer<typeof paymentStepSchema>;

// ---------------------------------------------------------------------------
// Full checkout schema — CLIENT-SIDE ONLY (includes card fields for step validation)
// ---------------------------------------------------------------------------

export const checkoutSchema = z.object({
  // Contact
  fullName: nameField,
  email: emailField,
  phone: phoneField,
  // Delivery
  addressLine1: z.string().min(3).max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  postcode: postcodeField,
  country: z.literal('United Kingdom'),
  notes: z.string().max(500).optional(),
  // Payment — card fields for client-side step validation ONLY; never sent to server
  cardName: z.string().min(2).max(100),
  cardNumber: z.string().min(13).max(23), // may include spaces
  expiry: z.string(),
  cvc: z.string(),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;

// ---------------------------------------------------------------------------
// Server checkout schema — contact + delivery ONLY; no card fields
// Card data must never transit to the server action.
// ---------------------------------------------------------------------------

export const serverCheckoutSchema = z.object({
  fullName: nameField,
  email: emailField,
  phone: phoneField,
  addressLine1: z.string().min(3).max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  postcode: postcodeField,
  country: z.literal('United Kingdom'),
  notes: z.string().max(500).optional(),
});

export type ServerCheckoutValues = z.infer<typeof serverCheckoutSchema>;
