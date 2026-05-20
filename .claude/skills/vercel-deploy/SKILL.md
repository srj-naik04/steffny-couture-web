---
name: vercel-deploy
description: Use this skill whenever working on deployment, environment variables, build configuration, preview URLs, the production launch, or migrating the steffnycouture.co.uk domain from Webador to Vercel. Fires for any work on `vercel.json`, `next.config.ts`, environment variable changes, DNS configuration, or Phase 8 (Demo prep + deploy) tasks. Enforces production-safety checklist, preview-URL noindex policy, and the domain migration sequence.
---

# Vercel Deploy + Domain Migration

The site lives on Vercel from day one. Free tier handles Steffi's traffic for years. The production launch involves migrating `steffnycouture.co.uk` from Webador's hosting to Vercel — a sequence that needs to be done in the right order to avoid downtime.

## Initial Vercel Setup

### From the CLI

```bash
npm install -g vercel
vercel login
cd E:\steffny-couture-web
vercel link  # connects this folder to a Vercel project
```

This creates `.vercel/project.json` (committed) and `.vercel/.env*` (gitignored).

### Or from the dashboard

1. Push the repo to GitHub
2. https://vercel.com/new → Import the repo
3. Framework preset: Next.js (auto-detected)
4. Root directory: `./`
5. Build command: leave default (`next build`)
6. Output directory: leave default (`.next`)
7. Install command: leave default
8. Click Deploy

The first deploy will fail until environment variables are set. Add them, redeploy.

## Environment Variables (production)

Set in Vercel dashboard → Project → Settings → Environment Variables.

Required:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Optional (when added later):
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX        # Google Analytics 4
INSTAGRAM_ACCESS_TOKEN=...              # IG Basic Display API
RESEND_API_KEY=...                      # If/when we move email off Supabase Edge Function
```

**Critical:** Anything starting with `NEXT_PUBLIC_` is shipped to the browser. Service role key MUST NOT have that prefix.

### Per-environment vars

Vercel supports three environments: Production, Preview, Development.

- **Production** uses the production Supabase URL/keys
- **Preview** can use the same Supabase (acceptable for demo) or a separate staging Supabase (better practice, do later)
- **Development** uses values from `.env.local`

For now, all three use the same Supabase project — simpler for the demo.

## `next.config.ts` for Production

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },

  // Block search engines from indexing preview deployments
  async headers() {
    if (process.env.VERCEL_ENV !== 'production') {
      return [
        {
          source: '/:path*',
          headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
        },
      ];
    }
    return [];
  },

  experimental: {
    // Server actions are stable in Next 15 but body size limits are conservative
    serverActions: { bodySizeLimit: '10mb' },
  },
};

export default nextConfig;
```

## Preview Deployments

Every git push to a non-main branch gets its own Vercel preview URL. Use these to show Rohan progress without affecting production:

```
https://steffnycouture-web-git-feature-xyz.vercel.app
```

Rules for previews:
- **Auto noindex via the `X-Robots-Tag` header** (configured above)
- **Robots meta tag in layout** as belt-and-braces:

```tsx
// src/app/layout.tsx
export const metadata: Metadata = {
  // ...
  robots: process.env.VERCEL_ENV !== 'production'
    ? { index: false, follow: false }
    : undefined,
};
```

- **Banner on preview** to make it visually obvious to Rohan:

```tsx
// src/components/PreviewBanner.tsx
export function PreviewBanner() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') return null;
  return (
    <div className="bg-warning text-ivory text-center py-2 text-xs font-medium">
      Preview build — not the live site
    </div>
  );
}
```

Render at the top of the root layout, above the Header.

## Domain Migration: Webador → Vercel

The most error-prone part of the launch. The existing site is on Webador (Dutch website builder). The domain `steffnycouture.co.uk` likely uses Webador's nameservers or has DNS records pointing at Webador's IPs.

### Pre-migration check (do this BEFORE touching anything)

```bash
# See where the domain currently points
dig steffnycouture.co.uk
dig www.steffnycouture.co.uk
nslookup -type=NS steffnycouture.co.uk

# Check who registered the domain
whois steffnycouture.co.uk
```

Find out:
- Who is the registrar? (Probably bought via Webador or a UK registrar like 123-reg, Nominet, GoDaddy)
- Who controls DNS? Webador's nameservers, or the registrar's own DNS?
- Are there any MX records (email forwarding)? Steffi might be receiving emails to `hello@steffnycouture.co.uk` — those need to keep working.

**Ask Rohan before doing anything:**
1. Where did you buy the domain? (registrar login)
2. Are you using email @steffnycouture.co.uk anywhere? (yes → preserve MX records)
3. Do you have the Webador account login? (need to cancel after migration)

### Migration sequence (zero-downtime)

1. **Build & deploy the site to Vercel** at its default `*.vercel.app` URL
2. **Test the Vercel URL thoroughly** — every page, every form, on multiple devices
3. **Add the custom domain** in Vercel → Project → Settings → Domains
   - Add `steffnycouture.co.uk` (apex/root)
   - Add `www.steffnycouture.co.uk` (and choose one as canonical — recommend `www`, redirect apex to it)
   - Vercel shows the DNS records you need to set
4. **At the registrar (where the domain is registered):**
   - If using registrar's DNS (typical): add an `A` record for apex `@` → `76.76.21.21` (Vercel's IP), and a `CNAME` record for `www` → `cname.vercel-dns.com`
   - **Keep existing MX records intact** (email forwarding stays unchanged)
   - **TTL: set to 300 (5 mins)** before the cutover, so changes propagate fast
5. **Wait for DNS propagation** — usually minutes, max 48 hours
   - Check with `dig steffnycouture.co.uk` and https://dnschecker.org
6. **Verify in Vercel** — domain status turns green
7. **HTTPS** — Vercel auto-issues a Let's Encrypt certificate within minutes
8. **Test the live URL** — visit `https://www.steffnycouture.co.uk`
9. **Don't cancel Webador yet** — keep paying for one more month as a safety net

### After successful migration

- Update Steffi's IG bio link to the new URL
- Update Google Business Profile URL
- Update any printed materials, business cards, WhatsApp business description
- Submit new sitemap to Google Search Console
- Set up Google Search Console for the domain (verify via DNS TXT record)
- Tell Rohan he can cancel Webador after 30 days of the new site being live

### If Webador owns the nameservers

If the domain is using Webador's DNS (not the registrar's), the migration is harder:
- Either point the nameservers back to the registrar's default (and recreate records there)
- Or switch to Vercel's nameservers (cleaner long-term, but requires being able to update NS records at the registrar level)

Recommend: switch to Vercel nameservers. Vercel will tell you which 2-4 nameservers to set at the registrar. Then DNS records are managed in Vercel's UI.

## `vercel.json` (rarely needed)

Most config goes in `next.config.ts`. `vercel.json` is for vendor-specific tweaks:

```json
{
  "framework": "nextjs",
  "regions": ["lhr1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

`"regions": ["lhr1"]` — London region. Closer to UK users than US default.

## Pre-Launch Checklist (run before going live)

Print this. Tick every box:

### Content
- [ ] All 10 dresses have correct photos, prices, descriptions
- [ ] About page has correct text
- [ ] Contact page has correct address, hours, phone, email
- [ ] At least 6 published reviews
- [ ] 3 published journal posts
- [ ] No "lorem ipsum" anywhere (grep the repo)
- [ ] No "TODO" or "FIXME" in user-facing copy
- [ ] No broken links — run a link checker
- [ ] No 404s on `/sitemap.xml`, `/robots.txt`
- [ ] No `noindex` on production pages
- [ ] OG images render correctly when shared on WhatsApp, Twitter, Facebook (test all three)

### Functional
- [ ] Book-a-fitting form submits and shows in mobile app
- [ ] Contact form submits, Steffi gets email
- [ ] Dress detail pages all load
- [ ] Cart adds, removes, persists across reload
- [ ] Demo checkout completes (with banner visible)
- [ ] All forms have working error states
- [ ] Mobile menu opens/closes/closes-on-link-tap
- [ ] WhatsApp links open WhatsApp (test on real phone)
- [ ] Map embed loads on contact page

### Performance
- [ ] Lighthouse Performance ≥ 90 on every page (run from Vercel preview)
- [ ] Lighthouse Accessibility ≥ 95 on every page
- [ ] Lighthouse SEO ≥ 95 on every page
- [ ] Lighthouse Best Practices ≥ 95 on every page
- [ ] First Contentful Paint < 1.5s on mobile (Slow 4G throttle)
- [ ] Cumulative Layout Shift = 0 on every page

### Cross-browser / cross-device
- [ ] Chrome desktop
- [ ] Safari desktop
- [ ] Firefox desktop
- [ ] Edge desktop
- [ ] Safari iOS (iPhone)
- [ ] Chrome Android
- [ ] Samsung Internet (Android, common in UK)
- [ ] All breakpoints: 360, 640, 768, 1024, 1280, 1920px

### SEO
- [ ] Submit sitemap to Google Search Console
- [ ] Verify domain in Google Search Console
- [ ] Set up Bing Webmaster Tools too (free, occasionally indexed faster than Google)
- [ ] Google Business Profile URL updated to new domain
- [ ] Schema validates on https://search.google.com/test/rich-results
- [ ] OG image render checked on https://www.opengraph.xyz

### Legal / Operational
- [ ] Privacy policy page exists
- [ ] Terms / refund policy exists (matches Steffi's actual policies)
- [ ] Cookie banner if Google Analytics added (otherwise skip — only Vercel Analytics is cookieless)
- [ ] Steffi knows where to find new bookings in the mobile app
- [ ] Bunty has been shown the demo checkout banner — explicitly told it's a demo

## Common Production Errors

- **`Module not found: Can't resolve 'fs'`** — using a Node API in a client component. Move to server.
- **Hydration mismatch warning** — server-rendered HTML differs from client. Usually caused by `Date.now()` or `Math.random()` in render. Wrap in `useEffect` or use deterministic values.
- **`Failed to fetch`** — Supabase URL or anon key wrong in production env vars
- **Images returning 403** — Supabase Storage bucket not public, or `next.config.ts` missing the remote pattern
- **Forms returning 500** — service role key missing or incorrect on Vercel
- **Sitemap empty** — server component tried to read database without proper Supabase setup, errored silently. Add error logging.
- **Robots.txt blocks indexing** — preview env var leaked into production build

## Rollback Plan

If production breaks badly after a deploy:

1. Go to Vercel dashboard → Project → Deployments
2. Find the last good deployment
3. Click "..." → Promote to Production
4. Done — old version is live in 30 seconds

Vercel keeps every deployment indefinitely on the free tier. There's no good reason to ever lose the previous version.

## Going-Live Day Script

Hour by hour, the day of launch:

- **T-2 hours:** Final production deploy, smoke test
- **T-1 hour:** Update DNS records (low TTL already set day before)
- **T-0:** Site is live. Spot-check homepage, dress detail, book-a-fitting from a real device
- **T+30 mins:** Submit sitemap to Search Console
- **T+1 hour:** Post on Steffi's Instagram story announcing the new site
- **T+2 hours:** Check Vercel Analytics — confirm traffic is hitting the new site, not Webador
- **T+24 hours:** Cancel Webador if everything stable
- **T+1 week:** Check Search Console for indexing progress

## Anti-Patterns

- ❌ Pushing straight to production without preview testing
- ❌ Cancelling Webador the moment Vercel goes live (no safety net)
- ❌ Changing DNS without lowering TTL first
- ❌ Forgetting MX records (Steffi's email breaks)
- ❌ Service role key in `NEXT_PUBLIC_*`
- ❌ Removing the preview-noindex header
- ❌ No rollback plan / not knowing where the "Promote to Production" button is
- ❌ Launching at 11pm Friday — launch Monday morning, when you can fix problems
