---
name: demo-readiness
description: Use this skill whenever preparing the Steffny Couture website for a live demo to Rohan, doing a pre-demo dress rehearsal, building the demo walkthrough script, or making last-mile polish decisions in Phase 8. Fires for any task tagged "demo prep", any final-polish pass, or anything that affects what Rohan will see on screen. Enforces the "every screen passes the unaware-eye test" rule, the demo script structure, and the 3-device verification ritual.
---

# Demo Readiness

The website's job at the demo is not to be perfect. It's to make Rohan say **"yes, my customers will love this"** within 4 minutes.

To do that, every screen has to look right — not have a finger-tap-away-from-broken state. The "unaware-eye test": pretend Rohan is seeing the page for the first time, with no context. Does it work?

## The 4-Minute Demo Script

When Rohan opens the demo URL, walk him through this sequence. Time yourself.

### Minute 1 — Hero + browse

1. Land on home — let the hero settle (3 seconds of silence so he absorbs it)
2. Scroll slowly through the home page — point out:
   - "Couture, crafted in London" headline
   - Featured dresses strip
   - "Our story" section with Steffi's atelier photo
   - Services preview
3. Click into "View the collection"
4. Show the catalogue grid on desktop, scroll once
5. **Resize the browser to narrow** (or open DevTools mobile view at 375px) — show the same grid responsive

### Minute 2 — Dress detail + dummy checkout

1. Click on a dress — show the detail page
2. Point out the image gallery, variant selectors, price
3. Click "Add to cart" — show the cart icon update (subtle animation)
4. Open the cart
5. Click "Proceed to checkout"
6. **Pause on the demo banner** — explicitly say: "This is a fake payment screen for the demo. In production it'll connect to Stripe."
7. Show the test card pre-filled, click pay
8. Show the success screen

### Minute 3 — Booking flow

1. Navigate to "Book a fitting"
2. Fill it in real-time while talking:
   - Choose alteration type
   - Add a photo (drag one in, or tap to select)
   - Write a description
   - Pick a date
   - Add contact details
3. Submit
4. **Switch to the mobile app on a second screen / phone** — show the booking appear in Steffi's kanban
5. "This is what makes the web and the app feel like one product"

### Minute 4 — About / reviews / journal / close

1. Navigate to About — show Steffi's story
2. Navigate to Reviews — show the testimonial grid
3. Navigate to Journal — open one post briefly
4. End on contact page — show the map, hours, WhatsApp button

End with: "What's your reaction?"

Don't pitch. Let him talk.

## The Unaware-Eye Test (Every Screen)

For every page in the site, open it fresh in a new tab. Pretend you've never seen it. Ask:

- Is the heading clear within 2 seconds?
- Do I know what to do next?
- Does anything look broken (missing image, weird spacing, overlapping text)?
- Does it feel like the same brand as the previous page?
- Is anything aggressively asking me to do something (popup, banner, scroll-jack)?
- Would I show this to a friend without apology?

If any answer is shaky, that screen isn't ready.

## Pre-Demo Checklist (do this morning of)

Run through every item. Don't skip.

### Content sanity
- [ ] Home hero image loads instantly (preload + priority)
- [ ] No "lorem ipsum" anywhere — grep the repo
- [ ] No placeholder phone numbers like `+1 (555) 555-5555`
- [ ] Steffi's actual phone, email, address on contact page
- [ ] All 10 dresses have correct names, prices, photos
- [ ] At least 6 reviews live, none with weird AI phrasing
- [ ] 3 journal posts published, with cover images
- [ ] Every page has a unique title in the browser tab
- [ ] Sitemap loads at `/sitemap.xml`
- [ ] Robots.txt loads at `/robots.txt`

### Visual polish
- [ ] No layout shift on any page (CLS = 0)
- [ ] Header looks correct on first load (no flash of unstyled content)
- [ ] All buttons have hover states
- [ ] All inputs have focus rings (rose, visible)
- [ ] Mobile menu opens and closes smoothly
- [ ] Hero parallax works on desktop, doesn't lag on mobile
- [ ] Cards have subtle hover lift, not aggressive
- [ ] All images load — no broken image icons anywhere
- [ ] Loading skeletons appear briefly on slow connections (test with Slow 4G in DevTools)

### Functional flows
- [ ] Add to cart → cart icon updates with count
- [ ] Cart persists across page reload
- [ ] Demo checkout completes, success screen shows reference number
- [ ] Book a fitting submits successfully
- [ ] **Booking appears in mobile app within 5 seconds** (verified live)
- [ ] Contact form submits (steffi@steffnycouture.co.uk receives test)
- [ ] WhatsApp button opens WhatsApp on iPhone and Android
- [ ] Map embed loads (Google Maps doesn't 403)
- [ ] All internal links work — no 404s
- [ ] External links open in new tab (`rel="noopener"`)

### Mobile experience
- [ ] iPhone Safari — tested, no horizontal scroll, no broken layout
- [ ] Android Chrome — tested, same
- [ ] Touch targets feel right (no tiny buttons)
- [ ] Forms work with iOS keyboard (email keyboard appears on email field)
- [ ] No annoying zoom-on-input behaviour (font-size on inputs ≥ 16px)

### Performance
- [ ] Lighthouse Performance ≥ 90 on home + dress detail + book-a-fitting (DevTools, mobile, 4G throttle)
- [ ] First page paint < 2 seconds on Slow 4G
- [ ] No long task warnings in the Performance tab

### Browser console
- [ ] Open DevTools Console on every key page
- [ ] **Zero errors, zero warnings, zero 404s in Network tab** (besides the predictable favicon edge cases)

### Demo URL hygiene
- [ ] Preview URL or `*.vercel.app` — make sure it's the latest deploy
- [ ] No staging banners visible if you're using the production URL
- [ ] Custom domain (if migrated) returns HTTPS, no certificate warnings
- [ ] All env vars are production values (not dev keys)

## The Three Devices

Before the demo, verify on three different devices:

1. **Your laptop** — Chrome, Safari, Firefox
2. **One phone** — iPhone or Android, on cellular (not WiFi) to see real-world speed
3. **One tablet** — iPad portrait, iPad landscape, or Android tablet

If any of the three has a problem you can't fix in time, **don't show that device** during the demo. Pre-position what Rohan sees.

## Common Demo-Day Failures

### "It worked yesterday but is broken now"
Usually one of:
- Supabase free tier paused the project (7-day inactivity)
  - **Fix:** ensure Supabase is on Pro tier ($25/month) before launch
- DNS hadn't fully propagated, now caches expired and pointed to old IP
  - **Fix:** verify with `dig` from multiple regions
- Latest deploy failed, last deploy is stale
  - **Fix:** check Vercel dashboard for build status

### "The booking doesn't appear in the app"
- Mobile app's RLS doesn't allow `source = 'web'` inserts
- Booking column missing required field
- Mobile app caching old data — force refresh

### "Photos won't upload"
- Storage bucket not public (or wrong CORS config)
- File size larger than the bucket's per-file limit
- HEIC uploaded but Supabase rejecting unknown contentType

### "It's slow"
- Vercel cold start on first request — open it once 30 seconds before demo
- Heavy images served at full resolution — check `sizes` props
- Third-party scripts (analytics, fonts) blocking render

### "Nothing happens when I click anything"
- Hydration error in console — a server/client mismatch
- JavaScript bundle failed to load (check Network tab)
- Adblocker blocking Vercel analytics (rare but happens)

## Demo Environment Setup

5 minutes before the demo:

1. **Open every page once** in the browser — primes Vercel's edge cache
2. **Open the demo URL in a fresh incognito window** — confirms it works without your cookies/cache
3. **Have the mobile app ready on your phone** — logged in as Steffi (the tailor role)
4. **Close all other tabs** so the browser is fast and screen-clean
5. **Test your screen-share once** if remote (Bunty has had Zoom issues before)
6. **Have WhatsApp open** to send him the link in chat as backup
7. **Phone on silent** — but not Do Not Disturb (you might need it for the booking app)

## Post-Demo

Don't promise the moon. Listen:

- If Rohan loves it → great, talk timeline + pricing on a follow-up call (don't quote on this call)
- If Rohan has concerns → write them down, don't argue, say "let me think about that and come back"
- If Rohan wants changes → categorise immediately:
  - Small (free under maintenance, do this week)
  - Medium (quote separately, do over 1-2 weeks)
  - Large (formal scope, separate engagement)

End with a clear next step. Either "I'll send you the timeline tonight" or "let's catch up Friday after you've slept on it."

## Anti-Patterns

- ❌ Last-minute deploys 30 mins before the demo (always breaks)
- ❌ Demoing from your local dev server (`localhost:3000`) when you can use a stable production URL
- ❌ Showing developer tooling open — the demo is for him, not for your debug view
- ❌ Saying "this is a bug, let me fix it real quick" mid-demo — note it down silently, move on
- ❌ Apologising for things he hasn't noticed — don't draw attention to flaws
- ❌ Going over 5 minutes without stopping for his reaction
- ❌ Pitching pricing in the same call as the demo (separate them)
- ❌ Demoing on a Friday evening when his attention is elsewhere
- ❌ Forgetting to follow up — send him a recap WhatsApp within 2 hours
