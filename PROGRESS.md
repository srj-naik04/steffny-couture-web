# Progress

Live state of the build. Update after every phase or significant change.

## Current phase

**Phase 3 — Marketing Pages** (complete; ready for Phase 4)

## Phase status

| Phase | Status | Notes |
|---|---|---|
| 0 — Foundation | ✅ Done | Playwright MCP visual pass: 375px, 768px, 1024px, 1440px all clean; mobile drawer open/Escape/close verified; 404 page styled; 0 console errors; build clean |
| 1 — Asset Extraction | ✅ Done | 36 raw images scraped, curated to 10 products + 13 hero + 3 about placeholders; WebP/AVIF + blurDataURLs generated; data/products.json populated |
| 2 — Database & Backend | ✅ Done | 5 web-only migrations (products/product_images, inquiries, reviews, journal_views, storage), RLS hardened with WITH CHECK + EXISTS guards, supabase clients split (browser/server/admin), env.ts split for server-only safety, products feature API; seed pending live SUPABASE_SERVICE_ROLE_KEY |
| 3 — Marketing Pages | ✅ Done | 7 marketing pages + 5 stub pages, JSON-LD (Organization/WebSite/LocalBusiness), unique image per visible placement, skip-to-content a11y, contact server action with PII-safe logging and RLS-compliant inserts; Playwright clean at all 6 viewports |
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

- [ ] Final hero image — home hero is `bride-bangles-portrait.jpg` (Steffi photo, confirmed). Steffi to confirm this is her preferred choice before launch.
- [ ] About-page gallery photos — three Pexels stock placeholders in `public/assets/about/` are marked `data-placeholder="true"`. Steffi to provide 3 real studio/process shots for swap before launch.
- [ ] About-page copy — content-writer produced full narrative; Steffi to voice-review before launch.
- [ ] Journal post topics — 3 placeholder posts stubbed in JournalTeaser. Phase 7 will write real MDX posts; Steffi to confirm topic angles.
- [ ] Press section — does Steffi have any press features? If yes, Phase 7 adds a press strip on about/home.
- [ ] Instagram pull — auto-pull (requires Instagram API + Business account) or static curated grid? Decide before Phase 7.
- [ ] Real phone/email/WhatsApp — all sourced from `src/constants/brand.ts` STUDIO constant. Confirm these are correct before launch.
- [ ] Custom-bridal service hero — currently uses `bride-maroon-arch.jpg` (non-Steffi). IMAGE_BRIEF originally recommended a Steffi photo here but the rule was relaxed as both Steffi photos are already anchored on home hero, about hero, and contact founder card. Steffi: do you want a dedicated portrait for the custom-bridal page?

## Blockers

- `SUPABASE_SERVICE_ROLE_KEY` blank in `.env.local` — owner must provide before `scripts/seed-products.ts` can run and before live Supabase tables are populated. Code is ready; no further engineering needed.
- No `origin` remote configured for this repo. Phase 2 commits landed locally (44fad0d, 33f452b, b49b180). To push: `git remote add origin <github-url> && git push -u origin main`.
- Contact form will silently fail in live mode until the `inquiries` table is provisioned on the live Supabase project (depends on the service-role key blocker above).

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

### 2026-05-23 (Phase 3)
- SEO helpers written: `src/lib/seo/metadata.ts` (per-route Metadata builder) + `src/lib/seo/jsonld.tsx` (Organization, WebSite, LocalBusiness JSON-LD components)
- 12 shared marketing components added: `Hero`, `SectionHeader`, `RevealOnScroll`, `Prose`, `FeaturedProductsStrip`, `ServicesPreview`, `AboutTeaser`, `ReviewsStrip`, `JournalTeaser`, `FinalCta`, `FounderCard`, `ContactForm`
- Home page: hero (`bride-bangles-portrait.jpg`) + featured products strip with graceful Supabase fallback + about teaser + services preview + reviews strip + journal teaser + final CTA
- About page: hero (`bride-bouquet-detail.jpg`) + 6 narrative sections + pull quote + 3 stock gallery photos marked `data-placeholder="true"` for later replacement
- Services overview + 3 detail pages (alterations, custom-bridal, bridesmaid): hero + what-we-do checklist + numbered process steps + `<details>/<summary>` FAQ accordion (server-rendered, zero JS)
- Contact page: two-column layout + `FounderCard` (`bride-bouquet-detail.jpg`) + LocalBusiness JSON-LD + OpenStreetMap iframe (no API key)
- 5 stub pages added (`/reviews`, `/journal`, `/book`, `/dresses`, `/cart`) with brand-voice "coming soon" heroes to prevent header nav 404s; Phases 4-7 replace these
- Route group layouts added for `(booking)` and `(shop)`, each with skip-to-content link + shared header/footer
- `ContactForm` server action (`src/features/contact/actions.ts`): writes to `inquiries` table with `source='web'`; PII-safe logging (reference id + timestamp only); demo-mode graceful degradation
- `src/app/sitemap.ts` + `src/app/robots.ts` added; non-production deploys set `disallow: '/'` via `VERCEL_ENV` check
- `RevealOnScroll` uses Framer Motion `whileInView` + `viewport.once: true`; reduces to plain `<div>` when `useReducedMotion()` is true
- Unique image per visible placement across all pages; `bride-bouquet-detail.jpg` intentionally reused on about hero + contact founder card per IMAGE_BRIEF founder-spotlight rule
- consistency-checker: 7 findings raised, all resolved (raw `<a>` link, RLS source mismatch, inline style, image over-use)
- security-reviewer: 1 critical + 1 high fixed (contact source RLS mismatch, PII logging); `npm audit --omit=dev --audit-level=high` returned 0
- Playwright (2 cycles): cycle 1 caught RevealOnScroll invisible content, Supabase insert failure, Instagram touch target, broken nav links — all fixed; cycle 2 clean at all 6 viewports (375/640/768/1024/1280/1920); BUG-2 (Supabase rejection) deferred pending live table provisioning
- `npm run typecheck`, `lint`, `build` all clean; 13 routes generated
- **Phase 3 complete**

---

## How to update this file

After every commit or session-end:
1. Update the "Current phase" line if it changed
2. Update the phase status table
3. Add to the activity log under today's date
4. Add to "Open questions" anything you noticed but didn't address
5. Add to "Blockers" anything stopping progress

Keep entries short. One line per achievement. Detailed notes go in commit messages and `docs/DECISIONS.md`.
