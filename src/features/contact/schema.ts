/**
 * Contact form validation schema — shared between client form and server action.
 * No 'use server' here — this is a plain module usable on both client and server.
 */

import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Please enter your name (at least 2 characters).')
    .max(100, 'Name must be 100 characters or fewer.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z
    .string()
    .optional()
    .refine(
      (v) => !v || v.length === 0 || /^[\d\s+\-().]{7,20}$/.test(v),
      'Please enter a valid phone number.',
    ),
  message: z
    .string()
    .min(10, 'Please say a little more — at least 10 characters.')
    .max(2000, 'Message must be 2,000 characters or fewer.'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
