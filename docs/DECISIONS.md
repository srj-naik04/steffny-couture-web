# Decisions

A running log of architectural and product decisions. Each entry: what we chose, what we considered, why.

## D-001 — Next.js 15 App Router, not Pages Router

**Chosen:** Next.js 15 App Router.

**Considered:**
- Pages Router (older, more mature)
- Remix
- Astro (with React islands)
- SvelteKit

**Why:** App Router is where Next.js is investing. Server Components dramatically reduce client JS. Largest Claude Code training corpus. SEO and performance are first-class. Vercel native.

**Trade-off:** Newer, occasional API churn (e.g. params being a Promise in Next 15).

## D-002 — Shared Supabase project with mobile app

**Chosen:** Use the same Supabase project as the mobile app at `E:\steffny-couture\`.

**Considered:**
- Separate Supabase projects with periodic sync
- Different backends entirely

**Why:** Bookings made on the website appear instantly in Steffi's mobile app — no sync layer, no race conditions. Single source of truth for products, customers, reviews. One database to maintain.

**Trade-off:** Migrations need coordination. Web and mobile must both treat the shared schema as a contract. Documented in `DATABASE_WEB.md`.

## D-003 — Tailwind v4, not v3

**Chosen:** Tailwind CSS v4.

**Considered:**
- Tailwind v3 (more battle-tested)
- vanilla-extract
- Stylex
- CSS Modules

**Why:** Tailwind v4 is the current major. Native CSS variable support, faster builds, no PostCSS config needed. Pairs cleanly with shadcn/ui.

**Trade-off:** Smaller community for v4-specific issues vs v3.

## D-004 — shadcn/ui as the primitive library

**Chosen:** shadcn/ui for primitives (Button, Input, Dialog, etc.).

**Considered:**
- Headless UI
- Radix UI directly (shadcn wraps Radix)
- Building everything from scratch
- Mantine, MUI, Chakra (full libraries)

**Why:** shadcn copies components into the repo — we own the code, can customise freely. No runtime bloat. Brand tokens drop in. Excellent a11y from Radix underneath.

**Trade-off:** Have to maintain copied components ourselves.

## D-005 — Mock payments for v1, Stripe later

**Chosen:** Fake card form with 2-second processing delay. Real backend write (`inquiries` table) + real emails.

**Considered:**
- Real Stripe integration from day one
- No e-commerce at all (inquiry-only)

**Why:**
- Steffi's product is bespoke — every "order" probably needs a follow-up call anyway
- Real Stripe adds £-cost overhead (per transaction fees, monthly minimums for advanced features) before there's traffic to justify it
- Demo-able now without weeks of Stripe webhook handling
- Architecture supports swap-in later (`processOrder` is the boundary)

**Trade-off:** Customers can't actually pay online yet. We compensate with "Steffi will WhatsApp you to finalise" messaging.

## D-006 — Cart in Zustand + localStorage, not in database

**Chosen:** Client-side cart state via Zustand with localStorage persistence.

**Considered:**
- Cart table in Supabase keyed by session
- Cart in cookies
- Cart in sessionStorage only

**Why:** No accounts in v1 = no user_id to key against. localStorage gives "your cart is still there tomorrow" behaviour. Zustand is the same pattern as the mobile app. No DB writes until checkout.

**Trade-off:** Cart doesn't sync across devices for the same person. Acceptable for v1.

## D-007 — MDX for blog/journal posts, not a CMS

**Chosen:** MDX files in the repo at `/content/journal/`.

**Considered:**
- Sanity, Contentful, Strapi (headless CMS)
- Notion as CMS
- Database-backed posts table

**Why:** v1 has ~3-5 starter posts. Steffi isn't a daily blogger. MDX = full design control, type safety, Git history, no external dependency. Move to a CMS if/when post velocity justifies it.

**Trade-off:** Steffi can't edit posts herself without a dev. For v1 we'll write posts on her behalf.

## D-008 — No customer accounts for v1

**Chosen:** Everything works as guest. Booking wizard collects name/phone/email each time.

**Considered:**
- Supabase Auth with magic links
- Sync with mobile app's user records
- Social auth (Google, Apple)

**Why:** Lower friction. Most first-time visitors won't sign up for a couture studio's website. Steffi knows her customers personally anyway. Reduces auth-related bugs in v1.

**Trade-off:** No "order history" page. Customers re-enter details each visit.

## D-009 — Vercel hosting, not self-hosted

**Chosen:** Vercel.

**Considered:**
- Self-hosted on a VPS
- Cloudflare Pages
- Netlify
- AWS Amplify

**Why:** Made by Next.js's authors. Free tier covers this site's expected traffic for years. Preview URLs on every PR. Vercel Analytics free. Edge functions if we ever need them. Zero ops.

**Trade-off:** Vendor lock-in is real but mitigated — Next.js apps can be deployed anywhere if needed.

## D-010 — `steffnycouture.co.uk` domain migration AFTER demo approval

**Chosen:** Site lives on a Vercel-provided preview URL until Bunty signs off. Domain switch is the final step.

**Considered:**
- Switch domain immediately to a staging subdomain like `new.steffnycouture.co.uk`
- Build on production domain from day one

**Why:** Doesn't risk breaking the live Webador site. Lets us iterate freely without SEO concerns. The domain swap is ~30 minutes of work when we're ready.

**Trade-off:** Steffi can't tell people "go to my new website" until after we cut over.

## D-011 — British English everywhere (`en-GB`)

**Chosen:** British English spelling in all UI text and HTML lang attribute.

**Considered:**
- American English (more globally common online)
- Both, with a setting

**Why:** Steffi's market is London. Customers searching "favourite", "centre", "colour", "personalise" expect British. Reinforces locality.

**Trade-off:** None worth noting.

## D-012 — No dark mode

**Chosen:** Light mode only. Explicitly set `color-scheme: light`.

**Considered:**
- System-preference toggle
- User-toggleable

**Why:** Brand is warm cream + rose + ink. Dark mode would invert this and look wrong. Most premium fashion sites are light. Saves complexity.

**Trade-off:** Users with strong dark-mode preference may dislike. Acceptable.

## D-013 — Mobile app's brand skill duplicated, not symlinked

**Chosen:** Each project has its own `.claude/skills/steffny-brand/SKILL.md`. Manually keep them in sync.

**Considered:**
- Symlink to mobile app
- Shared skills repo

**Why:** Skills include platform-specific patterns (React Native vs Next.js). Total duplication is small; total drift risk is small if disciplined.

**Trade-off:** Two places to update if brand changes.

## D-014 — Product images in Supabase Storage, not in `/public/`

**Chosen:** Product images live in Supabase Storage at `public/products/`.

**Considered:**
- All images in Next.js `/public/` directory (Vercel serves them)
- CDN like Cloudinary

**Why:** Steffi can add new products via the mobile app without touching the website code. The mobile app uploads to Supabase Storage; the website reads from there. Single source of truth.

**Trade-off:** Slightly slower than `/public/` static assets, but `next/image` with `priority` mitigates the LCP image. Other images lazy-load fine.

## D-015 — DemoBanner only on payment page, not site-wide

**Chosen:** A subtle "Demo mode — no real payment will be taken" notice **on the payment page only**, when `NEXT_PUBLIC_DEMO_MODE=true`.

**Considered:**
- Site-wide banner ("This is a demo site")
- No notice at all

**Why:** The site **is** real — bookings really get made, real emails go out, products are real. Only payments are mocked. The notice should be where the actual mock is happening, not plastered everywhere.

**Trade-off:** A customer might try to "buy" a dress not realising payment is fake. The notice on the payment page + the post-checkout "Steffi will WhatsApp you to confirm delivery" messaging makes this clear.

## D-016 — Migration filename convention: `YYYYMMDD_NNNN_<description>.sql`

**Chosen:** Four-digit zero-padded sequence suffix (`0001`, `0002`, …) after the date prefix.

**Considered:**
- `YYYYMMDD_HHMM_<description>.sql` (timestamp-based sequence, as used by some Supabase starters)
- Flat sequential numbers with no date (`001_products.sql`)

**Why:** Multiple migrations can land on the same day during active development. A `HHMM` suffix is ambiguous when two contributors create migrations at similar times. A monotonically incrementing `NNNN` counter gives deterministic ordering regardless of wall-clock time.

**Trade-off:** Counter must be manually checked before creating a new file; no automatic enforcement.

## D-017 — `env.ts` split into public `env.ts` and server-only `env.server.ts`

**Chosen:** Server-side secrets (`SUPABASE_SERVICE_ROLE_KEY`, `SMTP_*`) live in `src/lib/env.server.ts` behind `import 'server-only'`. Client-safe vars (`NEXT_PUBLIC_*`) remain in `src/lib/env.ts`.

**Considered:**
- Single `env.ts` exporting all vars (original approach)
- Separate files without `server-only` guard

**Why:** Without the split, any client component that imports `siteUrl` or `isDemoMode` from `env.ts` would also bundle the service-role key if it was exported from the same file. `import 'server-only'` causes a build-time error if the file is ever imported in a client bundle, making the guard enforced rather than advisory.

**Trade-off:** Two files to maintain; imports must be routed to the correct one.

## D-018 — Supabase client export names: `createBrowserSupabaseClient` and `createServerSupabaseClient`

**Chosen:** Explicit, verbose export names rather than a default `supabase` export or generic `createClient`.

**Considered:**
- Default export `supabase` (singleton)
- Named `createClient` (mirrors `@supabase/supabase-js` surface)

**Why:** Both clients are imported into the same module in some server components (e.g. comparing anon vs admin access). Disambiguating names at import time eliminates accidental usage of the wrong client. Also makes call-site intent clear during code review.

**Trade-off:** Verbose. Mitigated by IDE autocomplete.

## D-019 — `product_images` anon read policy guards via `EXISTS` subquery on `products.active`

**Chosen:** `USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.active = true))` on the anon SELECT policy.

**Considered:**
- No RLS on `product_images` (trust app-layer joins)
- Separate `active` boolean column mirrored onto `product_images`

**Why:** Without the guard, an anon client could enumerate all product images by id — including images for hidden/draft products — by querying `product_images` directly, bypassing the `products.active = true` filter on the join. The EXISTS subquery closes the gap at the DB layer with no application code required.

**Trade-off:** Slightly more complex policy; EXISTS subquery adds a join per row scan. Negligible at catalogue scale.

## D-020 — `inquiries` anon INSERT policy uses `WITH CHECK` to constrain `status`, `source`, and `type`

**Chosen:** `WITH CHECK (status = 'new' AND source = 'web' AND type IN ('product_inquiry', 'product_order', 'general'))`.

**Considered:**
- Rely on column DEFAULT values and app-layer validation only
- Separate server-side API route that sanitises before inserting

**Why:** An anon caller can override column defaults by specifying explicit values in the INSERT payload. Without `WITH CHECK`, a malicious actor could insert rows with `status = 'closed'` or `source = 'staff'`, poisoning the moderation queue in the mobile app. The constraint enforces legitimate values at the DB layer regardless of what the client sends.

**Trade-off:** Adding new allowed `type` values requires a migration to update the policy.

## D-021 — Unique image per visible placement; Steffi photos limited to anchor placements

**Date:** 2026-05-23

**Chosen:** Every visible image placement across the site uses a distinct file. `bride-bangles-portrait.jpg` anchors the home hero. `bride-bouquet-detail.jpg` anchors the about hero and contact founder card (the only intentional cross-page reuse, per IMAGE_BRIEF).

**Considered:**
- Reusing the same hero image across multiple pages to strengthen brand recognition
- Allowing any Steffi photo on any page

**Why:** IMAGE_BRIEF specifies that Steffi's two photos must anchor the highest-prominence placements. Reusing the same file on generic service pages dilutes the anchor effect and repeats an image the visitor has already seen. `bride-bouquet-detail.jpg` on both about hero and contact founder card is a deliberate exception: both placements reinforce the founder identity at appropriate moments in the user journey.

**Trade-off:** Non-Steffi images on service detail pages (e.g. `bride-maroon-arch.jpg` on custom-bridal). Acceptable until Steffi provides additional portraits.

## D-022 — Stub pages for unbuilt routes shipped in Phase 3

**Date:** 2026-05-23

**Chosen:** `/reviews`, `/journal`, `/book`, `/dresses`, and `/cart` ship in Phase 3 as brand-voice "coming soon" pages rather than 404s.

**Considered:**
- Hiding nav links to unbuilt pages until those phases are done
- Shipping nothing and letting clicks 404

**Why:** Header and footer links to these routes are present from Phase 0. A 404 on a first visit is a poor impression and breaks the demo flow. Stub pages preserve navigation continuity and demonstrate the full site structure during the Phase 3 demo. Phases 4-7 replace each stub with the real implementation.

**Trade-off:** Five extra files to maintain; each must be deleted/replaced rather than created fresh in later phases.

## D-023 — `RevealOnScroll` uses Framer Motion `whileInView` with `viewport.once: true`

**Date:** 2026-05-23

**Chosen:** `motion.div` with `whileInView` + `viewport={{ once: true }}`. When `useReducedMotion()` is true, the component renders a plain `<div>` with no animation and content immediately visible.

**Considered:**
- Manual `useInView` ref + `useEffect` toggling a CSS class
- Intersection Observer directly
- CSS-only `@keyframes` triggered by `:is(:not(:has(+ *)))` hacks

**Why:** `whileInView` handles observer lifecycle, unmount cleanup, and SSR (content is visible on first paint before JS hydrates). `viewport.once: true` prevents re-triggering on scroll-up, which matches the site's editorial feel. The `useReducedMotion` fallback satisfies WCAG 2.3.3 (Animation from Interactions) without a separate CSS media query.

**Trade-off:** Framer Motion is a required dependency; cannot tree-shake this component server-side.

## D-024 — Preview deploys are no-indexed via `VERCEL_ENV` check

**Date:** 2026-05-23

**Chosen:** Root layout sets `robots: { index: false, follow: false }` when `process.env.VERCEL_ENV !== 'production'`. `src/app/robots.ts` mirrors this with `disallow: '/'` for non-production environments.

**Considered:**
- Always allow indexing and rely on Vercel's preview URL obscurity
- Password-protect preview URLs instead

**Why:** Preview URLs are not obscure — Vercel generates them deterministically from branch names. A search engine crawling a preview deploy would index duplicate content at a different URL, potentially splitting link equity from the real domain. The `VERCEL_ENV` check is zero-maintenance and applies automatically to every preview and development deploy.

**Trade-off:** If `VERCEL_ENV` is not set (e.g. local `npm run build`), the check evaluates as non-production and the build will also be no-indexed. Acceptable — local builds are never served publicly.

## D-025 — Contact server action sets `source = 'web'` to match RLS `WITH CHECK`

**Date:** 2026-05-23

**Chosen:** `src/features/contact/actions.ts` always inserts with `source: 'web'`. Demo-mode fallback logs only a reference id and timestamp — never name, email, phone, or message content.

**Considered:**
- Omitting `source` and relying on column DEFAULT
- Logging the full payload for debugging

**Why:** The `inquiries` anon INSERT policy (D-020) enforces `WITH CHECK (source = 'web')`. Omitting the field would not trigger the check but would also not pass it if the DEFAULT were ever changed. Explicitly setting it makes the intent clear and matches the constraint. PII-free logging is required because server logs in Vercel are accessible to anyone with project access — logging a customer's email would be a data protection issue.

**Trade-off:** If a second submission source is added (e.g. `source = 'booking'`), the policy and the action must both be updated.

## D-026 — Data source wrapper with JSON fallback (`src/features/products/source.ts`)

**Date:** 2026-05-23

**Chosen:** `source.ts` tries Supabase first; falls back to bundled `data/products.json` + `data/optimised-images.json` when the service-role key is absent or a DYNAMIC_SERVER_USAGE error is thrown during SSG. Both paths return the same `ProductCard` / `ProductDetail` shape.

**Considered:**
- Hardcoded fallback data inline in each server component
- Requiring a live Supabase connection for all SSG builds

**Why:** Demo mode must work without `SUPABASE_SERVICE_ROLE_KEY`. Centralising the fallback in one wrapper means every server component (home featured strip, dresses grid, product detail, related dresses) benefits without duplicating guard logic. Phases 5-7 reuse the same wrapper.

**Trade-off:** Two JSON files in the repo must be kept consistent with the Supabase schema. Once the service-role key is wired, the JSON files become redundant but harmless.

## D-027 — Cart store: Zustand with localStorage, persistence key `steffny-cart-v1`

**Date:** 2026-05-23

**Chosen:** Zustand `persist` middleware writing to `localStorage` under key `steffny-cart-v1`. SSR safety via `useHydrated` hook in `src/features/cart/hooks.ts` which delays rendering the count badge until after client hydration.

**Considered:**
- Supabase cart table keyed by anonymous session id
- sessionStorage (lost on tab close)
- No persistence (cart resets on navigate)

**Why:** No customer accounts in v1 means no stable server-side key. The versioned key (`-v1`) lets us change the cart item shape between phases without silently rehydrating stale data that no longer matches the type. `useHydrated` prevents the server-rendered badge showing a stale count from a prior visit, which would cause a hydration mismatch.

**Trade-off:** Cart does not sync across devices. Acceptable for v1; Stripe integration in a later phase would introduce server-side cart state.

## D-028 — Tailwind v4 product swatch tokens in `globals.css` `@theme`

**Date:** 2026-05-23

**Chosen:** Nine colour tokens (`--color-swatch-mauve`, `-plum`, `-aqua`, `-coral`, `-cobalt`, `-blue`, `-champagne`, `-maroon`, `-sage`) added to the `@theme` block in `globals.css`. Used exclusively on `ProductCard` colour chips.

**Considered:**
- Inline hex codes on the chip elements
- Extending `tailwind.config.ts` (v3 approach)

**Why:** CLAUDE.md §6 forbids inline hex codes. Tailwind v4 extends the theme via `@theme` in CSS rather than a JS config. Naming tokens after the product colour names (not semantic UI names) keeps the mapping explicit. Phase 7 may extend the set if Steffi adds more colour names via the mobile app.

**Trade-off:** These tokens are not UI surface tokens and should not be used for anything other than product swatches. The naming convention (`swatch-*`) makes this visually distinct in the class list.

## D-029 — Filters split into client component and server helpers

**Date:** 2026-05-23

**Chosen:** `src/features/catalog/components/Filters.tsx` is a client component (uses `useSearchParams`, `useRouter`). `src/features/catalog/filters-helpers.ts` contains `parseFilters`, `applyFilters`, and `FilterState` with no `'use client'` directive and is imported by the server page.

**Considered:**
- One file with `'use client'` exporting both the component and the helpers
- Server-only filter parsing via `searchParams` prop on the page

**Why:** Next.js 15 forbids a server component from importing exports from a module that contains `'use client'`. The server `dresses/page.tsx` needs `parseFilters` and `applyFilters` to filter the product list before rendering. Separating helpers into a plain module with no client directive resolves the boundary violation without duplicating logic.

**Trade-off:** Two files where one might seem sufficient. The split is a Next.js 15 constraint, not a design preference.

## D-030 — JSON-LD breakout-safe serialiser (`safeJsonLd` in `src/lib/seo/jsonld.tsx`)

**Date:** 2026-05-23

**Chosen:** `safeJsonLd(data)` replaces `<` with `<`, `>` with `>`, and `&` with `&` before injecting structured data into an inline `<script type="application/ld+json">` tag.

**Considered:**
- `JSON.stringify` directly (default Next.js pattern)
- Sanitising input at the Supabase insert layer

**Why:** Product names and descriptions come from Supabase rows that Steffi edits via the mobile app. A stored string containing `</script>` would break out of the inline script tag and potentially execute arbitrary HTML. The Unicode escape approach is the OWASP-recommended method for safely embedding JSON in HTML. Sanitising at the insert layer would require co-ordinating with the mobile app's schema and would not protect against data already stored.

**Trade-off:** The escaped output is slightly harder to read in View Source. No functional difference at runtime — JSON parsers handle Unicode escapes transparently.

## D-031 — `src/features/catalog/` for UI components; `src/features/products/` for data layer

**Date:** 2026-05-23

**Chosen:** `src/features/catalog/` holds UI components (`ProductCard`, `ProductGrid`, `ImageCarousel`, `VariantSelector`, `AddToCartButton`, `Filters`). `src/features/products/` holds the data layer (`api.ts`, `source.ts`, hooks, types, schemas). CLAUDE.md §2 lists only `features/products/`; the `catalog/` folder is not documented there.

**Considered:**
- Merging everything into `src/features/products/` as CLAUDE.md originally specified
- Keeping CLAUDE.md accurate by amending it

**Why:** Separating rendering concerns (`catalog/`) from data concerns (`products/`) maps cleanly to "what the page renders" vs "what fetches data". The split emerged naturally during Phase 4 implementation when a single folder became unwieldy. CLAUDE.md is not amended because this is an implementation detail, not a spec change; the folder structure in CLAUDE.md is advisory, not enforced by tooling.

**Trade-off:** CLAUDE.md §2 does not reflect `catalog/`. Future builders reading only CLAUDE.md will be surprised. Mitigated by this decision log entry.

## D-032 — Cart store bumped to v2; persistence key `steffny-cart-v2`

**Date:** 2026-05-23

**Chosen:** Persist key changed from `steffny-cart-v1` to `steffny-cart-v2`. `CartItem` type gains `variantId?: string | null`. `migrate()` function on the Zustand persist config injects `variantId: null` for any v1 items found in localStorage.

**Considered:**
- Keeping v1 key and accepting silent type mismatch for existing carts
- Clearing localStorage on schema change (losing active carts)

**Why:** D-019 introduced `variantId` on `InquiryItem`; the `placeOrder` server action builds `InquiryItem[]` from the cart and must carry `variantId` through to the order payload. A cart item without `variantId` would fail the type check at the action boundary. Bumping the key triggers a clean migration rather than rehydrating stale data that no longer matches the type. The `migrate()` function provides a non-destructive upgrade path rather than silently dropping existing cart contents.

**Trade-off:** Customers with items in a v1 cart will see their cart preserved but with `variantId: null` (no variant selected). Acceptable — they can re-select a variant on the product page.

## D-033 — Mock card data is client-only; `serverCheckoutSchema` excludes card fields

**Date:** 2026-05-23

**Chosen:** `paymentStepSchema` validates card fields client-side only. `serverCheckoutSchema` is a separate Zod schema that omits all card fields (`cardNumber`, `cardExpiry`, `cardCvc`, `cardName`). The `placeOrder` server action input type is typed against `serverCheckoutSchema`, making it structurally impossible for card data to transit to the server.

**Considered:**
- Single schema for client and server, stripping card fields in the action body
- Marking card fields as optional on the server schema and ignoring them

**Why:** PCI-DSS scope minimisation — even in demo mode, card data must not transit the server. A runtime strip in the action body is still a violation: the data would have been received and processed at the server boundary. Separate schemas enforce the boundary at the type level; a TypeScript error surfaces at build time if the calling code ever attempts to pass card data.

**Trade-off:** Two schemas to maintain. The split is intentional and should not be collapsed.

## D-034 — Server actions gate on `(!hasSupabase || isDemoMode)` dual check

**Date:** 2026-05-23

**Chosen:** Both `placeOrder` (Phase 5) and the contact server action (Phase 3, updated) skip the live DB write when either `hasSupabase` is false or `isDemoMode` is true. The demo-mode flag is the authoritative signal; absence of Supabase credentials is the secondary guard.

**Considered:**
- Single check on `isDemoMode` only
- Single check on `hasSupabase` only
- Environment-based branching in a separate config module

**Why:** A deployment with Supabase credentials wired but `NEXT_PUBLIC_DEMO_MODE=true` must still skip the live write — the operator explicitly asked for demo mode. Checking only `hasSupabase` would bypass that intent. Checking only `isDemoMode` would cause a runtime crash in a fresh dev environment where credentials are absent but `NEXT_PUBLIC_DEMO_MODE` is not yet set. The dual check covers both states without needing a separate config module.

**Trade-off:** Two conditions to reason about in every server action. Mitigated by the consistent pattern across actions and this entry explaining the reasoning.

## D-035 — Reference id format: `SC-XXXXXX` generated server-side via `crypto.getRandomValues`

**Date:** 2026-05-23

**Chosen:** Order reference ids are six uppercase alphanumeric characters prefixed with `SC-`, generated in `placeOrder` using `crypto.getRandomValues`. Stored in `inquiries.reference` (UNIQUE NOT NULL). Surfaced on the confirmation page and used by Steffi to track orders in the mobile app.

**Considered:**
- UUID v4 (too long for verbal communication)
- Sequential integer (predictable, leaks order volume)
- Nanoid (adds a dependency)

**Why:** `SC-` prefix is instantly recognisable as a Steffny Couture reference. Six alphanumeric chars gives 2.18 billion combinations — collision probability negligible at expected order volume. `crypto.getRandomValues` is available in the Node.js Edge runtime with no extra dependency. Short enough that Steffi can read it over the phone or WhatsApp to match against the mobile app's inquiry list.

**Trade-off:** Theoretical collision risk at very high order volume. The UNIQUE constraint on `inquiries.reference` causes a DB error on collision; the action can retry with a new reference if required in a later phase.

## D-036 — `CartDrawer` mounted at root layout, not per route group

**Date:** 2026-05-23

**Chosen:** `<CartDrawer />` is rendered once in `src/app/layout.tsx` inside `MotionConfigProvider`. It is available from all route groups ((marketing), (shop), (booking)) without being duplicated in each group's layout.

**Considered:**
- Mounting in each route group layout that needs a cart
- Mounting in `(shop)/layout.tsx` only
- Rendering the drawer inline at the Header component level

**Why:** The "Add to cart" CTA exists on product detail pages (under `(shop)`) but the cart icon is in the Header which renders across all route groups. A user on the home page (under `(marketing)`) clicking the cart icon must be able to open the drawer. Mounting at root satisfies all placements with a single instance and no state reset between route group navigations.

**Trade-off:** The CartDrawer is in the DOM on pages that have no cart functionality (e.g. booking pages). The drawer is hidden and adds no visible overhead; the Zustand store is lazily initialised.

## D-037 — Image alts for cart items include size and colour via `describeCartItem`

**Date:** 2026-05-23

**Chosen:** `src/features/cart/utils.ts` exports `describeCartItem(item)` which returns `[name, size, colour].filter(Boolean).join(', ')`. This string is used as the `alt` attribute on product thumbnails in the cart drawer, cart page, checkout review step, checkout summary sidebar, and confirmation summary.

**Considered:**
- Using just the product name as alt
- Generating alt inline at each usage site

**Why:** WCAG 1.1.1 requires alt text to convey the purpose of the image in context. In a cart, two rows may show the same dress in different sizes or colours; an alt of just the dress name would be identical for both, failing to distinguish them for screen reader users. `describeCartItem` appends the selected size and colour so each thumbnail's alt is unique and descriptive. Centralising the logic in a helper prevents the five usage sites from diverging.

**Trade-off:** If a product has no size or colour selected (e.g. a single-option item with `variantId: null`), the alt falls back to the product name alone — still acceptable, as there is nothing to distinguish.

## D-038 — Booking wizard cross-page state restore: lazy `useState(1)` + post-hydration restore effect with `restoredRef` guard

**Date:** 2026-05-23

**Chosen:** `currentStep` initialises to literal `1` on both server and client (no `getStoredStep()` call in the `useState` initialiser). A `useEffect` runs after hydration, reads `storedStep` from the Zustand persist store, and calls `setCurrentStep(storedStep)` if `storedStep > 1`. A `restoredRef` boolean ref prevents the effect from running a second time. A separate sync effect that writes `storedStep` to the store on every step change has a first-render skip (a `mountedRef`) so the mount write cannot clobber a value that the restore effect has not yet applied.

**Considered:**
- Calling `useBoundStore.getState().step` directly in the `useState` initialiser
- Reading from `localStorage` synchronously in the initialiser
- Skipping persistence entirely and forcing users to restart on navigation

**Why:** Zustand `persist` hydrates asynchronously from `localStorage` — the stored value is not available on the first render. Calling `getState()` in the initialiser returns the unhydrated default (`1`), so restoring to a mid-wizard step requires waiting for the hydration event. Doing the restore in a `useEffect` eliminates the SSR/client mismatch (server always renders Step 1; client restores after paint). The `restoredRef` guard prevents a race where the sync-write effect fires between the restore read and the restore write.

**Trade-off:** One render at Step 1 is visible before the restore kicks in on a returning user. At typical browser speeds this is sub-frame; no flash observed in Playwright tests.

## D-039 — Anon DELETE policy on `booking-photos` bucket removed

**Date:** 2026-05-23

**Chosen:** No anon DELETE policy on the `booking-photos` bucket. Photos uploaded under `web-drafts/<draftId>/` cannot be deleted by unauthenticated visitors. Cleanup deferred to a future cron job that purges `web-drafts/` files older than 7 days.

**Considered:**
- Allowing anon DELETE scoped to the same `draftId` prefix
- Allowing anon DELETE only on files the uploader just created (no practical enforcement mechanism in Supabase Storage without user_id)

**Why:** Supabase Storage policies cannot enforce per-visitor ownership without a `user_id`. An anon DELETE policy scoped to `web-drafts/` would allow any visitor to delete any other visitor's draft photos by enumerating `draftId` values (UUIDs, but the bucket listing could be partially probed). Removing the policy eliminates the cross-visitor deletion vector. Orphaned files are a storage cost concern, not a security concern, and are addressed by a future cron.

**Trade-off:** Orphaned `web-drafts/` files accumulate for abandoned wizard sessions. Mitigated by the 8 MB file limit and the planned cron (tracked in Open Questions).

## D-040 — `journal_views.increment_view` RPC: anon EXECUTE revoked

**Date:** 2026-05-23

**Chosen:** Revoked `GRANT EXECUTE ON FUNCTION increment_view TO anon` from `supabase/migrations/20260521_0004_web_journal_views.sql`. Web journal pages now call `increment_view` via server actions (authenticated path using the service-role key) rather than from the browser client.

**Considered:**
- Keeping anon EXECUTE with a per-IP rate limit (not natively available in Supabase)
- Moving view tracking to a separate table with weaker integrity guarantees

**Why:** An anon caller could call `increment_view` from a script, pumping any slug's view count to arbitrary values. The function is `SECURITY DEFINER`, so abuse does not expose data, but it does corrupt the analytics signal. Restricting to authenticated callers (service role via server action) closes the vector with no change to the visible UX — view counts still increment on every real page visit.

**Trade-off:** View tracking no longer works in pure client-side renders. Acceptable — journal posts are server-rendered.

## D-041 — Booking confirmation `?ref` validated against `/^SC-[A-Z0-9]{6}$/`

**Date:** 2026-05-23

**Chosen:** `src/app/(booking)/book/confirmation/page.tsx` checks the `ref` searchParam against `/^SC-[A-Z0-9]{6}$/` before displaying it. An invalid or absent ref renders a generic "your booking has been received" message with no reference displayed.

**Considered:**
- Displaying whatever string is in the URL as a reference
- Redirecting invalid refs to `/book`

**Why:** A crafted URL such as `/book/confirmation?ref=<script>alert(1)</script>` could be shared as a phishing link or social-engineering vector if the value were reflected directly into the page. The regex check ensures only a valid SC reference (26-character space of known format) is displayed. A graceful fallback rather than a redirect avoids penalising users whose browser dropped the query string.

**Trade-off:** A legitimate booking whose reference was somehow truncated or mangled in transit would show the generic message. The probability is negligible given the reference is generated server-side and passed directly to `redirect()`.

## D-042 — `src/features/booking/` renamed to `src/features/bookings/`

**Date:** 2026-05-23

**Chosen:** Folder renamed to `src/features/bookings/` to match the pluralisation pattern in CLAUDE.md §2 (`products/`, `reviews/`, `cart/`, `bookings/`).

**Considered:**
- Leaving as `booking/` (singular) given the folder already existed
- Using `booking/` for the web wizard and keeping `bookings/` for a shared data layer

**Why:** CLAUDE.md §2 lists `features/bookings/` (plural). All other feature folders use the plural form. Consistent naming makes file-path reasoning predictable across the codebase and avoids the folder being invisible to contributors searching for `bookings`.

**Trade-off:** Import paths in all files under the folder required updating. No functional change.

## D-043 — Hero grid uses `items-start`, not `items-center`

**Date:** 2026-05-23

**Chosen:** Two-column Hero grid uses `items-start` so the text column aligns with the top edge of the image column.

**Considered:**
- `items-center` (original, vertically centres both columns in the row)
- `items-stretch` (stretches both columns to equal height)

**Why:** With `items-center`, a tall image in the right column pushes the text column's vertical midpoint well below the image top edge. This created a visible void above the kicker/headline at wide viewports where the image is constrained by `lg:max-h-*`. `items-start` anchors the kicker to the image top edge regardless of aspect ratio or viewport width, eliminating the void without changing the image dimensions.

**Trade-off:** If a hero image is very short and the text column is tall, the text will extend below the image bottom edge. This does not occur with the current set of portrait-ratio hero images.

## D-044 — Hero padding is asymmetric (`pt-*` retained, `pb-*` cut)

**Date:** 2026-05-23

**Chosen:** Hero container uses `pt-10 pb-4 md:pt-14 md:pb-6 lg:pt-16 lg:pb-8` (top > bottom). Previously symmetric `py-16 md:py-24 lg:py-28`.

**Considered:**
- Keeping symmetric padding (equal top and bottom)
- Removing all padding and relying solely on Section spacing

**Why:** The section immediately following the Hero provides its own `pt-*` spacing. Symmetric padding on the Hero created a double-padding sandwich — the Hero's `pb-*` plus the next Section's `pt-*` stacked to over 200px of white space at 1280px. Cutting `pb-*` to roughly half while preserving `pt-*` (breathing room under the header) closes the sandwich without removing the visual separation between hero and first content section.

**Trade-off:** If a Hero is placed above a non-Section element with no top padding, the gap between hero and content will appear tight. Not a concern with the current page structures.

## D-045 — Section spacing variants halved in Phase 7

**Date:** 2026-05-23

**Chosen:** Section `sm` → `py-8 md:py-10`; `md` → `py-10 md:py-14 lg:py-16`; `lg` → `py-14 md:py-18 lg:py-20`. Previous values were from the `py-16 md:py-24 lg:py-28` family.

**Considered:**
- Keeping original values and adjusting only Hero padding
- Per-section overrides rather than a global change

**Why:** Playwright cycle 1 showed ~200px gaps between sections at 1280px across all pages. The root cause was the combination of large Hero bottom padding and large Section top padding. After the Hero asymmetric fix (D-044), the remaining gap came from Section's own `py-*`. Halving the variant values uniformly brought all 12 pages into range (88px max at 1280px) in a single change, with no per-section overrides needed.

**Trade-off:** The tighter spacing is a permanent spec change. If a future section genuinely needs the old airy spacing, a custom class or a new `xl` variant can be introduced.

## D-046 — Draft journal posts filtered via `draft` frontmatter boolean

**Date:** 2026-05-23

**Chosen:** MDX post frontmatter accepts `draft?: boolean`. `getAllPosts`, `getPostBySlug`, and `getAllPostSlugs` in `src/features/journal/loader.ts` all filter out entries where `draft === true`. Sitemap generation therefore omits draft slugs automatically.

**Considered:**
- Keeping draft posts in a separate `content/journal/_drafts/` folder
- Using a `published: boolean` flag instead

**Why:** A draft post committed to `main` (e.g. during content review) must not appear in the public journal index, in search results, or in the sitemap. A `draft: true` frontmatter flag is the simplest mechanism — the file stays in the repo for review and editing, but all public surfaces treat it as invisible. A separate folder would require either a glob exclusion at every loader call site or a build-time move; frontmatter keeps the convention in one place.

**Trade-off:** A post with no `draft` field is treated as published. Content writers must explicitly set `draft: true` to suppress a WIP post; omitting the field publishes it. This matches MDX convention (opt-in draft, not opt-in publish).

## D-047 — `InstagramGallery` uses 6 non-Steffi hero images

**Date:** 2026-05-23

**Chosen:** `InstagramGallery` on the home page uses 6 images that are not visible anywhere else on the home page and are not Steffi's two crown jewels (`bride-bangles-portrait.jpg`, `bride-bouquet-detail.jpg`).

**Considered:**
- Pulling live Instagram photos via the Instagram Basic Display API
- Using the Steffi photos in the gallery for brand reinforcement

**Why:** IMAGE_BRIEF reserves the two Steffi photos for the home hero, about hero, and contact founder card. Placing them in the gallery would dilute those anchor placements and repeat images the visitor has already seen on the same page. The 6 curated studio images cover placements not otherwise used on the home page, maximising visual variety. Live Instagram pull deferred to post-launch (requires Business account + token refresh logic).

**Trade-off:** Gallery is static until an Instagram pull is implemented. Tracked in Open Questions.

## D-048 — `personJsonLd` includes Steffi photo as `image` field

**Date:** 2026-05-23

**Chosen:** The `personJsonLd()` helper in `src/lib/seo/jsonld.tsx` accepts an `image` parameter; the `/about` page passes the absolute URL of `bride-bouquet-detail.jpg`.

**Considered:**
- Omitting the `image` field (simpler, avoids using Steffi photo in structured data)
- Using a separate non-portrait photo for the schema image

**Why:** Google's knowledge panel for a Person entity is significantly more likely to surface a photo if the `image` field in Person JSON-LD points to a clear, high-quality portrait of the subject. `bride-bouquet-detail.jpg` is already on the `/about` page as the hero and founder card image; referencing it in structured data is an appropriate non-display use that reinforces the SEO signal without violating the IMAGE_BRIEF's placement rules (JSON-LD is not a visible image slot).

**Trade-off:** If the `/about` hero image is ever swapped for a different photo, the Person schema image must be updated in tandem.

## D-049 — Cart drawer items list is content-sized with `max-h-[60vh]` overflow scroll

**Date:** 2026-05-23

**Chosen:** The items `<ul>` in `CartDrawer.tsx` has `flex-1` removed; replaced with `max-h-[60vh] overflow-y-auto`. The subtotal/CTA block immediately follows in the drawer's flex column.

**Considered:**
- Keeping `flex-1` (fills remaining drawer height; subtotal anchored to bottom)
- Fixed pixel height on the items list

**Why:** With `flex-1`, a drawer containing one item had a 400px+ void between the item and the subtotal block, because `flex-1` expanded the items container to fill the full remaining drawer height. Removing `flex-1` makes the items container only as tall as its content. `max-h-[60vh]` with overflow scroll prevents the list from exceeding the viewport when many items are added, keeping the subtotal reachable without scrolling past items.

**Trade-off:** Subtotal position is no longer pinned to the drawer bottom — it sits immediately below the last item. This is acceptable UX and consistent with how most cart drawers behave on fashion e-commerce sites.

---

Add entries as you make decisions. Don't delete old ones — they explain "why" to future you (or future me).
