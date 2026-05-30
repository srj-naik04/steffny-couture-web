# Steffny Couture — Web Build Spec

> The master build prompt for the Steffny Couture website rebuild. Claude Code reads this on every session. It defines the what, why, and how of the build.

This is the **sibling** to the mobile app at `/E:/steffny-couture/`. Both apps share the same Supabase backend, the same brand identity, and the same booking system. The mobile app is for staff workflow and repeat customers; the website is for discovery, e-commerce, and first-touch booking.

---

## 1. Product Overview

### What we're building
A modern, fast, mobile-first website for **Steffny Couture** — a couture and alterations studio in Hounslow, London. Replaces the existing Webador site at `https://www.steffnycouture.co.uk/`.

### Who it serves
- **Discovery customers** — searching for "wedding dress London", "alterations Hounslow", "couture South Asian wedding" on Google, Instagram, or word-of-mouth referrals
- **Returning customers** — checking new arrivals, leaving reviews, booking a fitting for an upcoming event
- **B2B / press / Instagram crossover** — designers, photographers, influencers wanting to see the brand presence

### What it does
1. **Showcases the dress collection** — 10+ ready-to-wear pieces, high-res photos, multi-angle viewing
2. **Mock e-commerce checkout** — for demo: fake payment screen; in production: Stripe-ready architecture
3. **Books fittings & alterations** — same flow as the mobile app, writes to the same Supabase
4. **Tells the brand story** — about, services, custom bridal, alterations, bridesmaid dresses
5. **Publishes content for SEO** — blog/journal posts targeting Hounslow + South Asian wedding market
6. **Displays social proof** — customer reviews, Instagram gallery, press features

### What it does NOT do (in this build)
- Real payment processing (Phase 9 / future scope)
- Customer accounts on the web (defer; customers can use the mobile app for booking history)
- Multi-language (English-only for v1)
- Native admin portal (Steffi uses the mobile app to manage everything)
- A separate blog CMS — MDX files in the repo for now

---

## 2. Stack & Architecture

### Stack (locked)
| Layer | Choice | Reasoning |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Largest Claude Code training corpus, server components, image opt, SEO |
| **Language** | TypeScript strict | Same discipline as the mobile app |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Reuses brand tokens from mobile app |
| **Animations** | Framer Motion | Industry standard for smooth web motion |
| **Backend** | Supabase (same project as mobile) | Shared bookings, products, reviews |
| **Forms** | React Hook Form + Zod | Same as mobile |
| **State** | TanStack Query (server) + Zustand (client) | Same patterns as mobile |
| **Hosting** | Vercel | Free tier covers all expected traffic for years |
| **Domain** | `steffnycouture.co.uk` | Migrate from Webador post-demo |
| **Email** | Same Nodemailer Edge Function as mobile | Reuses booking confirmation templates |
| **Analytics** | Vercel Analytics | GDPR-friendly, no cookie banner needed |
| **Image hosting** | Supabase Storage `public/products/` + `next/image` | Auto WebP, lazy load, blur placeholders |

### Folder structure
```
steffny-couture-web/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Home, about, services, contact
│   │   ├── page.tsx              # Home
│   │   ├── about/page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   ├── alterations/page.tsx
│   │   │   ├── custom-bridal/page.tsx
│   │   │   └── bridesmaid/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── journal/              # Blog
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   └── layout.tsx            # Marketing layout (header + footer)
│   ├── (shop)/                   # E-commerce
│   │   ├── dresses/
│   │   │   ├── page.tsx          # Grid
│   │   │   └── [slug]/page.tsx   # Product detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx          # Mock checkout
│   │   │   └── confirmation/page.tsx
│   │   └── layout.tsx
│   ├── (booking)/                # Fitting/alteration booking
│   │   ├── book/page.tsx         # Multi-step wizard
│   │   └── layout.tsx
│   ├── api/                      # API routes (rare; prefer Supabase RPC)
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui primitives (Button, Input, etc.)
│   ├── marketing/                # Hero, FeatureSection, Testimonials, etc.
│   ├── shop/                     # ProductCard, ProductGrid, CartItem, etc.
│   ├── booking/                  # WizardStep, AlterationTypeCard, etc.
│   └── shared/                   # Header, Footer, MobileNav, etc.
├── features/
│   ├── products/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── schemas/
│   ├── bookings/                 # Shares schema with mobile app
│   ├── reviews/
│   └── cart/                     # Client-side cart in Zustand
├── content/
│   ├── journal/                  # MDX blog posts
│   │   ├── how-to-choose-wedding-dress-hounslow.mdx
│   │   └── bridal-alterations-timeline.mdx
│   └── services/                 # MDX service descriptions
├── lib/
│   ├── supabase/                 # Client + server Supabase instances
│   ├── motion/                   # Framer Motion presets
│   ├── seo/                      # Metadata helpers
│   ├── currency.ts               # GBP formatting
│   ├── date.ts                   # Europe/London
│   ├── cn.ts                     # Tailwind class merging
│   └── env.ts                    # Zod-validated env vars
├── constants/
│   ├── brand.ts                  # Mirrors mobile app's constants/brand.ts
│   ├── shop.ts                   # Hours, address, social links
│   └── nav.ts                    # Header + footer link structure
├── types/
│   └── database.ts               # Generated from Supabase
├── public/
│   ├── assets/                   # Scraped images organised by section
│   │   ├── hero/
│   │   ├── products/             # Renders bundle as needed
│   │   ├── about/
│   │   └── og/                   # Open Graph share images
│   ├── favicon.ico
│   └── robots.txt
├── scripts/
│   ├── scrape-images.mjs         # Pull from existing site
│   ├── seed-products.ts          # Push products to Supabase
│   └── generate-og-images.ts     # Per-page OG cards
├── .claude/                      # Claude Code skills + commands
├── docs/                         # ARCHITECTURE, DATABASE_WEB, DESIGN_SYSTEM, etc.
├── CLAUDE.md                     # This file
├── PROGRESS.md
├── README.md
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Architecture principles
1. **Server-first** — default to React Server Components. Use `"use client"` only where needed (forms, interactive elements, animations triggered by user)
2. **Image-heavy → next/image always** — never raw `<img>`. Lossless, AVIF/WebP, lazy
3. **Tailwind tokens only** — no hex codes in components. Brand tokens from `constants/brand.ts` → `tailwind.config.ts`
4. **Mobile-first responsive** — design at 375px, scale up. Test at 320px / 375px / 768px / 1024px / 1440px / 1920px
5. **SEO is product** — every page has metadata, Open Graph, structured data
6. **Reuse mobile patterns** — same Supabase queries, same Zod schemas, same brand voice

### Shared infrastructure with mobile app
- Same Supabase project
- Same `bookings` table (web bookings appear instantly in mobile staff app)
- Same `alteration_types` reference data
- Same brand colours, typography, voice
- **Different**: products, reviews, inquiries tables (web-specific)
- **Different**: shopping cart state (web-only feature)

### Branch + deploy pipeline (D-065, D-067)

Three GitHub branches map 1-to-1 to Vercel environments:

| Branch | Vercel environment | Use |
|---|---|---|
| `development` | Development (CLI / localhost) | day-to-day work; no auto-deploy needed |
| `main` | Preview | shareable dummy URL for stakeholder review |
| `production` | Production | live site (`steffny-couture-web.vercel.app`, eventually `steffnycouture.co.uk`) |

Promotion flow: `development → main → production` via `git merge --ff-only`. Vercel auto-deploys every push.

All three environments share **one Supabase project**. The boundary between safe-test and real-writes is enforced by `NEXT_PUBLIC_DEMO_MODE`:
- Set to `true` (or unset) on Preview + Development → all server actions short-circuit, no writes to Supabase.
- Set to `false` on Production only → real writes flow through, bookings reach the mobile app.

Build-time gotcha: any file imported from `src/` (e.g. `data/optimised-images.json`) must be committed to git, not gitignored — Vercel clones the repo on every build (D-066).

---

## 3. Design System

The brand is identical to the mobile app. See `.claude/skills/steffny-brand/SKILL.md` for the full authoritative rules.

### Palette (web variants in Tailwind)
```
ivory:        #FAF7F2    bg-ivory       Backgrounds
surface:      #FFFFFF    bg-surface     Cards, modals
surfaceAlt:   #F4EFE8    bg-surfaceAlt  Inputs, raised sections
rose:         #7C2D3E    bg-rose        PRIMARY action
roseDark:     #5A1F2C    bg-roseDark    Hover/pressed
roseSoft:     #F2D9DE    bg-roseSoft    Tonal badges
gold:         #C9A961    text-gold      Accents
goldSoft:     #F5EBD2    bg-goldSoft
ink:          #1F1B1A    text-ink       Primary text
inkMuted:     #5C5551    text-inkMuted  Secondary text
inkSubtle:    #9A9089    text-inkSubtle Tertiary text
success:      #3F6E4A
warning:      #B8741A
danger:       #9B2C2C
border:       #E8E0D7
borderStrong: #D4C8BA
```

### Typography
- **Fraunces** (display) — Google Fonts, weights 400, 600, 700. For hero, section headers, product names
- **Inter** (body) — Google Fonts, weights 400, 500, 600. For paragraphs, buttons, UI
- Load via `next/font/google` with `display: 'swap'` to avoid FOUT

### Web-specific scale (larger than mobile, modern web defaults)
```
text-hero       72/80    Fraunces 700   Hero h1 desktop
text-hero-sm    44/52    Fraunces 700   Hero h1 mobile
text-display    48/56    Fraunces 700   Section h2 desktop
text-display-sm 32/40    Fraunces 700   Section h2 mobile
text-title      28/36    Fraunces 600   Card titles
text-headline   20/28    Inter 600      Subheadings
text-body       16/26    Inter 400      Body
text-small      14/22    Inter 400      Captions
text-label      12/16    Inter 500      Uppercase labels
```

### Motion vocabulary (Framer Motion)
| Use | Duration | Easing |
|---|---|---|
| Micro (hover, button) | 200ms | `[0.4, 0, 0.2, 1]` (ease-out) |
| Default (fade-in, reveal) | 400ms | `[0.25, 0.1, 0.25, 1]` |
| Page transition | 600ms | `[0.6, 0.05, 0.01, 0.99]` |
| Stagger children | 80ms delay | Same as default |
| Hero parallax | scroll-linked | Tight, no spring |
| Image zoom (hover) | 700ms | `[0.4, 0, 0.2, 1]` |

### Brand voice (identical to mobile)
- No exclamation marks
- No emoji in UI
- British English
- Sentence case for buttons and headings
- Warm but refined
- "Crafted in London" identity always honoured

See the `steffny-brand` skill for full voice rules.

### Responsive breakpoints (the only ones we use)
```
sm:  640px   Small tablets
md:  768px   Tablets
lg:  1024px  Small laptops
xl:  1280px  Desktops
2xl: 1536px  Large desktops
```

Mobile-first always. Defaults are mobile; `md:` and up scale.

---

## 4. Phases

### Phase 0 — Foundation
- Next.js 15 scaffold with App Router
- Tailwind v4 + shadcn/ui setup
- Brand constants matching mobile app
- Font loading (Fraunces + Inter)
- Base UI primitives (Button, Card, Input, Container, Section)
- Header + Footer (responsive)
- Mobile navigation drawer
- Marketing layout
- Typecheck + lint + Prettier
- `.env.local` setup
- Vercel-ready

**Acceptance:**
- `npm run dev` works
- `npm run build` succeeds with no warnings
- Homepage renders blank state with header + footer
- Responsive at 375px and 1440px
- Lighthouse score on homepage: Performance ≥ 90, Accessibility ≥ 95, Best Practices = 100, SEO = 100

### Phase 1 — Asset Extraction
- Run `scripts/scrape-images.mjs` to pull all images from current site
- Download, organise into `/public/assets/`
- Generate WebP and AVIF variants via Sharp
- Extract product copy + prices into `data/products.json`
- Manually curate: pick best 30 images, archive rest
- Generate blur placeholders

**Acceptance:**
- All product photos in `/public/assets/products/` at original resolution
- About-page photos in `/public/assets/about/`
- Hero candidates in `/public/assets/hero/`
- `data/products.json` populated with 10 products

### Phase 2 — Database & Backend
- Extend existing Supabase project (same as mobile app):
  - `products` table — drosses catalogue
  - `product_images` — multi-image support
  - `inquiries` — "I'm interested in this dress" form submissions
  - `reviews` — customer reviews (manually entered initially, form added later)
  - `journal_views` — blog post view tracking
- RLS policies (matching the four-role model from mobile)
- Seed products from `data/products.json`
- Supabase client setup for Next.js (browser + server variants)

**Acceptance:**
- All tables created with RLS
- 10 products seeded with images uploaded to Storage
- Server component can read products list
- Mobile app's staff dashboard can see new "Products" section

### Phase 3 — Marketing Pages
- Home page: hero + featured products + about teaser + services preview + reviews + journal teaser + CTA
- About page: full brand story with photos
- Services pages: Alterations, Custom Bridal, Bridesmaid (3 separate pages with rich content)
- Contact page: address + hours + map + WhatsApp + Instagram + contact form
- All with proper SEO metadata, Open Graph, structured data

**Acceptance:**
- All pages responsive 320px → 1920px
- All pages have unique meta title + description + OG image
- Schema.org markup on contact page (LocalBusiness)
- 404 page styled

### Phase 4 — Dress Catalogue & Product Detail
- `/dresses` grid page with filters (by colour, type, price range)
- `/dresses/[slug]` product detail page:
  - Multi-image carousel with thumbnails
  - Zoom on hover
  - Size/colour/type variant selector
  - Price + description
  - "Add to cart" (client-side Zustand)
  - "Enquire via WhatsApp" (deep link)
  - "Book a fitting" (links to booking flow)
  - Related products
- Loading states, empty states, error boundaries

**Acceptance:**
- Grid loads with skeleton, then fade-in stagger
- Product detail page scores 90+ on Lighthouse mobile
- Carousel works with keyboard and touch
- Variant selector updates price/availability

### Phase 5 — Cart & Mock Checkout
- Cart drawer (Sheet) accessible from header
- Cart page with quantity, remove, total
- Checkout: address + delivery + mock payment screen
- Confirmation page with fake order number + "Steffi will WhatsApp you" notice
- Sends `inquiry` record to Supabase (so Steffi sees it in mobile app)

**Acceptance:**
- Cart persists across pages (Zustand + localStorage)
- Mock checkout looks production-quality (gradient buttons, smooth transitions)
- Confirmation triggers Supabase write + email to Steffi
- Demo-ready: a customer can complete the flow in under 60 seconds

### Phase 6 — Fitting/Alteration Booking
- "Book a fitting" CTA in header + product pages + home + services
- Multi-step booking wizard (same UX as mobile app):
  - Type (alteration / custom / bridal consultation)
  - Photo upload (optional)
  - Details + description
  - Schedule (date + time)
  - Contact details
  - Review + confirm
- Writes to same `bookings` table as mobile app

**Acceptance:**
- Booking made on website appears in Steffi's mobile app within 5 seconds (realtime)
- Confirmation email sent
- Wizard preserves state if user navigates away and comes back
- Works perfectly at 375px (most customers will be on mobile)

### Phase 7 — Reviews, Journal, Polish
- Reviews page with grid of testimonials + "Leave a review" form
- Journal section with 3-5 starter blog posts (MDX)
- Individual journal post pages with reading time, related posts
- Instagram-pull gallery on home page (static for now; auto-pull later)
- Press section if Steffi has any features
- Animations passes: stagger reveals, hero parallax, smooth scroll, image lazy fade-in
- Accessibility audit: all images alt, all forms labelled, keyboard nav, focus rings
- SEO audit: sitemap.xml, robots.txt, all meta tags

**Acceptance:**
- 3 journal posts published
- Reviews page populated with 8+ reviews
- All pages pass WCAG AA contrast
- All pages keyboard-navigable
- Sitemap submitted (after deploy)

### Phase 8 — Demo Prep & Deploy
- Final responsive sweep: every breakpoint, every page
- Test on real iPhone Safari + Android Chrome
- Cross-browser: Chrome, Firefox, Safari, Edge
- Lighthouse: Performance ≥ 90, A11y ≥ 95, Best Practices = 100, SEO = 100 on all pages
- Vercel deploy with preview URL
- Domain migration plan documented (do this only after Bunty approves)
- Demo script written

**Acceptance:**
- Live preview URL working
- All pages load in under 2 seconds on 4G
- Zero console errors
- Demo runs end-to-end without issues

### Phase 9 — Domain Migration & Production

**Vercel project import: DONE (2026-05-28).** Repo `srj-naik04/steffny-couture-web` imported; branch pipeline live (D-065); env vars wired per environment (D-067). Remaining work:

- Move `steffnycouture.co.uk` DNS from Webador to Vercel
- Set up email forwarding if needed (existing email addresses preserved)
- Configure Vercel Analytics
- Submit sitemap to Google Search Console
- Set up redirects from old Webador URLs to new ones (preserve any existing SEO juice)

**Acceptance:**
- Domain points to Vercel
- HTTPS works
- Old URLs redirect to new ones (301)
- Search Console verified
- Google indexes new pages within 7 days

---

## 5. Definition of Done (every PR)

Before merging anything, verify:

1. `npm run typecheck` clean
2. `npm run lint` clean
3. `npm run build` succeeds with no warnings
4. Tested on iPhone Safari + Android Chrome
5. Tested at 375px, 768px, 1440px
6. Lighthouse score doesn't drop below the threshold for that page
7. All new images have `alt` text
8. All new forms have labels and aria attributes
9. All new copy follows the brand voice (no exclamation marks, no emoji)
10. Brand tokens used (no hex codes inline)
11. PROGRESS.md updated
12. Conventional commit message

---

## 6. Anti-Patterns (immediate red flags)

- ❌ Raw `<img>` tags — always `next/image`
- ❌ `<a>` for internal links — always `<Link>` from `next/link`
- ❌ Hex codes inline — always Tailwind tokens
- ❌ `style={{}}` for static styling — use Tailwind classes
- ❌ Client components ("use client") when server would do
- ❌ Fetching data in `useEffect` — use server components or TanStack Query
- ❌ Form state in `useState` — use React Hook Form
- ❌ `console.log` left in production
- ❌ Skipping `<meta>` tags — every page needs them
- ❌ Fixed pixel widths breaking responsive — always use Tailwind responsive utilities
- ❌ Animation on every element — motion is intentional, not decorative
- ❌ Generic stock photos — use real Steffny Couture imagery only
- ❌ Lorem ipsum in committed code

---

## 7. Execution Order

Run phases in order. Don't skip ahead. Each builds on the previous.

After every phase:
1. Run `/phase-check <n>` to verify acceptance criteria
2. Update PROGRESS.md
3. Commit with Conventional Commits message
4. Tag if it's a milestone

When in doubt, ask before doing.
