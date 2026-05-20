---
description: Scaffold a new page in the App Router. Sets up route file, metadata, default layout, and links it into navigation.
---

# /page <route> [description]

Create a new page at the given route.

## Inputs

- `<route>` — the URL path, e.g. `/services/bridal` or `/journal/[slug]`
- `[description]` — optional purpose, e.g. "Custom bridal dress design service detail page"

## Steps

1. **Read** `nextjs` and `steffny-brand` skills. Re-read if it's been a while.

2. **Determine route group**:
   - Marketing pages (`/about`, `/services/*`, `/journal/*`, `/reviews`, `/contact`) → `src/app/(marketing)/...`
   - Shop pages (`/dresses`, `/dresses/[slug]`, `/cart`, `/checkout`) → `src/app/(shop)/...`
   - Standalone (`/book-a-fitting`, `/`) → `src/app/...`

3. **Create the file** at the correct path. For a static page:

   ```tsx
   // src/app/(marketing)/<route>/page.tsx
   import type { Metadata } from 'next';

   export const metadata: Metadata = {
     title: '<page-title>',
     description: '<140-155 char description>',
   };

   export default function <PascalCase>Page() {
     return (
       <main id="main">
         <section className="container py-16 md:py-24">
           <header className="max-w-2xl">
             <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">
               <eyebrow>
             </p>
             <h1 className="mt-3 font-display text-4xl md:text-5xl lg:text-6xl">
               <heading>
             </h1>
             <p className="mt-6 text-lg text-ink-muted leading-relaxed">
               <intro paragraph>
             </p>
           </header>
           {/* sections */}
         </section>
       </main>
     );
   }
   ```

   For a dynamic page with `[slug]`:
   ```tsx
   export async function generateMetadata({ params }: Props): Promise<Metadata> {
     const { slug } = await params;
     // fetch the resource...
     return { title: ..., description: ... };
   }

   export async function generateStaticParams() {
     // for SSG, optional
   }

   export default async function Page({ params }: Props) {
     const { slug } = await params;
     // ...
   }

   type Props = { params: Promise<{ slug: string }> };
   ```

4. **Add to navigation** — open `src/components/nav/Header.tsx` and `Footer.tsx`. Decide if the page belongs in the main nav. If yes, add it. If no, ensure it's still reachable via at least one internal link from another page (orphan pages don't get indexed).

5. **Add to sitemap** — if it's a static path, ensure `src/app/sitemap.ts` includes it. Dynamic paths are auto-discovered if you wire them in.

6. **Verify**:
   - Page renders without errors
   - Metadata appears in browser tab + view-source
   - Page is in the sitemap.xml
   - Page is responsive at 360/768/1024/1280px
   - Internal link to/from this page exists
   - h1 is unique on the page
   - No console errors

7. **Commit**:
   ```
   feat(<scope>): add <page-name> page
   ```

## Hard rules

- Every page exports `metadata` (static) or `generateMetadata` (dynamic)
- Every page has exactly one `<h1>`
- Every page is reachable from at least one other page
- Every page is in the sitemap
- Never use `'use client'` on a page unless it genuinely needs interactivity
