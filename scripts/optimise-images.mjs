#!/usr/bin/env node
/**
 * optimise-images.mjs
 *
 * Walks the curated asset folders and produces:
 *   - Resized WebP variants at 400, 800, 1600, 2400 px wide
 *   - One AVIF variant at the largest applicable size
 *   - blurDataURL strings for next/image placeholders
 *
 * Inputs:
 *   /public/assets/products/<slug>/*.jpg
 *   /public/assets/hero/*.jpg
 *   /public/assets/about/*.jpg
 *
 * Outputs:
 *   /public/assets/optimised/<section>/<name>-<width>.<format>
 *   /data/optimised-images.json   — metadata + blurDataURLs, keyed by section/source
 *
 * The `/public/assets/optimised/` tree is gitignored — variants are regenerated
 * on demand. Originals stay committed.
 *
 * Usage:
 *   npm run optimise
 */

import { mkdir, readdir, writeFile, stat } from 'node:fs/promises';
import { resolve, join, basename, extname, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { getPlaiceholder } from 'plaiceholder';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const ASSETS = resolve(ROOT, 'public/assets');
const OUT_ROOT = resolve(ASSETS, 'optimised');
const META_PATH = resolve(ROOT, 'data/optimised-images.json');

const SECTIONS = ['products', 'hero', 'about'];
const SIZES = [400, 800, 1600, 2400];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function processImage(srcPath) {
  const relFromAssets = relative(ASSETS, srcPath);
  const ext = extname(srcPath);
  const stem = basename(srcPath, ext);
  const outDir = join(OUT_ROOT, dirname(relFromAssets).replace(/^[^/\\]+[/\\]?/, ''));
  // dirname(relFromAssets) is e.g. "products/pink-mauve-mermaid" or "hero".
  // We want optimised/products/pink-mauve-mermaid/ — strip nothing, keep section path.
  const properOutDir = join(OUT_ROOT, dirname(relFromAssets));

  await mkdir(properOutDir, { recursive: true });

  const base = sharp(srcPath);
  const meta = await base.metadata();
  const aspectRatio = meta.width / meta.height;

  const variants = [];
  const applicableSizes = SIZES.filter((s) => s <= meta.width);
  const largest = applicableSizes.at(-1) ?? meta.width;

  for (const width of applicableSizes) {
    const webpName = `${stem}-${width}.webp`;
    await sharp(srcPath).resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toFile(join(properOutDir, webpName));
    variants.push({ filename: webpName, format: 'webp', width });
    process.stdout.write('.');
  }
  // One AVIF at the largest size — small bandwidth win, big encoder cost.
  const avifName = `${stem}-${largest}.avif`;
  await sharp(srcPath).resize({ width: largest, withoutEnlargement: true }).avif({ quality: 60, effort: 5 }).toFile(join(properOutDir, avifName));
  variants.push({ filename: avifName, format: 'avif', width: largest });
  process.stdout.write('.');

  const blurBuf = await sharp(srcPath).resize(20).toBuffer();
  const { base64: blurDataURL } = await getPlaiceholder(blurBuf, { size: 10 });

  return {
    source: relFromAssets.replace(/\\/g, '/'),
    originalWidth: meta.width,
    originalHeight: meta.height,
    aspectRatio: Number(aspectRatio.toFixed(4)),
    variants,
    blurDataURL,
  };
}

async function main() {
  console.log('Optimising curated assets...\n');
  await mkdir(OUT_ROOT, { recursive: true });

  const results = [];
  for (const section of SECTIONS) {
    const dir = join(ASSETS, section);
    try {
      await stat(dir);
    } catch {
      console.log(`  Skipping ${section}/ — folder not found`);
      continue;
    }

    const files = await walk(dir);
    console.log(`${section}/  (${files.length} file${files.length === 1 ? '' : 's'})`);

    for (const file of files) {
      const rel = relative(ASSETS, file).replace(/\\/g, '/');
      process.stdout.write(`  ${rel} `);
      try {
        results.push(await processImage(file));
        process.stdout.write(' ok\n');
      } catch (err) {
        process.stdout.write(` FAILED: ${err.message}\n`);
      }
    }
    console.log('');
  }

  await mkdir(dirname(META_PATH), { recursive: true });
  await writeFile(META_PATH, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${results.length} image records to ${relative(ROOT, META_PATH).replace(/\\/g, '/')}`);
  console.log(`Variants in ${relative(ROOT, OUT_ROOT).replace(/\\/g, '/')}/`);
}

main().catch((err) => {
  console.error('Optimise failed:', err);
  process.exit(1);
});
