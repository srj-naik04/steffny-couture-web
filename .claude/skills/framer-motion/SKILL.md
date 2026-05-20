---
name: framer-motion
description: Use this skill whenever adding animations, page transitions, scroll-triggered reveals, or any motion in the Steffny Couture website. Fires for any file importing `motion` from `framer-motion`, any `"use client"` component with animations, or any decision about transition timing. Enforces the project's motion vocabulary (durations, easings), the reduce-motion strategy, the IntersectionObserver pattern for scroll reveals, and the "intentional motion only" principle.
---

# Framer Motion — Web Conventions

Motion reinforces brand confidence. It does not decorate. Every animation must communicate a state change. If it doesn't, remove it.

## Stack

- **Framer Motion** for component-level animation, page transitions, gesture handling
- **Tailwind's `transition-*` classes** for simple hover/colour transitions (preferred for those)
- **CSS keyframes** for infinite loops (shimmer, ken burns) — avoid Framer for these

## Mounting Rule

Framer Motion runs in the browser only. Any component using `motion.*` must be a **Client Component**:

```tsx
'use client';
import { motion } from 'framer-motion';

export function FadeInSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.section>
  );
}
```

Then import the client component into a server page — Next handles the boundary.

## Motion Vocabulary (memorise this)

```ts
// lib/motion/presets.ts
import type { Transition, Variants } from 'framer-motion';

// Easings
export const easeOut: Transition['ease'] = [0.4, 0, 0.2, 1];
export const easeStandard: Transition['ease'] = [0.25, 0.1, 0.25, 1];
export const easePage: Transition['ease'] = [0.6, 0.05, 0.01, 0.99];

// Durations
export const dur = {
  micro: 0.2,
  default: 0.4,
  slow: 0.6,
  page: 0.6,
} as const;

// Common variants
export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.default, ease: easeStandard },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.default, ease: easeStandard },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.default, ease: easeStandard },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: dur.default, ease: easeStandard },
  },
};

export const drawerRight: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: dur.micro * 1.5, ease: easeOut },
  },
  exit: {
    x: '100%',
    transition: { duration: dur.micro, ease: easeOut },
  },
};

export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: dur.micro } },
  exit: { opacity: 0, transition: { duration: dur.micro } },
};
```

Import and reuse:

```tsx
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion/presets';

<motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
  New arrivals
</motion.h2>
```

## Standard Patterns

### Scroll-triggered fade-in

```tsx
'use client';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion/presets';

export function RevealOnScroll({ children, ...rest }: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeInUp}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
```

- `once: true` — animate once, don't re-trigger on scroll back
- `margin: '-80px'` — fire when the element is 80px into the viewport (feels more natural than 0px)

### Staggered list reveal

```tsx
'use client';
import { motion } from 'framer-motion';
import { stagger, staggerItem } from '@/lib/motion/presets';

export function ProductGrid({ products }: Props) {
  return (
    <motion.ul
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={stagger}
    >
      {products.map((p) => (
        <motion.li key={p.id} variants={staggerItem}>
          <ProductCard product={p} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

Cap visible stagger: if there are 20 items, only the first 6-8 visible ones should stagger. Items revealed by scroll later should just fade in normally.

### Page transition

Next.js App Router doesn't have native page transitions like Pages Router did. Two approaches:

**Approach A: Animate on each page** (simpler, no boilerplate)

Wrap the content of every page in a `<motion.div>` with the same `initial`/`animate`:

```tsx
// components/shared/PageTransition.tsx
'use client';
import { motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Usage in any page.tsx:
export default function Page() {
  return (
    <PageTransition>
      <Hero />
      <FeaturedProducts />
      {/* ... */}
    </PageTransition>
  );
}
```

**Approach B: Template-level animation** (slicker, runs on every nav)

Use Next's `template.tsx` (re-mounts on navigation):

```tsx
// app/(marketing)/template.tsx
'use client';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.6, 0.05, 0.01, 0.99] }}
    >
      {children}
    </motion.div>
  );
}
```

The downside of `template.tsx`: re-runs every navigation, breaks scroll restoration. Test before shipping.

### Modal / drawer

```tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { drawerRight, backdropFade } from '@/lib/motion/presets';

export function MobileNavDrawer({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-ink/40 z-50"
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.aside
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-ivory z-50"
            variants={drawerRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
          >
            {/* drawer content */}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
```

`AnimatePresence` is required for exit animations — without it the element unmounts before animation finishes.

### Hero parallax (light touch only)

```tsx
'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Background image moves slower than scroll (parallax)
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  // Content fades out as you scroll
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-[90vh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image src="/assets/hero/main.jpg" fill className="object-cover" priority />
      </motion.div>
      <motion.div className="relative z-10 ..." style={{ opacity }}>
        {/* hero content */}
      </motion.div>
    </section>
  );
}
```

Use parallax sparingly — once on the home hero is enough.

### Button micro-interactions

For simple button hover/press, prefer Tailwind transitions:

```tsx
<button className="bg-rose text-ivory rounded-full px-8 py-3.5 hover:bg-rose-dark active:scale-[0.98] transition-all duration-200">
  Book a fitting
</button>
```

Only reach for Framer when there's a state-dependent animation that CSS can't express (e.g., a button that shakes on error).

## Reduce Motion

Always respect `prefers-reduced-motion`:

```tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';

export function FadeIn({ children }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
    >
      {children}
    </motion.div>
  );
}
```

Or globally via `MotionConfig`:

```tsx
// app/layout.tsx
'use client';
import { MotionConfig } from 'framer-motion';

<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```

`reducedMotion="user"` respects the OS setting automatically.

## Anti-Patterns

- ❌ Animating every section reveal with custom variants — extract to presets
- ❌ Bouncy spring physics on functional UI (forms, navigation)
- ❌ Infinite loops outside hero ken burns or skeleton shimmer
- ❌ Animations that span >800ms — feels sluggish
- ❌ Animating `width` / `height` — use `transform: scale()` or `max-height`
- ❌ Framer Motion for what CSS transitions handle better (hover, focus)
- ❌ Forgetting `AnimatePresence` around exit animations
- ❌ Animating during page load — adds to LCP
- ❌ Layout animations without `layoutId` — flickery
- ❌ Skipping `viewport={{ once: true }}` on scroll reveals — re-runs on scroll back, distracting
- ❌ Putting Framer Motion in server components — won't work, breaks build

## Performance Tips

- Framer Motion adds ~30KB gzipped. Worth it for the polish.
- For lots of items animating at once, use `layout` carefully — performant but can jank on low-end Android
- `will-change: transform` is added automatically when needed; don't add manually
- For scroll-driven animations on long pages, prefer `useScroll` over `scroll` event listeners
- Test on a mid-range Android (£200 device) — if it stutters there, simplify

## Recommended File Layout

```
lib/
  motion/
    presets.ts       # All variants, easings, durations
    index.ts         # Re-exports
components/
  shared/
    PageTransition.tsx
    RevealOnScroll.tsx
    FadeInSection.tsx
```

Keep motion logic centralised. When you find yourself writing `transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}` for the third time, extract it.
