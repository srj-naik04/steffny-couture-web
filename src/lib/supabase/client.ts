'use client';

/**
 * Browser Supabase client — for use in Client Components only.
 *
 * Creates a new client instance each call (cheap; @supabase/ssr caches the
 * underlying GoTrue instance). Do not memoize at module level — it would
 * break hot-reload and Next.js Fast Refresh.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { publicEnv } from '@/lib/env';

export function createBrowserSupabaseClient() {
  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase env vars missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local',
    );
  }
  return createBrowserClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
