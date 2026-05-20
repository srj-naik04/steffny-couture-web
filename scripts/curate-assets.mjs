#!/usr/bin/env node
/**
 * curate-assets.mjs
 *
 * Takes the raw scrape from /public/assets/raw/ and copies each image into its
 * curated home with a clean, human-readable filename:
 *
 *   /public/assets/products/<slug>/01.jpg
 *   /public/assets/hero/<descriptive-name>.jpg
 *   /public/assets/about/<descriptive-name>.jpg
 *
 * The product mapping below was produced by visual inspection of the 36 images
 * the scraper pulled from steffnycouture.co.uk on 2026-05-20. If the source site
 * changes, re-run scrape-images.mjs and re-curate by hand.
 *
 * Pexels stock images from the existing About page are kept as placeholders —
 * see TODO marker in /public/assets/about/PLACEHOLDERS.txt.
 *
 * Usage:
 *   node scripts/curate-assets.mjs
 */

import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const RAW = resolve(ROOT, 'public/assets/raw');
const ASSETS = resolve(ROOT, 'public/assets');

// Each product gets a slug + an ordered list of source filenames from /raw.
// First image is the cover.
const PRODUCTS = [
  { slug: 'pink-mauve-mermaid',       images: ['d155cd6c-864f-45f2-8141-3f395477df7e-high.jpg'] },
  { slug: 'mauve-off-shoulder-gown',  images: ['9fc04ad3-8e77-429c-b55b-8e4849b5c0fa-high.jpg'] },
  { slug: 'plum-one-shoulder-gown',   images: ['5d40f810-0d69-4e02-a5a8-2e863c68fa5a-high.jpg'] },
  { slug: 'aqua-sequinned-gown',      images: ['46527968-3dd5-4a40-9c62-a389cf4b8a62-high.jpg'] },
  { slug: 'coral-tulle-bustier',      images: ['677bd61f-9f41-4ee6-831d-68949fb176cc-high-mb3qom.jpg'] },
  { slug: 'cobalt-blue-tulle-gown',   images: ['151dbf8d-72c2-4763-af46-eb143722a3cb-high.jpg'] },
  { slug: 'champagne-tulle-ballgown', images: ['de0e6982-26d3-4b7e-99b1-2ee9e8563142-high.jpg'] },
  { slug: 'maroon-rosette-gown',      images: ['64beccae-2e0c-46b7-8873-c517f2ef6582-high.jpg'] },
  { slug: 'champagne-satin-gown',     images: ['1ceb3a17-384b-46e3-b30e-17f1d54ee8e0-high.jpg'] },
  { slug: 'sage-satin-gown',          images: ['eda10e01-2f0d-4547-9377-5ccc66c7ccb5-high-9njovk.jpg'] },
];

// Real Steffi editorial photos — strong hero / lifestyle candidates.
const HERO = [
  { src: 'viru-photography-142-standard.jpg',                         out: 'bride-bangles-portrait.jpg' },
  { src: 'img_0282-high.jpg',                                         out: 'bride-white-umbrella-interior.jpg' },
  { src: 'img_0283-standard.jpg',                                     out: 'bride-white-ballgown-train.jpg' },
  { src: 'img_0281-standard-fu02nr.jpg',                              out: 'bride-fuchsia-pampas.jpg' },
  { src: 'img_0678-standard.jpg',                                     out: 'bride-burgundy-outdoor.jpg' },
  { src: 'img_1289-high.jpg',                                         out: 'bride-red-roses.jpg' },
  { src: '459f8305-daea-4d1a-9ad1-c8b4437edb16-high.jpg',             out: 'bride-maroon-interior.jpg' },
  { src: '6f7c7dd9-7706-4423-a6e6-5a65371e2795-standard.jpg',         out: 'bride-maroon-chandelier.jpg' },
  { src: '89e1b7d6-62d8-4dd8-9e61-47fca4c80837-standard-ymoysn.jpg',  out: 'bride-maroon-radio.jpg' },
  { src: 'a3db8784-c4b0-406a-a829-2bf2fe233f63-high-e2uooq.jpg',      out: 'bride-maroon-arch.jpg' },
  { src: '452e2432-238d-410a-a35f-8d016d9894ab-high-h2ohca.jpg',      out: 'bride-white-tulle-moody.jpg' },
  { src: 'viru-photography-189-standard.jpg',                         out: 'bride-bouquet-detail.jpg' },
  { src: 'e8f35e67-d0d7-474d-aa00-d346add6db55-standard.jpg',         out: 'beaded-bodice-detail.jpg' },
];

// Pexels stock from the existing About page — placeholder until Steffi sends
// real studio photos. See PLACEHOLDERS.txt next to these files.
const ABOUT_PLACEHOLDERS = [
  { src: '5490969.jpeg', out: 'placeholder-boutique-interior.jpg' },
  { src: '9853292.jpeg', out: 'placeholder-designer-fitting.jpg' },
  { src: '4621928.jpeg', out: 'placeholder-hands-sewing.jpg' },
];

const PLACEHOLDER_NOTE = `These are Pexels stock photos pulled from the existing Webador About page.
They are committed only so the About route renders during the build phase.

Before launch (Phase 8 — Demo prep), replace with real Steffny studio photos
and delete this file.

Replacement brief:
  - One wide atelier / interior shot (the Hounslow studio).
  - One Steffi-at-work portrait (pinning, fitting, sketching — hands visible).
  - One detail / craft shot (sewing, beading, fabric close-up).
`;

async function copy(src, destDir, outName) {
  const from = join(RAW, src);
  const to = join(destDir, outName);
  await mkdir(dirname(to), { recursive: true });
  await copyFile(from, to);
  return to;
}

async function main() {
  console.log('Curating raw scrape into product / hero / about folders...\n');

  let count = 0;

  console.log('Products:');
  for (const product of PRODUCTS) {
    for (let i = 0; i < product.images.length; i++) {
      const outName = `${String(i + 1).padStart(2, '0')}.jpg`;
      const dest = join(ASSETS, 'products', product.slug);
      await copy(product.images[i], dest, outName);
      console.log(`  ${product.slug}/${outName}`);
      count++;
    }
  }

  console.log('\nHero:');
  for (const h of HERO) {
    await copy(h.src, join(ASSETS, 'hero'), h.out);
    console.log(`  hero/${h.out}`);
    count++;
  }

  console.log('\nAbout (placeholders):');
  for (const a of ABOUT_PLACEHOLDERS) {
    await copy(a.src, join(ASSETS, 'about'), a.out);
    console.log(`  about/${a.out}`);
    count++;
  }
  await writeFile(join(ASSETS, 'about', 'PLACEHOLDERS.txt'), PLACEHOLDER_NOTE);

  console.log(`\nDone. ${count} files curated.`);
}

main().catch((err) => {
  console.error('Curation failed:', err);
  process.exit(1);
});
