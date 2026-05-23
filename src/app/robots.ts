import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/env';

/**
 * Next.js robots.txt generation — Phase 5 (updated from Phase 8)
 *
 * Allows all search engines to crawl marketing pages.
 * Disallows API routes, checkout funnel, and other private paths.
 *
 * Indexing is permitted only when BOTH conditions hold:
 *   1. VERCEL_ENV is 'production' or undefined (local build)
 *   2. NEXT_PUBLIC_SITE_URL matches the canonical production domain
 * This prevents staging hosts (Railway, Docker, tunnels) without correct
 * env configuration from silently allowing indexing.
 */
const CANONICAL = 'https://www.steffnycouture.co.uk';

export default function robots(): MetadataRoute.Robots {
  const isProductionContext =
    (process.env.VERCEL_ENV === 'production' ||
      process.env.VERCEL_ENV === undefined) &&
    process.env.NEXT_PUBLIC_SITE_URL === CANONICAL;

  if (!isProductionContext) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/book/confirmation',
          '/checkout/',
          '/checkout/confirmation',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
