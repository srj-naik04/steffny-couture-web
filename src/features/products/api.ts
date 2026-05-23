/**
 * Products API — server-side data access for the dress catalogue.
 *
 * All functions use the anon-key server client so that RLS applies.
 * These are server-only (no 'use client') and designed to be called directly
 * from React Server Components or Server Actions.
 *
 * Column selection is explicit — select only what the UI needs.
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ProductImage } from '@/lib/supabase/types';

// ---------------------------------------------------------------------------
// Projection types
// ---------------------------------------------------------------------------

/**
 * Columns returned for list / grid views.
 * Deliberately excludes `story`, `active`, `created_at`, `updated_at` to
 * keep the payload small. The full `Product` row type is not used here.
 */
export interface ProductCard {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string;
  category: string;
  price: number;
  currency: string;
  primary_colour: string | null;
  available_sizes: string[];
  available_colours: string[];
  length: string | null;
  occasion: string[];
  featured: boolean;
  display_order: number;
  stock: number | null;
  blur_data_url: string | null;
  images: ProductImage[];
}

/**
 * Full product shape for the detail page — includes `story`.
 * `active` and `updated_at` are excluded (callers don't need them in UI).
 */
export interface ProductDetail extends ProductCard {
  story: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Column selects
// ---------------------------------------------------------------------------

const PRODUCT_CARD_COLS = `
  id,
  slug,
  name,
  short_description,
  description,
  category,
  price,
  currency,
  primary_colour,
  available_sizes,
  available_colours,
  length,
  occasion,
  featured,
  display_order,
  stock,
  blur_data_url,
  images:product_images(
    id,
    product_id,
    storage_path,
    alt_text,
    blur_data_url,
    aspect_ratio,
    variants,
    width,
    height,
    display_order,
    is_primary,
    created_at
  )
` as const;

const PRODUCT_DETAIL_COLS = `
  id,
  slug,
  name,
  short_description,
  description,
  story,
  category,
  price,
  currency,
  primary_colour,
  available_sizes,
  available_colours,
  length,
  occasion,
  featured,
  display_order,
  stock,
  blur_data_url,
  created_at,
  images:product_images(
    id,
    product_id,
    storage_path,
    alt_text,
    blur_data_url,
    aspect_ratio,
    variants,
    width,
    height,
    display_order,
    is_primary,
    created_at
  )
` as const;

// ---------------------------------------------------------------------------
// getActiveProducts
// ---------------------------------------------------------------------------
/**
 * Returns all active products, ordered by display_order, each with its
 * associated images sorted by display_order.
 *
 * Used by: /dresses (catalogue grid)
 */
export async function getActiveProducts(): Promise<ProductCard[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_CARD_COLS)
    .eq('active', true)
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`getActiveProducts failed: ${error.message}`);
  }

  return (data ?? []).map(sortImages) as ProductCard[];
}

// ---------------------------------------------------------------------------
// getFeaturedProducts
// ---------------------------------------------------------------------------
/**
 * Returns up to `limit` featured active products, ordered by display_order.
 *
 * Used by: home page "Our collection" section.
 *
 * @param limit - Maximum number of products to return (default: 4)
 */
export async function getFeaturedProducts(limit = 4): Promise<ProductCard[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_CARD_COLS)
    .eq('active', true)
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`getFeaturedProducts failed: ${error.message}`);
  }

  return (data ?? []).map(sortImages) as ProductCard[];
}

// ---------------------------------------------------------------------------
// getProductBySlug
// ---------------------------------------------------------------------------
/**
 * Returns a single active product by slug, with all images.
 * Returns null if the product does not exist or is inactive.
 *
 * Used by: /dresses/[slug] (product detail page)
 *
 * Callers should call `notFound()` when this returns null.
 */
export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_DETAIL_COLS)
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    throw new Error(`getProductBySlug("${slug}") failed: ${error.message}`);
  }

  if (!data) return null;

  return sortImages(data) as ProductDetail;
}

// ---------------------------------------------------------------------------
// getRelatedProducts
// ---------------------------------------------------------------------------
/**
 * Returns up to `limit` active products in the same category, excluding the
 * current product.
 *
 * Used by: /dresses/[slug] "You might also like" section.
 *
 * @param productId - The current product's id (excluded from results)
 * @param category  - The category to match
 * @param limit     - Maximum results (default: 3)
 */
export async function getRelatedProducts(
  productId: string,
  category: string,
  limit = 3,
): Promise<ProductCard[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_CARD_COLS)
    .eq('active', true)
    .eq('category', category)
    .neq('id', productId)
    .order('display_order', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`getRelatedProducts failed: ${error.message}`);
  }

  return (data ?? []).map(sortImages) as ProductCard[];
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Sort product images by display_order so UI code doesn't have to. */
function sortImages<T extends { images?: { display_order: number }[] | null }>(
  product: T,
): T {
  return {
    ...product,
    images: [...(product.images ?? [])].sort(
      (a, b) => a.display_order - b.display_order,
    ),
  };
}
