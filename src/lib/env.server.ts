import 'server-only';
import { z } from 'zod';

/** Treat empty strings and whitespace as undefined so `.optional()` covers them. */
const emptyToUndef = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

// ---------------------------------------------------------------------------
// Server-only env — never exposed to browser bundles
// ---------------------------------------------------------------------------
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(emptyToUndef, z.string().min(1).optional()),
});

export const serverEnv = serverEnvSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});
