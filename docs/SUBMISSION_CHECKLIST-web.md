# Launch Checklist

The "is it ready to go live on steffnycouture.co.uk?" gate. Run through every item. Don't launch with any unchecked.

## Pre-launch (the day before)

### Code

- [ ] `npm run typecheck` clean
- [ ] `npm run lint` clean (no errors, no warnings)
- [ ] `npm run build` succeeds with no warnings
- [ ] Bundle size analyser run: each page < its budget (see ARCHITECTURE.md)
- [ ] No `console.log` left in production code
- [ ] No `TODO` / `FIXME` comments without tracking refs
- [ ] No commented-out blocks of code
- [ ] No dependency vulnerabilities (`npm audit` — fix high/critical)

### Content

- [ ] All 10+ products have proper photos (no placeholders)
- [ ] All products have descriptions (no "TODO" or lorem ipsum)
- [ ] All products have prices set
- [ ] At least 6 customer reviews live on `/reviews`
- [ ] 3 journal posts published, each with a hero image
- [ ] About page reflects Steffi's actual story (approved by her)
- [ ] All services pages have specific content (alterations, custom bridal, bridesmaid)
- [ ] Contact page has correct: address, phone, hours, WhatsApp link, Instagram link
- [ ] Footer has same details + small print
- [ ] 404 page styled and helpful

### SEO

- [ ] Every page has unique title and description
- [ ] All titles are 50-60 chars
- [ ] All descriptions are 140-160 chars
- [ ] Open Graph image on every page (1200×630)
- [ ] Sitemap.xml accessible and complete
- [ ] robots.txt accessible
- [ ] Canonical URLs on every page
- [ ] Structured data: Organization (root), LocalBusiness (contact), Product (each product), AggregateRating (reviews), BlogPosting (each journal post)
- [ ] All images have descriptive alt text
- [ ] No `noindex` on production pages (only on `/checkout`, `/cart`)

### Performance (Lighthouse on every page)

| Page | Perf | A11y | BP | SEO | OK? |
|---|---|---|---|---|---|
| `/` | ≥ 90 | ≥ 95 | 100 | 100 | [ ] |
| `/dresses` | ≥ 90 | ≥ 95 | 100 | 100 | [ ] |
| `/dresses/[product]` | ≥ 90 | ≥ 95 | 100 | 100 | [ ] |
| `/about` | ≥ 90 | ≥ 95 | 100 | 100 | [ ] |
| `/services/alterations` | ≥ 90 | ≥ 95 | 100 | 100 | [ ] |
| `/contact` | ≥ 90 | ≥ 95 | 100 | 100 | [ ] |
| `/book` | ≥ 85 | ≥ 95 | 100 | 100 | [ ] |
| `/journal/[post]` | ≥ 90 | ≥ 95 | 100 | 100 | [ ] |
| `/reviews` | ≥ 90 | ≥ 95 | 100 | 100 | [ ] |

### Accessibility

- [ ] All images have alt text (decorative: `alt=""`)
- [ ] All form fields have associated labels
- [ ] Tab navigation works from header to footer
- [ ] Focus rings visible everywhere
- [ ] Colour contrast passes AA (4.5:1 body, 3:1 large text)
- [ ] No content conveyed by colour alone
- [ ] `prefers-reduced-motion` respected
- [ ] HTML lang attribute set to `en-GB`
- [ ] Modal/drawer traps focus and restores on close

### Responsive

Test at:
- [ ] 320px (smallest mainstream Android)
- [ ] 375px (iPhone SE)
- [ ] 393px (iPhone 14 Pro)
- [ ] 768px (iPad portrait)
- [ ] 1024px (iPad landscape, small laptop)
- [ ] 1280px (standard laptop)
- [ ] 1920px (large desktop)
- [ ] 2560px (27" 1440p desktop)

For each: every page loads correctly, no horizontal scroll, all CTAs reachable, no text overflow.

### Cross-browser

- [ ] Chrome (latest) on macOS / Windows
- [ ] Safari (latest) on macOS
- [ ] Safari on iPhone (real device, not simulator)
- [ ] Chrome on Android (real device)
- [ ] Firefox (latest) on desktop
- [ ] Edge (latest) on Windows

### Functionality smoke test (end-to-end)

- [ ] Home → browse → product → add to cart → cart → checkout → payment → confirmation (full flow works)
- [ ] Book a fitting wizard completes end-to-end and writes to Supabase
- [ ] Booking appears in mobile staff app within 5 seconds
- [ ] Customer receives confirmation email within 30 seconds
- [ ] Steffi receives notification email/push
- [ ] Contact form submits and creates an inquiry
- [ ] Cart persists across browser refresh
- [ ] WhatsApp button opens WhatsApp with prefilled message
- [ ] Instagram links open in new tab
- [ ] All internal navigation works (no 404s)
- [ ] 404 page works (try `/non-existent-page`)

### Browser console

- [ ] Zero errors on every page
- [ ] Zero warnings on every page
- [ ] Network tab: no 404s, no CORS errors, no failed requests
- [ ] All third-party scripts load successfully

### Security

- [ ] No service role key in client code (search the bundle)
- [ ] All env vars set correctly in Vercel
- [ ] `.env.local` is in `.gitignore` (verify)
- [ ] HTTPS works (Vercel handles this)
- [ ] HSTS header present (Vercel default)
- [ ] No sensitive data in URLs
- [ ] Forms have honeypot fields
- [ ] All Supabase tables have RLS enabled (verify in dashboard)

## Domain migration (when ready to switch)

This is the actual "go-live" step. **Schedule for a low-traffic time** (Sunday morning, etc.) so any downtime is minimal.

### 1. Pre-migration

- [ ] All checks above pass
- [ ] Vercel deployment is the latest, working version
- [ ] Backup of current Webador site content (screenshots, copy)
- [ ] Confirmed access to domain registrar account (where steffnycouture.co.uk DNS is managed)
- [ ] Note current DNS records (in case rollback needed)
- [ ] Communicate with Bunty that domain change is happening

### 2. Add domain to Vercel

- [ ] In Vercel dashboard → Project → Settings → Domains
- [ ] Add `steffnycouture.co.uk` and `www.steffnycouture.co.uk`
- [ ] Vercel provides DNS records to add (A record for apex, CNAME for www)

### 3. Update DNS

- [ ] Log into domain registrar
- [ ] Remove existing A/CNAME records pointing to Webador
- [ ] Add Vercel's A record for apex (`steffnycouture.co.uk` → Vercel IP)
- [ ] Add Vercel's CNAME for www (`www` → `cname.vercel-dns.com`)
- [ ] Set TTL low (300s = 5 min) for faster propagation
- [ ] Save

### 4. Wait for propagation (5 min to 24 hours, usually 30-60 min)

Verify:
```bash
dig steffnycouture.co.uk +short
dig www.steffnycouture.co.uk +short
```

Should return Vercel IPs.

Or use https://dnschecker.org to see propagation globally.

### 5. Verify in Vercel

- [ ] Vercel dashboard shows domain as "Valid Configuration"
- [ ] SSL certificate issued (Vercel auto-handles)
- [ ] Open https://www.steffnycouture.co.uk in incognito browser — should show new site

### 6. Set up redirects

If old Webador URLs need redirecting (preserve any backlinks), add to `next.config.ts`:

```ts
async redirects() {
  return [
    { source: '/old-path', destination: '/new-path', permanent: true },
  ];
}
```

### 7. Submit to Google Search Console

- [ ] Verify domain ownership via DNS TXT record
- [ ] Submit sitemap.xml
- [ ] Request re-indexing of homepage
- [ ] Check "Removals" tab — request removal of any old Webador URLs (optional)

### 8. Verify analytics

- [ ] Vercel Analytics counting page views
- [ ] No tracking errors in console

### 9. Post-launch

- [ ] Update Steffi's Instagram bio link
- [ ] Update Google Business Profile website field
- [ ] Update any business cards / signage if relevant
- [ ] Tell anyone who shares the link (friends, family) to test it

### 10. First-day monitoring

- [ ] Check Vercel logs every few hours for the first 24 hours
- [ ] Check Supabase dashboard for any error spike
- [ ] Test critical flows (booking, contact) every few hours
- [ ] Be ready to roll back if anything serious breaks

## Rollback plan (if domain switch breaks something)

If something is critically broken after the domain switch:

1. **Don't panic** — DNS changes are reversible
2. **In Vercel dashboard** → Deployments → Promote a known-good previous deployment
3. **If that doesn't fix it** → temporarily point DNS back to Webador IPs (you noted these in step 1)
4. **DNS propagation back to Webador**: 5-60 min
5. **Once stable** → investigate what went wrong, fix, redeploy, switch DNS again

## After launch

### Week 1
- [ ] Monitor daily
- [ ] Watch for any customer reports
- [ ] Check Google Search Console for indexing
- [ ] Get Steffi's feedback after she's used it for a few days

### Week 2-4
- [ ] First inquiries/bookings via website tracked
- [ ] Verify SEO indexing (search "steffny couture" — should rank)
- [ ] Adjust based on real customer behaviour (which pages get traffic, where they drop off)

### Month 2+
- [ ] Quarterly Lighthouse audit
- [ ] Add new journal posts
- [ ] Continue accumulating reviews
- [ ] Consider Phase 9 (real Stripe payments) if order volume justifies

## Sign-off

When all checks above pass, get explicit approval from Bunty in writing (WhatsApp text is fine):

> "I've reviewed the site, looks good, go ahead with the domain migration on [date]."

Don't migrate without this. It's not just professional — it's protection against a "wait I didn't approve this" moment.
