/**
 * Products source — Phase 4
 *
 * Wraps api.ts Supabase calls with a JSON fallback for demo/dev mode.
 * Order of preference:
 *   1. Supabase (live data, post-seed)
 *   2. data/products.json + data/optimised-images.json (local / demo mode)
 *
 * A single console.warn fires when the fallback engages so the developer
 * knows which path is active. Silent in production once Supabase is seeded.
 */

import {
  getActiveProducts,
  getFeaturedProducts,
  getProductBySlug,
  getRelatedProducts,
  type ProductCard,
  type ProductDetail,
} from './api';
import { hasSupabase, isDemoMode } from '@/lib/env';

/**
 * True when we should skip the Supabase round-trip entirely and go straight
 * to the local JSON fallback. This prevents a ~1.8 s TTFB stall on pages that
 * await Supabase while it is unreachable (demo/local environment).
 */
const useLocalOnly = isDemoMode || !hasSupabase;

// ---------------------------------------------------------------------------
// Local JSON shapes (what data/products.json contains)
// ---------------------------------------------------------------------------

interface LocalProduct {
  slug: string;
  name: string;
  short_description: string | null;
  description: string;
  story?: string | null;
  category: string;
  price: number;
  currency: string;
  primary_colour: string | null;
  available_sizes: string[];
  available_colours: string[];
  length: string | null;
  occasion: string[];
  featured: boolean;
  images: string[];
}

interface LocalOptimisedImage {
  source: string;
  originalWidth: number;
  originalHeight: number;
  aspectRatio: number;
  variants: { filename: string; format: string; width: number }[];
  blurDataURL: string;
}

// ---------------------------------------------------------------------------
// Lazy-loaded JSON data (server-side only — these are static imports in Node)
// ---------------------------------------------------------------------------

let _products: LocalProduct[] | null = null;
let _optimisedImages: LocalOptimisedImage[] | null = null;

function getLocalProducts(): LocalProduct[] {
  if (_products) return _products;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  _products = require('../../../data/products.json') as LocalProduct[];
  return _products;
}

function getLocalOptimisedImages(): LocalOptimisedImage[] {
  if (_optimisedImages) return _optimisedImages;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  _optimisedImages = require('../../../data/optimised-images.json') as LocalOptimisedImage[];
  return _optimisedImages;
}

// ---------------------------------------------------------------------------
// Slug → deterministic "id" (stable across requests; just for demo mode)
// ---------------------------------------------------------------------------

function slugToId(slug: string): string {
  // Produce a UUID-v4-shaped string from the slug so downstream code
  // that treats `id` as a UUID doesn't choke. Simple but stable.
  const hex = Buffer.from(slug.padEnd(16, '0').slice(0, 16)).toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(16, 19)}-${hex.slice(19, 32).padEnd(12, '0')}`;
}

// ---------------------------------------------------------------------------
// Build ProductCard from a local product record
// ---------------------------------------------------------------------------

function localProductToCard(local: LocalProduct): ProductCard {
  const optimisedImages = getLocalOptimisedImages();
  const sourceKey = `products/${local.slug}/01.jpg`;
  const opt = optimisedImages.find((img) => img.source === sourceKey);

  const imagePath = `/assets/products/${local.slug}/01.jpg`;
  const storagePath = `/assets/products/${local.slug}/01.jpg`;

  const productImage = opt
    ? {
        id: `img-${local.slug}-01`,
        product_id: slugToId(local.slug),
        storage_path: storagePath,
        alt_text: `${local.name} — front view`,
        blur_data_url: opt.blurDataURL,
        aspect_ratio: opt.aspectRatio,
        variants: opt.variants as unknown as import('@/types/database').Database['public']['Tables']['product_images']['Row']['variants'],
        width: opt.originalWidth,
        height: opt.originalHeight,
        display_order: 0,
        is_primary: true,
        created_at: new Date().toISOString(),
      }
    : null;

  return {
    id: slugToId(local.slug),
    slug: local.slug,
    name: local.name,
    short_description: local.short_description ?? null,
    description: local.description,
    category: local.category,
    price: local.price,
    currency: local.currency,
    primary_colour: local.primary_colour ?? null,
    available_sizes: local.available_sizes,
    available_colours: local.available_colours,
    length: local.length ?? null,
    occasion: local.occasion,
    featured: local.featured,
    display_order: getLocalProducts().indexOf(local),
    stock: null,
    blur_data_url: opt?.blurDataURL ?? null,
    images: productImage ? [productImage] : [],
    // imagePath is stored only in images[].storage_path; kept here for convenience
    _imagePath: imagePath,
  } as ProductCard & { _imagePath: string };
}

function localProductToDetail(local: LocalProduct): ProductDetail {
  const card = localProductToCard(local);
  return {
    ...card,
    story: local.story ?? null,
    created_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Error classification helper
// ---------------------------------------------------------------------------

/**
 * Returns true when the error is a Next.js static-generation "dynamic server
 * usage" error (cookies() called during SSG). This is expected during
 * `generateStaticParams` pre-rendering and should not produce a verbose warn.
 */
function isDynamicServerError(err: unknown): boolean {
  if (err instanceof Error) {
    return (
      (err as Error & { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE' ||
      err.message.includes('DYNAMIC_SERVER_USAGE') ||
      err.message.includes("couldn't be rendered statically")
    );
  }
  return false;
}

function warnFallback(label: string, err?: unknown) {
  if (err && !isDynamicServerError(err)) {
    console.warn(`[products/source] Supabase ${label} failed, using local fallback:`, err);
  }
  // For DYNAMIC_SERVER_USAGE (SSG pre-render) or no-error cases, emit a
  // single quiet line so local dev can confirm which path is active.
  console.warn(`[products/source] Using local JSON fallback for ${label}`);
}

// ---------------------------------------------------------------------------
// Exported wrapper functions
// ---------------------------------------------------------------------------

export async function getActiveProductsFromSource(): Promise<ProductCard[]> {
  if (!useLocalOnly) {
    try {
      const products = await getActiveProducts();
      if (products.length > 0) return products;
    } catch (err) {
      warnFallback('getActiveProducts', err);
      return getLocalProducts().map(localProductToCard);
    }
  }

  warnFallback('getActiveProducts');
  return getLocalProducts().map(localProductToCard);
}

export async function getFeaturedProductsFromSource(limit = 4): Promise<ProductCard[]> {
  if (!useLocalOnly) {
    try {
      const products = await getFeaturedProducts(limit);
      if (products.length > 0) return products;
    } catch (err) {
      warnFallback('getFeaturedProducts', err);
      return getLocalProducts()
        .filter((p) => p.featured)
        .slice(0, limit)
        .map(localProductToCard);
    }
  }

  warnFallback('getFeaturedProducts');
  return getLocalProducts()
    .filter((p) => p.featured)
    .slice(0, limit)
    .map(localProductToCard);
}

export async function getProductBySlugFromSource(
  slug: string,
): Promise<ProductDetail | null> {
  if (!useLocalOnly) {
    try {
      const product = await getProductBySlug(slug);
      if (product) return product;
    } catch (err) {
      warnFallback(`getProductBySlug("${slug}")`, err);
      const local = getLocalProducts().find((p) => p.slug === slug);
      return local ? localProductToDetail(local) : null;
    }
  }

  warnFallback(`getProductBySlug("${slug}")`);
  const local = getLocalProducts().find((p) => p.slug === slug);
  if (!local) return null;
  return localProductToDetail(local);
}

export async function getRelatedProductsFromSource(
  productId: string,
  category: string,
  limit = 3,
): Promise<ProductCard[]> {
  if (!useLocalOnly) {
    try {
      const products = await getRelatedProducts(productId, category, limit);
      if (products.length > 0) return products;
    } catch (err) {
      warnFallback('getRelatedProducts', err);
      return getLocalProducts()
        .filter((p) => p.category === category && slugToId(p.slug) !== productId)
        .slice(0, limit)
        .map(localProductToCard);
    }
  }

  warnFallback('getRelatedProducts');
  return getLocalProducts()
    .filter((p) => p.category === category && slugToId(p.slug) !== productId)
    .slice(0, limit)
    .map(localProductToCard);
}

export async function getAllProductSlugsFromSource(): Promise<string[]> {
  if (!useLocalOnly) {
    try {
      const products = await getActiveProducts();
      if (products.length > 0) return products.map((p) => p.slug);
    } catch {
      // fall through to local JSON silently (called from sitemap/generateStaticParams)
    }
  }
  return getLocalProducts().map((p) => p.slug);
}
