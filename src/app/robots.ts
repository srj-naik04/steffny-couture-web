import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/env';

/**
 * Next.js robots.txt generation — Phase 3
 *
 * Allows all search engines to crawl marketing pages.
 * Disallows API routes and any private paths.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== 'production') {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/book/confirmation'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
