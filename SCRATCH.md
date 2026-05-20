# Scratch

Working notes and ideas. Not part of the formal documentation. Edit freely.

---

## Phase 1 — Starting 2026-05-20

### Tasks (from CLAUDE.md)
- Run `scripts/scrape-images.mjs` to pull all images from current site
- Download, organise into `/public/assets/`
- Generate WebP and AVIF variants via Sharp
- Extract product copy + prices into `data/products.json`
- Manually curate: pick best 30 images, archive rest
- Generate blur placeholders

### Acceptance
- All product photos in `/public/assets/products/` at original resolution
- About-page photos in `/public/assets/about/`
- Hero candidates in `/public/assets/hero/`
- `data/products.json` populated with 10 products

### Preflight notes
- typecheck clean, lint clean, no diffs (only `tsconfig.tsbuildinfo` untracked → already in `.gitignore` via `.tsbuildinfo`).
- Scripts already scaffolded: `scrape-images.mjs`, `optimise-images.mjs`, `seed-products.ts`.
- Missing devDeps for the pipeline: `cheerio`, `plaiceholder`, `tsx`, `dotenv`. (`sharp` ships with Next.)
- `/public/assets/raw/` and `/public/assets/optimised/` are NOT in `.gitignore` — the scrape script writes there but the gitignore lists `scripts/scraped/` and `scripts/optimised/`. Need to align.
- `data/` does not exist yet.
- `seed-products.ts` already encodes the 10-product manual catalogue — that's our source of truth for `data/products.json`.

---

## Phase 0 — Starting 2026-05-20

### Tasks (from CLAUDE.md)
- Next.js 15 scaffold with App Router
- Tailwind v4 + shadcn/ui setup
- Brand constants matching mobile app
- Font loading (Fraunces + Inter)
- Base UI primitives (Button, Card, Input, Container, Section)
- Header + Footer (responsive)
- Mobile navigation drawer
- Marketing layout
- Typecheck + lint + Prettier
- `.env.local` setup (already present)
- Vercel-ready

### Acceptance
- `npm run dev` works
- `npm run build` succeeds with no warnings
- Homepage renders blank state with header + footer
- Responsive at 375px and 1440px
- Lighthouse on homepage: Performance ≥ 90, A11y ≥ 95, Best Practices = 100, SEO = 100

### Preflight notes
- No `package.json` yet — repo is bare (CLAUDE.md, skills, docs, scripts only). Typecheck/lint can't run; establishing them is part of this phase.
- `.env.local` already exists.
- Git status: untracked-only (no prior phase to break baseline).

---

## Hero copy options (pick later with Steffi)

- "Elegance, made in London."
- "Crafted dresses, bespoke alterations."
- "Dresses for the moments that matter."
- "Couture, finished by hand."
- "Hand-crafted in our Hounslow studio."

## Journal post ideas

Targeting Hounslow + South Asian wedding searches:

1. **"How to choose a wedding dress in Hounslow"** — the buying-process guide
2. **"Bridal alterations timeline: from purchase to wedding day"** — pratical timeline post
3. **"5 things to ask your dressmaker before your wedding"** — checklist post (Google loves these)
4. **"South Asian wedding gowns: where tradition meets modern tailoring"** — captures niche searches
5. **"The Steffny studio: how we work"** — about-style, but in journal format
6. **"What to wear to a winter wedding in London"** — seasonal evergreen
7. **"Lehenga vs gown for your reception: pros and cons of each"** — comparison piece
8. **"Why off-the-rack rarely fits perfectly"** — explains the value of alterations

Start with 1, 2, 3. Add more over time.

## Reviews to seed initially

Pull from:
- Google Business Profile reviews (Steffi or Rohan can export)
- Instagram comments (with permission)
- WhatsApp testimonials (with permission)
- Anything written about her in local press

Format each as:
```
{
  author_name: "Anjali P.",
  author_location: "Hounslow",
  rating: 5,
  title: "Made my wedding dress dreams come true",
  body: "I came in with a Pinterest board and Steffi turned it into a real dress. The fit was perfect after two fittings. Worth every penny.",
  occasion: "wedding",
  featured: true
}
```

Aim for 8-10 reviews to start. Some 5-star, some 4-star (mix is more believable than all 5).

## Images currently on Webador

From scrape inventory:
- ~25-30 product photos on Webador CDN
- 3 lifestyle photos on About page (Pexels — placeholder, should replace with real Steffi photos)
- 1 hero image (Pexels)

Manual curation will:
- Pick best 3-5 photos per product (multi-angle, well-lit)
- Replace Pexels hero with a real Steffi photo if available
- Replace Pexels about-page photos with real studio photos

## Domain migration sequence (when ready)

1. Get explicit WhatsApp approval from Bunty
2. Pick a Sunday morning (lowest traffic time)
3. Note current DNS records (Webador IPs) for rollback
4. In Vercel, add `steffnycouture.co.uk` and `www.steffnycouture.co.uk` to project
5. Update DNS at registrar:
   - A record: `@` → Vercel IP
   - CNAME: `www` → `cname.vercel-dns.com`
   - Set TTL to 300s
6. Wait 30-60 min for propagation
7. Verify SSL cert issued by Vercel
8. Test in incognito on multiple devices
9. Submit sitemap to Google Search Console
10. Update Steffi's Instagram bio link
11. Tell Bunty + Steffi it's live

## Pricing for new features (post-launch)

Reference from mobile app:
- Small: ₹3-6k / £28-56 (typo fix, copy change, single component tweak)
- Medium: ₹8-15k / £75-140 (new page, new feature like newsletter, additional service section)
- Large: ₹20k+ / £190+ (Stripe integration, multi-language, account system, custom booking type)

Always quote in writing. Never on the spot. 50% upfront, 50% on completion.

## Things to mention to Steffi for content

- About page: I'd like to interview her about her journey — origin story, when she started, why couture vs ready-made
- A short paragraph about her dressmaking philosophy
- A "behind the scenes" carousel of her at work (handheld iPhone photos are fine — feel real, not staged)
- Customer success stories (with permission, with photos if possible)

## Edge cases to handle in QA

- What happens if Supabase is down? → fallback "we're having a moment, try again or WhatsApp us"
- What happens if email send fails? → log error, show success to user but retry async
- What happens if the customer's browser blocks localStorage? → cart still works for the session, just doesn't persist (acceptable)
- What happens on a really slow connection? → loading states + skeleton screens (already designed)
- What if a product is sold out mid-checkout? → server-side validation + redirect to product with message

## "Phase 2" ideas (not for v1)

Things to consider for the next major release:
- Real Stripe payments
- Customer accounts (sign in via mobile app credentials)
- Order history page
- Wishlist
- Newsletter (Mailchimp or similar)
- Live chat (Crisp or similar)
- Multi-language (Hindi, Punjabi as starting languages)
- Auto-pull Instagram grid
- Loyalty / referral programme
- Gift cards
- AR try-on (overkill for now, but cool)
- Sizing quiz / recommendation engine
- Studio booking from Google search ("Book on Google")

## Notes from prior conversations

- Bunty mentioned promotion ideas — QR code at counter for app downloads. Web equivalent: QR code linking to `/dresses` for in-store browsing.
- Steffi mentioned customers often ask for similar dresses they've seen on Instagram — the journal section could have a "trending styles" element
- Currency is GBP — never display in INR even on the dev side (we're Indian devs but it's a UK site)

## TODO before first commit

- [ ] Run `npm init` and configure `package.json`
- [ ] Set up `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`
- [ ] Set up `.gitignore`, `.prettierrc`, `.eslintrc`
- [ ] Initial commit: "chore: initial setup"
- [ ] Push to GitHub
- [ ] Connect to Vercel
- [ ] First Vercel preview deploy of an empty Next.js app to verify the pipeline works
