# Design System — Web

This document is the visual reference. For voice/tone rules, see the `steffny-brand` skill.

## Tokens

### Colour palette

```
ivory          #FAF7F2    Page background
surface        #FFFFFF    Cards, modals
surfaceAlt     #F4EFE8    Input backgrounds, raised sections

rose           #7C2D3E    PRIMARY — buttons, focus rings, accents
roseDark       #5A1F2C    Hover state
roseSoft       #F2D9DE    Badges, hover backgrounds

gold           #C9A961    Accents, dividers
goldSoft       #F5EBD2    Subtle highlights

ink            #1F1B1A    Primary text
inkMuted       #5C5551    Secondary text
inkSubtle      #9A9089    Captions, hints

success        #3F6E4A    Confirmation states
warning        #B8741A    Caution
danger         #9B2C2C    Errors
info           #3A5878    Informational

border         #E8E0D7    Default borders
borderStrong   #D4C8BA    Emphasised borders
```

### Typography scale

| Token | Size / Line height | Weight | Use |
|---|---|---|---|
| `text-hero` | 72 / 80 | 700 Fraunces | Desktop hero h1 |
| `text-hero-sm` | 44 / 52 | 700 Fraunces | Mobile hero h1 |
| `text-display` | 48 / 56 | 700 Fraunces | Section h2 desktop |
| `text-display-sm` | 32 / 40 | 700 Fraunces | Section h2 mobile |
| `text-title` | 28 / 36 | 600 Fraunces | Card titles |
| `text-headline` | 20 / 28 | 600 Inter | Subheadings |
| `text-body-lg` | 18 / 28 | 400 Inter | Lede paragraphs |
| `text-body` | 16 / 26 | 400 Inter | Default body |
| `text-small` | 14 / 22 | 400 Inter | Captions |
| `text-label` | 12 / 16 | 500 Inter | Uppercase labels |

### Spacing scale

Tailwind defaults — `0`, `1` (4px), `2` (8px), `4` (16px), `6` (24px), `8` (32px), `12` (48px), `16` (64px), `20` (80px), `24` (96px), `32` (128px).

Most-used:
- Card padding: `p-6 md:p-8`
- Section vertical: `py-16 md:py-24 lg:py-32`
- Container horizontal: `px-6 lg:px-12` (handled by container utility)
- Form field stacking: `space-y-6`
- Button: `px-8 py-3.5`

### Radii

```
rounded-sm     2px     Inline tags
rounded        4px     Small UI
rounded-md     6px     Input fields, small cards
rounded-lg     8px     Cards, images
rounded-xl     12px    Large cards, modals
rounded-2xl    16px    Hero containers
rounded-full   ∞       Buttons, avatars, pills
```

### Shadows (sparingly)

```
shadow-sm      Subtle elevation on cards
shadow-md      Hover state on interactive cards
shadow-lg      Modals, dropdowns
shadow-xl      Sticky headers when scrolled
```

Always paired with a 1px border in a similar tone. Never use shadow alone for separation.

## Components

### Button

```tsx
<Button variant="primary" size="md">Book a fitting</Button>
<Button variant="secondary" size="md">See details</Button>
<Button variant="ghost" size="md">Learn more</Button>
```

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| `primary` | rose | ivory | none | roseDark bg |
| `secondary` | surface | ink | borderStrong | surfaceAlt bg |
| `ghost` | transparent | ink | none | surfaceAlt bg |
| `ghost-on-image` | transparent | ivory | ivory/30 | ivory/10 bg |
| `link` | none | rose | none | underline |

| Size | Padding | Height | Font size |
|---|---|---|---|
| `sm` | px-5 py-2.5 | 40px | text-small |
| `md` | px-8 py-3.5 | 48px | text-body |
| `lg` | px-10 py-4 | 56px | text-body-lg |

All buttons: `rounded-full`, `font-medium`, `transition-colors`, `focus-visible:ring-2 focus-visible:ring-rose`.

### Card

```tsx
<article className="bg-surface border border-border rounded-lg p-6 md:p-8 hover:shadow-md transition-shadow">
  <h3 className="font-display text-title text-ink">Title</h3>
  <p className="mt-2 text-inkMuted text-body">Body</p>
</article>
```

### Input

```tsx
<div className="space-y-1.5">
  <label className="block text-label uppercase tracking-widest text-inkMuted">
    Email
  </label>
  <input
    className="block w-full h-12 px-4 bg-surfaceAlt rounded-lg
               text-body text-ink placeholder:text-inkSubtle
               border border-border focus:border-rose
               focus:ring-2 focus:ring-rose focus:ring-offset-2"
  />
</div>
```

### Badge / Tag

```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-label uppercase tracking-widest bg-roseSoft text-roseDark">
  New
</span>
```

### Section heading pattern

```tsx
<div className="text-center max-w-3xl mx-auto">
  <span className="text-label uppercase tracking-widest text-inkMuted">
    From the studio
  </span>
  <h2 className="font-display text-display-sm md:text-display text-ink mt-4">
    New arrivals
  </h2>
  <div className="mt-4 h-px w-16 bg-rose mx-auto" />
  <p className="text-body-lg text-inkMuted mt-6">
    Our latest pieces, ready to wear or made to measure.
  </p>
</div>
```

## Layout patterns

### Container

```tsx
<div className="container mx-auto px-6 lg:px-12">
  {/* max-width: 1280px, centered */}
</div>
```

### Section

```tsx
<section className="py-16 md:py-24 lg:py-32 bg-ivory">
  <div className="container">
    {/* content */}
  </div>
</section>
```

### Two-column

```tsx
<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
  <div>{/* text */}</div>
  <div>{/* image */}</div>
</div>
```

### Product grid

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</div>
```

## Motion

| Trigger | Duration | Easing | Notes |
|---|---|---|---|
| Hover (colour) | 200ms | ease-out | Tailwind `transition-colors` |
| Hover (image zoom) | 700ms | ease-out | `group-hover:scale-105` |
| Page transition | 400ms | ease-out | Framer Motion in template |
| Section reveal | 400ms | ease-out | IntersectionObserver via Framer |
| Stagger items | 80ms delay | ease-out | Cap at 6 visible |
| Modal/drawer enter | 300ms | ease-out | scale-95 → 100 + opacity |
| Modal/drawer exit | 250ms | ease-out | reverse |

Respect `prefers-reduced-motion`. See `framer-motion` skill.

## Imagery

- Always `next/image`
- Hero: 16:9 desktop, 4:5 mobile
- Product card: 3:4
- Product detail main: 3:4 with carousel
- About: 4:3 or 1:1
- Journal hero: 16:9
- Loading: `blur` placeholder with `blurDataURL`
- Above fold: `priority`
- Always `sizes` prop when `fill`

## Iconography

- `lucide-react` only
- Stroke width: 1.75 default
- Sizes: 16, 20, 24 (match text x-height)
- Colour: `currentColor`
- Decorative: `aria-hidden="true"`
- Functional: `aria-label`

## Hard bans

- ❌ Emoji in UI
- ❌ Exclamation marks
- ❌ All-caps for shouting
- ❌ Gradients on buttons
- ❌ Glassmorphism
- ❌ Stock photo aesthetic
- ❌ Pop-up newsletter modals
- ❌ Exit-intent pop-ups
- ❌ Cookie banners (we don't use tracking cookies)
- ❌ Auto-playing video with sound
- ❌ Tailwind default colours (`bg-red-500`, etc.)
- ❌ Hex codes inline
- ❌ `<img>` tags
- ❌ `<a>` for internal links

## Reference

- Constants source of truth: `/constants/brand.ts`
- Tailwind config: `/tailwind.config.ts`
- shadcn primitives: `/components/ui/`
- Mobile app's design system: `E:\steffny-couture\docs\DESIGN_SYSTEM.md` (parallel reference)
