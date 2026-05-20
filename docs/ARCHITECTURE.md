# Architecture — Steffny Couture Web

## Overview

The website is a Next.js 15 App Router application deployed on Vercel. It shares a Supabase backend with the mobile app at `E:\steffny-couture\`. The website handles discovery, e-commerce browsing, and customer-facing bookings; the mobile app handles staff operations and customer accounts.

```
┌──────────────────────────┐         ┌──────────────────────────┐
│   Customer's browser     │         │  Steffi's mobile app     │
│   (Next.js website)      │         │  (Expo React Native)     │
└────────┬─────────────────┘         └────────┬─────────────────┘
         │                                    │
         │   READS: products, reviews         │   READS: bookings,
         │   WRITES: bookings, inquiries,     │           inquiries,
         │           reviews (unpublished)    │           products
         │                                    │   WRITES: bookings,
         │                                    │           products,
         │                                    │           reviews status
         │                                    │
         ▼                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Supabase Project (Ireland)                      │
│                                                                  │
│  Tables:                                                         │
│  • bookings        (SHARED — mobile + web both read/write)      │
│  • users           (SHARED — mobile owns, web reads for staff)  │
│  • shop_settings   (SHARED — mobile manages, web reads)         │
│  • alteration_types (SHARED — mobile manages, web reads)         │
│  • products        (web-only)                                    │
│  • product_images  (web-only)                                    │
│  • inquiries       (web-only; mobile reads to follow up)        │
│  • reviews         (web-only; mobile moderates)                  │
│  • journal_views   (web-only)                                    │
│                                                                  │
│  Storage: public/products/, public/about/, public/hero/          │
│                                                                  │
│  Edge Functions: send-email (shared with mobile)                 │
└─────────────────────────────────────────────────────────────────┘
```

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 15.x (App Router) |
| Language | TypeScript | 5.x strict |
| UI | React | 19 |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui | latest |
| Animation | Framer Motion | 11.x |
| Forms | React Hook Form + Zod | latest |
| State | Zustand + TanStack Query | latest |
| Backend | Supabase | latest |
| Hosting | Vercel | latest |
| Domain | steffnycouture.co.uk | migrated from Webador post-launch |
| Email | Nodemailer Edge Function | shared with mobile |

## Folder structure

See `CLAUDE.md` section 2 for the canonical layout.

Key principles:
- **Routes mirror URLs.** Files in `app/` are pages. Subdirectories are URL segments.
- **Route groups** organise without affecting URLs. `(marketing)`, `(shop)`, `(booking)` keep different layout contexts separate.
- **Components are categorised** by purpose: `ui/` (primitives), `marketing/`, `shop/`, `booking/`, `shared/`.
- **Features hold domain logic.** `features/products/`, `features/cart/`, `features/bookings/` each have `api/`, `hooks/`, `schemas/`, `types/`, `components/`.
- **Lib is for cross-cutting helpers.** `cn()`, `currency.ts`, `date.ts`, Supabase clients.
- **Constants** for brand tokens, shop info, nav structure — these don't change at runtime.

## Data flow

### Read flow (product page example)

```
Customer requests /dresses/maroon-wedding-dress
  ↓
Next.js Server Component (app/(shop)/dresses/[slug]/page.tsx)
  ↓
Calls features/products/api/getProduct(slug)
  ↓
Supabase server client (lib/supabase/server.ts)
  ↓
SQL: SELECT * FROM products WHERE slug = $1
  ↓
RLS: anyone can read if active = true
  ↓
Returns product to server component
  ↓
Server renders HTML (with metadata via generateMetadata)
  ↓
Browser receives streamed HTML
```

### Write flow (booking submission example)

```
Customer fills out 6-step wizard at /book
  ↓
Form state in Zustand (features/bookings/store.ts)
  ↓
Submit triggers Server Action (features/bookings/actions.ts)
  ↓
Zod validates input
  ↓
Supabase server client inserts into bookings table (source: 'web')
  ↓
RLS: anyone can insert with role 'guest'
  ↓
fetch() to Edge Function /functions/v1/send-email
  ↓
Two emails sent: customer confirmation + Steffi notification
  ↓
Realtime: mobile app's bookings list updates via Supabase Realtime subscription
  ↓
Server Action returns success
  ↓
Client redirects to /book/confirmed?ref=SC-ABC123
```

## Routing

App Router with route groups:

```
/                          → (marketing) home
/about                     → (marketing) about
/services                  → (marketing) services index
/services/alterations      → (marketing) alterations
/services/custom-bridal    → (marketing) custom bridal
/services/bridesmaid       → (marketing) bridesmaid
/reviews                   → (marketing) reviews
/journal                   → (marketing) journal index
/journal/[slug]            → (marketing) journal post
/contact                   → (marketing) contact
/dresses                   → (shop) catalogue
/dresses/[slug]            → (shop) product detail
/cart                      → (shop) cart
/checkout                  → (shop) checkout (form)
/checkout/payment          → (shop) mock payment
/checkout/confirmation     → (shop) order confirmation
/book                      → (booking) fitting wizard
/book/confirmed            → (booking) confirmation
/sitemap.xml               → auto-generated
/robots.txt                → auto-generated
```

## Rendering strategy

| Page | Strategy | Why |
|---|---|---|
| `/` | Static + ISR (60s) | Mostly static, occasional product/review updates |
| `/dresses` | Static + ISR (60s) | Product list changes ~weekly |
| `/dresses/[slug]` | Static + ISR (300s) | Individual products change rarely |
| `/about`, `/services/*` | Fully static | Doesn't change |
| `/journal/[slug]` | Static | MDX files at build time |
| `/reviews` | Static + ISR (300s) | Reviews accumulate slowly |
| `/cart`, `/checkout/*` | Dynamic (SSR) | Per-user state |
| `/book` | Dynamic (SSR) | Wizard state |
| `/contact` | Static | Doesn't change |

ISR (Incremental Static Regeneration) via `export const revalidate = N`.

## Authentication

The website **doesn't require accounts** for v1. Customers can browse, buy (mock), and book as guests.

Reasoning:
- Lower friction for first-time visitors
- Steffi can manage everything through the mobile app
- Account features can be added later if/when needed (order history, saved fittings, etc.)

For Phase 2+: add Supabase Auth, integrate with mobile app's user records.

## Security

- All env vars validated via Zod at startup (`lib/env.ts`)
- Service role key never exposed to client (only used in server actions when needed)
- All Supabase tables have RLS enabled with explicit policies
- Form input always Zod-validated server-side, never trust client
- Cart total recalculated server-side from product IDs (never trust client total)
- Honeypot fields on public forms (contact, reviews) to deter bots
- Vercel automatic HTTPS, HSTS, sensible security headers

## Performance budget

| Page | LCP target | Bundle size budget |
|---|---|---|
| Home | < 2.0s | < 200 KB (gzipped) |
| Dresses grid | < 2.5s | < 250 KB |
| Product detail | < 2.5s | < 250 KB |
| Booking | < 2.5s | < 300 KB |
| Other | < 2.0s | < 200 KB |

Measured via Vercel Analytics (real-user metrics) + monthly Lighthouse runs.

## Deployment

- Branch strategy: `main` deploys to production, all other branches deploy to preview URLs (Vercel automatic)
- Preview URLs are `noindex` automatically (controlled by Vercel env)
- Database migrations applied manually before deploys that need them
- Rollback: Vercel "Promote previous deployment" button

## Monitoring

- Vercel Analytics for traffic + performance
- Vercel Speed Insights for Core Web Vitals
- Supabase Dashboard for DB performance + errors
- Vercel logs for runtime errors
- Manual checks: weekly Lighthouse runs, monthly responsive sweep

No third-party error tracking (Sentry, etc.) in v1 — Vercel logs are sufficient for the scale.
