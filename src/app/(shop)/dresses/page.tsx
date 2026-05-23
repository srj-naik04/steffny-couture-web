/**
 * Dresses catalogue page — Phase 4 (updated Phase 8)
 *
 * Server component. Fetches all products at build time (SSG) and passes them
 * to DressesClient, which handles filtering entirely on the client via
 * useSearchParams(). This makes the page fully static (○) so the <head>
 * metadata is present in the initial HTML — required for Lighthouse SEO 100.
 *
 * Filters update the URL so they are shareable and survive page refresh.
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Hero } from '@/components/marketing/Hero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { getActiveProductsFromSource } from '@/features/products/source';
import { DressesClient } from '@/features/catalog/components/DressesClient';
import { siteUrl } from '@/lib/env';
import { BRAND } from '@/constants/brand';

// Pre-render at build time — metadata must be in the initial HTML for SEO.
export const dynamic = 'force-static';
export const revalidate = 3600;

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

export default async function DressesPage() {
  const allProducts = await getActiveProductsFromSource();

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
          {/*
           * DressesClient handles filtering via useSearchParams().
           * Wrapped in Suspense so the page shell renders immediately while
           * the client-side URL parsing hydrates.
           */}
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] animate-pulse rounded-xl bg-surface-alt"
                    aria-hidden="true"
                  />
                ))}
              </div>
            }
          >
            <DressesClient allProducts={allProducts} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
