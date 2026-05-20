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

---

Add entries as you make decisions. Don't delete old ones — they explain "why" to future you (or future me).
