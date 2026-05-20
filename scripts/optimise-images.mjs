#!/usr/bin/env node
/**
 * optimise-images.mjs
 *
 * Takes downloaded images from /public/assets/raw/ and produces:
 *   - Resized WebP variants at 400, 800, 1600, 2400 px wide
 *   - AVIF variants for the largest size
 *   - blurDataURL strings for next/image placeholders
 *
 * Usage:
 *   node scripts/optimise-images.mjs
 *
 * Requires: sharp, plaiceholder (install if missing)
 */

import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { resolve, join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { getPlaiceholder } from 'plaiceholder';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

const RAW_DIR = resolve(PROJECT_ROOT, 'public/assets/raw');
const OUT_DIR = resolve(PROJECT_ROOT, 'public/assets/optimised');
const META_PATH = resolve(PROJECT_ROOT, 'data/optimised-images.json');

const SIZES = [400, 800, 1600, 2400];
const FORMATS = ['webp', 'avif'];

async function processImage(filename) {
  const inPath = join(RAW_DIR, filename);
  const baseName = basename(filename, extname(filename));

  console.log(`📷 ${filename}`);

  const baseImage = sharp(inPath);
  const metadata = await baseImage.metadata();
  const aspectRatio = metadata.width / metadata.height;

  const variants = [];

  for (const width of SIZES) {
    if (width > metadata.width) continue; // don't upscale

    for (const format of FORMATS) {
      // Only generate AVIF at the largest size (saves time)
      if (format === 'avif' && width !== Math.max(...SIZES.filter((s) => s <= metadata.width))) continue;

      const outName = `${baseName}-${width}.${format}`;
      const outPath = join(OUT_DIR, outName);

      let pipe = sharp(inPath).resize({ width, withoutEnlargement: true });

      if (format === 'webp') pipe = pipe.webp({ quality: 82, effort: 4 });
      else if (format === 'avif') pipe = pipe.avif({ quality: 60, effort: 5 });

      await pipe.toFile(outPath);
      variants.push({ filename: outName, format, width });
      process.stdout.write('.');
    }
  }
  console.log('');

  // Generate blur placeholder
  const { base64: blurDataURL } = await getPlaiceholder(await sharp(inPath).resize(20).toBuffer(), {
    size: 10,
  });

  return {
    originalFilename: filename,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    aspectRatio,
    variants,
    blurDataURL,
  };
}

async function main() {
  console.log('🎨 Optimising images...\n');
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(RAW_DIR)).filter((f) =>
    /\.(jpg|jpeg|png)$/i.test(f)
  );

  if (files.length === 0) {
    console.log('No images found in /public/assets/raw/');
    console.log('Run `node scripts/scrape-images.mjs` first.');
    process.exit(0);
  }

  console.log(`Found ${files.length} source images.\n`);

  const results = [];
  for (const file of files) {
    try {
      const result = await processImage(file);
      results.push(result);
    } catch (err) {
      console.error(`  ⚠ Failed on ${file}: ${err.message}`);
    }
  }

  await writeFile(META_PATH, JSON.stringify(results, null, 2));
  console.log(`\n✅ Optimised ${results.length} images.`);
  console.log(`📋 Metadata written to ${META_PATH}`);
  console.log(`📦 Variants in ${OUT_DIR}`);
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
