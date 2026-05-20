# Database — Web Tables & Shared Schema

The website shares the same Supabase project as the mobile app. This document describes web-specific tables, shared tables, and the contract between them.

## Shared with mobile app

These tables exist for the mobile app. The website reads or writes them. **Do not modify their structure without coordinating.**

### `bookings`
The core booking record. Mobile app manages staff workflow. Website creates them via the booking wizard.

| Column | Type | Web behaviour | Mobile behaviour |
|---|---|---|---|
| id | uuid | (auto) | (auto) |
| reference | text | Generated `SC-XXXXXX` | Same |
| type | text | `alteration` / `custom` / `consultation` | Same |
| alteration_type_id | uuid | Optional FK | Same |
| garment_type | text | Required | Same |
| description | text | Required | Same |
| appointment_date | date | Required | Same |
| appointment_time | time | Required | Same |
| photo_paths | text[] | Optional, from Storage | Same |
| status | text | Defaults to `new` | Mobile updates through workflow |
| guest_name | text | Required (web is guest-only) | Optional (uses user_id instead) |
| guest_phone | text | Required | Optional |
| guest_email | text | Required | Optional |
| user_id | uuid | NULL on web | Set on mobile |
| source | text | `'web'` | `'mobile'` or `'staff'` |
| created_at | timestamptz | (auto) | (auto) |
| updated_at | timestamptz | (auto) | (auto) |

**RLS:** anyone can insert; only staff can update.

### `shop_settings`
| Column | Web behaviour |
|---|---|
| All fields | Read-only |

Website reads opening hours, slot config, etc. Mobile staff manages.

### `alteration_types`
| Column | Web behaviour |
|---|---|
| All fields | Read-only |

Website reads to show types in the booking wizard. Mobile staff manages.

### `users`
| Column | Web behaviour |
|---|---|
| All fields | Not used directly (web is guest-only) |

Reserved for Phase 2+ when web has accounts.

## Web-only tables

### `products`
The dress catalogue.

```sql
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  story text,
  category text NOT NULL,          -- 'wedding', 'evening', 'occasion', 'bridal'
  price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'GBP',
  primary_colour text,
  available_sizes text[] NOT NULL DEFAULT '{}',
  available_colours text[] NOT NULL DEFAULT '{}',
  length text,                     -- 'long', 'midi', 'short'
  occasion text[],                 -- multi: 'wedding', 'engagement', 'prom', 'party'
  active boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  stock int,                       -- NULL = made to order, number = limited
  blur_data_url text,              -- placeholder for next/image
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX products_active_idx ON public.products(active, display_order);
CREATE INDEX products_featured_idx ON public.products(featured) WHERE featured = true;
CREATE INDEX products_category_idx ON public.products(category);
```

RLS: anyone reads active products; staff manages.

### `product_images`
Multiple images per product.

```sql
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path text NOT NULL,      -- e.g. 'products/maroon-wedding-dress-1.jpg'
  alt_text text NOT NULL,
  blur_data_url text,
  width int,
  height int,
  display_order int NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX product_images_product_idx ON public.product_images(product_id, display_order);
```

RLS: anyone reads; staff manages.

### `inquiries`
Website "I'm interested in this dress" submissions + mock checkout orders.

```sql
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,  -- 'SC-XXXXXXXX'
  type text NOT NULL,              -- 'product_inquiry' | 'product_order' | 'general'
  product_id uuid REFERENCES public.products(id),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text,
  items jsonb,                     -- for orders: [{productId, variantId, name, price, qty}, ...]
  total numeric(10,2),
  message text,
  status text NOT NULL DEFAULT 'new',  -- 'new' | 'contacted' | 'closed'
  source text NOT NULL DEFAULT 'web',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX inquiries_status_idx ON public.inquiries(status, created_at DESC);
```

RLS: anyone inserts; staff reads + updates.

### `reviews`
Customer reviews. Submitted via web, moderated via mobile app.

```sql
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_location text,            -- e.g. 'Hounslow, London'
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  body text NOT NULL,
  occasion text,                   -- e.g. 'wedding alterations'
  published boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX reviews_published_idx ON public.reviews(published, created_at DESC);
```

RLS: anyone reads published; anyone inserts (unpublished); staff publishes + features.

### `journal_views`
Anonymous view counter for blog posts.

```sql
CREATE TABLE public.journal_views (
  slug text PRIMARY KEY,           -- matches MDX filename
  views int NOT NULL DEFAULT 0,
  last_viewed_at timestamptz
);
```

RLS: anyone can call `increment_view(slug)` RPC; no direct table access.

## Storage buckets

### `public/` bucket
Anyone can read; only authenticated staff can write.

Folders:
- `products/` — dress photography
- `about/` — about page photos
- `hero/` — homepage hero images
- `journal/` — blog post images

URLs follow:
```
https://<project>.supabase.co/storage/v1/object/public/products/<filename>
```

These work with `next/image` as long as the hostname is in `next.config.ts` `remotePatterns`.

## RLS Role Model

Same four-role model as the mobile app:
- **customer** (signed-in via mobile app) — limited reads
- **tailor** (Steffi) — broad reads + writes on bookings, products, reviews
- **manager** (Rohan) — full reads + writes
- **owner** — same as manager

Website operates as **guest** (anonymous), with very specific allowed actions:
- Read active products, product_images, published reviews, alteration_types, shop_settings
- Insert into bookings (with source = 'web')
- Insert into inquiries
- Insert into reviews (with published = false)
- Call `increment_view(slug)` RPC

## Migrations

Web project migrations live in `supabase/migrations/` like the mobile app. **Coordinate timestamps** so they apply in order.

Naming: `YYYYMMDD_HHMM_<description>.sql`

Each web-only table migration must:
1. `CREATE TABLE IF NOT EXISTS`
2. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
3. Define explicit policies (no implicit denial)
4. Add necessary indexes
5. Add updated_at trigger if applicable

## Type generation

After any migration, regenerate types:

```bash
npx supabase gen types typescript --project-id <id> > types/database.ts
```

This produces a typed `Database` interface used by `@supabase/ssr`.

## Backups

Supabase Pro tier includes daily backups, 7-day retention. Manual backups via:
```bash
npx supabase db dump > backup-$(date +%Y%m%d).sql
```

Before major migrations, take a manual backup.
