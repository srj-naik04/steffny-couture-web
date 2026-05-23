# Progress

Live state of the build. Update after every phase or significant change.

## Current phase

**Phase 7 — Reviews, Journal, Polish** (not started)

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
- [ ] Multiple images per product — each catalogue entry currently has only one image (`01.jpg`). Carousel is built to handle multiple; once Supabase is seeded, additional `product_images` rows will render automatically. Steffi: do you have second/third angles for the 10 dresses?
- [ ] Colour-swatch palette accuracy — `globals.css` `@theme` defines approximate hex for nine product colours (mauve, plum, aqua, coral, cobalt, blue, champagne, maroon, sage). Steffi: review the chips on demo day to confirm they read true to fabric.
- [ ] `booking-photos` bucket provisioning — migration `20260523_0007_booking_photos_bucket.sql` creates the bucket with anon-write to `web-drafts/`. Must be applied to the live Supabase project once the service-role key is available. Until then, photo uploads in live mode will silently fail (wizard still submits; photo_paths = demo paths or []).
- [ ] Stale `web-drafts/` photo cleanup — customers who abandon the wizard mid-upload leave orphaned files in Storage. Phase 7 should add a cleanup job (Supabase Edge Function cron or Postgres cron) to purge `web-drafts/` files older than 7 days.

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
