---
name: image-pipeline
description: Use this skill whenever working with images on the Steffny Couture website — scraping from the existing site, optimising, uploading to Supabase Storage, displaying via next/image, generating blurhash placeholders, or making the "where should this image live" decision. Fires for any code in `/scripts/scrape-site.mjs`, `/scripts/seed-products.ts`, `/src/lib/images/`, or any component using `next/image`. Enforces the asset categorisation (static-bundled, Supabase Storage, user-uploaded), optimisation rules, and the image-from-existing-site extraction workflow.
---

# Image Pipeline

The website inherits ~30 images from the existing Webador-hosted site and needs them in good shape. This skill covers extraction, optimisation, storage, and display.

## The Three Image Categories

### Category 1 — Static brand assets (in `/public/images/static/`)

For images that ship with the bundle and never change:
- Brand wordmark / logo variants
- Default OG image
- Favicon
- 404 illustration
- Empty-state illustrations
- "Powered by" / footer marks

Files committed to git. Referenced via `/images/static/logo.svg`.

### Category 2 — CMS / catalogue images (Supabase Storage)

For images that are part of the content and may be edited via the database:
- All dress product photos (~30 images)
- About page lifestyle photos (3 images)
- Hero / atelier photos (5-10 images)
- Customer review portraits (when added)
- Blog post covers

Lives in Supabase Storage buckets:
- `dress-photos/` — product images, public bucket
- `marketing-photos/` — hero, about, blog covers, public bucket

Referenced by URL in DB rows. Displayed via `next/image` with remote pattern in `next.config.ts`.

### Category 3 — User-generated (already in mobile app's spec)

The `booking-photos/` bucket, private. When customers upload via web's book-a-fitting form, they go here. Shared with mobile app.

## Decision Tree

```
Is this image part of the brand identity (logo, default-OG, illustration)?
  ├─ Yes → Category 1 (public/images/static)
  └─ No → does it need to be editable without a code release?
           ├─ Yes → Category 2 (Supabase Storage)
           └─ No → does it appear on more than one page?
                    ├─ Yes → Category 2
                    └─ No → Category 1 if truly one-off, Category 2 otherwise (default to Storage)
```

When in doubt, **default to Supabase Storage**. It's easier to swap an image without a redeploy.

## Scraping the Existing Site

The Webador site has the images we want. The scraping script extracts them at the best available quality.

```js
// /scripts/scrape-site.mjs
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, 'scraped');
const IMG_DIR = join(OUT_DIR, 'images');
const DATA_DIR = join(OUT_DIR, 'data');

const PAGES = [
  { url: 'https://www.steffnycouture.co.uk/', name: 'home' },
  { url: 'https://www.steffnycouture.co.uk/dresses', name: 'dresses' },
  { url: 'https://www.steffnycouture.co.uk/about-steffny-couture', name: 'about' },
  { url: 'https://www.steffnycouture.co.uk/customer-reviews', name: 'reviews' },
  { url: 'https://www.steffnycouture.co.uk/contact', name: 'contact' },
  { url: 'https://www.steffnycouture.co.uk/size-guide', name: 'size-guide' },
];

// Strip web optimisation params, prefer -high over -standard
function bestUrl(url) {
  return url.split('?')[0].replace(/-standard(\.[a-z]+)$/i, '-high$1');
}

function filename(url) {
  return url.split('/').pop().replace(/[?#].*$/, '');
}

const IMG_RE = /<img[^>]+src=["']([^"']+\.(?:jpe?g|png|webp))[^"']*["']/gi;

async function main() {
  mkdirSync(IMG_DIR, { recursive: true });
  mkdirSync(DATA_DIR, { recursive: true });

  const allImages = new Set();
  const productData = []; // also extract product names, prices, descriptions

  for (const page of PAGES) {
    console.log(`Fetching ${page.url}`);
    const html = await fetch(page.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(r => r.text());
    writeFileSync(join(DATA_DIR, `${page.name}.html`), html); // archive

    for (const match of html.matchAll(IMG_RE)) {
      const raw = match[1];
      if (raw.startsWith('data:')) continue;
      allImages.add(bestUrl(raw));
    }
  }

  console.log(`Found ${allImages.size} unique images`);
  for (const url of allImages) {
    const out = join(IMG_DIR, filename(url));
    if (existsSync(out)) continue;
    try {
      const buf = Buffer.from(await fetch(url).then(r => r.arrayBuffer()));
      writeFileSync(out, buf);
      console.log(`  ✓ ${filename(url)} (${(buf.length / 1024).toFixed(0)}KB)`);
    } catch (e) {
      console.warn(`  ✗ ${filename(url)}: ${e.message}`);
    }
  }

  console.log(`\nDone. Images in ${IMG_DIR}. Archived HTML in ${DATA_DIR}.`);
  console.log('Next: extract product data with extract-products.mjs, then run seed-products.ts');
}

main().catch(console.error);
```

Run with `node scripts/scrape-site.mjs`. Add `/scripts/scraped/` to `.gitignore` — raw scrapes don't need committing.

## Product Data Extraction

The HTML archives need parsing to get product names, prices, descriptions, and image-to-product mapping. This is one-off scraping:

```js
// /scripts/extract-products.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, 'scraped/data/dresses.html');
const html = readFileSync(htmlPath, 'utf-8');

// Match the dress card markup from the Webador shop
// Each product block has: image, link to /product/<id>/<slug>, name, price, description, variants
// Extract by parsing the repeated structure (use cheerio or jsdom for reliability)

// ... extraction logic ...

const products = [
  // example shape
  {
    name: 'Pink wedding dress',
    slug: 'pink-wedding-dress',
    price: 420,
    short_description: 'Baby pink wedding guest dress. High end designer dress.',
    images: ['d155cd6c-864f-45f2-8141-3f395477df7e-high.jpg'],
    variants: [{ colour: 'Pink', sizes: ['L', 'XL'], type: 'Long' }],
  },
  // ...
];

writeFileSync(join(__dirname, 'scraped/data/products.json'), JSON.stringify(products, null, 2));
```

Use a parser (`cheerio` recommended) — regex on HTML is brittle:

```bash
npm install --save-dev cheerio
```

```js
import * as cheerio from 'cheerio';
const $ = cheerio.load(html);
$('.product').each((i, el) => { /* extract */ });
```

## Optimisation Before Upload

Webador-served images are already compressed but often have unnecessary metadata or aren't sized for our specific layout needs. Re-optimise before uploading to Supabase:

```js
// /scripts/optimise-images.mjs
import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IN = join(__dirname, 'scraped/images');
const OUT = join(__dirname, 'optimised/images');

mkdirSync(OUT, { recursive: true });

const files = readdirSync(IN).filter(f => /\.(jpe?g|png|webp)$/i.test(f));

for (const file of files) {
  const src = join(IN, file);
  const name = basename(file, extname(file));
  const out = join(OUT, `${name}.jpg`);

  await sharp(src)
    .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .withMetadata({}) // strip EXIF
    .toFile(out);

  const sizeKB = (statSync(out).size / 1024).toFixed(0);
  console.log(`  ${file} → ${name}.jpg (${sizeKB}KB)`);
}
```

Target sizes after optimisation:
- Hero / about page images: 200-300KB
- Product photos: 150-250KB
- Thumbnails: 30-60KB

## Uploading to Supabase Storage

```ts
// /scripts/seed-products.ts
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import productsData from './scraped/data/products.json';
import type { Database } from '../src/types/database';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // service role for seeding
);

async function uploadImage(filename: string): Promise<string> {
  const path = `products/${filename}`;
  const file = readFileSync(join(__dirname, 'optimised/images', filename));
  const { error } = await supabase.storage
    .from('dress-photos')
    .upload(path, file, { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('dress-photos').getPublicUrl(path);
  return data.publicUrl;
}

for (const product of productsData) {
  // Upload images
  const imageUrls = await Promise.all(product.images.map(uploadImage));

  // Insert product
  const { data: inserted, error } = await supabase.from('products').insert({
    slug: product.slug,
    name: product.name,
    price: product.price,
    short_description: product.short_description,
    cover_image_url: imageUrls[0],
    is_published: true,
  }).select().single();

  if (error) throw error;

  // Insert additional images
  for (let i = 0; i < imageUrls.length; i++) {
    await supabase.from('product_images').insert({
      product_id: inserted.id,
      url: imageUrls[i],
      display_order: i,
    });
  }

  console.log(`✓ ${product.name}`);
}
```

## Displaying via next/image

### Configuration

`next.config.ts`:
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
```

### Component patterns

```tsx
// Hero — above the fold, priority loading
<Image
  src="/images/static/hero-atelier.jpg"
  alt="Steffi pinning a wedding dress in the Hounslow atelier"
  width={2400}
  height={1600}
  priority
  sizes="100vw"
  className="w-full h-auto"
/>

// Product card — lazy loaded, responsive
<Image
  src={product.cover_image_url}
  alt={`${product.name} — ${product.short_description}`}
  width={800}
  height={1200}
  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
  className="aspect-[2/3] w-full object-cover"
/>

// Product detail gallery — multiple sizes, with blurhash placeholders
<Image
  src={image.url}
  alt={`${product.name} view ${index + 1}`}
  width={1200}
  height={1800}
  placeholder="blur"
  blurDataURL={image.blurhash_data_url}
  sizes="(min-width: 1024px) 50vw, 100vw"
  className="w-full h-auto rounded-xl"
/>
```

### Aspect ratios for the brand
- Dress thumbnails / cards: `aspect-[2/3]` (portrait, slightly taller than wide)
- Hero / lifestyle: `aspect-[3/2]` or `aspect-video` (16/9 also fine)
- Blog covers: `aspect-[3/2]`
- Square thumbnails: `aspect-square`

Be consistent within a section. Mixed aspect ratios look chaotic.

## Blurhash Placeholders

For Category 2 images (catalogue), generate blurhash on upload and store with the row. Avoids LCP shift.

```ts
// /scripts/generate-blurhash.ts
import sharp from 'sharp';
import { encode } from 'blurhash';

async function generateBlurhash(buffer: Buffer): Promise<{ hash: string; dataUrl: string }> {
  const { data, info } = await sharp(buffer)
    .raw()
    .ensureAlpha()
    .resize(32, 32, { fit: 'inside' })
    .toBuffer({ resolveWithObject: true });

  const hash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);

  // For next/image's blurDataURL prop, we need a base64 data URL
  const previewBuffer = await sharp(buffer)
    .resize(20, 20, { fit: 'inside' })
    .jpeg({ quality: 30 })
    .toBuffer();

  const dataUrl = `data:image/jpeg;base64,${previewBuffer.toString('base64')}`;

  return { hash, dataUrl };
}
```

Store both: `blurhash` (the encoded string) and `blurhash_data_url` (the tiny base64 jpg) on the product row.

## Anti-Patterns

- ❌ Importing unoptimised images (>500KB)
- ❌ `<img>` tags for content (always `next/image`)
- ❌ Missing `sizes` prop on `next/image` — bandwidth bloat
- ❌ Missing `alt` text — accessibility + SEO fail
- ❌ Decorative `alt=""` with no role — at least be explicit with `aria-hidden`
- ❌ Loading 30 hero-sized images on a grid page
- ❌ Committing 50MB of raw scraped images to git
- ❌ Storing user-uploaded photos as base64 in the database
- ❌ Public bucket for private images (booking photos)
- ❌ Hot-linking to Webador URLs in production (control your own assets)

## Workflow Summary

1. **Scrape** — `node scripts/scrape-site.mjs` → raw images + HTML archives in `scripts/scraped/`
2. **Extract** — `node scripts/extract-products.mjs` → `scripts/scraped/data/products.json`
3. **Optimise** — `node scripts/optimise-images.mjs` → smaller JPGs in `scripts/optimised/images/`
4. **Generate placeholders** — `node scripts/generate-blurhash.ts` → blurhash strings per image
5. **Seed** — `npx tsx scripts/seed-products.ts` → uploads to Supabase Storage, inserts DB rows
6. **Display** — components use `next/image` with the Supabase URLs

Add to `.gitignore`:
```
scripts/scraped/
scripts/optimised/
```
