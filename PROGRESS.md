# Progress

Live state of the build. Update after every phase or significant change.

## Current phase

**Phase 2 — Database & Backend** (complete; ready for Phase 3)

## Phase status

| Phase | Status | Notes |
|---|---|---|
| 0 — Foundation | ✅ Done | Playwright MCP visual pass: 375px, 768px, 1024px, 1440px all clean; mobile drawer open/Escape/close verified; 404 page styled; 0 console errors; build clean |
| 1 — Asset Extraction | ✅ Done | 36 raw images scraped, curated to 10 products + 13 hero + 3 about placeholders; WebP/AVIF + blurDataURLs generated; data/products.json populated |
| 2 — Database & Backend | ✅ Done | 5 web-only migrations (products/product_images, inquiries, reviews, journal_views, storage), RLS hardened with WITH CHECK + EXISTS guards, supabase clients split (browser/server/admin), env.ts split for server-only safety, products feature API; seed pending live SUPABASE_SERVICE_ROLE_KEY |
| 3 — Marketing Pages | ⏳ Not started | Home, about, services, contact |
| 4 — Dress Catalogue | ⏳ Not started | Grid, product detail, carousel |
| 5 — Cart & Mock Checkout | ⏳ Not started | Zustand cart, fake payment, inquiry record |
| 6 — Fitting Booking | ⏳ Not started | 6-step wizard, shared bookings table |
| 7 — Reviews, Journal, Polish | ⏳ Not started | MDX posts, reviews, animations, a11y |
| 8 — Demo Prep & Deploy | ⏳ Not started | Lighthouse, cross-browser, Vercel preview |
| 9 — Domain Migration | ⏳ Not started | Cut over from Webador to Vercel |

Legend: ⏳ Not started • 🔨 In progress • ✅ Done

## Decisions made

See `docs/DECISIONS.md` for the full log.

Notable to date:
- Next.js 15 App Router locked
- Supabase project shared with mobile app
- Mock payments for v1, Stripe later
- No customer accounts in v1
- Vercel hosting

## Open questions

- [ ] Final hero image — using a placeholder; Steffi to pick the real one
- [ ] About-page copy — currently from existing site, needs Steffi's voice review
- [ ] Journal post topics — 3 to start, need ideas from Steffi (or write generic Hounslow-wedding pieces)
- [ ] Press section — does Steffi have any features? If yes, set up the section
- [ ] Instagram pull — auto-pull (requires Instagram API + Business account) or static curated grid?

## Blockers

- `SUPABASE_SERVICE_ROLE_KEY` blank in `.env.local` — owner must provide before `scripts/seed-products.ts` can run and before live Supabase tables are populated. Code is ready; no further engineering needed.
- No `origin` remote configured for this repo. Phase 2 commits landed locally (44fad0d, 33f452b, b49b180). To push: `git remote add origin <github-url> && git push -u origin main`.

## Activity log

### 2026-05-18
- Project kit assembled
- CLAUDE.md, all 16 skills, all 8 commands, all 9 docs, 3 scripts written
- Ready for Phase 0 setup

### 2026-05-20
- Phase 0 scaffold landed: Next.js 15.5 + React 19, Tailwind v4 with `@theme` brand tokens, Fraunces + Inter via `next/font/google`
- `src/lib/` essentials (`cn`, `currency`, `date`, `env`, `motion/presets`) and `src/constants/{brand,nav}.ts`
- UI primitives (`Button`, `Container`, `Section`, `Card`, `Input`, `Label`) + shared `Header`, `MobileDrawer` (Framer Motion drawer, ESC + body-scroll lock), `Footer`, `Logo`, `MotionConfigProvider`
- `(marketing)` route group with placeholder home + global `not-found.tsx`
- `npm run typecheck`, `lint`, `build` all clean; dev smoke test returns 200 + correct `<title>`
- Lucide v1 dropped brand icons; Instagram glyph inlined as SVG in footer
- Playwright MCP visual acceptance: header breakpoint moved md→lg (768px was too cramped for desktop nav); `fullWidth` prop stripped before DOM spread in Button; `favicon.ico` + `icon.svg` added; 0 console errors confirmed
- **Phase 0 complete**

### 2026-05-21
- Phase 1: scraped 36 images from steffnycouture.co.uk (Webador CDN + Pexels stock on About). Wrote `scripts/curate-assets.mjs` to remap raw filenames into clean, slug-named originals under `/public/assets/{products,hero,about}/`
- 10-product catalogue derived from visual inspection (Steffi's real inventory; named by colour + silhouette). Written to `data/products.json` with brand-voice copy (no exclamation marks, sentence case, descriptive)
- `optimise-images.mjs` rewritten to walk curated folders, producing WebP at 400/800/1600/2400 + AVIF at largest + blurDataURL per image → `data/optimised-images.json` (26 records). Variants land in `/public/assets/optimised/` (gitignored)
- `seed-products.ts` refactored to read both JSON files; will run in Phase 2 once the `products` / `product_images` tables exist
- About-page photos are Pexels stock — committed as placeholders with `PLACEHOLDERS.txt` marking them for replacement before launch
- `npm run scrape | curate | optimise | seed` wired up in package.json
- Acceptance: ✓ 10 product photos at original res, ✓ 3 about photos, ✓ 13 hero candidates, ✓ data/products.json with 10 products
- **Phase 1 complete**

### 2026-05-23
- 5 SQL migrations written: `products`, `product_images`, `inquiries`, `reviews`, `journal_views` + `dress-photos` storage bucket (`supabase/migrations/20260521_0001–0005_*.sql`)
- RLS hardened: `product_images` anon read guarded via `EXISTS` on `products.active=true`; `inquiries` anon INSERT tightened with `WITH CHECK` constraining `status/source/type`; `journal_views` `increment_view` RPC uses `SECURITY DEFINER` with `char_length` guard
- `reviews` table has `updated_at` column + auto-update trigger
- Storage bucket `dress-photos` created with 5 MB file size limit (down from initial 50 MB)
- Supabase clients split into `src/lib/supabase/client.ts` (`createBrowserSupabaseClient`), `server.ts` (`createServerSupabaseClient`), `admin.ts` (service-role; `server-only` guarded)
- `src/lib/env.ts` split: public vars remain in `env.ts`; server-only `serverEnv` moved to `env.server.ts` with `import 'server-only'` to prevent service-role key leakage into client bundles
- `src/types/database.ts` hand-written to match schema; `src/features/products/api.ts` exports `getActiveProducts`, `getFeaturedProducts`, `getProductBySlug`, `getRelatedProducts`
- `scripts/seed-products.ts` updated to read `data/products.json` + `data/optimised-images.json`; ready to run once `SUPABASE_SERVICE_ROLE_KEY` is supplied
- Playwright acceptance: `/` and 404 pass at all 6 viewports (375/640/768/1024/1280/1920); 0 console errors; 0 network failures
- `npm audit --omit=dev --audit-level=high` returned 0 high/critical findings
- **Phase 2 complete**

---

## How to update this file

After every commit or session-end:
1. Update the "Current phase" line if it changed
2. Update the phase status table
3. Add to the activity log under today's date
4. Add to "Open questions" anything you noticed but didn't address
5. Add to "Blockers" anything stopping progress

Keep entries short. One line per achievement. Detailed notes go in commit messages and `docs/DECISIONS.md`.
