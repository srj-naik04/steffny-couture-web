/**
 * Dresses catalogue page — Phase 4
 *
 * Server component. Fetches all products via the source wrapper (Supabase
 * or local JSON fallback), parses URL filter params, and renders the grid.
 *
 * The Filters component is client — it manages URL state. The ProductGrid
 * is server — it receives the already-filtered list.
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Hero } from '@/components/marketing/Hero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { getActiveProductsFromSource } from '@/features/products/source';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { Filters } from '@/features/catalog/components/Filters';
import {
  parseFilters,
  applyFilters,
} from '@/features/catalog/components/filters-helpers';
import { siteUrl } from '@/lib/env';
import { BRAND } from '@/constants/brand';

export const metadata: Metadata = {
  title: 'The dress collection',
  description:
    'Browse the full Steffny Couture collection — wedding gowns, evening dresses, and occasion wear, all hand-finished at the Hounslow studio.',
  keywords: [
    'wedding dresses London',
    'evening gowns Hounslow',
    'couture dresses',
    'South Asian bridal',
    'occasion wear London',
  ],
  alternates: {
    canonical: `${siteUrl}/dresses`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: `${siteUrl}/dresses`,
    siteName: BRAND.name,
    title: 'The dress collection — Steffny Couture',
    description:
      'Browse the full Steffny Couture collection — wedding gowns, evening dresses, and occasion wear, all hand-finished at the Hounslow studio.',
    images: [
      {
        url: `${siteUrl}/assets/hero/bride-bangles-portrait.jpg`,
        width: 1200,
        height: 630,
        alt: 'The Steffny Couture dress collection',
      },
    ],
  },
};

interface DressesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DressesPage({ searchParams }: DressesPageProps) {
  const allProducts = await getActiveProductsFromSource();

  // Build filter meta from the full product list
  const allCategories = [...new Set(allProducts.map((p) => p.category))].sort();
  const allColours = [
    ...new Set(
      allProducts.map((p) => p.primary_colour).filter(Boolean) as string[],
    ),
  ].sort();
  const allOccasions = [
    ...new Set(allProducts.flatMap((p) => p.occasion)),
  ].sort();
  const maxPriceRange =
    Math.ceil(Math.max(...allProducts.map((p) => p.price)) / 50) * 50 || 1000;

  // Parse filter params from URL
  const resolvedParams = await searchParams;
  const paramEntries = Object.entries(resolvedParams).map(([k, v]) => [
    k,
    Array.isArray(v) ? v[0] : (v ?? ''),
  ]);
  const urlParams = new URLSearchParams(paramEntries as [string, string][]);
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
    <>
      <Hero
        kicker="The collection"
        headline="Couture and ready-to-wear"
        subhead="Hand-finished gowns for weddings, evenings, and the moments that deserve to be remembered. Each piece is made or curated at the Hounslow studio."
        variant="service"
      />

      <Section tone="ivory" spacing="md">
        <Container>
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
            {/* Filters column */}
            <aside aria-label="Product filters">
              <Suspense fallback={null}>
                <Filters
                  allCategories={allCategories}
                  allColours={allColours}
                  allOccasions={allOccasions}
                  maxPriceRange={maxPriceRange}
                  currentFilters={currentFilters}
                />
              </Suspense>
            </aside>

            {/* Grid column */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-small text-ink-muted">
                  {resultLabel}
                </p>
              </div>
              <ProductGrid
                products={filteredProducts}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
