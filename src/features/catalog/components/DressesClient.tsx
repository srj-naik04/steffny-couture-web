/**
 * DressesClient — Phase 8 (SEO fix)
 *
 * Client-side wrapper for the dresses catalogue. Receives the full product
 * list from the server and handles filtering entirely on the client via
 * useSearchParams(). This lets dresses/page.tsx be fully static (○) so the
 * <head> metadata is included in the initial HTML — necessary for Lighthouse
 * SEO 100 score.
 *
 * The Filters component still updates the URL so filters are shareable and
 * survive refresh — the difference is that the filtered list is computed here
 * on the client rather than being passed down from the server page.
 */

'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Filters } from '@/features/catalog/components/Filters';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import Link from 'next/link';
import { parseFilters, applyFilters } from '@/features/catalog/components/filters-helpers';
import type { ProductCard as ProductCardType } from '@/features/products/api';

interface DressesClientProps {
  allProducts: ProductCardType[];
}

export function DressesClient({ allProducts }: DressesClientProps) {
  const searchParams = useSearchParams();

  // Derive filter metadata from products once
  const allCategories = React.useMemo(
    () => [...new Set(allProducts.map((p) => p.category))].sort(),
    [allProducts],
  );
  const allColours = React.useMemo(
    () =>
      [
        ...new Set(
          allProducts.map((p) => p.primary_colour).filter(Boolean) as string[],
        ),
      ].sort(),
    [allProducts],
  );
  const allOccasions = React.useMemo(
    () => [...new Set(allProducts.flatMap((p) => p.occasion))].sort(),
    [allProducts],
  );
  const maxPriceRange = React.useMemo(
    () => Math.ceil(Math.max(...allProducts.map((p) => p.price)) / 50) * 50 || 1000,
    [allProducts],
  );

  // Parse filters from URL each render
  const urlParams = new URLSearchParams(searchParams.toString());
  const currentFilters = parseFilters(urlParams, maxPriceRange, {
    categories: allCategories,
    colours: allColours,
    occasions: allOccasions,
  });

  const filteredProducts = applyFilters(allProducts, currentFilters);

  const hasActiveFilters =
    currentFilters.categories.length > 0 ||
    currentFilters.colours.length > 0 ||
    currentFilters.occasions.length > 0 ||
    currentFilters.maxPrice < maxPriceRange;

  const resultLabel =
    filteredProducts.length === allProducts.length
      ? `${allProducts.length} piece${allProducts.length === 1 ? '' : 's'}`
      : `${filteredProducts.length} of ${allProducts.length} piece${allProducts.length === 1 ? '' : 's'}`;

  return (
    <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
      {/* Filters column */}
      <aside aria-label="Product filters">
        <Filters
          allCategories={allCategories}
          allColours={allColours}
          allOccasions={allOccasions}
          maxPriceRange={maxPriceRange}
          currentFilters={currentFilters}
        />
      </aside>

      {/* Grid column */}
      <div>
        {/* sr-only h2 preserves heading hierarchy: h1 (hero) → h2 (collection) → h3 (product cards) */}
        <h2 className="sr-only">The collection</h2>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-small text-ink-muted">{resultLabel}</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-body-lg text-ink-muted">
              No matches yet. Try widening your filters.
            </p>
            {hasActiveFilters && (
              <Link
                href="/dresses"
                className="text-small text-rose font-medium underline underline-offset-2 hover:text-rose-dark"
              >
                Clear all filters
              </Link>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
