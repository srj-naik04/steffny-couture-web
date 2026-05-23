/**
 * Reviews feature schemas — Phase 7
 *
 * Zod schema for the public "leave a review" form.
 * Validates before the server action writes to the `reviews` table.
 */

import { z } from 'zod';

export const submitReviewSchema = z.object({
  author_name: z
    .string()
    .min(2, 'Please enter your name (at least 2 characters).')
    .max(80, 'Name must be 80 characters or fewer.'),

  rating: z
    .number()
    .int()
    .min(1, 'Please select a rating.')
    .max(5, 'Rating must be between 1 and 5.'),

  body: z
    .string()
    .min(50, 'Your review must be at least 50 characters — a little detail helps others.')
    .max(1000, 'Please keep your review to 1,000 characters or fewer.'),

  occasion: z.string().max(80).optional(),

  author_location: z.string().max(80).optional(),
});

export type SubmitReviewValues = z.infer<typeof submitReviewSchema>;
