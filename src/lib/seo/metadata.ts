/**
 * SEO metadata helpers — Phase 3
 *
 * buildMetadata() returns a Next.js Metadata object for a given route path.
 * Consumes from src/content/marketing/seo.ts and src/lib/env.ts.
 *
 * The root layout applies a title template "%s — Steffny Couture".
 * Titles returned here are the page-specific fragment only.
 */

import type { Metadata } from 'next';
import { siteUrl } from '@/lib/env';
import { marketingSeo } from '@/content/marketing/seo';
import { BRAND } from '@/constants/brand';

/**
 * Builds a full Next.js Metadata object for a given route path.
 * Falls back to brand-level defaults when the path is not in marketingSeo.
 *
 * @example
 *   export const metadata = buildMetadata('/about');
 */
export function buildMetadata(routePath: string): Metadata {
  const page = marketingSeo[routePath];

  if (!page) {
    return {};
  }

  const canonicalUrl = `${siteUrl}${routePath}`;
  const ogImageUrl = page.ogImage
    ? `${siteUrl}${page.ogImage}`
    : `${siteUrl}/assets/hero/bride-bangles-portrait.jpg`;

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      url: canonicalUrl,
      siteName: BRAND.name,
      title: page.title,
      description: page.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [ogImageUrl],
    },
  };
}
