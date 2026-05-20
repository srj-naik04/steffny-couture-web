---
name: nextjs
description: Use this skill whenever working with Next.js 15 (App Router) — creating pages, layouts, server/client components, data fetching, routing, metadata, server actions, route handlers, or middleware. Fires for any file in `/app/`, `next.config.ts`, or anything importing from `next/*`. Enforces server-first patterns, the metadata API, image optimisation, and the App Router conventions.
---

# Next.js 15 — App Router Conventions

The biggest mental shift from Pages Router: **everything is a Server Component by default**. Only mark `"use client"` when you actually need the browser (interactivity, browser APIs, hooks).

## The Three Sacred Rules

### Rule 1 — Default to Server Components

```tsx
// app/dresses/page.tsx — Server Component (no "use client")
import { getProducts } from '@/features/products/api/getProducts';

export default async function DressesPage() {
  const products = await getProducts(); // runs on server
  return <ProductGrid products={products} />;
}
```

Only add `"use client"` if the component:
- Uses `useState`, `useEffect`, `useReducer`, `useContext`
- Uses event handlers (`onClick`, `onChange`)
- Uses browser-only APIs (`window`, `localStorage`)
- Uses React hooks generally
- Wraps a third-party library that does these things (Framer Motion, etc.)

**Pattern:** Make the parent a server component, push the client boundary down to the smallest possible leaf.

```tsx
// ✅ Good — server component fetches, passes data to client island
// app/dresses/page.tsx (server)
export default async function Page() {
  const products = await getProducts();
  return <ProductGrid products={products} />;  // ProductGrid is server, ProductCard hover is client
}

// components/shop/ProductGrid.tsx (server)
export function ProductGrid({ products }) {
  return (
    <div className="grid">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

// components/shop/ProductCard.tsx (server, but image hover handled in CSS)
// No "use client" needed — Tailwind `group-hover:scale-105` works without JS
```

### Rule 2 — Use the Metadata API for SEO

Every page exports `metadata` or `generateMetadata`:

```tsx
// app/dresses/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dresses — Steffny Couture',
  description: 'Browse our collection of bespoke couture and ready-to-wear dresses, hand-finished in our Hounslow studio.',
  openGraph: {
    title: 'Dresses — Steffny Couture',
    description: 'Browse our collection of bespoke couture and ready-to-wear dresses.',
    images: ['/og/dresses.jpg'],
  },
};
```

For dynamic pages:
```tsx
// app/dresses/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // Next 15: params is a Promise
  const product = await getProduct(slug);
  return {
    title: `${product.name} — Steffny Couture`,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}
```

Root metadata in `app/layout.tsx`:
```tsx
export const metadata: Metadata = {
  title: {
    template: '%s | Steffny Couture',
    default: 'Steffny Couture — Elegance, made in London',
  },
  description: 'Bespoke couture and alterations in Hounslow, London.',
  metadataBase: new URL('https://www.steffnycouture.co.uk'),
};
```

### Rule 3 — Always `next/image`, Never `<img>`

```tsx
import Image from 'next/image';

// Above-fold hero — priority loading
<Image
  src="/assets/hero/main.jpg"
  alt="Maroon wedding gown on model in golden light"
  fill
  priority
  sizes="100vw"
  className="object-cover"
  placeholder="blur"
  blurDataURL={heroBlurDataURL}
/>

// Below-fold product card — lazy + responsive
<Image
  src={product.image}
  alt={product.name}
  fill
  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
  className="object-cover"
  placeholder="blur"
  blurDataURL={product.blurDataURL}
/>

// Remote images from Supabase Storage
// next.config.ts needs: { remotePatterns: [{ hostname: '<project>.supabase.co' }] }
<Image
  src={`${supabaseUrl}/storage/v1/object/public/products/${product.image}`}
  alt={product.name}
  width={800}
  height={1067}
  className="rounded-lg"
/>
```

The `sizes` prop is critical — without it, Next serves a 2400px image on a 375px screen and Lighthouse drops.

## Routing Patterns

### Route Groups (parentheses don't show in URL)

```
app/
├── (marketing)/         # No URL prefix; just organisation
│   ├── layout.tsx       # Marketing header + footer
│   ├── page.tsx         # /
│   ├── about/page.tsx   # /about
│   └── contact/page.tsx # /contact
├── (shop)/
│   ├── layout.tsx       # Same header, with cart drawer
│   ├── dresses/
│   │   ├── page.tsx     # /dresses
│   │   └── [slug]/page.tsx  # /dresses/pink-wedding-dress
│   └── cart/page.tsx    # /cart
└── (booking)/
    ├── layout.tsx       # Minimal layout, no main nav
    └── book/page.tsx    # /book
```

### Dynamic params (Next 15 specific)

In Next 15, `params` and `searchParams` are **Promises**:

```tsx
// app/dresses/[slug]/page.tsx
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { colour } = await searchParams;
  // ...
}
```

### Loading + Error + Not Found

Every route segment can have these:

```
app/dresses/
├── page.tsx           # The actual content
├── loading.tsx        # Shown while page.tsx is loading
├── error.tsx          # Shown if page.tsx throws (client boundary; needs "use client")
└── not-found.tsx      # Triggered by notFound() function
```

```tsx
// app/dresses/loading.tsx
import { ProductGridSkeleton } from '@/components/shop/ProductGridSkeleton';

export default function Loading() {
  return <ProductGridSkeleton count={12} />;
}

// app/dresses/error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center py-32">
      <h2 className="font-display text-display-sm">Something didn't load</h2>
      <p className="text-inkMuted mt-4">Check your connection and try again.</p>
      <Button onClick={reset} className="mt-8">Try again</Button>
    </div>
  );
}

// app/dresses/[slug]/page.tsx
import { notFound } from 'next/navigation';

export default async function Page({ params }: Props) {
  const product = await getProduct((await params).slug);
  if (!product) notFound(); // Triggers not-found.tsx
  // ...
}
```

## Data Fetching

### Server-side (default — preferred)

```tsx
// In a server component
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient(); // server-only Supabase client
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  return <ProductGrid products={products ?? []} />;
}
```

### Client-side (only when needed)

```tsx
'use client';
import { useQuery } from '@tanstack/react-query';

export function CartItems() {
  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart(), // uses browser Supabase client
  });
  // ...
}
```

### Caching

```tsx
// Static (cached forever, ISR via revalidate)
export const revalidate = 3600; // 1 hour

// Or per-request via fetch options
const res = await fetch(url, { next: { revalidate: 3600 } });

// Disable cache entirely (every request hits the source)
const res = await fetch(url, { cache: 'no-store' });
```

For Supabase queries:
```tsx
// In server component — uses Next's cache layer if you wrap with cache()
import { cache } from 'react';

export const getProducts = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.from('products').select('*');
  return data ?? [];
});
```

## Server Actions

For form submissions and mutations from server components without client JS:

```tsx
// app/contact/page.tsx (server)
import { submitContact } from '@/features/contact/actions';

export default function ContactPage() {
  return (
    <form action={submitContact}>
      <input name="name" required />
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
    </form>
  );
}

// features/contact/actions.ts
'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function submitContact(formData: FormData) {
  const data = schema.parse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  const supabase = await createClient();
  await supabase.from('inquiries').insert(data);

  redirect('/contact/thanks');
}
```

For client-side forms with feedback (loading states, error display), use React Hook Form + Server Action via `useFormState`.

## Linking & Navigation

```tsx
// Always next/link for internal navigation
import Link from 'next/link';

<Link href="/dresses" className="...">All dresses</Link>

// Programmatic navigation (client component only)
'use client';
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/checkout');
router.replace('/');
router.back();
```

Never use `<a href>` for internal links — breaks SPA navigation, full page reload.

## Common Patterns

### Conditionally rendering based on URL
```tsx
'use client';
import { usePathname } from 'next/navigation';

export function NavLink({ href, children }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn('px-3 py-2', isActive && 'text-rose font-medium')}
    >
      {children}
    </Link>
  );
}
```

### Search params in client components
```tsx
'use client';
import { useSearchParams } from 'next/navigation';

export function FilterButton() {
  const sp = useSearchParams();
  const colour = sp.get('colour');
  // ...
}
```

Note: in server components, `searchParams` comes as a prop (and is a Promise in Next 15).

## Anti-Patterns

- ❌ `"use client"` at the top of every file by reflex
- ❌ `useEffect` to fetch data — use server components or TanStack Query
- ❌ Raw `<img>` — always `next/image`
- ❌ `<a href>` for internal links — always `<Link>`
- ❌ `useState` for server data — server component or TanStack Query
- ❌ Forgetting `await params` in Next 15 (TypeScript will yell, listen to it)
- ❌ Mixing pages router (`pages/`) and app router (`app/`) — we use app router only
- ❌ `getServerSideProps` / `getStaticProps` — don't exist in App Router
- ❌ `next/head` — use the metadata API
- ❌ Putting metadata in client components — only server components export metadata
- ❌ Forgetting `sizes` on `next/image` with `fill`

## next.config.ts essentials

```ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'YOUR-PROJECT.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default config;
```

## When in doubt

- Want SEO? Page is a server component, exports metadata
- Need interactivity? Client component, mark `"use client"` at the top
- Need both? Server component as parent, client component as a child
- Need data? Fetch on the server, pass as props
- Need to mutate? Server Action

The mental model: **server components handle "what to show", client components handle "what to do".**
