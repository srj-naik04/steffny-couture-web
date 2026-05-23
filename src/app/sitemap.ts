import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/env';

/**
 * Next.js sitemap generation — Phase 3
 *
 * Includes all marketing routes. Excludes /api/ and private routes.
 * Phase 4 will extend this to include individual dress slugs.
 * Phase 7 will extend to include individual journal post slugs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services/alterations`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/services/custom-bridal`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/services/bridesmaid`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/dresses`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/reviews`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/journal`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/book`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
