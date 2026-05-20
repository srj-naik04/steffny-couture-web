#!/usr/bin/env tsx
/**
 * seed-products.ts
 *
 * Uploads product images to Supabase Storage and creates product/product_image
 * records in the database.
 *
 * Reads from:
 *   /data/scraped-products.json      — product info from Webador
 *   /data/optimised-images.json      — image metadata with blurDataURLs
 *   /public/assets/optimised/        — actual image files
 *
 * Usage:
 *   npm run seed
 *   (or: npx tsx scripts/seed-products.ts)
 *
 * Requires:
 *   .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Manual product catalogue — replaces what scrape-products.json gives us
// (Webador scrape is best-effort; manual curation produces better results)
const PRODUCTS = [
  {
    slug: 'pink-wedding-dress',
    name: 'Pink Wedding Dress',
    description: 'A soft baby pink wedding gown with hand-finished bodice. Long sleeves, full length. Made for spring weddings and intimate ceremonies.',
    category: 'wedding',
    price: 420.00,
    primary_colour: 'pink',
    available_sizes: ['L', 'XL'],
    available_colours: ['Pink'],
    length: 'long',
    occasion: ['wedding'],
    featured: true,
    images: ['pink-wedding-dress-1', 'pink-wedding-dress-2', 'pink-wedding-dress-3'],
  },
  {
    slug: 'maroon-wedding-dress',
    name: 'Maroon Wedding Dress',
    description: 'A rich maroon long gown with structured silhouette. Made to flatter and to last — the kind of dress kept long after the day.',
    category: 'wedding',
    price: 420.00,
    primary_colour: 'maroon',
    available_sizes: ['L', 'XL'],
    available_colours: ['Maroon'],
    length: 'long',
    occasion: ['wedding'],
    featured: true,
    images: ['maroon-wedding-dress-1', 'maroon-wedding-dress-2'],
  },
  {
    slug: 'pink-long-gown',
    name: 'Pink Long Gown',
    description: 'A flowing pink long gown, equally at home at a wedding reception or a black-tie evening.',
    category: 'evening',
    price: 380.00,
    primary_colour: 'pink',
    available_sizes: ['M', 'L', 'XL'],
    available_colours: ['Pink'],
    length: 'long',
    occasion: ['wedding', 'engagement', 'evening'],
    featured: true,
    images: ['pink-long-gown-1'],
  },
  {
    slug: 'green-long-gown',
    name: 'Light Green Long Gown',
    description: 'A delicate light green gown with subtle detailing. Long, fluid, and quietly luxurious.',
    category: 'evening',
    price: 420.00,
    primary_colour: 'green',
    available_sizes: ['L', 'XL'],
    available_colours: ['Light Green'],
    length: 'long',
    occasion: ['evening', 'engagement'],
    images: ['green-long-gown-1'],
  },
  {
    slug: 'blue-long-gown-1',
    name: 'Blue Long Gown',
    description: 'Deep blue with a refined cut. Long sleeves, full length — equally appropriate for formal evenings and special occasions.',
    category: 'evening',
    price: 349.00,
    primary_colour: 'blue',
    available_sizes: ['L', 'XL'],
    available_colours: ['Blue'],
    length: 'long',
    occasion: ['evening'],
    images: ['blue-long-gown-1'],
  },
  {
    slug: 'pink-wedding-dress-2',
    name: 'Pink Wedding Dress II',
    description: 'A second pink wedding gown in our collection — softer, with a more relaxed silhouette. For the bride who wants comfort without compromise.',
    category: 'wedding',
    price: 420.00,
    primary_colour: 'pink',
    available_sizes: ['L', 'XL'],
    available_colours: ['Pink'],
    length: 'long',
    occasion: ['wedding'],
    images: ['pink-wedding-dress-2-img-1'],
  },
  {
    slug: 'yellow-long-gown',
    name: 'Yellow Long Gown',
    description: 'A warm yellow long gown. Designed for sun-drenched garden parties and bright occasions where you want to be noticed.',
    category: 'occasion',
    price: 349.00,
    primary_colour: 'yellow',
    available_sizes: ['L', 'XL'],
    available_colours: ['Yellow'],
    length: 'long',
    occasion: ['party', 'engagement'],
    images: ['yellow-long-gown-1'],
  },
  {
    slug: 'maroon-long-gown',
    name: 'Maroon Long Gown',
    description: 'A versatile maroon gown — equally at home at engagements, mehndis, and formal evening events.',
    category: 'occasion',
    price: 349.00,
    primary_colour: 'maroon',
    available_sizes: ['M', 'L', 'XL'],
    available_colours: ['Maroon'],
    length: 'long',
    occasion: ['engagement', 'party'],
    images: ['maroon-long-gown-1'],
  },
  {
    slug: 'blue-long-gown-2',
    name: 'Blue Long Gown II',
    description: 'A lighter blue long gown with modern lines. The most accessibly-priced piece in our current collection.',
    category: 'occasion',
    price: 279.00,
    primary_colour: 'blue',
    available_sizes: ['XL'],
    available_colours: ['Blue'],
    length: 'long',
    occasion: ['evening', 'party'],
    images: ['blue-long-gown-2'],
  },
];

async function uploadImage(filename: string, productSlug: string) {
  const filePath = resolve('public/assets/optimised', `${filename}-1600.webp`);

  try {
    const fileBuffer = await readFile(filePath);

    const storagePath = `products/${productSlug}/${filename}.webp`;

    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      console.error(`  ✗ Upload failed for ${filename}: ${uploadError.message}`);
      return null;
    }

    return storagePath;
  } catch (err) {
    console.error(`  ✗ Read failed for ${filePath}: ${(err as Error).message}`);
    return null;
  }
}

async function seedProduct(product: typeof PRODUCTS[0], displayOrder: number) {
  console.log(`\n📦 ${product.name}`);

  // Insert product
  const { data: inserted, error } = await supabase
    .from('products')
    .upsert({
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      currency: 'GBP',
      primary_colour: product.primary_colour,
      available_sizes: product.available_sizes,
      available_colours: product.available_colours,
      length: product.length,
      occasion: product.occasion,
      featured: product.featured ?? false,
      display_order: displayOrder,
      active: true,
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (error || !inserted) {
    console.error(`  ✗ Product insert failed: ${error?.message}`);
    return;
  }

  console.log(`  ✓ Product upserted (id: ${inserted.id})`);

  // Upload images
  for (let i = 0; i < product.images.length; i++) {
    const imageName = product.images[i];
    const storagePath = await uploadImage(imageName, product.slug);

    if (storagePath) {
      const { error: imgError } = await supabase
        .from('product_images')
        .upsert({
          product_id: inserted.id,
          storage_path: storagePath,
          alt_text: `${product.name} — view ${i + 1}`,
          display_order: i,
          is_primary: i === 0,
        }, { onConflict: 'product_id,storage_path' });

      if (imgError) console.error(`  ✗ Image record failed: ${imgError.message}`);
      else console.log(`  ✓ Image ${i + 1}/${product.images.length}`);
    }
  }
}

async function main() {
  console.log('🌱 Seeding products into Supabase...');

  for (let i = 0; i < PRODUCTS.length; i++) {
    await seedProduct(PRODUCTS[i], i + 1);
  }

  console.log('\n✅ Seed complete.');
  console.log('\nVerify in Supabase dashboard:');
  console.log(`  ${SUPABASE_URL!.replace('https://', 'https://app.supabase.com/project/')}`);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
