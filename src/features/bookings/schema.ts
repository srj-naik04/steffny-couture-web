/**
 * Booking form validation schemas — Phase 6
 *
 * The wizard has 6 steps:
 *   1. Type     — alteration / custom / consultation
 *   2. Photos   — optional, up to 5 images
 *   3. Details  — garment type + description
 *   4. Schedule — appointment date + time
 *   5. Contact  — name, email, phone
 *   6. Review   — confirmed via submit
 *
 * The full booking schema (`bookingFullSchema`) is validated client-side
 * across the wizard. The server action (`serverBookingSchema`) validates
 * all fields except photo previews (those are local object URLs, never sent).
 *
 * Field names map 1-to-1 to the shared `bookings` table columns documented
 * in docs/DATABASE_WEB.md — do not rename without coordinating with the
 * mobile app team.
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

// ---------------------------------------------------------------------------
// Step 1 — Booking type
// ---------------------------------------------------------------------------

export const bookingTypeSchema = z.object({
  type: z.enum(['alteration', 'custom', 'consultation'], {
    error: 'Please select a service type.',
  }),
});

export type BookingTypeValues = z.infer<typeof bookingTypeSchema>;

// ---------------------------------------------------------------------------
// Step 2 — Photos (optional)
// Photo paths are Storage paths collected by the PhotoUploader.
// An empty array is valid.
// ---------------------------------------------------------------------------

export const bookingPhotosSchema = z.object({
  photoPaths: z.array(z.string()).max(5, 'You can add up to 5 photos.'),
});

export type BookingPhotosValues = z.infer<typeof bookingPhotosSchema>;

// ---------------------------------------------------------------------------
// Step 3 — Details (garment type + description)
// ---------------------------------------------------------------------------

export const bookingDetailsSchema = z.object({
  garmentType: z
    .string()
    .min(2, 'Please describe the garment — at least 2 characters.')
    .max(100, 'Keep the garment description under 100 characters.'),
  description: z
    .string()
    .min(10, 'A little more detail helps Steffi prepare — at least 10 characters.')
    .max(2000, 'Please keep your description under 2000 characters.'),
  alterationTypeId: z
    .string()
    .uuid('Please select the alteration type.')
    .optional()
    .or(z.literal('')),
});

export type BookingDetailsValues = z.infer<typeof bookingDetailsSchema>;

// ---------------------------------------------------------------------------
// Step 4 — Schedule
// ---------------------------------------------------------------------------

const todayIso = (): string => new Date().toISOString().split('T')[0];
const maxDateIso = (): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().split('T')[0];
};

export const bookingScheduleSchema = z.object({
  appointmentDate: z
    .string()
    .min(1, 'Please pick a date.')
    .refine((v) => v >= todayIso(), 'Please choose a date from today onwards.')
    .refine((v) => v <= maxDateIso(), 'Please choose a date within the next 6 months.'),
  appointmentTime: z
    .string()
    .min(1, 'Please choose a time.')
    .refine((v) => {
      // Studio hours: earliest 09:30, latest 18:30 (last slot)
      const [h, m] = v.split(':').map(Number);
      const mins = h * 60 + m;
      return mins >= 9 * 60 + 30 && mins <= 18 * 60 + 30;
    }, 'Please choose a time within studio hours (09:30 – 18:30).'),
});

export type BookingScheduleValues = z.infer<typeof bookingScheduleSchema>;

// ---------------------------------------------------------------------------
// Step 5 — Contact details
// ---------------------------------------------------------------------------

export const bookingContactSchema = z.object({
  guestName: nameField,
  guestEmail: emailField,
  guestPhone: phoneField,
});

export type BookingContactValues = z.infer<typeof bookingContactSchema>;

// ---------------------------------------------------------------------------
// Full booking schema — used by the wizard to hold the complete form state
// ---------------------------------------------------------------------------

export const bookingFullSchema = bookingTypeSchema
  .merge(bookingPhotosSchema)
  .merge(bookingDetailsSchema)
  .merge(bookingScheduleSchema)
  .merge(bookingContactSchema);

export type BookingFullValues = z.infer<typeof bookingFullSchema>;

// ---------------------------------------------------------------------------
// Server booking schema — sent to the server action.
// Identical to bookingFullSchema (no payment PII to strip for bookings).
// ---------------------------------------------------------------------------

export const serverBookingSchema = bookingFullSchema;

export type ServerBookingValues = z.infer<typeof serverBookingSchema>;
