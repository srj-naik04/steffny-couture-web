# Demo Script

The pitch and walkthrough for showing the new website to Bunty and Steffi.

**Target runtime:** 10-12 minutes.
**Goal:** They say "yes, let's launch it."

## Before the demo

- [ ] Production Vercel URL loaded in Chrome (fresh tab, no other tabs)
- [ ] Mobile phone with Steffny Couture mobile app open, signed in as Steffi
- [ ] Personal hotspot ready if studio wifi is patchy
- [ ] Laptop fully charged + plugged in
- [ ] System notifications muted
- [ ] Test the production URL one final time on your phone

## Opening (30 seconds)

> "Good [morning/afternoon]. As discussed, I've built the new website. It's not yet on steffnycouture.co.uk — we'll switch over once you've approved everything. Quick walkthrough, then questions?"

## 1. Home page (90 seconds)

Open the production URL. Land on home.

> "This is the homepage. Hero image up front — Steffi, this would be one of your photographs, current one is a placeholder."

Scroll slowly through:
- Hero
- Featured dresses (pause: "These pull from your inventory automatically. Add a dress in the app, it shows up here within a minute.")
- About teaser
- Services preview
- Reviews
- Journal teaser
- Footer

> "Notice the rhythm — sections breathe, photos lead, text supports. The brand stays consistent across every page."

Toggle DevTools mobile view (393×852).

> "And here's the same page on phone. 70% of customers will see this first on Instagram or WhatsApp on their phone."

Scroll through mobile view briefly.

## 2. Dresses (90 seconds)

Click into `/dresses`.

> "Full collection. Filters by colour and price along the side. Customers can find what they want fast."

Click into a product (maroon wedding dress).

> "Product detail. Multiple photos, zoom, variant selector for size and colour. Three calls to action — add to cart, message on WhatsApp, or book a fitting. We're not forcing one path."

## 3. Mock checkout (2.5 minutes)

> "Walk through checkout. Heads up: payments are mocked for the demo — real Stripe integration is a separate piece of work once you're ready."

- Click "Add to cart" → cart drawer slides in
- Show drawer, click "Checkout"
- Fill in the form (use Bunty's name, your test email)
- Continue to payment
- Show the fake card form: "Fake card here — `4242 4242 4242 4242` is the Stripe test card pattern"
- Click "Pay £420"
- 2-second animation → confirmation page

> "Order placed. Customer gets a confirmation email."

Switch to your phone running the mobile app.

> "And the order just landed in Steffi's app — see the new inquiry?"

Show the Inquiries tab updated.

> "Realtime. Within five seconds. From the moment a customer hits Pay, you know about it."

## 4. Book a fitting (2 minutes)

Back to website, click "Book a fitting" in header.

> "Six-step wizard. Same flow you have in the mobile app, accessible to customers who don't have the app yet."

Walk through the steps quickly:
1. Type → Alteration
2. Details → "Wedding dress, needs hemming"
3. Schedule → next Saturday, 2:00 PM
4. Photos → skip
5. Contact → name, phone, email
6. Review → submit

> "Same Supabase backend. Same notifications. Customer's confirmation email goes out, Steffi's notification shows up in the app."

Show the mobile app updating.

## 5. About + Journal (90 seconds)

Click About in nav.

> "Your story. We can update this any time — currently using copy from the existing site, you can rewrite it however you want."

Click Journal.

> "This is the SEO play. People search 'wedding dress Hounslow' or 'bridal alterations London' — these posts get them to your site. We start with three posts. Steffi, you tell me what topics, I write or help you write them."

Click into a post briefly to show formatting.

## 6. Reviews + Contact (60 seconds)

Click Reviews.

> "Reviews page. We can seed this with reviews from your Google profile and Instagram. Customers can also submit new ones — they come into the app for you to approve before they appear."

Click Contact.

> "Address, map, hours, WhatsApp button, contact form. Everything someone needs to walk into the studio or message you."

## 7. Technical proof (60 seconds)

Open DevTools → Lighthouse → run on home (have it pre-run if possible).

> "Performance scores: 95+, Accessibility 98, SEO 100. These are above what most large brands hit. The site is fast on slow connections too — let me show you on throttled 3G."

DevTools → Network → throttle to "Slow 3G" → hard refresh.

> "Even on terrible connection, content appears within a couple of seconds."

## 8. Wrap (60-90 seconds)

> "So to recap. The site does:
> - Showcases your dresses with proper photography and SEO
> - Lets customers book fittings online — same flow as the app
> - Mock e-commerce checkout — real payments are a Phase 2 add-on when you're ready
> - Reviews, blog content for Google traffic, contact integration
>
> Next steps:
> - You both review and tell me anything you want changed
> - I migrate the domain from Webador — that's a 30-minute change
> - Site goes live officially
> - Then we talk about adding real Stripe payments if and when you want
>
> Any questions?"

## Common questions — prepared answers

| Q | A |
|---|---|
| **How much to run?** | "Hosting is free on Vercel for our traffic level. Supabase is the £20/month you're already paying. Domain stays at whatever you pay Webador currently. No new monthly costs from the website itself." |
| **Can Steffi edit dresses?** | "Through the mobile app — add a dress, it appears on the website within a minute. No code changes needed." |
| **If it breaks?** | "Vercel is 99.99% uptime. If something does break, that's what the monthly maintenance covers — I'm on it." |
| **How will people find it?** | "Three ways: Google searches (the SEO is set up properly for Hounslow + wedding searches), your Instagram bio link, and walk-ins seeing your storefront and looking you up. Plus I'll set up Google Search Console for you so you can see traffic." |
| **Real payments — when?** | "Two to three weeks of work for proper Stripe integration. I'll quote separately when you're ready. We can pick a launch date that works." |
| **How long until it's live on the actual domain?** | "Two days from your sign-off. Domain change takes 24 hours to propagate fully — I'll do it on a quiet day so existing site stays up during the switch." |
| **What about the existing Webador site?** | "Stays live until we cut over. Once we switch DNS, it disappears — the URL goes to the new site instead." |
| **Mobile app?** | "Already built — Steffi has it on her iPad. The website connects to the same data. Booking on website → appears in app. New product in app → appears on website." |

## Questions to NOT answer in the room

- Final pricing for new features → "I'll send a written quote tonight"
- Whether you can add X feature → "Let me check, I'll come back with options"
- Anything they push on for a discount → "Let me look at the full picture and come back"

You don't have to commit to anything in the room. The goal of the demo is **approval to launch what's there**, not signing up for new scope.

## After the demo

Same day, send a follow-up WhatsApp:

> "Thanks for the time today. Quick summary + next steps coming over email tonight."

Within 24 hours, email:
- One-paragraph summary of what was approved
- Date for launching
- What you need from them (final approval, content for journal, any photos to add)
- A reminder of the pricing already agreed
- Anything that came up as new scope (with "will quote separately")

## If they don't approve on the spot

That's fine. They might want to think it over or ask other questions.

- "Take your time, look at the URL whenever you want — here's the link to bookmark"
- Set a follow-up: "Should we sync again Friday?"
- Don't push. Confidence > pressure.

## If they want major changes

- "Let me make a note of all of these, I'll send a written plan with what's changing and how long each takes"
- Don't agree on the spot to anything that wasn't in the original scope
- Small tweaks (copy edits, photo swaps): free, included
- New features: separate quote

## Confidence checklist

Walk in knowing:
- The site works at 375px and 1920px
- Every page loads in under 3 seconds on 4G
- Zero console errors anywhere
- All forms submit successfully and trigger emails
- The mobile app picks up bookings in realtime
- You've personally clicked every link and CTA

If any of the above isn't true, postpone the demo by one day. A polished demo is worth waiting for.
