/**
 * Server Supabase client — for use in Server Components, Server Actions,
 * and Route Handlers.
 *
 * Reads Next.js cookies so that any auth session established in the browser
 * (e.g. future staff login) is respected. The `setAll` implementation is a
 * no-op when called from a Server Component (cookies are read-only there);
 * the try/catch is intentional per the @supabase/ssr docs.
 *
 * NOTE: Importing `cookies` from `next/headers` makes any page that calls this
 * function dynamic (opt-out of static generation). For fully static pages
 * (about, journal posts) prefer passing data via props from a parent RSC.
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';
import { publicEnv } from '@/lib/env';

export async function createServerSupabaseClient() {
  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase env vars missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local',
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Swallow: this runs in Server Components where cookies are read-only.
          }
        },
      },
    },
  );
}
