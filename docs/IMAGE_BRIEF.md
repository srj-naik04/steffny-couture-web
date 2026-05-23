# Image brief — Steffny Couture web

Authoritative rules for selecting, placing, and crediting imagery across the website. Read this before placing any image in a hero, spotlight, about, or featured slot.

## The owner-spotlight rule (non-negotiable)

**Steffi is the founder and the brand.** When her face or hands are in a photograph, that photograph carries the brand. These images must be given visual priority — homepage hero, about-page hero, contact-page founder card, journal author headshot if/when needed.

### Confirmed photos of Steffi

| File | Where Steffi appears | Recommended placement |
|---|---|---|
| [public/assets/hero/bride-bangles-portrait.jpg](../public/assets/hero/bride-bangles-portrait.jpg) | Steffi (owner) — adjusting bangles on a bride | Home hero (primary candidate), about-page hero, services/custom-bridal hero |
| [public/assets/hero/bride-bouquet-detail.jpg](../public/assets/hero/bride-bouquet-detail.jpg) | Steffi (owner) — with bouquet detail | Home hero alternate, about-page spotlight, services/bridesmaid hero |

These are the **only two confirmed founder photos** in the asset pool right now. Treat them like crown jewels: never crop Steffi out, never overlay text directly over her face, never use them as decorative background tiles.

### Placement rules

1. **Home hero** — must feature one of the two Steffi photos as the primary frame. Other hero candidates (`bride-maroon-*`, `bride-white-*`, etc.) are secondary frames only — use them in a hero slider's later slides, in a "Recent work" strip, or on the dresses grid as collection bait.
2. **About page** — must open with a Steffi photo. The "Meet Steffi" or "Crafted in London" section uses the second Steffi photo as a spotlight.
3. **Contact page** — founder card with the second Steffi photo (small, ~120-160px) next to her name and signature line.
4. **Custom bridal service page** — Steffi photo as the hero, framing the story of the consultation process.
5. **Journal author byline** — if/when a Steffi headshot is added, use it on every post she "writes". Until then, the brand monogram logo stands in.
6. **Open Graph / social cards** — primary OG image for the home page must be a Steffi photo. People click on faces.

### What NOT to do with Steffi photos

- Don't blur them as background images
- Don't crop tight to her face for decorative use without her consent (we don't have it; treat as full-frame editorial)
- Don't put them behind text overlays without a darkening gradient that preserves her visibility
- Don't reuse them so often they lose impact — 3-5 placements across the whole site, not on every page

### Other bridal images (Steffi NOT in frame)

All other `public/assets/hero/bride-*.jpg` files are model/customer shots from the existing site, used with implicit permission carried over from the previous website. These are fine for:
- Dresses catalogue spotlights and collection covers
- Journal post hero images
- Hero slider secondary slides
- Reviews-page accent imagery
- Decorative tiles in editorial sections

## About-page placeholders

The three `placeholder-*.jpg` files in `public/assets/about/` are Pexels stock used as scaffolding. They MUST be replaced before launch (Phase 9). The phase-builder for Phase 3 should:
- Use them in the layout to establish design
- Mark them with a `data-placeholder="true"` attribute or wrap in a `<Placeholder>` component so they're easy to find at swap time
- List them in `PROGRESS.md` "Open questions" with a clear ask: "Final about-page photos — Steffi to provide 3 studio/process shots"

## Image hygiene (every image, every phase)

- Always `next/image`, never raw `<img>`
- Always include meaningful `alt` text — for Steffi photos, the alt should name her: `"Steffi adjusts a bride's bangles before a fitting at the Hounslow studio"`. Not `"woman with bride"`.
- Always include `sizes` for responsive layouts
- Always include `blurDataURL` for above-the-fold (already generated in `data/optimised-images.json`)
- Hero images: `priority={true}` and `fetchPriority="high"`

## Audit checklist (consistency-checker + standards-auditor must run these)

- [ ] Home hero contains a Steffi photo (`bride-bangles-portrait.jpg` or `bride-bouquet-detail.jpg`)
- [ ] About page opens with a Steffi photo
- [ ] Contact page founder card contains a Steffi photo
- [ ] Every Steffi photo has alt text that names her
- [ ] No Steffi photo is used as a blurred background
- [ ] OG image for `/` is a Steffi photo
- [ ] About-page placeholders are clearly marked and listed in PROGRESS.md open questions
