---
name: tailwind-web
description: Use this skill whenever writing or modifying any Tailwind CSS classes in the Steffny Couture website. Fires for any `.tsx` file with `className=`, `tailwind.config.ts`, or `globals.css`. Enforces brand-token-only usage, the project's spacing/sizing scale, the `cn()` helper, dark mode strategy (light-only), and the patterns for arbitrary values, group/peer selectors, and component variants.
---

# Tailwind CSS — Web Conventions

Tailwind v4 is the styling layer. Brand tokens from `constants/brand.ts` are exposed through `tailwind.config.ts` so we never write raw hex codes in components.

## The Five Sacred Rules

### Rule 1 — Brand tokens only, no Tailwind defaults

Forbidden:
```tsx
❌ <div className="bg-red-500 text-blue-600 border-gray-300">
❌ <div className="bg-[#FF0000]">
❌ <p style={{ color: '#7C2D3E' }}>
```

Correct:
```tsx
✅ <div className="bg-rose text-ivory border-borderStrong">
```

The only acceptable "arbitrary values" in Tailwind classes:
- Dynamic sizing: `w-[var(--carousel-width)]`
- Specific viewport math: `min-h-[100dvh]`
- Negative margins for bleeding: `mx-[-1.5rem]`
- Custom aspect ratios: `aspect-[3/4]`
- Letter spacing fine-tuning: `tracking-[0.18em]`

### Rule 2 — Use `cn()` for conditional classes

```tsx
// lib/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Then everywhere:
```tsx
import { cn } from '@/lib/cn';

<button
  className={cn(
    'inline-flex items-center justify-center px-6 py-3 rounded-full transition-colors',
    variant === 'primary' && 'bg-rose text-ivory hover:bg-roseDark',
    variant === 'secondary' && 'bg-surface text-ink border border-borderStrong',
    disabled && 'opacity-50 cursor-not-allowed',
    fullWidth && 'w-full',
    className, // always allow caller to override
  )}
>
```

`twMerge` resolves conflicts intelligently: `cn('px-4', 'px-6')` becomes just `px-6`.

### Rule 3 — Sensible component prop API

Components that take Tailwind classes should always accept and forward a `className`:

```tsx
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  // ...
};

export function Button({ variant = 'primary', size = 'md', className, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,  // caller's overrides win
      )}
      {...rest}
    />
  );
}
```

### Rule 4 — Group + peer for child interactions

```tsx
// Hover on parent affects child
<div className="group">
  <Image className="transition-transform duration-700 group-hover:scale-105" />
  <h3 className="group-hover:text-rose transition-colors">Title</h3>
</div>

// Sibling state affects another sibling
<input id="email" className="peer" />
<label htmlFor="email" className="peer-focus:text-rose">Email</label>
```

### Rule 5 — Sort classes (auto via Prettier plugin)

`prettier-plugin-tailwindcss` sorts classes consistently. Don't manually order. Just install:

```json
// package.json
"devDependencies": {
  "prettier": "^3",
  "prettier-plugin-tailwindcss": "^0.6"
}
```

```json
// .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Run `npm run format` and classes are sorted.

## Tailwind v4 Setup

### `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        md: '2rem',
        lg: '3rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        ivory: '#FAF7F2',
        surface: '#FFFFFF',
        surfaceAlt: '#F4EFE8',
        rose: {
          DEFAULT: '#7C2D3E',
          dark: '#5A1F2C',
          soft: '#F2D9DE',
        },
        gold: {
          DEFAULT: '#C9A961',
          soft: '#F5EBD2',
        },
        ink: {
          DEFAULT: '#1F1B1A',
          muted: '#5C5551',
          subtle: '#9A9089',
        },
        success: '#3F6E4A',
        warning: '#B8741A',
        danger: '#9B2C2C',
        info: '#3A5878',
        border: {
          DEFAULT: '#E8E0D7',
          strong: '#D4C8BA',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '5rem', fontWeight: '700' }],
        'hero-sm': ['2.75rem', { lineHeight: '3.25rem', fontWeight: '700' }],
        'display': ['3rem', { lineHeight: '3.5rem', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'title': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        'headline': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'body': ['1rem', { lineHeight: '1.625rem' }],
        'small': ['0.875rem', { lineHeight: '1.375rem' }],
        'label': ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
      },
      letterSpacing: {
        widest: '0.1em',
      },
      maxWidth: {
        prose: '65ch',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

Note the nested colour syntax: `bg-rose` → `#7C2D3E`, `bg-rose-dark` → `#5A1F2C`, `bg-rose-soft` → `#F2D9DE`. Keeps the namespace clean.

### `globals.css`

```css
@import 'tailwindcss';

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 80px;
  }
  body {
    @apply bg-ivory text-ink font-body;
  }
  *:focus-visible {
    @apply outline-none ring-2 ring-rose ring-offset-2 ring-offset-ivory;
  }
  ::selection {
    @apply bg-rose-soft text-rose-dark;
  }
}

@layer components {
  /* Reusable utility classes if needed — prefer Tailwind tokens directly */
}
```

## Common Patterns

### Section with container

```tsx
<section className="py-16 md:py-24 lg:py-32 bg-ivory">
  <div className="container">
    {/* content auto-padded and centred */}
  </div>
</section>
```

### Card

```tsx
<article className="bg-surface border border-border rounded-lg p-6 md:p-8 hover:shadow-md transition-shadow">
  <h3 className="font-display text-title">Title</h3>
  <p className="mt-2 text-inkMuted">Body</p>
</article>
```

### Form input

```tsx
<div className="space-y-1.5">
  <label
    htmlFor="email"
    className="block text-label uppercase tracking-widest text-inkMuted"
  >
    Email
  </label>
  <input
    id="email"
    type="email"
    className={cn(
      'block w-full h-12 px-4 bg-surfaceAlt rounded-lg',
      'text-body text-ink placeholder:text-inkSubtle',
      'border border-border focus:border-rose',
      'focus:ring-2 focus:ring-rose focus:ring-offset-2 focus:ring-offset-ivory',
      'transition-colors',
      error && 'border-danger focus:border-danger focus:ring-danger',
    )}
  />
  {error && (
    <p className="text-small text-danger" role="alert">{error}</p>
  )}
</div>
```

### Image with hover zoom

```tsx
<div className="group relative aspect-[3/4] overflow-hidden rounded-lg">
  <Image
    src={src}
    alt={alt}
    fill
    sizes="(min-width: 1024px) 25vw, 50vw"
    className="object-cover transition-transform duration-700 group-hover:scale-105"
  />
</div>
```

The `overflow-hidden` is essential — without it the scaled image escapes.

## Animation Classes

Use Tailwind's `transition-*` for CSS transitions. Reach for Framer Motion only when state-based animation is needed.

```tsx
// Hover colour transitions
className="text-ink hover:text-rose transition-colors duration-200"

// Hover scale (on images inside group)
className="group-hover:scale-105 transition-transform duration-700"

// Fade entrance (only via CSS, not state-aware)
className="opacity-0 animate-fade-in"  // requires custom keyframe
```

For state-aware (component mounts/unmounts), use Framer Motion. See `framer-motion` skill.

## Dark Mode Strategy

**We don't support dark mode.**

The brand is warm cream + rose + ink. Dark mode would invert this and look wrong. Set:

```tsx
// app/layout.tsx
<html lang="en" data-theme="light" style={{ colorScheme: 'light' }}>
```

```css
/* globals.css */
@media (prefers-color-scheme: dark) {
  /* explicitly do not override — we stay light always */
}
```

In meta:
```html
<meta name="color-scheme" content="light only" />
```

This prevents Safari from auto-darkening colours.

## Anti-Patterns

- ❌ Default Tailwind colours (`bg-red-500`, `text-blue-600`)
- ❌ Inline `style={{}}` for static values
- ❌ Hex codes in className with `bg-[#...]`
- ❌ Long unsorted class strings (let Prettier sort)
- ❌ `@apply` in component CSS — defeats Tailwind's atomic model. Use components instead.
- ❌ Mixing custom CSS files with Tailwind — pick one path per file
- ❌ Using `!important` (`!`)— restructure instead
- ❌ Tailwind classes constructed at runtime — they get purged
```tsx
❌ <div className={`bg-${color}-500`} />  // won't work
✅ <div className={cn(color === 'rose' && 'bg-rose')} />
```
- ❌ Skipping `cn()` and concatenating with `+` or template strings
- ❌ Adding classes that aren't in the content paths (purge will remove them)

## When to break the rules

Sometimes you need a custom CSS file (animations with multiple keyframes, complex selectors). That's fine — put it in `app/[route]/<name>.module.css` and import it. Don't `@apply` Tailwind classes inside; just write CSS. Use sparingly.

## Quick Reference

```
Container        container mx-auto
Section          py-16 md:py-24 lg:py-32
Card             bg-surface border border-border rounded-lg p-6 md:p-8
Primary button   bg-rose text-ivory rounded-full px-8 py-3.5 hover:bg-rose-dark
Body text        text-body text-ink (or text-inkMuted for secondary)
Heading          font-display text-display-sm md:text-display
Image wrapper    relative aspect-[3/4] overflow-hidden rounded-lg
Focus ring       focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2
Hover transition transition-colors duration-200
Image hover zoom group-hover:scale-105 transition-transform duration-700
```
