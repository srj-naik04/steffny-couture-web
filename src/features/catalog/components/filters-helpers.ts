/**
 * filters-helpers — Phase 4
 *
 * Pure server-safe helpers for the dresses catalogue filters.
 * NO React, NO hooks, NO 'use client' directive.
 *
 * Exported from here so the server page (dresses/page.tsx) can import them
 * without crossing the client boundary that Filters.tsx lives behind.
 */

import type { ProductCard } from '@/features/products/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FilterState {
  categories: string[];
  colours: string[];
  occasions: string[];
  maxPrice: number;
}

// ---------------------------------------------------------------------------
// parseFilters — convert URL search params → FilterState
// ---------------------------------------------------------------------------

export function parseFilters(
  params: URLSearchParams,
  maxPriceRange: number,
  allowed?: { categories?: string[]; colours?: string[]; occasions?: string[] },
): FilterState {
  const rawCategories = params.get('category')
    ? params.get('category')!.split(',').filter(Boolean)
    : [];
  const rawColours = params.get('colour')
    ? params.get('colour')!.split(',').filter(Boolean)
    : [];
  const rawOccasions = params.get('occasion')
    ? params.get('occasion')!.split(',').filter(Boolean)
    : [];
  const maxPrice = params.get('maxPrice')
    ? Math.min(Number(params.get('maxPrice')), maxPriceRange)
    : maxPriceRange;

  const categories = allowed?.categories
    ? rawCategories.filter((v) => allowed.categories!.includes(v))
    : rawCategories;
  const colours = allowed?.colours
    ? rawColours.filter((v) => allowed.colours!.includes(v))
    : rawColours;
  const occasions = allowed?.occasions
    ? rawOccasions.filter((v) => allowed.occasions!.includes(v))
    : rawOccasions;

  return { categories, colours, occasions, maxPrice };
}

// ---------------------------------------------------------------------------
// applyFilters — filter a product list server-side
// ---------------------------------------------------------------------------

export function applyFilters(
  products: ProductCard[],
  filters: FilterState,
): ProductCard[] {
  return products.filter((p) => {
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(p.category)
    ) {
      return false;
    }
    if (
      filters.colours.length > 0 &&
      !(p.primary_colour && filters.colours.includes(p.primary_colour))
    ) {
      return false;
    }
    if (
      filters.occasions.length > 0 &&
      !p.occasion.some((occ) => filters.occasions.includes(occ))
    ) {
      return false;
    }
    if (p.price > filters.maxPrice) {
      return false;
    }
    return true;
  });
}
