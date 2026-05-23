# Demo script — Steffny Couture website

**Audience:** Rohan (owner/decision-maker)
**Duration:** 5–7 minutes
**Demo URL:** `http://localhost:3000` (local) or the Vercel preview URL once deployed
**Presenter notes** are in *italics* throughout.

---

## Before you start (5 minutes before)

1. Open the demo URL in a **fresh incognito window** — confirms it works without your cache.
2. Clear the cart: open the cart drawer, remove any items from a previous session.
3. Close all other browser tabs — keep the screen clean.
4. Have a second device or the Steffny Couture mobile app open and logged in as Steffi (if demonstrating the real-time booking sync).
5. Keep the browser zoom at 100%.

**Known-state checkpoints:**
- Cart is empty.
- No booking draft is saved (open `/book` briefly to verify wizard starts at step 1).
- The home hero image loads immediately (it is pre-loaded with `priority`).

---

## Section 1 — Home page intro (approx. 30 seconds)

*Land on the home page. Say nothing for 2–3 seconds. Let the hero settle.*

- Point out the hero image: "This is Steffi — the founder — adjusting a bride's bangles. Every piece on this site traces back to her hands."
- Slowly scroll down, pausing on each section:
  - **Featured dresses strip** — "A few pieces from the current collection."
  - **About teaser** — "This section tells the brand story — I'll show you the full About page in a moment."
  - **Services preview** — "Three service lanes: alterations, custom bridal, bridesmaid."
  - **Reviews strip** — "Real customer testimonials. We have 14 live reviews."
  - **Instagram gallery** — "A static pull from the feed for now. Auto-pull from Instagram is a post-launch task."
  - **Journal teaser** — "Three published posts targeting Hounslow and South Asian bridal searches."

*Do not rush. This scroll is your 30-second brand statement.*

---

## Section 2 — About and services (approx. 60 seconds)

Navigate to `/about`.

- Point to the Steffi hero photo at the top: "This is the about-page anchor — Steffi's photo is used intentionally here because the brand IS Steffi."
- Scroll briefly through the narrative sections.

*Note for presenter: the three gallery photos below the narrative are Pexels placeholders. Steffi's real studio shots go here before launch. The placeholders are clearly marked in code with `data-placeholder="true"`.*

Navigate to `/services`.

- Show the three service cards (Alterations, Custom Bridal, Bridesmaid).
- Click **About alterations** to open the alterations page.
- Point to: intro copy, "What we do" checklist, numbered process steps, FAQ accordion.
- Navigate back and briefly show the other two service pages.

---

## Section 3 — Dress catalogue (approx. 90 seconds)

Navigate to `/dresses`.

- "This is the full dress collection — ten pieces at launch, with more to follow once Steffi confirms her inventory."
- On the left sidebar: show the filter chips (Category, Colour, Occasion) and the price slider.
- Click a colour chip to filter — *note the grid updates instantly with no page reload*.
- Clear the filter.
- Click on the **Pink mauve mermaid** dress (or any product card).

On the product detail page:

- Show the image carousel: "Multiple angles. Click an arrow or a thumbnail to switch."
- Show the variant selector: "Size and colour options. The price updates if variants are priced differently."
- Click **Add to cart** — *watch the cart icon in the header update with a count badge*.

*Presenter note: the "Add to cart" button shows a brief "Added" confirmation — pause so Rohan can see it.*

---

## Section 4 — Cart and mock checkout (approx. 90 seconds)

Click the **cart icon** in the header.

- The cart drawer slides in from the right.
- Point to the quantity stepper and the item thumbnail.
- Click **View cart** (or proceed directly to checkout).

On the `/cart` page:

- Show the order summary and delivery note.
- Click **Proceed to checkout**.

On the `/checkout` page:

*Pause on the yellow demo banner before filling in any details.*

- Say: "This is the demo checkout. In production this will connect to Stripe — for today it's a safe sandbox so you can see the full flow without any real payment."
- Walk through the four steps:
  1. **Contact** — fill in any name/email/phone.
  2. **Delivery** — fill in any address.
  3. **Payment** — point to the mock card fields. "Nothing is stored, nothing is charged."
  4. **Review** — confirm the summary, click **Place order**.

On the `/checkout/confirmation` page:

- Read the SC-XXXXXX order reference aloud.
- Point to the notice: "Steffi will be in touch via WhatsApp within one working day to confirm sizing and final pricing."
- "Your card has not been charged" reassurance is explicit on screen.

*This entire flow takes under 60 seconds once you know the steps.*

---

## Section 5 — Fitting and alteration booking (approx. 60 seconds)

Navigate to `/book`.

- "This is the same booking flow the mobile app uses — it writes to the same database."
- Walk through the six steps at a brisk pace:
  1. **Service type** — select "Alteration".
  2. **Photos** — "Customers can upload photos of their garment here. Optional."
  3. **Details** — type a brief description, e.g. "Wedding dress hem needs taking in by 5 cm."
  4. **Schedule** — pick any available date and time slot.
  5. **Contact** — fill in name, email, phone.
  6. **Review** — confirm and submit.

- On the confirmation page, point out the SC-XXXXXX booking reference.

*If the mobile app is open on a second device and Supabase is live: switch to the app and show the booking appearing in Steffi's dashboard within a few seconds. This moment — seeing the web booking appear instantly in the mobile app — is the most powerful demo moment. Pause for it.*

---

## Section 6 — Reviews and journal (approx. 30 seconds)

Navigate to `/reviews`.

- "Fourteen verified reviews. Each goes through a moderation step before appearing — customers submit via the form at the bottom of this page."
- Scroll past a few cards.

Navigate to `/journal`.

- "Three published posts targeting high-intent searches — 'how to choose a wedding dress in Hounslow', 'bridal alterations timeline', 'South Asian bridal and bridesmaid wear'. These are the SEO foundation."
- Click one post title to open it. Point to the reading time and related posts at the bottom.

---

## Section 7 — Close (approx. 15 seconds)

Navigate to `/contact`.

- "All roads lead here: address, hours, map, WhatsApp button, and a contact form. This page also has LocalBusiness structured data for Google."
- Point to the WhatsApp button: "Tapping this on a phone opens a WhatsApp conversation directly with Steffi."

End with: "The positioning is Hounslow — a couture studio in the heart of West London's South Asian wedding market. Every page is built around that identity."

*Stop. Ask: "What's your reaction?"*

Do not pitch. Do not apologise for anything. Let Rohan talk.

---

## After the demo

- If Rohan wants changes, note them on paper or in a shared doc. Categorise immediately: small (free), medium (quoted separately), large (formal scope).
- Send a follow-up WhatsApp within 2 hours summarising what was covered and the agreed next step.
- Do not quote pricing in the same session as the demo.

---

## Known open items before public launch

These are engineering-complete but need Steffi's sign-off before the site goes live:

| Item | Status | Action needed |
|---|---|---|
| Home hero image | `bride-bangles-portrait.jpg` confirmed | Steffi to verbally confirm on demo day |
| About-page gallery photos | Three Pexels placeholders | Steffi to supply 3 real studio/process shots |
| About-page copy | Content-writer draft live | Steffi to voice-review |
| Real phone/email/WhatsApp | Sourced from `constants/brand.ts` | Steffi to confirm values are current |
| Custom bridal hero photo | `bride-maroon-arch.jpg` (non-Steffi) | Steffi to decide if she wants her photo here |
| Colour-swatch palette | Approximate hex values | Steffi to review chips on demo day |
| Supabase provisioning | Supabase service-role secret (server-only env var) not supplied | Must be provided before live seed and bookings |
| Booking photo uploads | Silently fail without live Supabase | Will resolve once service-role key is supplied |
| Instagram auto-pull | Static grid | Needs Instagram Business account token post-launch |
| Press features | Empty array | Steffi to confirm if any press coverage exists |

---

*This script was written for the Phase 8 demo prep. Update it after the demo with any agreed changes.*
