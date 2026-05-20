#!/usr/bin/env node
/**
 * scrape-images.mjs
 *
 * Pulls images from the existing Webador site at steffnycouture.co.uk.
 *
 * Usage:
 *   node scripts/scrape-images.mjs
 *
 * Outputs:
 *   /public/assets/raw/         — downloaded original images
 *   /data/scraped-products.json — extracted product info
 *
 * After this: run optimise-images.mjs to generate WebP variants.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { resolve, join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

const BASE_URL = 'https://www.steffnycouture.co.uk';
const RAW_DIR = resolve(PROJECT_ROOT, 'public/assets/raw');
const DATA_DIR = resolve(PROJECT_ROOT, 'data');

const PAGES_TO_SCRAPE = [
  { path: '/', label: 'home' },
  { path: '/dresses', label: 'dresses' },
  { path: '/about-steffny-couture', label: 'about' },
  { path: '/customer-reviews', label: 'reviews' },
  { path: '/size-guide', label: 'size-guide' },
  { path: '/contact', label: 'contact' },
];

const IMAGE_URL_PATTERNS = [
  /primary\.jwwb\.nl/,    // Webador CDN
  /images\.pexels\.com/,  // Pexels stock (about page)
];

async function fetchPage(url) {
  console.log(`  Fetching ${url}`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 SteffnyCoutureMigration/1.0 (asset scraping for site rebuild)',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return await res.text();
}

function extractImages(html, pageLabel) {
  const $ = load(html);
  const imgs = [];

  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    const alt = $(el).attr('alt') || '';
    if (!src) return;

    const full = src.startsWith('http') ? src : new URL(src, BASE_URL).toString();

    if (IMAGE_URL_PATTERNS.some((p) => p.test(full))) {
      imgs.push({ url: full, alt, page: pageLabel });
    }
  });

  // Inline background images
  $('[style*="background-image"]').each((_, el) => {
    const style = $(el).attr('style') || '';
    const m = style.match(/url\(["']?(https?:[^)"']+)["']?\)/);
    if (m) imgs.push({ url: m[1], alt: '', page: pageLabel });
  });

  return imgs;
}

function extractProducts(html) {
  const $ = load(html);
  const products = [];

  // Webador product card pattern (best-effort, may need tuning)
  $('.product, [class*="product"], .grid-item').each((_, el) => {
    const $el = $(el);
    const name = $el.find('h2, h3, .title, [class*="title"]').first().text().trim();
    const priceText = $el.find('.price, [class*="price"]').first().text().trim();
    const price = priceText.match(/[\d.]+/)?.[0];
    const imgSrc = $el.find('img').first().attr('src');

    if (name && price) {
      products.push({
        name,
        price: parseFloat(price),
        currency: 'GBP',
        image_url: imgSrc?.startsWith('http') ? imgSrc : `${BASE_URL}${imgSrc}`,
        scraped_from: '/dresses',
      });
    }
  });

  return products;
}

async function downloadImage(imageUrl, outDir) {
  const cleanName = basename(new URL(imageUrl).pathname);
  const safeName = cleanName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = extname(safeName) || '.jpg';
  const finalName = safeName.endsWith(ext) ? safeName : `${safeName}${ext}`;
  const outPath = join(outDir, finalName);

  const res = await fetch(imageUrl);
  if (!res.ok) {
    console.warn(`  ⚠ Failed: ${imageUrl} → ${res.status}`);
    return null;
  }

  await pipeline(res.body, createWriteStream(outPath));
  return { url: imageUrl, path: outPath, filename: finalName };
}

async function main() {
  console.log('🔍 Scraping Steffny Couture site...');
  await mkdir(RAW_DIR, { recursive: true });
  await mkdir(DATA_DIR, { recursive: true });

  const allImages = [];
  const allProducts = [];

  for (const page of PAGES_TO_SCRAPE) {
    const url = `${BASE_URL}${page.path}`;
    try {
      const html = await fetchPage(url);
      const imgs = extractImages(html, page.label);
      allImages.push(...imgs);

      if (page.path === '/dresses') {
        const products = extractProducts(html);
        allProducts.push(...products);
      }
    } catch (err) {
      console.warn(`  ⚠ Skipped ${url}: ${err.message}`);
    }
  }

  console.log(`\n📷 Found ${allImages.length} images across ${PAGES_TO_SCRAPE.length} pages.`);

  // Dedupe
  const uniqueByUrl = new Map();
  for (const img of allImages) {
    if (!uniqueByUrl.has(img.url)) uniqueByUrl.set(img.url, img);
  }
  const unique = Array.from(uniqueByUrl.values());
  console.log(`📷 ${unique.length} unique images after dedup.`);

  console.log(`\n💾 Downloading to ${RAW_DIR}`);
  const downloadResults = [];
  for (const img of unique) {
    const result = await downloadImage(img.url, RAW_DIR);
    if (result) {
      downloadResults.push({ ...result, alt: img.alt, page: img.page });
      console.log(`  ✓ ${result.filename}`);
    }
  }

  // Write metadata
  const metaPath = join(DATA_DIR, 'scraped-images.json');
  await writeFile(metaPath, JSON.stringify(downloadResults, null, 2));
  console.log(`\n📋 Wrote metadata to ${metaPath}`);

  const productsPath = join(DATA_DIR, 'scraped-products.json');
  await writeFile(productsPath, JSON.stringify(allProducts, null, 2));
  console.log(`📋 Wrote ${allProducts.length} products to ${productsPath}`);

  console.log('\n✅ Scrape complete.');
  console.log('\nNext steps:');
  console.log('  1. Review /data/scraped-images.json and /data/scraped-products.json');
  console.log('  2. Manually curate: pick best 30 product photos, archive the rest');
  console.log('  3. Run: node scripts/optimise-images.mjs');
  console.log('  4. Run: node scripts/seed-products.ts');
}

main().catch((err) => {
  console.error('❌ Scrape failed:', err);
  process.exit(1);
});
