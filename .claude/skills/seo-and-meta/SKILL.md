---
name: seo-and-meta
description: Use this skill whenever working on page metadata, titles, descriptions, structured data, sitemap, robots, OG images, or anything that affects how the Steffny Couture website appears in search results or social shares. Fires for any `metadata` export, `generateMetadata` function, `sitemap.ts`, `robots.ts`, OG image route, or JSON-LD structured data. Enforces title/description length, the local SEO strategy targeting Hounslow and the South Asian wedding market, and the structured-data schema for Products/LocalBusiness/Reviews.
---

# SEO & Metadata

The existing Steffny Couture website ranks for almost nothing despite being in a high-intent market (Hounslow has one of London's largest South Asian wedding economies). Rebuilding with proper SEO is one of the biggest value-adds we can deliver.

## The SEO Strategy

### Target audience
1. **Hounslow / West London locals** searching for "wedding dress alterations near me"
2. **South Asian brides** searching for "lehenga alterations London", "saree blouse fitting"
3. **Prom/21st birthday/bridesmaid customers** in West London
4. **Engaged couples** searching "bridal alterations London", "wedding dress fitting"

### Target keywords (organic intent)

**Primary (high commercial intent):**
- wedding dress alterations Hounslow
- bridal alterations London
- couture alterations Hounslow
- dressmaker Hounslow
- saree blouse alterations London
- lehenga alterations London

**Secondary (informational, blog content):**
- how long do wedding dress alterations take
- bridal fitting timeline
- how many fittings does a wedding dress need
- where to alter a wedding dress in London

### Anti-pattern: keyword stuffing
❌ Don't write "Hounslow wedding dress alterations Hounslow tailoring Hounslow couture Hounslow"
✅ Write naturally: "Our Hounslow studio is open Monday to Saturday for fittings and consultations."

## Metadata Rules

### Per-page metadata

Every page exports a `metadata` object (static) or `generateMetadata` function (dynamic).

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bridal alterations in Hounslow',
  description: 'Hand-crafted wedding dress alterations from a Hounslow atelier. Bridal, bridesmaid, occasion. Book a fitting with Steffi.',
  openGraph: {
    title: 'Bridal alterations in Hounslow · Steffny Couture',
    description: 'Hand-crafted wedding dress alterations from a Hounslow atelier.',
    images: ['/api/og?title=Bridal+alterations'],
  },
};
```

The root layout sets `metadataBase` and `title.template`, so per-page `title` strings automatically get suffixed with " · Steffny Couture".

### Title rules

- **50-60 characters** total (including the " · Steffny Couture" suffix)
- **Primary keyword early** when natural
- **Sentence case**
- **No exclamation marks, no all-caps, no emojis**
- **Unique per page**

Examples:
- ✅ `Bridal alterations in Hounslow · Steffny Couture` (51 chars)
- ✅ `Pink wedding dress · £420 · Steffny Couture` (45 chars)
- ✅ `How to choose a wedding dress in Hounslow · Steffny Couture` (60 chars)
- ❌ `Welcome to Steffny Couture - The Best Couture Studio in Hounslow, London | Wedding Dresses & Alterations` (104 chars, generic, stuffed)
- ❌ `Home` (lazy)
- ❌ `🌸 Beautiful Bridal Dresses 🌸` (emoji + no brand)

### Description rules

- **140-155 characters**
- **Lead with user benefit, not company name**
- **Include location signal** ("Hounslow", "London", "West London")
- **End without sales pitch** — no "Book now!" / "Call today!"
- **Mention the primary CTA** subtly: "Book a fitting" / "Visit the atelier"

Examples:
- ✅ `Hand-crafted wedding dress alterations from a Hounslow atelier. Bridal, bridesmaid, occasion. Book a fitting with Steffi.` (124 chars)
- ✅ `Pink baby-pink wedding guest dress in long cut, sizes L and XL. £420, hand-finished in our Hounslow studio.` (109 chars)
- ❌ `We are the best couture studio in London. Welcome to our website! Click here to learn more about our amazing services.` (sales-pitch, no specifics, exclamation)

## Structured Data (JSON-LD)

Add to every relevant page. Use `<script type="application/ld+json">` inside the page or layout.

### LocalBusiness (home + contact + footer)

```tsx
// src/components/seo/LocalBusinessJsonLd.tsx
export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'Steffny Couture',
    image: 'https://www.steffnycouture.co.uk/og-default.jpg',
    '@id': 'https://www.steffnycouture.co.uk',
    url: 'https://www.steffnycouture.co.uk',
    telephone: '+44-7834-877992',
    priceRange: '££',
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
      latitude: 51.4671,
      longitude: -0.3683,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:30', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '11:00', closes: '18:00' },
    ],
    sameAs: ['https://www.instagram.com/steffnycouture'],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### Product (dress detail pages)

```tsx
export function ProductJsonLd({ product }: { product: Product }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description,
    image: product.images.map((i) => i.url),
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Steffny Couture' },
    offers: {
      '@type': 'Offer',
      url: `https://www.steffnycouture.co.uk/dresses/${product.slug}`,
      priceCurrency: 'GBP',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Steffny Couture' },
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

### BlogPosting (journal posts)

```tsx
const data = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt ?? post.publishedAt,
  author: { '@type': 'Person', name: 'Steffi Da Cruz' },
  publisher: {
    '@type': 'Organization',
    name: 'Steffny Couture',
    logo: { '@type': 'ImageObject', url: 'https://www.steffnycouture.co.uk/logo.png' },
  },
  mainEntityOfPage: `https://www.steffnycouture.co.uk/journal/${post.slug}`,
};
```

### BreadcrumbList (every page with depth)

```tsx
const data = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.steffnycouture.co.uk' },
    { '@type': 'ListItem', position: 2, name: 'Dresses', item: 'https://www.steffnycouture.co.uk/dresses' },
    { '@type': 'ListItem', position: 3, name: product.name, item: `https://www.steffnycouture.co.uk/dresses/${product.slug}` },
  ],
};
```

## Sitemap

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.steffnycouture.co.uk';
  const supabase = await createClient();
  const { data: products } = await supabase.from('products').select('slug, updated_at').eq('is_published', true);
  const { data: posts } = await supabase.from('journal_posts').select('slug, updated_at').eq('is_published', true);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), priority: 1.0 },
    { url: `${base}/dresses`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/services/bridal`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/services/alterations`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/services/occasion`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/journal`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/reviews`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/book-a-fitting`, lastModified: new Date(), priority: 0.9 },
  ];

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${base}/dresses/${p.slug}`,
    lastModified: new Date(p.updated_at ?? Date.now()),
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${base}/journal/${p.slug}`,
    lastModified: new Date(p.updated_at ?? Date.now()),
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
```

## Robots

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/cart', '/checkout/'] },
    ],
    sitemap: 'https://www.steffnycouture.co.uk/sitemap.xml',
  };
}
```

For Vercel preview deployments, automatically add `noindex`:

```tsx
// in src/app/layout.tsx metadata
robots: process.env.VERCEL_ENV !== 'production' ? { index: false, follow: false } : undefined,
```

## OG Images (dynamic)

```tsx
// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'Steffny Couture';

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        background: '#FAF7F2', padding: 80,
      }}>
        <p style={{ fontSize: 24, color: '#5C5551', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 32 }}>
          Steffny Couture
        </p>
        <p style={{ fontSize: 72, color: '#1F1B1A', fontFamily: 'Fraunces', textAlign: 'center', maxWidth: 900, lineHeight: 1.1 }}>
          {title}
        </p>
        <p style={{ fontSize: 22, color: '#7C2D3E', marginTop: 40 }}>
          Hounslow · London
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

## Page-by-Page SEO Checklist

Before any page ships, verify:

- [ ] Unique `<title>`, 50-60 chars
- [ ] Unique `description`, 140-155 chars
- [ ] OG image (auto or custom)
- [ ] Twitter card metadata
- [ ] Canonical URL set (Next does this automatically with `metadataBase`)
- [ ] One `<h1>` per page
- [ ] Headings hierarchy correct (no skipping levels)
- [ ] Alt text on every image
- [ ] Structured data where applicable
- [ ] Sitemap includes the page
- [ ] Internal links to/from this page exist

## Anti-Patterns

- ❌ Same title/description across pages
- ❌ Title > 60 chars (gets truncated in SERPs)
- ❌ Description > 160 chars (gets truncated)
- ❌ Keyword stuffing
- ❌ Multiple `<h1>` tags on one page
- ❌ `noindex` left on after going live (a real launch-day bug)
- ❌ Mixed canonical signals (page has `<link rel="canonical">` to a different URL)
- ❌ JSON-LD with broken syntax (validate with Google's Rich Results Test)
- ❌ Forgetting `alt` text on hero images
- ❌ Hidden text "for SEO" (penalised, ineffective)

## Testing Tools

After deploy, run these against the live URL:
- **Google Rich Results Test** — validates structured data
- **PageSpeed Insights** — performance + SEO score
- **Mobile-Friendly Test** — mobile rendering
- **Lighthouse in DevTools** — comprehensive audit
- **Schema.org Validator** — structured data validity

Target Lighthouse SEO score: **≥ 95** on every page.
