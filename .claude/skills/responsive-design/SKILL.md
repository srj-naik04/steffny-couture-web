---
name: responsive-design
description: Use this skill whenever building or reviewing any UI component, page, or layout in the Steffny Couture website. Fires for any `.tsx` file in `/src/app/` or `/src/components/`, any layout decision, any decision about breakpoints, image sizes, or device-specific behaviour. Enforces mobile-first development, the required viewport tests (360, 640, 768, 1024, 1280, 1920px), touch target minimums, and the "user-friendly across all viewports" mandate from the master brief.
---

# Responsive Design — Mobile First, Always

The client's explicit requirement: **the website must be responsive and extremely user-friendly across all viewports.** Treat this skill as a hard contract.

## The 6 Required Test Widths

Every page, every component, must render correctly at:

| Width | Device | Why |
|---|---|---|
| **360px** | Small Android phones | The realistic floor — many users in Hounslow's South Asian community have entry-level Androids |
| **640px** | Larger phones (iPhone 12 Pro Max landscape, foldables) | Common phone landscape |
| **768px** | Tablets (iPad portrait) | Tablet-heavy audience for shopping |
| **1024px** | Tablets landscape / small laptops | Workplace browsing |
| **1280px** | Standard desktop | The "designer's monitor" default |
| **1920px** | Full HD desktop / large displays | Don't ignore — the layout can break here too |

If you tested on 1440px MacBook and called it done — that's one out of six. Untested.

## Mobile-First Discipline

Always write the mobile layout first. Add breakpoints to scale up. Never the reverse.

```tsx
// ✅ Good — mobile-first
<h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
  Couture, crafted in London.
</h1>

<div className="flex flex-col gap-4 md:flex-row md:gap-8 lg:gap-12">
  {/* stacked on mobile, side-by-side on tablet+ */}
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1 col mobile, 2 col small tablet, 3 col desktop */}
</div>

// ❌ Don't — desktop-first with mobile overrides
<h1 className="text-7xl md:text-5xl sm:text-3xl">
  ...
</h1>
```

### Why mobile-first matters

1. Users on small screens see the page render before resize logic runs — mobile-first means it's correct from the first paint
2. Forces minimal-viable-layout thinking — what's the most important thing to show?
3. Tailwind's responsive prefixes are mobile-first by design — going against the grain creates churn
4. 70%+ of website traffic in 2026 is mobile — that's your default audience

## Touch Targets

Every interactive element must be at least **44 × 44 pixels** of touch target — this is the WCAG and Apple HIG minimum.

```tsx
// ✅ Good — button is 44pt tall (h-11 = 44px), plenty of padding
<button className="h-11 px-6 ...">Book a fitting</button>

// ✅ Good — small icon button has padding that brings it to 44pt
<button className="p-2.5 rounded-full hover:bg-rose-soft">
  <X className="size-5" />
</button>

// ❌ Don't — icon button without enough hit area
<button>
  <X className="size-4" />
</button>
```

For dense UIs (e.g., a small caret on a navigation link), the **visible** element can be smaller, but the **interactive** area must still be 44pt. Use padding to expand the hit area beyond the visible bounds, or `::before` pseudo-elements.

Spacing between touch targets: minimum **8 pixels** so users don't tap the wrong one.

## Container Widths & Padding

Use the project's container utilities — never hardcode `max-w-7xl` etc.

```tsx
<div className="container-narrow">{/* 768px max, articles, forms */}</div>
<div className="container-prose">{/* 1024px max, content */}</div>
<div className="container">{/* 1280px max, standard marketing */}</div>
<div className="container-wide">{/* 1536px max, hero exceptions */}</div>
```

These have built-in responsive horizontal padding:
- Mobile: `px-5` (20px)
- Tablet: `px-6` to `px-8` (24-32px)
- Desktop: `px-12` (48px) on `container-wide`

Never let content touch the viewport edge on any screen size.

## Typography Responsive Scale

Always responsive. Use the project's mobile-first scale.

```tsx
// Hero
<h1 className="text-5xl md:text-6xl lg:text-7xl font-display">
  Couture, crafted in London.
</h1>

// Section heading
<h2 className="text-3xl md:text-4xl lg:text-5xl font-display">
  Our story
</h2>

// Body
<p className="text-base md:text-lg leading-relaxed">
  ...
</p>

// Subtle small text
<p className="text-sm md:text-base text-ink-muted">
  ...
</p>
```

Body text on desktop can step up to `text-lg` (18px) for better readability on wider screens. Don't go bigger — that's blog territory.

## Image Responsiveness

`next/image` handles most of it, but you must give it the right `sizes`:

```tsx
{/* Full-width hero */}
<Image src="..." alt="..." fill priority sizes="100vw" className="object-cover" />

{/* 3-col grid on desktop, 2-col tablet, 1-col mobile */}
<Image src="..." alt="..." width={800} height={1200}
       sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
       className="aspect-[2/3] object-cover" />

{/* Inline article image, max ~768px */}
<Image src="..." alt="..." width={1024} height={576}
       sizes="(min-width: 768px) 768px, 100vw"
       className="aspect-video object-cover rounded-2xl" />
```

Without `sizes`, Next.js serves the same resolution to every device, wasting bandwidth on mobile.

## Layout Patterns (the standards)

### Two-column → single-column on mobile

```tsx
<section className="container py-16 md:py-24">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
    <div>
      <Image src="..." alt="..." width={800} height={1000} className="aspect-[4/5] rounded-2xl object-cover" />
    </div>
    <div className="space-y-4">
      <p className="text-xs font-medium tracking-widest uppercase text-ink-muted">Our work</p>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display">Every dress, made by hand</h2>
      <p className="text-base md:text-lg text-ink-muted leading-relaxed">...</p>
    </div>
  </div>
</section>
```

### Card grids

```tsx
<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
  {items.map((item) => <li key={item.id}>...</li>)}
</ul>
```

For dress catalogues specifically — 2 cols on mobile is fine even at 360px (gives a richer browsing feel). Single-column on mobile is for blog/news.

### Horizontal scroll on mobile, grid on desktop

For featured strips:

```tsx
<div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6">
  {featured.map((p) => (
    <article key={p.id} className="snap-start flex-shrink-0 w-[80%] sm:w-[60%] md:w-auto">
      ...
    </article>
  ))}
</div>
```

Add `scrollbar-hide` utility class for clean scroll on mobile.

### Sticky header

```tsx
<header className="fixed top-0 inset-x-0 z-50">
  <nav className="container flex items-center justify-between h-16 md:h-20">
    <Logo />
    <DesktopNav className="hidden md:flex" />
    <MobileMenuButton className="md:hidden" />
  </nav>
</header>
```

Add page-level top padding to compensate: `<main className="pt-16 md:pt-20">`.

## Mobile Menu Pattern

```tsx
'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="md:hidden p-2.5 -mr-2.5"
      >
        <Menu className="size-6" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-ivory shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between h-16 px-5">
                <Logo />
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2.5 -mr-2.5">
                  <X className="size-6" />
                </button>
              </div>
              <nav className="px-5 py-8 space-y-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-2xl font-display"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

Mobile menu must:
- Lock body scroll when open
- Close on outside tap (backdrop)
- Close on route change (handled by `onClick` on Link)
- Have a visible close button
- Support keyboard (Escape to close — add via `useEffect`)

## Form Inputs

Mobile keyboards need help:

```tsx
<input
  type="email"
  inputMode="email"
  autoComplete="email"
  autoCapitalize="off"
  spellCheck="false"
  className="..."
/>

<input
  type="tel"
  inputMode="tel"
  autoComplete="tel"
  className="..."
/>

<input
  type="text"
  inputMode="numeric"  // for postcodes
  autoComplete="postal-code"
  pattern="[A-Z0-9 ]+"
  className="..."
/>
```

Inputs minimum height **48px** on mobile (`h-12`). Easier to tap.

## Tables → Cards on Mobile

Tables don't fit on phones. Convert to cards:

```tsx
{/* Desktop table */}
<table className="hidden md:table w-full">
  ...
</table>

{/* Mobile cards */}
<ul className="md:hidden space-y-3">
  {rows.map((row) => (
    <li key={row.id} className="bg-surface rounded-xl p-4 border border-border">
      ...
    </li>
  ))}
</ul>
```

## Performance on Mobile

The site must feel fast on a £200 Android, not just a M3 MacBook.

- **Image dimensions:** never serve more than 2x the displayed size
- **Avoid `100vw` images** as much as possible — use container-aware sizing
- **Lazy load** everything below the fold (default with `next/image`)
- **Defer heavy JS** — code-split large client components with `dynamic()`
- **No framer-motion** above-the-fold on mobile if you can help it — it's 50kb of JS

## Testing Workflow

Before any PR / commit:

1. **DevTools at 360px** — does it render? scroll? read?
2. **DevTools at 768px** — does the layout transition cleanly?
3. **DevTools at 1280px** — does it use the space well, not look stretched?
4. **DevTools at 1920px** — does the layout cap at a sensible max-width, not stretch to fill?
5. **Real iPhone** if you have one, or BrowserStack
6. **Real Android** at least once per phase
7. **Keyboard only** — can you Tab through the whole page?
8. **Screen reader briefly** — VoiceOver or NVDA — does the page read in a sensible order?

## Anti-Patterns

- ❌ Desktop-first development ("I'll add mobile later")
- ❌ Fixed pixel widths in layouts (`w-[800px]`)
- ❌ Horizontal scroll outside intentional carousels (test: scrolled all the way down and right on mobile, does anything overflow?)
- ❌ Buttons smaller than 44px tall
- ❌ Text smaller than 14px (`text-sm`) anywhere except micro-labels
- ❌ Hamburger menu without a backdrop / outside-click close
- ❌ Modal open without body scroll lock
- ❌ Hover-only interactions (mobile has no hover)
- ❌ Layouts that break between two breakpoints (e.g., looks fine at 768 and 1024, broken at 900)
- ❌ Images served at full desktop resolution to mobile
- ❌ Forms with no `inputMode` / `autoComplete` hints
- ❌ Sticky bottom CTAs that overlap content without padding-bottom on the page

## The 30-Second Checklist (run before every commit)

- [ ] DevTools to 360px — page works
- [ ] DevTools to 1920px — page works
- [ ] All buttons have visible focus state
- [ ] All text is readable (contrast, size)
- [ ] No horizontal overflow
- [ ] Touch targets ≥ 44pt
- [ ] Images have `sizes` prop set
