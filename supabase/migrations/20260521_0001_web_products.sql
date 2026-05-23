-- =============================================================================
-- Migration: 20260521_0001_web_products.sql
-- Purpose:   Create the `products` table (dress catalogue) and `product_images`
--            table (multi-image support per product), both web-only and additive.
--
-- Rollback notes:
--   DROP TABLE IF EXISTS public.product_images CASCADE;
--   DROP TABLE IF EXISTS public.products CASCADE;
--   DROP FUNCTION IF EXISTS public.set_updated_at CASCADE;
--
-- Dependencies: none (no shared tables modified)
-- Convention:   YYYYMMDD_NNNN_<description>.sql (see docs/DATABASE_WEB.md)
-- =============================================================================

-- ----------------------------------------------------------------------------
-- Helper trigger function — reuse across all web tables
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- products
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              text        UNIQUE NOT NULL,
  name              text        NOT NULL,
  short_description text,                        -- one-liner for cards/grids
  description       text        NOT NULL,
  story             text,                        -- long narrative for detail page
  category          text        NOT NULL,        -- 'wedding' | 'evening' | 'occasion' | 'bridal'
  price             numeric(10,2) NOT NULL,
  currency          text        NOT NULL DEFAULT 'GBP',
  primary_colour    text,
  available_sizes   text[]      NOT NULL DEFAULT '{}',
  available_colours text[]      NOT NULL DEFAULT '{}',
  length            text,                        -- 'long' | 'midi' | 'short'
  occasion          text[]      NOT NULL DEFAULT '{}', -- multi: 'wedding' | 'engagement' | 'prom' | 'party'
  active            boolean     NOT NULL DEFAULT true,
  featured          boolean     NOT NULL DEFAULT false,
  display_order     int         NOT NULL DEFAULT 0,
  stock             int,                         -- NULL = made to order; number = limited stock
  blur_data_url     text,                        -- base64 placeholder for next/image
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_active_idx    ON public.products(active, display_order);
CREATE INDEX IF NOT EXISTS products_featured_idx  ON public.products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS products_category_idx  ON public.products(category);
CREATE INDEX IF NOT EXISTS products_slug_idx      ON public.products(slug);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Trigger: keep updated_at current
DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS policies -----------------------------------------------------------------

-- Anon/guest: read active products
CREATE POLICY "anon read active products"
  ON public.products FOR SELECT
  TO anon
  USING (active = true);

-- Authenticated users (staff / tailor / manager / owner): read all, including inactive
CREATE POLICY "authenticated read all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (true);

-- Staff can insert new products
CREATE POLICY "staff insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Staff can update products
CREATE POLICY "staff update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Staff can delete products
CREATE POLICY "staff delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- product_images
-- Note: aspect_ratio and variants columns added to match seed-products.ts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path  text        NOT NULL,    -- e.g. 'products/maroon-wedding-dress-1-1600.webp'
  alt_text      text        NOT NULL,
  blur_data_url text,
  aspect_ratio  numeric(6,4),            -- width / height, e.g. 0.6935 (for next/image sizing)
  variants      jsonb,                   -- [{width, format, storage_path}, ...] for srcset
  width         int,
  height        int,
  display_order int         NOT NULL DEFAULT 0,
  is_primary    boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, storage_path)
);

CREATE INDEX IF NOT EXISTS product_images_product_idx ON public.product_images(product_id, display_order);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- RLS policies -----------------------------------------------------------------

-- Anon/guest: read images for active products only (enforced at DB layer)
CREATE POLICY "anon read product images"
  ON public.product_images FOR SELECT
  TO anon
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_images.product_id AND p.active = true));

-- Authenticated: read all
CREATE POLICY "authenticated read all product images"
  ON public.product_images FOR SELECT
  TO authenticated
  USING (true);

-- Staff: write
CREATE POLICY "staff insert product images"
  ON public.product_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "staff update product images"
  ON public.product_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "staff delete product images"
  ON public.product_images FOR DELETE
  TO authenticated
  USING (true);
