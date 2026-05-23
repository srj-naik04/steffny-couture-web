/**
 * Admin Supabase client — service-role key, bypasses RLS.
 *
 * SERVER-ONLY. The `server-only` package causes a hard build error if this
 * module is imported from a Client Component or the browser bundle. This is
 * intentional defence-in-depth: a leaked service-role key is catastrophic.
 *
 * Use sparingly:
 *  - Seeding / migration scripts (scripts/seed-products.ts)
 *  - Trusted server-to-server webhooks
 *  - Admin tasks that genuinely need to bypass RLS
 *
 * Do NOT use for ordinary product reads, booking writes, or any path that
 * executes on behalf of a normal website visitor — those all use the server
 * client with the anon key so that RLS applies.
 */

import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { publicEnv } from '@/lib/env';
import { serverEnv } from '@/lib/env.server';

export function createAdminClient() {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const key = serverEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for the admin client.',
    );
  }

  return createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
