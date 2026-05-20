---
name: product-catalog
description: Use this skill whenever working on the dress catalogue — the grid page, product detail pages, filtering, sorting, variant selection, cart, or dummy checkout flow. Fires for any file in `/src/app/(shop)/`, `/src/features/catalog/`, `/src/features/cart/`, or anything touching the `products` / `product_images` / `product_variants` tables. Enforces the demo-checkout disclaimer rule, the cart state pattern, and the "every product has a clear next step" UX principle.
---

# Product Catalogue + Dummy Checkout

The website catalogue showcases Steffi's ready-to-wear dresses. For the demo, checkout is **fake** — but the flow looks and feels real. Every screen must be unmistakably labelled as demo so Rohan never thinks it's processing real payments.

## The Three Catalogue Surfaces

### 1. `/dresses` — catalogue grid

The browsable index. Filtering, sorting, ~10 products initially.

**Layout:**
- Hero band: page title + brief intro
- Filter bar (mobile: horizontal scroll chips, desktop: top-aligned dropdowns)
  - Type: All · Wedding · Evening · Prom · Bridesmaid · 21st birthday
  - Colour: All · Pink · Maroon · Blue · Green · Yellow · Gold
  - Sort: Newest · Price low to high · Price high to low
- Grid:
  - Mobile (360-639px): 2 columns
  - Tablet (640-1023px): 2 columns
  - Desktop (1024+): 3 columns
  - Large desktop (1280+): 3-4 columns
- Pagination not needed for ~10 products. Show "Want a custom design? Book a fitting" CTA below the grid.

**Empty state (after filtering):** "No dresses match those filters. Try something else?" with a "Clear filters" link.

### 2. `/dresses/[slug]` — product detail

The hero of the catalogue. Conversion happens here.

**Layout:**
- Two-column on desktop, stacked on mobile
- **Left column (or top on mobile):** image gallery with thumbnails, multi-angle photos, swipeable on mobile
- **Right column:** product info
  - Eyebrow: dress type (small uppercase label)
  - Heading: dress name (Fraunces 3xl-4xl)
  - Price (tabular numerals, prominent)
  - Variant selector — size dropdown, colour swatches if multiple
  - "Add to cart" button (primary)
  - "Enquire about this dress" button (secondary, opens WhatsApp prefilled)
  - "Book a fitting for this style" link (tertiary)
  - Short description paragraph
  - Specs accordion: fabric, care, made in
  - "Why this dress" — brief copy about the design
- Related dresses section below: "You might also like" — 3 cards
- **Crucial:** customers can buy this OR ask for it custom-altered for them. The page should make both feel natural.

### 3. `/cart`, `/checkout`, `/checkout/success` — DUMMY ONLY

The fake payment journey. **Every screen must label itself as a demo.**

## Cart State Management

Use Zustand for cart state, persisted to localStorage for cross-tab sync.

```ts
// src/features/cart/store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  size: string;
  colour: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, size: string, colour: string) => void;
  updateQuantity: (productId: string, size: string, colour: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.size === item.size && i.colour === item.colour
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (productId, size, colour) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size && i.colour === colour)
          ),
        })),

      updateQuantity: (productId, size, colour, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size && i.colour === colour
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),

      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'sc-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

## The Demo Checkout

This is the part to get right. Polished, looks real, but **unmistakably labelled as demo**.

### `/checkout` page structure

```tsx
export default function CheckoutPage() {
  return (
    <section className="container py-12 md:py-20">
      <DemoBanner />  {/* Banner at top: "Demo only — no real payment" */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
        <CheckoutForm />     {/* Shipping address, contact info */}
        <OrderSummary />     {/* Items, totals */}
      </div>
    </section>
  );
}
```

### The Demo Banner (every checkout screen)

```tsx
function DemoBanner() {
  return (
    <div className="mb-8 rounded-2xl border border-gold/30 bg-gold-soft p-4 text-center">
      <p className="text-sm font-medium text-ink">
        <span className="font-display text-base">Demo checkout</span>
        <span className="mx-2 text-ink-subtle">·</span>
        No real payment will be processed
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        For now, complete a fitting booking or enquire on WhatsApp to place an order.
      </p>
    </div>
  );
}
```

This banner appears on:
- `/cart`
- `/checkout`
- The fake payment screen
- `/checkout/success`

Bunty can never miss it. Rohan can never confuse it for production.

### The Fake Payment Screen

After he fills shipping info and clicks "Continue to payment":

```tsx
'use client';
import { motion } from 'motion/react';
import { useState } from 'react';

export function FakePaymentForm() {
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { clear } = useCart();

  async function fakeProcess(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    // Show fake processing animation for 2.5s
    await new Promise((r) => setTimeout(r, 2500));
    clear();
    router.push('/checkout/success?ref=SC-' + Math.random().toString(36).slice(2, 8).toUpperCase());
  }

  return (
    <form onSubmit={fakeProcess} className="space-y-5">
      <DemoBanner />

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="space-y-4">
          <Input label="Card number" value="4242 4242 4242 4242" readOnly />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Expiry" value="12/30" readOnly />
            <Input label="CVC" value="123" readOnly />
          </div>
          <Input label="Cardholder name" placeholder="Name on card" />
        </div>
      </div>

      <Button type="submit" disabled={processing} className="w-full" size="lg">
        {processing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Processing demo payment…
          </span>
        ) : (
          <>Pay £{total.toFixed(2)} — demo</>
        )}
      </Button>

      <p className="text-xs text-center text-ink-subtle">
        This is a demonstration. No data is sent. No payment processed.
      </p>
    </form>
  );
}
```

The "card number" is Stripe's well-known test card `4242 4242 4242 4242` — a recognisable signal to any developer/business owner that this is a demo.

### Success Screen

```tsx
export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return (
    <section className="container py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <DemoBanner />

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 180, delay: 0.2 }}
          className="mx-auto size-20 rounded-full bg-rose-soft flex items-center justify-center"
        >
          <Check className="size-10 text-rose" />
        </motion.div>

        <h1 className="mt-8 font-display text-4xl md:text-5xl">Order received</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Reference: <span className="font-display tabular-nums">{ref}</span>
        </p>
        <p className="mt-6 text-base text-ink-muted max-w-md mx-auto">
          In production, this would confirm your order and Steffi would be in touch about shipping or pickup.
          For now, this is a demo of the checkout flow.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/book-a-fitting">Book a fitting</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/dresses">Browse more dresses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

## Product Card Component

```tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useState } from 'react';

export function ProductCard({ product }: { product: Product }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      href={`/dresses/${product.slug}`}
      className="group block bg-surface rounded-2xl overflow-hidden border border-border transition-shadow duration-300 hover:shadow-sm"
    >
      <div className="aspect-[2/3] overflow-hidden bg-surfaceAlt relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full"
        >
          <Image
            src={product.cover_image_url}
            alt={`${product.name} — ${product.short_description}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL={product.blurhash_data_url ?? undefined}
            onLoad={() => setImgLoaded(true)}
            className="object-cover"
          />
        </motion.div>
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-xs font-medium tracking-wide uppercase text-ink-muted">
          {product.type}
        </p>
        <h3 className="mt-1 font-display text-lg sm:text-xl text-ink line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-2 font-display text-base tabular-nums">£{product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
```

## Variant Selection Pattern

For dresses with multiple sizes/colours:

```tsx
'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

export function VariantSelector({ product }: { product: ProductWithVariants }) {
  const [size, setSize] = useState<string | null>(null);
  const [colour, setColour] = useState<string | null>(product.variants[0]?.colour ?? null);

  const sizesForColour = product.variants
    .filter((v) => v.colour === colour)
    .flatMap((v) => v.sizes);

  return (
    <div className="space-y-6">
      {/* Colour swatches */}
      <div>
        <p className="text-xs font-medium tracking-wide uppercase text-ink-muted mb-3">Colour</p>
        <div className="flex gap-2">
          {Array.from(new Set(product.variants.map((v) => v.colour))).map((c) => (
            <button
              key={c}
              onClick={() => { setColour(c); setSize(null); }}
              className={cn(
                'px-4 py-2 rounded-full border text-sm transition-colors',
                colour === c
                  ? 'border-rose bg-rose-soft text-rose'
                  : 'border-border-strong text-ink hover:bg-surfaceAlt'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Size chips */}
      <div>
        <p className="text-xs font-medium tracking-wide uppercase text-ink-muted mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {['M', 'L', 'XL'].map((s) => {
            const available = sizesForColour.includes(s);
            return (
              <button
                key={s}
                onClick={() => available && setSize(s)}
                disabled={!available}
                className={cn(
                  'min-w-12 h-11 px-4 rounded-full border text-sm transition-colors',
                  size === s
                    ? 'border-rose bg-rose text-ivory'
                    : available
                    ? 'border-border-strong text-ink hover:bg-surfaceAlt'
                    : 'border-border text-ink-subtle line-through cursor-not-allowed'
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-ink-subtle">
          Not your size? <Link href="/book-a-fitting" className="text-rose underline">Book a fitting</Link> for a custom piece.
        </p>
      </div>
    </div>
  );
}
```

## Anti-Patterns

- ❌ Real Stripe / payment integration without explicit approval — keep it demo
- ❌ DemoBanner missing on any checkout-related screen
- ❌ Pretend "order confirmation" without "demo" labelling
- ❌ Filtering / sorting without URL params — back button loses state
- ❌ Cart that doesn't persist across page refresh
- ❌ Adding to cart from the grid (no variant selected — invalid state)
- ❌ Product images served at full resolution to mobile
- ❌ Heading levels nested wrong (every product card with `<h1>` — should be `<h3>`)
- ❌ Animations on every card simultaneously — stagger them or none
- ❌ "Add to cart" button without disabled state during variant selection
- ❌ Out-of-stock variants clickable

## URL Parameters for Filtering

Filter state should be in the URL so back/forward works and shares preserve state:

```
/dresses?type=wedding&colour=pink&sort=price-asc
```

Use `useSearchParams` in client components, `searchParams` in server components.

## Quick Decision Tree

- Adding a product card → use the `ProductCard` component, never re-style inline
- Adding a filter → URL param + server component re-fetch with the filter
- Adding to cart → variant must be selected; disable the button until both size and colour chosen
- Going to checkout → DemoBanner mandatory
- Order success → show reference number with tabular numerals
- Empty cart → friendly EmptyState with "Browse dresses" CTA, never just blank
