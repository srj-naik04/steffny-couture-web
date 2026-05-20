---
description: Create a reusable component. Reads brand + responsive skills, picks the right folder, scaffolds with TypeScript types and brand-compliant defaults.
---

# /component <name> [purpose]

Create a new component.

## Inputs

- `<name>` — PascalCase, e.g. `ReviewCard`, `DressGallery`, `BookingForm`
- `[purpose]` — optional description, e.g. "single review tile for the reviews grid"

## Steps

1. **Read** `steffny-brand`, `tailwind-web`, `responsive-design`, `framer-motion` skills.

2. **Decide the folder**:
   - Generic UI primitive (Button, Input, Card, Heading) → `src/components/ui/<Name>.tsx`
   - Navigation (Header, Footer, MobileMenu) → `src/components/nav/<Name>.tsx`
   - Motion wrapper (FadeUp, Stagger) → `src/components/motion/<Name>.tsx`
   - Marketing-specific (HeroBlock, FeaturedStrip) → `src/components/marketing/<Name>.tsx`
   - Shop-specific (ProductCard, CartItem) → `src/components/shop/<Name>.tsx`
   - Feature-specific (BookingForm parts, ReviewForm) → `src/features/<feature>/<Name>.tsx`
   - SEO (JSON-LD components) → `src/components/seo/<Name>.tsx`

3. **Decide server vs client**:
   - Uses hooks, state, events, browser APIs, framer-motion → `'use client'`
   - Static structure, accepts props, renders JSX → server component (no directive)

4. **Scaffold**:

   ```tsx
   // src/components/<folder>/<Name>.tsx
   import { cn } from '@/lib/utils/cn';

   type <Name>Props = {
     // props with explicit types — avoid `any`
     className?: string;
   };

   export function <Name>({ className, ...props }: <Name>Props) {
     return (
       <div className={cn('...', className)}>
         {/* ... */}
       </div>
     );
   }
   ```

   For a component with variants:
   ```tsx
   const base = '...';
   const variants = {
     primary: '...',
     secondary: '...',
   };

   type Props = React.HTMLAttributes<HTMLDivElement> & {
     variant?: keyof typeof variants;
   };
   ```

5. **Apply brand rules**:
   - No exclamation marks in placeholder copy
   - No hex codes — use Tailwind tokens
   - Sentence-case button labels
   - Mobile-first responsive classes
   - 44pt touch targets minimum
   - Default `className` prop accepts overrides via `cn()`

6. **Add motion** if interactive — use `framer-motion` patterns from the skill, include `useReducedMotion`.

7. **Verify**:
   - Imports work from a sibling component
   - Renders at 360px, 768px, 1280px without breaking
   - No console warnings in dev
   - `npm run typecheck` clean

8. **Commit**:
   ```
   feat(ui): add <Name> component

   <one-line purpose>
   ```

## Hard rules

- TypeScript types on every prop (no `any`)
- Brand tokens only (no `bg-[#xxx]`)
- Mobile-first responsive
- `cn()` for class merging when accepting `className` prop
- `'use client'` only when genuinely interactive
- No emoji or exclamation marks in default copy
