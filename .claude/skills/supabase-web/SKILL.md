---
name: supabase-web
description: Use this skill whenever working with Supabase from the Next.js website — client setup (browser vs server vs admin), queries, mutations, server actions, storage uploads, RLS considerations, or anything importing `@supabase/ssr`. Fires for any file in `/src/lib/supabase/`, `/src/app/api/`, server actions, or any component fetching from Supabase. The schema and RLS rules live in the mobile app's `rls-policies` skill — this skill is about web-specific client patterns.
---

# Supabase from Next.js — Conventions

The website shares the same Supabase project as the mobile app. **Never break the mobile app's contracts.** Migrations must be additive. RLS policies on shared tables must not be loosened.

## Three Clients, Three Contexts

Next.js has three different rendering contexts. Each needs the right Supabase client.

### 1. Browser client — `src/lib/supabase/client.ts`

For client components, event handlers, anything that runs in the user's browser.

```ts
'use client';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

Use:
```tsx
'use client';
import { createClient } from '@/lib/supabase/client';

export function FavouriteButton({ productId }: { productId: string }) {
  const supabase = createClient();
  // ...
}
```

### 2. Server client — `src/lib/supabase/server.ts`

For server components, server actions, route handlers. Reads cookies for auth state.

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // ignore — happens in server components that can't set cookies
          }
        },
      },
    }
  );
}
```

Use:
```tsx
// src/app/dresses/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function DressesPage() {
  const supabase = await createClient();
  const { data: dresses, error } = await supabase
    .from('products')
    .select('*, images:product_images(*)')
    .eq('is_published', true)
    .order('display_order');

  if (error) throw error;
  return <DressGrid dresses={dresses ?? []} />;
}
```

### 3. Admin client — `src/lib/supabase/admin.ts`

Service-role key. **Server-only.** Bypasses RLS. Use sparingly — only for genuine admin tasks like webhooks, scheduled jobs, internal tools.

```ts
import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY required');
  }
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}
```

The `'server-only'` import causes a build error if anyone tries to import this from a client component. Defence in depth.

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...the-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...service-role...  # NEVER prefix with NEXT_PUBLIC_
```

**Critical:** Service role key must NEVER have the `NEXT_PUBLIC_` prefix. That prefix exposes the variable to the browser. Service role = full database access. Leaking it is catastrophic.

## Standard Query Patterns

### Read in server component (preferred)

```tsx
// src/app/dresses/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DressPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !product) notFound();
  return <DressDetail product={product} />;
}
```

Use `.single()` only when you're sure of exactly one row. Use `.maybeSingle()` when zero is valid.

### Write via server action (preferred over API route)

```tsx
// src/app/contact/actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

type State = { ok: boolean; error?: string } | null;

export async function submitContactForm(_prev: State, formData: FormData): Promise<State> {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { ok: false, error: 'Check the form and try again' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('inquiries').insert({
    ...parsed.data,
    type: 'general',
  });

  if (error) {
    console.error(error);
    return { ok: false, error: "That didn't go through" };
  }

  return { ok: true };
}
```

### Storage upload from a client component

```tsx
'use client';
import { createClient } from '@/lib/supabase/client';

async function uploadPhotos(files: File[], bookingDraftId: string): Promise<string[]> {
  const supabase = createClient();
  const paths: string[] = [];

  for (const file of files) {
    const ext = file.name.split('.').pop();
    const path = `bookings/drafts/${bookingDraftId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from('booking-photos')
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    paths.push(data.path);
  }

  return paths;
}
```

For signed URLs (private buckets) when displaying:

```tsx
const supabase = await createClient();
const { data } = await supabase.storage
  .from('booking-photos')
  .createSignedUrl(path, 60 * 60); // 1 hour
```

## Shared Tables with Mobile App

These tables already exist. **Do not modify their schemas.**

| Table | Owned by | Web reads | Web writes |
|---|---|---|---|
| `profiles` | mobile | yes (for staff auth) | no |
| `bookings` | mobile | own bookings only | yes (via book-a-fitting form) |
| `alteration_types` | mobile | yes | no |
| `shop_settings` | mobile | yes (hours/contact) | no |
| `booking_status_history` | mobile | no | no |

Web-only tables (additive, owned by web project):

| Table | Purpose |
|---|---|
| `products` | Dress catalogue |
| `product_images` | Multiple images per dress |
| `product_variants` | Size/colour combos |
| `inquiries` | Contact form + dress enquiry submissions |
| `reviews` | Customer testimonials |
| `journal_posts` | Blog content (or MDX in repo, decide Phase 5) |

## Type Generation

After any schema change in Supabase:

```bash
npx supabase gen types typescript --linked > src/types/database.ts
```

Commit `src/types/database.ts`. Both web and mobile project regenerate after a shared-table change.

Derive row types in features:
```ts
import type { Database } from '@/types/database';
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
```

## Auth — Only Where Needed

The website mostly serves public visitors. Auth is only required for:
- A future "my account" area (not in v1)
- A future "review submission with verified purchase" (not in v1)

For now, **no login UI on the website**. Bookings and inquiries are submitted anonymously and tied to the customer via email/phone.

If/when auth is added, use the `@supabase/ssr` middleware pattern documented in the Supabase Next.js guide.

## Realtime — Usually Don't

Realtime makes sense in the mobile app where Steffi watches the kanban update. On a website it's rarely useful — public visitors aren't sitting on the page waiting for things to change.

Skip realtime on the web. Use server-rendered pages with appropriate `revalidate` intervals instead.

## Common Gotchas (web-specific)

- **`cookies()` is async in Next 15** — always `await cookies()`
- **`params` is a Promise in Next 15** — always `await params`
- **Service role key on client** — instant catastrophe; the linter should warn but be vigilant
- **RLS errors look like "row not found"** — not "permission denied". Check policies first.
- **Anon client + RLS-protected insert** — needs an explicit `anon` insert policy. The mobile app already has this for `bookings`.
- **Cookies in static-generation** — pages with `cookies()` are dynamic by definition. Avoid using server Supabase client in pages you want fully static.
- **Caching server-component fetches** — Next 15 changed defaults; Supabase queries run per-request unless wrapped in `unstable_cache`.

## Performance

- **Select only the columns you need**: `.select('id, name, price, cover_image_url')` not `.select('*')`
- **Use `.range(0, 19)`** for paginated lists, never load everything
- **Cache reference data** (alteration_types, shop_settings) via `unstable_cache` with a long TTL — these change weekly at most
- **Use foreign-key embeds** instead of N+1 queries: `select('*, images:product_images(*)')`
- **Index** any column used in `eq()` or `order()` that isn't already indexed

## Migration Discipline

Migrations live in `/supabase/migrations/` of THIS repo (web). The mobile app's `/supabase/migrations/` is its own thing.

Naming: `00X_web_<purpose>.sql` to distinguish from mobile-app migrations.

```
008_web_products.sql
009_web_inquiries.sql
010_web_reviews.sql
011_web_rls.sql
```

Numbering starts at 008 because the mobile app uses 001-007. **Confirm the highest mobile-app migration number before adding a new web migration.**

## When in Doubt

Read the mobile app's `supabase` skill for the underlying patterns. This skill adds Next.js context, but the SQL and RLS philosophy are shared.
