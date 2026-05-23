import { z } from 'zod';

/** Treat empty strings and whitespace as undefined so `.optional()` covers them. */
const emptyToUndef = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

// ---------------------------------------------------------------------------
// Public env — safe to access in browser bundles
// ---------------------------------------------------------------------------
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(emptyToUndef, z.string().url().optional()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(emptyToUndef, z.string().min(1).optional()),
  NEXT_PUBLIC_SITE_URL: z.preprocess(emptyToUndef, z.string().url().optional()),
  NEXT_PUBLIC_DEMO_MODE: z
    .string()
    .optional()
    .default('true')
    .transform((v) => v === 'true'),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
});

export const siteUrl =
  publicEnv.NEXT_PUBLIC_SITE_URL ?? 'https://www.steffnycouture.co.uk';

/** True when running in demo / staging mode — e.g. to show a "demo" badge. */
export const isDemoMode = publicEnv.NEXT_PUBLIC_DEMO_MODE;

/** True when the Supabase credentials are present (local dev may omit them). */
export const hasSupabase = Boolean(
  publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/**
 * Returns the public Supabase Storage URL for a given bucket path.
 * Example: storageUrl('products/my-dress-1600.webp') →
 *   https://abc.supabase.co/storage/v1/object/public/dress-photos/products/my-dress-1600.webp
 *
 * Falls back to a data-URI placeholder when SUPABASE_URL is not set (local
 * dev without Supabase credentials).
 */
export function storageUrl(path: string, bucket = 'dress-photos'): string {
  const base = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return `/assets/optimised/${path}`;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
