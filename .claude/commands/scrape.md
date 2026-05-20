---
description: Extract images and content from the existing Webador site. Runs the scrape and extract scripts, then prepares assets for the seed.
---

# /scrape

Pull images and product data from https://www.steffnycouture.co.uk into local files for seeding.

## Steps

1. **Read** `image-pipeline` skill for the full extraction → optimisation → seed flow.

2. **Verify scripts exist**:
   - `scripts/scrape-site.mjs` — downloads images + archives HTML
   - `scripts/extract-products.mjs` — parses archived HTML into `products.json`
   - `scripts/optimise-images.mjs` — runs sharp over the raw images
   - `scripts/seed-products.ts` — uploads to Supabase, inserts DB rows

   If any are missing, create them per the patterns in `image-pipeline` skill.

3. **Run scrape**:
   ```bash
   node scripts/scrape-site.mjs
   ```
   Expected output:
   - `scripts/scraped/images/` populated with ~25-30 JPGs
   - `scripts/scraped/data/<page>.html` for each page archived

4. **Run extraction**:
   ```bash
   node scripts/extract-products.mjs
   ```
   Expected output:
   - `scripts/scraped/data/products.json` with all 10 dresses, prices, variants, image refs

   **Manually review** `products.json` for correctness:
   - Names match what's on the site
   - Prices match
   - Variants captured
   - Image filenames referenced exist in `scripts/scraped/images/`

5. **Run optimisation**:
   ```bash
   node scripts/optimise-images.mjs
   ```
   Expected output:
   - `scripts/optimised/images/` with re-encoded JPGs at 2000px max, ~150-300KB each

6. **Verify before seeding**:
   - Open 3-4 optimised images, check quality is good
   - `products.json` is sensible
   - Supabase project URL and service role key are in `.env.local`

7. **Seed Supabase** (only when ready, this is the last step):
   ```bash
   npx tsx scripts/seed-products.ts
   ```
   Expected output:
   - 10 products inserted into the `products` table
   - Images uploaded to `dress-photos/` Storage bucket
   - All image URLs are public + accessible

8. **Verify seeded data**:
   - Open Supabase Studio → Table editor → products → confirm 10 rows
   - Open one image URL in a browser — it loads
   - Open a category page in the local dev server, the dresses appear

## Hard rules

- Never seed before reviewing the extracted JSON
- Never seed against production Supabase without confirming with user
- Never commit `scripts/scraped/` or `scripts/optimised/` — they're in `.gitignore`
- Always run the scripts in order: scrape → extract → optimise → seed
- If a re-run is needed, delete the relevant output folder first (`rm -rf scripts/scraped/`)
