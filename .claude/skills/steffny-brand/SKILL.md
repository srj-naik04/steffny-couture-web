---
name: steffny-brand
description: Use this skill whenever working on any user-facing aspect of the Steffny Couture website — writing UI copy, error messages, page content, choosing colours, styling components, picking icons, selecting fonts, or making any visual or tonal decision. Also use when reviewing code with hardcoded strings, colour values, or font references. Enforces the brand voice, palette, typography, currency/date formatting, and motion philosophy across the website. Mirrors the mobile app's brand skill but with web-specific patterns.
---

# Steffny Couture Brand — Web

This skill is the single source of truth for everything brand-related on the website. It mirrors the mobile app's brand skill — consistency across platforms is the entire point.

If you find yourself making a visual or tonal choice, this file overrides any default Tailwind / Next.js convention.

## Voice & Tone

**Voice:** Warm but refined. Confident, never apologetic. We are a London couture studio, not a Silicon Valley startup.

### Core rules (non-negotiable)
- **No exclamation marks anywhere.** Not in headlines, not in success messages, not in errors.
- **No "Oops!", "Yay!", "Whoops".** Calm confidence.
- **No emoji in UI copy.** Period.
- **British English.** "colour", "favourite", "centre", "personalise". `en-GB` lang attribute.
- **Sentence case for buttons and headings.** "Book a fitting" not "Book A Fitting".
- **Active voice.** "We'll be in touch" not "You will be contacted".
- **Address the reader as "you".** Never "users" or "customers" in copy.
- **No corporate-speak.** Banned: "leverage", "ecosystem", "seamless", "innovative".

### Voice examples for web specifically

| ❌ Don't write | ✅ Do write |
|---|---|
| "Welcome to our amazing site!" | "Welcome to Steffny Couture." |
| "Click here to learn more" | "See how we work" |
| "Sign up for our newsletter!" | "Stay in touch" |
| "Submit" | "Send", "Save", "Book", "Order" |
| "Error: Invalid email" | "That email doesn't look right." |
| "Sorry, page not found!" | "We couldn't find that page." |
| "🎉 Order placed successfully!" | "Your order is in." |
| "Loading..." | "Just a moment" (or skeleton) |
| "Featured products" | "New arrivals" / "From the studio" |
| "Hottest sellers" | "Pieces we love" |

### Page-specific tone

**Home hero** — single statement of who we are. No question, no exclamation.
```
"Elegance, made in London."
"Crafted dresses, bespoke alterations."
"Dresses for the moments that matter."
```

**About** — first-person plural ("we"), human warmth, specific details (Hounslow studio, Steffi's hands, hand-finished seams).

**Product descriptions** — sensory and specific. Talk about fabric, drape, occasion. Avoid "amazing", "stunning", "perfect".
```
✅ "Soft baby pink with a hand-finished bodice. Long sleeves, full-length. Made for spring weddings and garden ceremonies."
❌ "Amazing pink dress! Perfect for any occasion!"
```

**Calls to action** — what the action will do, not generic.
```
"Book a fitting"      ← good (specific outcome)
"Get in touch"        ← good (clear, warm)
"View dress"          ← good (action + object)
"Click here"          ← banned
"Learn more"          ← weak, replace with specific verb
```

---

## Colour Palette

**Source of truth:** `/constants/brand.ts` → exposed via `/tailwind.config.ts`. Never invent colours.

```ts
ivory:        '#FAF7F2'   // bg-ivory — body background
surface:      '#FFFFFF'   // bg-surface — cards, modals
surfaceAlt:   '#F4EFE8'   // bg-surfaceAlt — inputs, raised sections

rose:         '#7C2D3E'   // PRIMARY — buttons, links, focus rings
roseDark:     '#5A1F2C'   // hover state on rose
roseSoft:     '#F2D9DE'   // tonal badges, hover backgrounds

gold:         '#C9A961'   // accents, premium markers
goldSoft:     '#F5EBD2'

ink:          '#1F1B1A'   // text-ink — primary text
inkMuted:     '#5C5551'   // text-inkMuted — secondary
inkSubtle:    '#9A9089'   // text-inkSubtle — captions

success:      '#3F6E4A'
warning:      '#B8741A'
danger:       '#9B2C2C'
info:         '#3A5878'

border:       '#E8E0D7'
borderStrong: '#D4C8BA'
```

### Web-specific usage rules
- **Page background:** `bg-ivory` on `<body>`, never pure white
- **Card / section bg:** `bg-surface` with `border border-border`
- **Hero overlay on dark images:** rose with 60% opacity → `bg-rose/60`
- **Primary CTA:** `bg-rose text-ivory hover:bg-roseDark`
- **Secondary CTA:** `bg-surface text-ink border border-borderStrong hover:bg-surfaceAlt`
- **Ghost button (in hero / on image):** `bg-transparent text-ivory border border-ivory/30 hover:bg-ivory/10`
- **Links in body text:** `text-rose underline underline-offset-4 hover:text-roseDark`
- **Focus rings:** `focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2`

### Forbidden
- ❌ `text-blue-600` (or any Tailwind default colour)
- ❌ `#000000` pure black — `text-ink` is our black
- ❌ Gradients on buttons (flat colour only)
- ❌ Drop shadows without a 1px border in the same family
- ❌ Box-shadow with rgba(0,0,0,...) — use `shadow-sm` / `shadow-md` only

---

## Typography

### Font loading
```ts
// app/layout.tsx
import { Fraunces, Inter } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-fraunces',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

// Apply: <html className={`${fraunces.variable} ${inter.variable}`}>
```

```ts
// tailwind.config.ts
fontFamily: {
  display: ['var(--font-fraunces)', 'Georgia', 'serif'],
  body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
}
```

### When to use which
- **Fraunces** → hero h1, section h2, card titles, product names, big prices, the brand wordmark
- **Inter** → everything else
- **Never mix more than these two fonts**
- **Never use Fraunces below 18px** — loses its character
- **Never use Inter above 32px** — loses its personality

### Web type scale (more generous than mobile)
```
text-hero       72/80    Fraunces 700    Desktop hero h1
text-hero-sm    44/52    Fraunces 700    Mobile hero h1 (≤ md breakpoint)
text-display    48/56    Fraunces 700    Section h2 desktop
text-display-sm 32/40    Fraunces 700    Section h2 mobile
text-title      28/36    Fraunces 600    Card titles
text-headline   20/28    Inter 600       Subheadings
text-body-lg    18/28    Inter 400       Lede paragraphs
text-body       16/26    Inter 400       Default body
text-small      14/22    Inter 400       Captions
text-label      12/16    Inter 500       Uppercase labels, tracking-widest
```

### Rules
- Hero h1: always Fraunces 700, paired with a thin gold horizontal rule below
- Section h2: always Fraunces 700, optionally with a small uppercase Inter label above
- Body paragraphs: max-width 65ch (`max-w-prose`) for readability
- Buttons: Inter 500, sentence case, slight letter-spacing
- All-caps labels: Inter 500, `tracking-widest` (0.1em)

---

## Formatting

### Currency
- Always `£` prefix, two decimals: `£420.00`
- Free / inquiry-only: "Price on enquiry"
- Range: `£279 – £420` (en-dash with spaces)

### Phone numbers
- Always `+44 7834 877992` (international + UK mobile)
- Tap-to-call: `tel:+447834877992` (no spaces)

### Dates
- Short (in cards): `Wed 21 May 2026`
- Long (headers, blog posts): `Wednesday, 21 May 2026`
- Relative for blog (< 7 days): `3 days ago`, beyond that switch to short

### Times
- 12-hour with space + AM/PM: `2:30 PM`
- Range: `2:30 PM – 4:00 PM`

### Address
Always exactly: `255 High Street, Hounslow, London TW3 1EA`

### Studio hours (always formatted like this in copy)
```
Monday to Friday    9:30 am – 7:00 pm
Saturday            10:00 am – 7:00 pm
Sunday              11:00 am – 6:00 pm
```

---

## Web-Specific Components

### Hero pattern
```tsx
<section className="relative min-h-[80vh] flex items-center">
  {/* Background image with rose overlay */}
  <div className="absolute inset-0">
    <Image src="/assets/hero/main.jpg" fill priority className="object-cover" alt="" />
    <div className="absolute inset-0 bg-rose/40" />
  </div>

  {/* Content */}
  <div className="relative container mx-auto px-6 lg:px-12 py-24">
    <span className="text-label uppercase tracking-widest text-ivory/80">
      Crafted in London
    </span>
    <h1 className="font-display text-hero-sm md:text-hero text-ivory mt-4 max-w-4xl">
      Dresses for the moments that matter.
    </h1>
    <div className="mt-4 h-px w-24 bg-gold" />
    <p className="font-body text-body-lg text-ivory/90 mt-8 max-w-xl">
      Custom-made and ready-to-wear couture, hand-finished in our Hounslow studio.
    </p>
    <div className="mt-12 flex flex-wrap gap-4">
      <Button variant="primary">View dresses</Button>
      <Button variant="ghost">Book a fitting</Button>
    </div>
  </div>
</section>
```

### Section pattern
```tsx
<section className="py-20 lg:py-32 bg-ivory">
  <div className="container mx-auto px-6 lg:px-12">
    <div className="max-w-3xl mx-auto text-center">
      <span className="text-label uppercase tracking-widest text-inkMuted">
        From the studio
      </span>
      <h2 className="font-display text-display-sm md:text-display text-ink mt-4">
        New arrivals
      </h2>
      <div className="mt-4 h-px w-16 bg-rose mx-auto" />
      <p className="font-body text-body-lg text-inkMuted mt-6">
        Our latest pieces, ready to wear or made to measure.
      </p>
    </div>
    {/* content */}
  </div>
</section>
```

### Product card pattern
```tsx
<Link
  href={`/dresses/${product.slug}`}
  className="group block"
>
  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-surfaceAlt">
    <Image
      src={product.image}
      alt={product.name}
      fill
      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
      className="object-cover transition-transform duration-700 group-hover:scale-105"
    />
  </div>
  <div className="mt-4 space-y-1">
    <h3 className="font-display text-title text-ink">{product.name}</h3>
    <p className="font-body text-body text-inkMuted">{formatGBP(product.price)}</p>
  </div>
</Link>
```

### Button system
```tsx
// Primary
<button className="bg-rose text-ivory font-body font-medium text-base
                   px-8 py-3.5 rounded-full
                   hover:bg-roseDark transition-colors duration-200
                   focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2">
  Book a fitting
</button>

// Secondary
<button className="bg-surface text-ink font-body font-medium text-base
                   px-8 py-3.5 rounded-full border border-borderStrong
                   hover:bg-surfaceAlt transition-colors duration-200">
  See details
</button>

// Ghost (on image / dark bg)
<button className="bg-transparent text-ivory font-body font-medium text-base
                   px-8 py-3.5 rounded-full border border-ivory/30
                   hover:bg-ivory/10 transition-colors duration-200">
  Learn more
</button>
```

---

## Iconography

- **Library:** `lucide-react` only (web counterpart to `lucide-react-native` in mobile)
- **Stroke width:** 1.75 default, 2 for icons ≤ 16px
- **Size:** match text x-height: 16 with `text-sm`, 20 with `text-base`, 24 with `text-lg`+
- **Colour:** `currentColor` — inherits from parent text colour
- **Aria:** decorative icons get `aria-hidden="true"`, functional icons get `aria-label`

---

## Imagery

- All product imagery is real Steffny Couture work — never stock photos
- Image ratios:
  - Hero: 16:9 desktop, 4:5 mobile
  - Product card: 3:4 (portrait, dresses look better tall)
  - Product detail main: 3:4
  - About section: 4:3 or 1:1
  - Journal hero: 16:9
- Always `next/image` with proper `sizes` attribute
- Loading: `priority` on above-fold images only
- Placeholder: blurDataURL on all product images
- Alt text: descriptive, not "image of dress" → "Maroon long evening gown with full sleeves"

---

## Motion Philosophy

Animation reinforces brand confidence. It does not entertain.

- **Page transitions** — subtle fade + 8px Y-translate, 400ms ease-out
- **Section reveals** — fade + 20px Y-translate, triggered by IntersectionObserver, 400ms ease-out
- **Stagger children** — 80ms between items, max 5 items staggered (then cap)
- **Image hover** — `scale-105` on the image inside an `overflow-hidden` parent, 700ms
- **Button hover** — `bg-roseDark` colour transition only, no scale
- **Card hover** — subtle elevation via `shadow-md`, no transform
- **Mobile nav drawer** — slide from right, 300ms ease-out
- **Modal / sheet** — fade backdrop + scale-95-to-100 + 8px Y, 300ms

### Hard rules
- Respect `prefers-reduced-motion` — disable transforms, keep opacity
- Never animate `width` / `height` — use `transform: scale()` or `max-height`
- Never animate on scroll for more than the hero parallax (one element max)
- Never use spring physics on functional UI — only delight moments (success check on order placed)
- No infinite loops except hero subtle Ken Burns effect (optional)

---

## Hard Bans

These will make the site feel cheap. They override anything else.

- ❌ Emoji in UI copy
- ❌ Exclamation marks
- ❌ All-caps shouting ("ERROR", "SUCCESS")
- ❌ Stock SaaS gradients (purple-blue, sunset, etc.)
- ❌ Glassmorphism (frosted glass effects) — too 2021
- ❌ Drop shadows without paired border
- ❌ Material Design ripple effects
- ❌ Bootstrap-default blue (#007BFF) — links are rose
- ❌ "Submit" on buttons — always describe the action
- ❌ "Click here" — describe the destination/action
- ❌ Lorem ipsum in committed code
- ❌ Stock photos — only real Steffny Couture imagery
- ❌ Auto-playing video with sound
- ❌ Pop-up newsletter modals on first visit
- ❌ "Wait, don't leave!" exit-intent popups
- ❌ Cookie banners that aren't strictly necessary (we use no tracking cookies)

---

## Quick Decision Tree

When you're styling something and not sure:

1. **Is it a primary action?** → `bg-rose text-ivory rounded-full px-8 py-3.5`
2. **Is it a section?** → `py-20 lg:py-32` vertical, `container mx-auto px-6 lg:px-12` horizontal
3. **Is it a card?** → `bg-surface border border-border rounded-lg p-6`
4. **Is it a heading?** → `font-display` + appropriate size from scale
5. **Is the copy too long?** → cut it in half
6. **About to add an emoji?** → don't
7. **About to add `!`?** → don't
8. **Using a hex code inline?** → stop, use the brand token
9. **About to use `<img>`?** → switch to `next/image`

---

## Reference

- Brand tokens: `/constants/brand.ts`
- Tailwind config: `/tailwind.config.ts`
- Sibling project (mobile app): `E:/steffny-couture/` — same brand, different platform
- Existing site (for content reference only): `https://www.steffnycouture.co.uk/`
- Master spec: `/CLAUDE.md`
