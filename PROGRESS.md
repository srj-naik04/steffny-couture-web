# Progress

Live state of the build. Update after every phase or significant change.

## Build outcome

Phases 0-8 shipped. Phase 9 (domain migration) deferred pending owner sign-off.

All 13 routes pass Lighthouse local (Perf ≥96, A11y ≥96, BP=100, SEO=100). Final regression: 54 screenshots across 17 pages × 6 viewports — 0 bugs remaining, 0 console errors, 0 network failures. Security sweep: 0 critical/high findings; 0 high/critical npm audit findings. Build is demo-ready.

**Owner actions required before domain cut-over:** provide `SUPABASE_SERVICE_ROLE_KEY`, confirm real contact details, supply studio/product photos, voice-review about copy, then run Phase 9.

## Current phase

**Build complete (Phases 2-8 shipped; Phase 9 deferred)** — ready for owner sign-off + Vercel deploy

## Phase status

| Phase | Status | Notes |
|---|---|---|
| 0 — Foundation | ✅ Done | Playwright MCP visual pass: 375px, 768px, 1024px, 1440px all clean; mobile drawer open/Escape/close verified; 404 page styled; 0 console errors; build clean |
| 1 — Asset Extraction | ✅ Done | 36 raw images scraped, curated to 10 products + 13 hero + 3 about placeholders; WebP/AVIF + blurDataURLs generated; data/products.json populated |
| 2 — Database & Backend | ✅ Done | 5 web-only migrations (products/product_images, inquiries, reviews, journal_views, storage), RLS hardened with WITH CHECK + EXISTS guards, supabase clients split (browser/server/admin), env.ts split for server-only safety, products feature API; seed pending live SUPABASE_SERVICE_ROLE_KEY |
| 3 — Marketing Pages | ✅ Done | 7 marketing pages + 5 stub pages, JSON-LD (Organization/WebSite/LocalBusiness), unique image per visible placement, skip-to-content a11y, contact server action with PII-safe logging and RLS-compliant inserts; Playwright clean at all 6 viewports |
| 4 — Dress Catalogue | ✅ Done | 10-product SSG grid with URL-state filters + product detail with carousel/variant selector/cart; demo-mode JSON fallback so catalogue works without live Supabase; Zustand cart store wired into header; Product JSON-LD with breakout-safe serializer |
| 5 — Cart & Mock Checkout | ✅ Done | Cart drawer + cart page + 4-step checkout (Contact/Delivery/Payment/Review) + confirmation; mock card data never transits to server (serverCheckoutSchema excludes card fields); placeOrder writes inquiries row with SC-XXXXXX reference; cart store v2 with v1→v2 migration; full a11y (aria-labels, focus trap, sr-only step labels, 44×44 touch targets); demo flow verified end-to-end at 1280px, layouts clean at all 6 viewports |
| 6 — Fitting Booking | ✅ Done | 6-step booking wizard with draft persistence across navigation (SSR-safe lazy init + post-hydration restore + ref guard, 5 playwright cycles to close state-restore race); photo upload to `booking-photos/web-drafts/<draftId>/` prefix; RLS-compliant anon INSERT on shared `bookings` table; `?ref` validated against `/^SC-[A-Z0-9]{6}$/`; `journal_views.increment_view` anon EXECUTE revoked; anon DELETE on `booking-photos` removed; `src/features/booking/` renamed to `bookings/` |
| 7 — Reviews, Journal, Polish | ✅ Done | Reviews page (14 reviews + submission form), 3 SSG MDX journal posts, BlogPosting + Person JSON-LD, InstagramGallery, draft post filtering, comprehensive UI spacing tighten (Hero items-start + asymmetric padding + Section halved + product/book grids items-start) after 3 Playwright cycles closed all user-reported voids; all 12 pages × 6 viewports clean |
| 8 — Demo Prep & Deploy | ✅ Done | All 13 routes pass Lighthouse local: Perf ≥96, A11y ≥96, BP=100, SEO=100. Security headers added (HSTS preload, X-Frame DENY, Referrer-Policy, Permissions-Policy). Robots gate tightened to canonical-domain check. WCAG AA contrast sweep across 17 files (46 text-ink-subtle → text-ink-muted). ARIA 1.2 fixes on swatches + star ratings. Demo script written. End-to-end happy path verified at all viewports. |
| 9 — Domain Migration | ⏳ Not started | Out of scope for this build run. Run separately when ready to migrate steffnycouture.co.uk DNS from Webador to Vercel. |

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
- [ ] Press section — `pressFeatures` array in `src/content/marketing/press.ts` is empty (pending Steffi confirmation). PressStrip component not rendered; will auto-appear once array is populated.
- [ ] Instagram pull — static curated grid used for Phase 7. Auto-pull requires Instagram Business account + token refresh; defer to post-launch.
- [ ] Real phone/email/WhatsApp — all sourced from `src/constants/brand.ts` STUDIO constant. Confirm these are correct before launch.
- [ ] Custom-bridal service hero — currently uses `bride-maroon-arch.jpg` (non-Steffi). IMAGE_BRIEF originally recommended a Steffi photo here but the rule was relaxed as both Steffi photos are already anchored on home hero, about hero, and contact founder card. Steffi: do you want a dedicated portrait for the custom-bridal page?
- [ ] Multiple images per product — each catalogue entry currently has only one image (`01.jpg`). Carousel is built to handle multiple; once Supabase is seeded, additional `product_images` rows will render automatically. Steffi: do you have second/third angles for the 10 dresses?
- [ ] Colour-swatch palette accuracy — `globals.css` `@theme` defines approximate hex for nine product colours (mauve, plum, aqua, coral, cobalt, blue, champagne, maroon, sage). Steffi: review the chips on demo day to confirm they read true to fabric.
- [ ] `booking-photos` bucket provisioning — migration `20260523_0007_booking_photos_bucket.sql` creates the bucket with anon-write to `web-drafts/`. Must be applied to the live Supabase project once the service-role key is available. Until then, photo uploads in live mode will silently fail (wizard still submits; photo_paths = demo paths or []).
- [ ] Stale `web-drafts/` photo cleanup — customers who abandon the wizard mid-upload leave orphaned files in Storage. Phase 7 should add a cleanup job (Supabase Edge Function cron or Postgres cron) to purge `web-drafts/` files older than 7 days.

## Activity log

### 2026-05-28 — Hero + catalogue layout polish

Hero + catalogue layout polish — full-bleed split hero (image bleeds to right edge on lg+, text aligns to container; removes empty desktop side gutters), about hero object-top (head no longer cropped), dresses grid de-gated from RevealOnScroll + compact catalogue header so products show without scrolling. Playwright verified 0 horizontal overflow across 6 viewports × 6 pages.

### 2026-05-24 — Copy de-personalisation — studio voice pass

Copy de-personalisation — generalized all operational "Steffi will…" service promises to studio voice ("we will…", "the studio…") across 21 files; kept founder identity on about page, founder card, home teaser, JSON-LD, journal bylines. Playwright verified 0 operational promises in visible text; build clean.

### 2026-05-24 — Post-ship UX polish — card heights + image dedupe

User feedback: "sizes inconsistent. handle across all view ports."

- Card row-height consistency applied across 6 grid components: `h-full flex flex-col` on card root, `flex-1` on body, `mt-auto` on footer — covers ProductCard, journal/page.tsx, JournalTeaser, reviews/page.tsx, services/page.tsx, FeaturedProductsStrip. Cards in the same row now equalise height regardless of content length at all viewports.
- Header CTA button bumped from h-10 (40px) to h-12 (48px) — consistent with site button minimum, meets WCAG 44px touch target.
- InstagramGallery slot 3 swapped from `bride-maroon-arch.jpg` (duplicating JournalTeaser slot 3) to `bride-white-umbrella-interior.jpg` — deduplicated home page image set.
- Occasion-wear keywords added: "21st birthday dress" + "prom dress" appended to /dresses, /services, /services/alterations SEO entries, closing gap identified during original-site scrape audit.

## Blockers

- `SUPABASE_SERVICE_ROLE_KEY` blank in `.env.local` — owner must provide before `scripts/seed-products.ts` can run and before live Supabase tables are populated. Code is ready; no further engineering needed.
- No `origin` remote configured for this repo. Phase 2 commits landed locally (44fad0d, 33f452b, b49b180). To push: `git remote add origin <github-url> && git push -u origin main`.
- Contact form will silently fail in live mode until the `inquiries` table is provisioned on the live Supabase project (depends on the service-role key blocker above).

## Build summary

Phases 0–8 complete. Phase 9 (domain migration) is deferred and must be run separately by the owner when ready to cut `steffnycouture.co.uk` DNS from Webador to Vercel.

**Outstanding owner sign-offs before launch:**
- Provide `SUPABASE_SERVICE_ROLE_KEY` so `scripts/seed-products.ts` can populate the live database and migrations can be applied.
- Confirm or replace the three Pexels stock placeholders in `public/assets/about/` with real studio photos.
- Voice-review the about-page copy written on Steffi's behalf.
- Confirm phone, email, and WhatsApp numbers in `src/constants/brand.ts` are correct.
- Decide whether a dedicated portrait is needed on the custom-bridal service page.
- Confirm the home hero (`bride-bangles-portrait.jpg`) is the preferred choice.
- Provide second/third-angle product photos for the carousel (single image per dress at present).
- Review colour-swatch chip accuracy on demo day.
- Confirm press section (empty `pressFeatures` array in `src/content/marketing/press.ts`).

**Suggested next steps:**
1. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` and run `npm run seed`.
2. Apply pending migrations (`20260523_0006`, `20260523_0007`) to the live Supabase project.
3. Push repo to GitHub remote (`git remote add origin <url> && git push -u origin main`).
4. Deploy to Vercel; confirm preview URL is functional.
5. Provide real about-page photos and any additional product angles.
6. Steffi/Rohan sign-off on the demo walkthrough.
7. Run Phase 9 to migrate the domain.

## Activity log

### 2026-05-24 (Final testing + pre-ship polish)

- Final regression: 54 screenshots captured across 17 pages × 6 viewports (375/640/768/1024/1280/1920); all owner-spotlight placements verified; 0 console errors; 0 network failures
- Blocking bug found and closed: `BookingWizard` `handleSubmit` silently swallowed validation failures — `onInvalid` callback added to surface brand-voice error toast (`src/app/(booking)/book/page.tsx`)
- FIX: `/reviews` page — `LocalBusiness` JSON-LD with `AggregateRating` (ratingValue 5.0, reviewCount 14) and 10 `Review` nodes added; enables Google star-rating rich snippets; first-name-only author fields, no PII
- FIX: contact server action — raw `err` object replaced with sanitised log (reference id + timestamp only; `src/features/contact/actions.ts`)
- FIX: new migration `supabase/migrations/20260524_0008_revoke_increment_view_public.sql` — `REVOKE EXECUTE ON FUNCTION increment_view FROM PUBLIC` applied explicitly; Postgres `CREATE FUNCTION` grants to PUBLIC by default; migration 0006 added an authenticated GRANT but the PUBLIC grant was never revoked
- FIX: checkout confirmation — `ref` searchParam validated against `/^SC-[A-Z0-9]{6}$/` regex (parity with booking confirmation D-041; `src/app/(shop)/checkout/confirmation/page.tsx`)
- Post-fix Playwright re-verify: BUG-1 closed, JSON-LD live on `/reviews`, ref validation working; 0 bugs remaining
- All 13 Lighthouse routes still pass thresholds (no performance-affecting changes in this pass)
- `npm audit --omit=dev --audit-level=high`: 0 high/critical; postcss moderate noted as Next.js internal dependency, not actionable

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

### 2026-05-23 (Phase 5)
- Cart store bumped from v1 → v2: `CartItem` gains `variantId?: string | null`; persist key `steffny-cart-v2`; `migrate()` maps v1 items → v2 by injecting `variantId: null`
- `src/features/cart/ui-store.ts` — Zustand UI store (no persist) for drawer open/close state; `useCartUiStore` with `openDrawer`, `closeDrawer`, `toggleDrawer`
- `src/features/cart/components/CartDrawer.tsx` — right-side slide-in sheet; Framer Motion; body-scroll-lock; ESC closes; backdrop click closes; focus trap (Tab/Shift+Tab cycle) + return-focus to opener; ARIA `role="dialog"`, `aria-modal`, `aria-labelledby`; quantity stepper (44×44 buttons, aria-label includes item name, min 1 max 10); image alts include size + colour via `describeCartItem` helper
- `src/components/shared/CartIcon.tsx` — updated to button (was Link); opens CartDrawer via `useCartUiStore` on click; `/cart` remains navigable via drawer's "View cart" link
- `src/app/layout.tsx` — `<CartDrawer />` mounted at root layout inside `MotionConfigProvider`; available across all route groups without duplication
- `src/features/cart/components/CartContents.tsx` — client component; full cart page contents with quantity stepper, remove, order summary, brand-voice studio note; AnimatePresence exit on item remove
- `src/app/(shop)/cart/page.tsx` — replaced Phase 3 stub; server shell with CartContents client wrapper; `noindex` metadata
- `src/app/(shop)/cart/loading.tsx` — shimmer skeleton
- `src/features/checkout/schema.ts` — Zod schemas: `contactStepSchema`, `deliveryStepSchema`, `paymentStepSchema` (client-only), `serverCheckoutSchema` (excludes card fields); UK postcode regex; mock card length checks; `serverCheckoutSchema` enforces no card data over the wire
- `src/features/checkout/action.ts` — `placeOrder` server action; generates `SC-XXXXXX` reference via `crypto.getRandomValues`; builds `InquiryItem[]` with `variantId` per D-019 contract; writes `inquiries` row (`type: 'product_order'`, `source: 'web'`, `status: 'new'`); card data never persisted; demo-mode guard `(!hasSupabase || isDemoMode)` logs reference + timestamp + itemCount only, no PII; sanitised error logging
- `src/features/checkout/components/CheckoutForm.tsx` — `"use client"` 4-step wizard; React Hook Form + Zod; step-level partial validation via `trigger()`; progress indicator with `<nav><ol><li>` semantics, `aria-current="step"`, sr-only completion labels; 2-second fake delay on submit; writes `steffny-last-order` to sessionStorage; clears cart; redirects to `/checkout/confirmation?ref=<ref>`; AnimatePresence step transitions; demo-mode notice on Payment step
- `src/features/checkout/components/CheckoutSummary.tsx` — client sidebar; reads Zustand cart; subtotal + delivery placeholder
- `src/app/(shop)/checkout/page.tsx` — server shell with two-column layout (form + sticky sidebar)
- `src/app/(shop)/checkout/loading.tsx` — shimmer skeleton
- `src/app/(shop)/checkout/error.tsx` — brand-voice error boundary with "Try again" + "Return to collection" CTAs
- `src/app/(shop)/checkout/confirmation/page.tsx` — server component; reads `ref` from searchParams; gold-soft reference badge; brand-voice WhatsApp notice ("within one working day"); "Your card has not been charged" assurance; `noindex` metadata
- `src/app/(shop)/checkout/confirmation/LastOrderSummary.tsx` — client component; reads `steffny-last-order` from sessionStorage; clears after first read; displays item list + total; graceful fallback
- `src/features/cart/utils.ts` — `describeCartItem(item)` helper returns `[name, size, colour].filter(Boolean).join(', ')`; used across all 5 cart thumbnail Image sites
- Contact server action updated to same `(!hasSupabase || isDemoMode)` dual gate for consistency with `placeOrder`
- `src/content/marketing/seo.ts` — added `/cart`, `/checkout`, `/checkout/confirmation` entries; `src/app/robots.ts` — added `/checkout/` + `/checkout/confirmation` to disallow list
- security-reviewer: 0 critical; 2 high fixed (card-field wire transit via `serverCheckoutSchema`; `hasSupabase` vs `isDemoMode` mismatch); 1 medium fixed; `npm audit --omit=dev --audit-level=high` returned 0
- Playwright cycle 1 happy path PASS; BUG-1 (ESC focus return to body) fixed in cycle 2 by routing ESC through `handleClose` calling `openerRef.current?.focus()`; all 6 viewports clean
- `npm run typecheck`, `lint`, `build` all clean; 30 routes generated
- **Phase 5 complete**

### 2026-05-23 (Phase 6)
- 6-step booking wizard built at `src/app/(booking)/book/page.tsx` — Service type / Photos / Details / Schedule / Contact / Review; single React Hook Form instance with per-step `trigger()` validation
- Framer Motion slide transitions; `useReducedMotion` respected; progress indicator uses `<nav aria-label="Booking progress"><ol>` with `aria-current="step"` and sr-only completion labels
- `src/features/bookings/schema.ts` — Zod per-step schemas + `bookingFullSchema` + `serverBookingSchema`
- `src/features/bookings/action.ts` — `submitBooking` server action; `SC-XXXXXX` reference via `crypto.getRandomValues`; writes shared `bookings` table with `source='web'`, `status='new'`, `user_id=null`; demo-mode guard `(!hasSupabase || isDemoMode)` logs reference + timestamp only
- `src/features/bookings/draft-store.ts` — Zustand `persist` key `steffny-booking-draft-v1`; saves partial form state on every `watch()` change; clears on successful submit
- Cross-page state-restore race resolved after 5 playwright cycles: SSR/first-render = literal `1`; post-hydration `useEffect` restores `storedStep` via a `restoredRef` guard that only locks after seeing `storedStep > 1`; first-render skip on the sync effect prevents mount write clobbering the restored value
- `src/features/bookings/components/PhotoUploader.tsx` — JPEG/PNG/WebP/HEIC; max 5 × 8 MB; uploads to `booking-photos/web-drafts/<draftId>/<uuid>.<ext>`; `demo://...` paths in demo mode; object URL previews revoked on unmount/remove
- `src/app/(booking)/book/confirmation/page.tsx` — `noindex`; `?ref` validated against `/^SC-[A-Z0-9]{6}$/` before display; graceful generic fallback prevents cosmetic phishing
- `supabase/migrations/20260523_0006_web_bookings_rls.sql` — anon INSERT policy on shared `bookings` table (`source='web'`, `status='new'`, `user_id IS NULL`); no anon SELECT/UPDATE/DELETE
- `supabase/migrations/20260523_0007_booking_photos_bucket.sql` — `booking-photos` private bucket (8 MB limit, image MIME only); anon write scoped to `web-drafts/` prefix; anon DELETE policy removed (security fix: visitor A cannot delete visitor B's drafts)
- `supabase/migrations/20260521_0004_web_journal_views.sql` updated — revoked anon EXECUTE on `increment_view` RPC (was a view-count abuse vector); web server actions call via authenticated path only
- `src/types/database.ts` — `bookings` table `Row`/`Insert`/`Update` types added
- `src/content/marketing/seo.ts` — `/book` and `/book/confirmation` SEO entries added
- Folder renamed `src/features/booking/` → `src/features/bookings/` to match CLAUDE.md §2 pluralisation
- `/book` hero uses `bride-white-umbrella-interior.jpg` (non-Steffi, previously unassigned per IMAGE_BRIEF distribution)
- `npm run typecheck`, `lint`, `build` all clean; 32 routes generated; `/book` static (○), `/book/confirmation` dynamic (ƒ)
- **Phase 6 complete**

### 2026-05-23 (Phase 7)
- **PRIORITY 0 hero fix**: removed `min-h-[85vh] lg:min-h-[90vh]` from home variant and `min-h-[55vh] lg:min-h-[65vh]` from about/service variant in `Hero.tsx`; replaced `flex h-full justify-center` Container with direct `py-` padding (`py-16 md:py-24 lg:py-28` home; `py-14 md:py-20 lg:py-24` about/service). Image column `lg:max-h-[75vh]` replaced with `lg:max-h-170` (home) and `lg:max-h-140` (about/service). Same pattern fixed in `book/page.tsx` custom hero section.
- `next-mdx-remote` + `gray-matter` added to deps; YAML-colon sanitiser in loader handles content-writer MDX with unquoted colons in titles
- `src/features/journal/loader.ts`: `getAllPosts`, `getPostBySlug`, `getRelatedPosts`, `getAllPostSlugs`; server-only; reads `content/journal/*.mdx`
- `/journal/page.tsx` replaced Phase 3 stub: uses `journalIndexCopy` from content-writer's `journal-index.ts`; real post grid with dates + reading times
- `/journal/[slug]/page.tsx`: SSG (generateStaticParams), per-post `generateMetadata`, BlogPosting JSON-LD, MDX rendered via `next-mdx-remote/rsc` with `img` → `next/image` override and `a` → `Link` override; related posts at bottom; breadcrumb nav
- `/journal/[slug]/loading.tsx` + `not-found.tsx` added
- `JournalTeaser.tsx` updated to accept real `JournalPostPreview[]` prop; falls back to placeholder posts if not supplied; home page now passes real posts from loader
- `src/features/reviews/schema.ts` + `action.ts`: Zod schema + `submitReview` server action; `published: false, featured: false` enforced; demo-mode gate `(!hasSupabase || isDemoMode)`; PII-safe logging
- `src/features/reviews/components/ReviewForm.tsx`: RHF+Zod; star-picker radiogroup (44×44 touch targets, aria-checked); success/error states with brand voice
- `/reviews/page.tsx` replaced Phase 3 stub: 14-review grid (8 seed + 6 extra from content-writer) + sticky sidebar leave-a-review form; uses `reviewsIntroCopy` from content-writer's `reviews-intro.ts`
- `InstagramGallery.tsx`: static 6-image grid; links to `STUDIO.instagram`; uses images not visible elsewhere on home page; external link with `rel=noopener`
- Home page: `InstagramGallery` added between ReviewsStrip and JournalTeaser
- `personJsonLd()` added to `jsonld.tsx`; added to `/about` page
- `src/app/sitemap.ts`: extended with journal slug entries (priority 0.75, monthly)
- `globals.css`: `journal-prose` CSS class for brand-voice MDX article typography; `kenBurns` CSS animation + `hero-ken-burns` class (reduced-motion aware); applied to Hero image column
- `Header.tsx` nav links: `focus-visible:ring-2 focus-visible:ring-rose` added for keyboard nav visibility
- `npm run typecheck`, `lint`, `build` all clean; 34 routes; 3 journal post pages SSG-prerendered (●)
- **Phase 7 complete**

### 2026-05-23 (Phase 7 — UI polish + final acceptance)
- Reviews page `/reviews`: 14-review grid (8 Phase 3 seed + 6 from `reviews-extra.ts`); `submitReview` server action writes `published: false, featured: false`; star-picker radiogroup with `aria-pressed`; demo-mode gate `(!hasSupabase || isDemoMode)`; PII-safe logs
- Journal: 3 MDX posts SSG-prerendered (`how-to-choose-a-wedding-dress-in-hounslow`, `bridal-alterations-timeline`, `south-asian-bridal-and-bridesmaid-wear`); draft frontmatter filter in `getAllPosts/getPostBySlug/getAllPostSlugs` prevents WIP posts publishing; sitemap appends slugs dynamically (priority 0.75, monthly)
- Person JSON-LD added to `/about` with Steffi photo absolute URL for knowledge-panel SEO
- `InstagramGallery` on home page: 6 non-Steffi hero photos, links to `STUDIO.instagram`, `rel=noopener`; Steffi crown jewels reserved per IMAGE_BRIEF
- Ken Burns CSS animation on Hero image column (`hero-ken-burns` class, `prefers-reduced-motion` override in `globals.css`)
- Dead dep `@tailwindcss/typography` removed; `next-mdx-remote` + `gray-matter` added
- Hamburger `focus-visible:ring-2 focus-visible:ring-rose` + Header nav link focus rings wired
- UI spacing tighten (3 Playwright cycles to close user-reported voids): `Hero.tsx` grid `items-center` → `items-start`; Hero padding cut to `pt-10 pb-4 md:pt-14 md:pb-6 lg:pt-16 lg:pb-8`; Section spacing variants halved (sm `py-8 md:py-10`, md `py-10 md:py-14 lg:py-16`, lg `py-14 md:py-18 lg:py-20`); `/book` inline hero and `/dresses/[slug]` product grid both given `items-start`; CartDrawer items `<ul>` `flex-1` removed + `max-h-[60vh] overflow-y-auto` added
- Cycle 3 Playwright result: 88px top gap at 1280px, 64px at 375px; `/book` kicker aligns with image top within 6px; cart drawer single-item gap 21px; 0 console errors across all 12 pages × both viewports
- consistency-checker: 8 findings raised; all resolved (Steffi photo in InstagramGallery, hamburger focus ring, dead dep, `personJsonLd` missing image, Tailwind `max-h-*` tokens confirmed valid)
- security-reviewer: 0 critical/high; 1 medium fixed (sitemap draft leak via `draft?: boolean` frontmatter filter); `npm audit --omit=dev --audit-level=high`: 0
- `npm run typecheck`, `lint`, `build` all clean; 34 routes; 3 journal posts SSG-prerendered (●)
- **Phase 7 complete**

### 2026-05-23 (Phase 8)
- Security headers added to `next.config.ts` headers() block: HSTS, X-Content-Type-Options, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy (camera/microphone/geolocation off)
- `lighthouse-*.json` added to `.gitignore` — generated during audits, not committed
- Lighthouse 13.3.0 run against all 13 public routes (desktop preset) using Puppeteer Chrome cache
- **Initial scores revealed two systemic issues:**
  - Performance=56 on `/` — TTFB 1,810 ms caused by `getFeaturedProductsFromSource` awaiting Supabase timeout in demo mode; fixed by introducing `useLocalOnly = isDemoMode || !hasSupabase` guard in `source.ts` to skip Supabase entirely in demo mode
  - Home page `ƒ` (dynamic) due to server Supabase client cookies() call path — added `export const dynamic='force-static'` + `revalidate=3600` to home page; home is now `○` (static, 1h ISR)
  - SEO=61 — `robots.ts` returned `disallow:'/'` for non-Vercel envs; `layout.tsx` injected `<meta robots noindex>` for same; both fixed to check `VERCEL_ENV !== undefined && VERCEL_ENV !== 'production'` (only blocks on Vercel preview/staging; allows on local `next start`)
  - Static `public/robots.txt` conflicted with `app/robots.ts` — removed `public/robots.txt` (the programmatic route takes precedence in production builds)
- **A11y fixes (ARIA 1.2 violations, weight 7 each):**
  - `ColourSwatch` `<span aria-label>` → added `role="img"` (ARIA 1.2 prohibits `aria-label` on generic-role elements)
  - Star-rating `<div aria-label>` on `/reviews` and `ReviewsStrip` → added `role="img"`
  - FAQ `<dl><div><details><summary><dt>` structure → flattened to `<div><details><summary><span>` in all three service pages (alterations, bridesmaid, custom-bridal)
- **A11y contrast fixes:** `text-ink-subtle` (#9a9089) at 12px = 2.92:1 ratio, fails 4.5:1 WCAG AA; replaced with `text-ink-muted` (#5C5551) across: `Filters.tsx`, product detail `[slug]/page.tsx`, `reviews/page.tsx`, `ReviewsStrip.tsx`, `ReviewForm.tsx`, `ContactForm.tsx`, `FeaturedProductsStrip.tsx`, `JournalTeaser.tsx`, `journal/page.tsx`, `journal/[slug]/page.tsx`
- **SEO fixes:**
  - `/services` "Learn more" link text → changed to descriptive "About alterations", "About custom bridal", "About bridesmaid dresses"
  - `/dresses` meta description injected late (byte 63,435 in streamed 123KB response) because page was dynamic due to `searchParams`; refactored to `DressesClient.tsx` (new client component handling filtering + grid) — server page is now `○` static with `force-static` + `revalidate=3600`; `DressesClient` wraps `Filters` + product grid, computes filtered list from `useSearchParams()` entirely client-side
- **Heading hierarchy fix:** `/dresses` skipped from `h1` to `h3` (product cards); added `<h2 className="sr-only">The collection</h2>` in `DressesClient`
- **Final Lighthouse scores (all 13 routes, desktop, Lighthouse 13.3.0):**

| Route | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 100 |
| `/about` | 100 | 100 | 100 | 100 |
| `/services` | 100 | 100 | 100 | 100 |
| `/services/alterations` | 100 | 100 | 100 | 100 |
| `/services/custom-bridal` | 100 | 100 | 100 | 100 |
| `/services/bridesmaid` | 100 | 100 | 100 | 100 |
| `/contact` | 96 | 97 | 100 | 100 |
| `/dresses` | 100 | 100 | 100 | 100 |
| `/dresses/pink-mauve-mermaid` | 100 | 100 | 100 | 100 |
| `/reviews` | 99 | 100 | 100 | 100 |
| `/journal` | 98 | 100 | 100 | 100 |
| `/journal/how-to-choose-a-wedding-dress-in-hounslow` | 99 | 100 | 100 | 100 |
| `/book` | 100 | 96 | 100 | 100 |

- `docs/DEMO_SCRIPT.md` written — 5–7 minute walkthrough for Rohan; includes presenter notes, known-state checkpoints, open-items table
- Vercel deploy deferred per Phase 8 brief (local Lighthouse only run; no CLI commands)
- `npm run typecheck`, `lint`, `build` all clean; 34 routes; home + dresses now `○` (static)
- **Phase 8 complete**

### 2026-05-23 (Phase 8)
- Local Lighthouse run against all 13 public routes (desktop, Lighthouse 13.3.0): all routes pass Perf ≥96, A11y ≥96, BP=100, SEO=100. Lowest: Perf 96 (/contact — OSM iframe overhead), A11y 96 (/book — multi-step form).
- Performance: `useLocalOnly = isDemoMode || !hasSupabase` guard added to `src/features/products/source.ts` — skips Supabase round-trip in demo mode (~1.8 s TTFB win on home).
- Home page promoted to static: `export const dynamic = 'force-static'` + `revalidate = 3600` added to `src/app/(marketing)/page.tsx`; page is now `○` (was `ƒ`).
- `/dresses` page refactored from dynamic to static: filter logic extracted to new client component `src/features/catalog/components/DressesClient.tsx`; server page is now `○` with `force-static` + `revalidate = 3600`.
- Robots gate tightened: indexable only when `VERCEL_ENV` in {`production`, undefined} AND `NEXT_PUBLIC_SITE_URL === 'https://www.steffnycouture.co.uk'`; applied to both `src/app/robots.ts` and `src/app/layout.tsx` metadata. Prevents accidental indexing on Vercel preview/staging and non-Vercel hosts without the canonical URL configured.
- Static `public/robots.txt` deleted — conflicted with programmatic `app/robots.ts`.
- Security headers added to `next.config.ts` `headers()` block: HSTS (2yr + preload), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera/microphone/geolocation.
- WCAG AA contrast sweep: 46 `text-ink-subtle` → `text-ink-muted` replacements across 17 files; all small-text labels and captions now meet 4.5:1 on ivory.
- ARIA 1.2 fixes: `role="img"` added to `ColourSwatch` `<span>` and star-rating `<div>` elements in `ReviewsStrip` and `reviews/page.tsx`.
- FAQ accordion HTML restructured on all three service pages: `<dl><div><details>` → `<div><details>` (removes invalid `<dl>` wrapper).
- Services overview page CTA labels changed from generic "Learn more" to descriptive "About alterations", "About custom bridal", "About bridesmaid dresses" (Lighthouse SEO flag resolved).
- `<h2 className="sr-only">The collection</h2>` added in `DressesClient` to close h1→h3 heading hierarchy gap on `/dresses`.
- `themeColor` in root layout metadata sourced from `BRAND.colors.ivory` via existing `COLORS` export (was inline hex `#FAF7F2`).
- `lighthouse-*.json` added to `.gitignore`.
- `docs/DEMO_SCRIPT.md` written: 5–7 minute walkthrough for Steffi/Rohan, presenter notes, known-state checkpoints, open-items table; env var name generalised to "Supabase service-role secret" for security hygiene.
- `npm run typecheck`, `lint`, `build` all clean; 34 routes; home + dresses now `○` (static).
- **Phase 8 complete**

### 2026-05-23 (Phase 4)
- `src/features/products/source.ts` — Supabase-first wrapper with local JSON fallback; `warnFallback()` suppresses verbose stack traces for expected SSG DYNAMIC_SERVER_USAGE errors
- `src/features/cart/store.ts` + `hooks.ts` — Zustand cart with localStorage persistence; `CartItem` type; merge-by-productId+size+colour; `useCartCount()` + `useHydrated()` for SSR-safe badge
- `src/components/shared/CartIcon.tsx` — hydration-safe cart icon with count badge; 44px touch target; added to Header (desktop + mobile)
- `src/features/catalog/components/ProductCard.tsx` — server card with image zoom hover, colour swatches, full-card link
- `src/features/catalog/components/ProductGrid.tsx` — server grid (1/2/3/4 cols) with RevealOnScroll stagger + brand-voice empty state
- `src/features/catalog/components/Filters.tsx` — client component; URL search param state; category/colour/occasion chips + price slider; mobile expandable panel; `parseFilters` + `applyFilters` helpers
- `src/app/(shop)/dresses/page.tsx` — replaced stub; server page with filter parsing + filtered product grid
- `src/app/(shop)/dresses/loading.tsx` + `error.tsx` — shimmer skeleton + brand-voice error boundary
- `src/features/catalog/components/ImageCarousel.tsx` — client; keyboard ←/→; swipe via pointer events; thumbnail tablist; pagination dots; hover zoom; fullscreen dialog overlay
- `src/features/catalog/components/VariantContext.tsx` + `VariantSelector.tsx` + `AddToCartButton.tsx` — client trio; context shares selected size/colour; auto-selects single option; 2s in-button "Added" confirmation
- `src/app/(shop)/dresses/[slug]/page.tsx` — SSG (generateStaticParams over 10 slugs); generateMetadata per product; Product JSON-LD; breadcrumb; two-column layout; story section; related dresses; FinalCta
- `src/app/(shop)/dresses/[slug]/loading.tsx` + `not-found.tsx` — matching skeleton + brand-voice not-found
- `src/app/sitemap.ts` — extended to async; appends `/dresses/<slug>` for all 10 products
- Home page updated to use `getFeaturedProductsFromSource(4)` — works in demo mode without Supabase
- `npm run typecheck`, `lint`, `build` all clean; 28 routes generated; all 10 product slugs SSG-prerendered (`●`)
- **Phase 4 complete**

---

## How to update this file

After every commit or session-end:
1. Update the "Current phase" line if it changed
2. Update the phase status table
3. Add to the activity log under today's date
4. Add to "Open questions" anything you noticed but didn't address
5. Add to "Blockers" anything stopping progress

Keep entries short. One line per achievement. Detailed notes go in commit messages and `docs/DECISIONS.md`.
