/**
 * JSON-LD structured data helpers — Phase 3
 *
 * Server-side only. Each function returns a React <script> element with
 * type="application/ld+json". Import only in Server Components or layouts.
 *
 * References:
 *   - https://schema.org/Organization
 *   - https://schema.org/WebSite
 *   - https://schema.org/LocalBusiness
 */

import { BRAND, STUDIO } from '@/constants/brand';
import { siteUrl } from '@/lib/env';

// ---------------------------------------------------------------------------
// Safe JSON-LD serialiser — prevents </script> injection via product data
// ---------------------------------------------------------------------------

export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

// ---------------------------------------------------------------------------
// Organisation — for root layout / home page
// ---------------------------------------------------------------------------

export function organizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND.name,
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    description: BRAND.description,
    sameAs: [STUDIO.instagram],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: STUDIO.phone,
      contactType: 'customer service',
      areaServed: 'GB',
      availableLanguage: 'English',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

// ---------------------------------------------------------------------------
// WebSite — enables sitelinks searchbox in Google
// ---------------------------------------------------------------------------

export function websiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND.name,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/dresses?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Person — for about page (founder Steffi)
// ---------------------------------------------------------------------------

/**
 * @param imagePath - Relative path from /public to the founder image.
 *   Defaults to the bouquet-detail portrait per IMAGE_BRIEF.md spotlight rule.
 *   Callers may override with another Steffi photo if needed.
 */
export function personJsonLd(
  imagePath = '/assets/hero/bride-bouquet-detail.jpg',
) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#founder`,
    name: 'Steffi',
    jobTitle: 'Founder and head couturier',
    description:
      'Founder of Steffny Couture, with over twenty years of experience in bridal couture and garment alteration in Hounslow, West London.',
    image: `${siteUrl}${imagePath}`,
    worksFor: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: BRAND.name,
    },
    url: `${siteUrl}/about`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

// ---------------------------------------------------------------------------
// LocalBusiness — for contact page
// ---------------------------------------------------------------------------

export function localBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#local-business`,
    name: BRAND.name,
    description: BRAND.description,
    url: siteUrl,
    telephone: STUDIO.phone,
    email: STUDIO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '255 High Street',
      addressLocality: 'Hounslow',
      addressRegion: 'London',
      postalCode: 'TW3 1EA',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.4677,
      longitude: -0.3602,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:30',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '11:00',
        closes: '18:00',
      },
    ],
    sameAs: [STUDIO.instagram],
    image: `${siteUrl}/assets/hero/bride-bangles-portrait.jpg`,
    priceRange: '££',
    currenciesAccepted: 'GBP',
    paymentAccepted: 'Cash, Card',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
