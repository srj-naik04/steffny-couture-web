---
name: content-cms
description: Use this skill whenever working on customer reviews (display, submission, moderation) or the journal/blog (MDX posts, post lists, post detail pages, JSON-LD for blog posts). Fires for any file in `/src/app/(marketing)/reviews/`, `/src/app/(marketing)/journal/`, `/content/journal/`, or `/src/features/reviews/`. Enforces the moderation flow (reviews submit unpublished, staff approve via mobile app), MDX content structure, and the SEO content strategy targeting Hounslow + South Asian wedding market.
---

# Content — Reviews + Journal

Two separate content surfaces share a skill because they have similar shape: each is a list page + detail/item page, each needs SEO discipline, each pulls from Supabase or MDX.

## Reviews

### The strategy

The existing site's "Customer Reviews" page is empty. This is a free SEO + trust win. Seed it with 6-8 plausible reviews on launch (with permission, ideally lifted from Steffi's Google Business / Instagram / WhatsApp messages), then accept ongoing submissions.

### Schema

```sql
-- 010_web_reviews.sql
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body text NOT NULL,
  service_type text,  -- 'bridal' | 'alterations' | 'occasion' | 'custom'
  source text DEFAULT 'web' CHECK (source IN ('web', 'google', 'instagram', 'whatsapp')),
  is_published boolean DEFAULT false NOT NULL,
  is_featured boolean DEFAULT false NOT NULL,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  published_at timestamptz
);

CREATE INDEX idx_reviews_published ON public.reviews(is_published, published_at DESC);

-- RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads published reviews"
ON public.reviews FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY "anon can submit review"
ON public.reviews FOR INSERT
TO anon
WITH CHECK (is_published = false AND source = 'web');
```

The `is_published = false` constraint on anon insert is the moderation gate. Reviews go in as drafts. Steffi or Rohan publishes them via the mobile app (or Supabase Studio for now — a moderation UI in the mobile app is a Phase-2 feature).

### Reviews page layout

```
/reviews
  Hero band: "From customers, in their words"
  Stats strip: average rating, total reviews, "Featured in..." if any
  Grid of reviews (3 cols desktop, 2 tablet, 1 mobile)
  Featured review (pull-quote treatment) every 6th row
  "Add yours" CTA → form
```

Review card:
```tsx
<article className="bg-surface rounded-2xl p-6 border border-border">
  <div className="flex items-center gap-2">
    <StarRating rating={review.rating} />
    <span className="text-xs text-ink-subtle">{review.source}</span>
  </div>
  <blockquote className="mt-4 text-base text-ink leading-relaxed">
    {review.body}
  </blockquote>
  <footer className="mt-4 flex items-center justify-between">
    <p className="font-display text-sm">— {review.customer_name}</p>
    {review.service_type && (
      <span className="text-xs uppercase tracking-wide text-ink-muted">
        {review.service_type}
      </span>
    )}
  </footer>
</article>
```

### Submission form

Brand-voice form, honeypot for spam, name + rating + body + optional email + service type. On submit, write `is_published: false` and show:

> "Thank you. Steffi reads every review herself before publishing — you'll see yours on the site within a few days."

### Featured reviews on home page

The home page's reviews strip pulls `is_featured = true ORDER BY display_order` limit 3. Steffi flags her favourite reviews via the mobile app.

### Star rating component (web)

```tsx
import { Star } from 'lucide-react';

export function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'size-3.5', md: 'size-4', lg: 'size-5' };
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            sizes[size],
            i <= rating ? 'fill-gold text-gold' : 'fill-none text-border-strong'
          )}
        />
      ))}
    </div>
  );
}
```

### Anti-patterns (reviews)
- ❌ Auto-publish without moderation (spam will arrive within a week)
- ❌ Fake reviews invented for launch (legal grey zone, ethically wrong) — use real reviews with permission
- ❌ Showing star ratings on dress detail pages without enough reviews per dress (looks sparse)
- ❌ Aggregate rating in JSON-LD if you have under 10 reviews (Google penalises thin schemas)
- ❌ "Verified purchase" badges without an auth system to back it

## Journal (Blog)

### The strategy

SEO-driven content targeting search intent in the Hounslow + South Asian wedding market. Each post is a discoverable, shareable, evergreen piece that funnels readers to book a fitting.

### Storage decision: MDX files (not database)

Why MDX, not a CMS or a `journal_posts` table:
- 5-15 posts maximum in v1 — DB is overkill
- Content rarely changes once published — DB benefits aren't relevant
- MDX lets Steffi (or you) write rich content with embedded components
- Posts ship with the repo, instantly indexable after deploy
- No CMS subscription
- Version-controlled with the rest of the site

If post count exceeds 30, revisit. Until then: `/content/journal/` directory of `.mdx` files.

### File structure

```
content/
  journal/
    how-to-choose-a-wedding-dress-in-hounslow.mdx
    bridal-alterations-timeline.mdx
    5-things-to-bring-to-your-first-fitting.mdx
```

Each file has frontmatter + body:

```mdx
---
title: How to choose a wedding dress in Hounslow
slug: how-to-choose-a-wedding-dress-in-hounslow
excerpt: A practical guide to finding your dress in West London, from where to look to what questions to ask.
coverImage: /images/journal/wedding-dress-hounslow.jpg
author: Steffi Da Cruz
publishedAt: 2026-02-12
updatedAt: 2026-02-12
keywords:
  - wedding dress Hounslow
  - bridal shops Hounslow
  - wedding dress West London
serviceType: bridal
readTime: 6
---

## Where to start

Hounslow is a quiet centre for bridal shopping. Within a 15-minute drive of the High Street...

## What to ask before your first appointment

...
```

### Loading MDX in Next.js 15

Install:
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter remark-gfm rehype-slug rehype-autolink-headings
```

Use `next-mdx-remote` for server-rendered MDX (more flexible than the built-in `@next/mdx`):
```bash
npm install next-mdx-remote
```

```ts
// src/lib/journal.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const JOURNAL_DIR = path.join(process.cwd(), 'content/journal');

export async function getAllPosts() {
  const files = await fs.readdir(JOURNAL_DIR);
  const posts = await Promise.all(
    files.filter((f) => f.endsWith('.mdx')).map(async (file) => {
      const raw = await fs.readFile(path.join(JOURNAL_DIR, file), 'utf-8');
      const { data } = matter(raw);
      return data as Post;
    })
  );
  return posts.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export async function getPost(slug: string) {
  const filepath = path.join(JOURNAL_DIR, `${slug}.mdx`);
  try {
    const raw = await fs.readFile(filepath, 'utf-8');
    const { data, content } = matter(raw);
    return { ...(data as Post), content };
  } catch {
    return null;
  }
}
```

### Post detail page

```tsx
// src/app/(marketing)/journal/[slug]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getPost, getAllPosts } from '@/lib/journal';
import { BlogPostingJsonLd } from '@/components/seo/BlogPostingJsonLd';
import { mdxComponents } from '@/components/mdx';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Not found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="container-narrow py-16 md:py-24">
      <BlogPostingJsonLd post={post} />

      <header>
        <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">
          Journal · {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl text-ink leading-tight">
          {post.title}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-ink-muted leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      <div className="mt-12 aspect-[3/2] overflow-hidden rounded-2xl">
        <Image src={post.coverImage} alt="" fill className="object-cover" priority />
      </div>

      <div className="prose prose-rose mt-12 max-w-prose mx-auto">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
            },
          }}
        />
      </div>

      <footer className="mt-16 pt-8 border-t border-border">
        <h2 className="font-display text-2xl">Ready for your fitting?</h2>
        <p className="mt-3 text-ink-muted">
          Steffi will walk you through everything from sketch to final fitting.
        </p>
        <Button asChild className="mt-6">
          <Link href="/book-a-fitting">Book a fitting</Link>
        </Button>
      </footer>
    </article>
  );
}
```

### Prose styles for MDX

Use `@tailwindcss/typography` with brand customisations:

```ts
// tailwind.config.ts
typography: {
  rose: {
    css: {
      '--tw-prose-body': '#1F1B1A',
      '--tw-prose-headings': '#1F1B1A',
      '--tw-prose-lead': '#5C5551',
      '--tw-prose-links': '#7C2D3E',
      '--tw-prose-bold': '#1F1B1A',
      '--tw-prose-quotes': '#1F1B1A',
      '--tw-prose-quote-borders': '#7C2D3E',
      '--tw-prose-bullets': '#7C2D3E',
      'h2, h3': { fontFamily: 'var(--font-display)' },
      'a': { textDecorationColor: 'rgba(124, 45, 62, 0.3)', textUnderlineOffset: '4px' },
      'a:hover': { textDecorationColor: '#7C2D3E' },
    },
  },
}
```

Apply with `<div className="prose prose-rose prose-lg">`.

### Initial seed posts (3 to ship in Phase 5)

1. **"How to choose a wedding dress in Hounslow"** — practical guide, links to /services/bridal and /book-a-fitting
2. **"Bridal alterations timeline: 6 months to the big day"** — step-by-step, links to /services/alterations
3. **"5 things to bring to your first fitting"** — quick read, links to /book-a-fitting

Future post ideas (for Steffi to author over time):
- "Saree blouse alterations: what to know"
- "Lehenga fitting timeline for South Asian brides"
- "Reception outfit vs ceremony outfit: should you change?"
- "Prom dress alterations in West London: when to book"
- "21st birthday dress shopping in London"

### Journal index page

```tsx
// /journal
export default async function JournalIndexPage() {
  const posts = await getAllPosts();

  return (
    <section className="container py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">Journal</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl lg:text-6xl">
          Notes from the atelier
        </h1>
        <p className="mt-6 text-lg text-ink-muted leading-relaxed">
          Practical guides on dresses, alterations, and getting ready for the moments that matter.
        </p>
      </header>

      <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </section>
  );
}
```

### MDX custom components

Make a few brand-aware MDX components for richer posts:

```tsx
// src/components/mdx/index.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Quote } from './Quote';
import { TimelineList } from './TimelineList';
import { CTABlock } from './CTABlock';

export const mdxComponents = {
  img: ({ src, alt }: { src: string; alt: string }) => (
    <Image
      src={src}
      alt={alt}
      width={1024}
      height={768}
      className="rounded-2xl my-8"
      sizes="(min-width: 768px) 768px, 100vw"
    />
  ),
  a: ({ href, children }: any) => (
    <Link href={href} className="text-rose underline">
      {children}
    </Link>
  ),
  Quote,
  TimelineList,
  CTABlock,
};
```

Then in MDX:
```mdx
<Quote attribution="Steffi">
  Every dress is a story.
</Quote>

<CTABlock title="Book a fitting" href="/book-a-fitting" />
```

### Anti-patterns (journal)
- ❌ Posts under 500 words (Google considers thin content)
- ❌ Posts without a `coverImage`
- ❌ Slugs with spaces, capitals, or special chars (use kebab-case ASCII only)
- ❌ Same title on multiple posts (slug clashes, SEO disaster)
- ❌ Auto-publishing draft posts (use `publishedAt` in the future to schedule)
- ❌ Missing `excerpt` (SERP description falls back to first paragraph, often bad)
- ❌ Skipping the BlogPosting JSON-LD
- ❌ Heavy embed widgets (iframes from random services) — slows Lighthouse
- ❌ Posts written by ChatGPT in obvious AI voice — write to brand voice

## Quick Reference

- Reviews: Supabase table, moderation via `is_published`, render server-side
- Journal: MDX files in `/content/journal/`, render with `next-mdx-remote/rsc`
- Both: dedicated detail page, BreadcrumbList + LocalBusiness JSON-LD on the index
- Both: include in `sitemap.ts` dynamically
