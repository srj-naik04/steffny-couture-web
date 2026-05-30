/**
 * Journal post page — Phase 7
 *
 * Server component. Renders a single MDX journal post.
 * Static params generated from all .mdx files in content/journal/.
 * Structured data: BlogPosting JSON-LD.
 *
 * View tracking intentionally deferred — increment_view RPC has anon EXECUTE
 * revoked (migration 0004 update). Will be wired via Edge Function cron later.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { RevealOnScroll } from '@/components/marketing/RevealOnScroll';
import { safeJsonLd } from '@/lib/seo/jsonld';
import { siteUrl } from '@/lib/env';
import { BRAND } from '@/constants/brand';
import {
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
} from '@/features/journal/loader';

// ---------------------------------------------------------------------------
// Static params — pre-render all post slugs at build time
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${siteUrl}/journal/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'en_GB',
      url,
      siteName: BRAND.name,
      title: `${post.title} — ${BRAND.name}`,
      description: post.description,
      images: [
        {
          url: `${siteUrl}${post.heroImage}`,
          width: 1200,
          height: 630,
          alt: post.heroImageAlt,
        },
      ],
      publishedTime: post.date,
    },
  };
}

// ---------------------------------------------------------------------------
// BlogPosting JSON-LD
// ---------------------------------------------------------------------------

function blogPostingJsonLd(post: Awaited<ReturnType<typeof getPostBySlug>>) {
  if (!post) return null;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `${siteUrl}${post.heroImage}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: `${siteUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: BRAND.name,
      url: siteUrl,
    },
    url: `${siteUrl}/journal/${post.slug}`,
    keywords: post.tags.join(', '),
    inLanguage: 'en-GB',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/journal/${post.slug}`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

// ---------------------------------------------------------------------------
// MDX component overrides — ensure all images use next/image
// ---------------------------------------------------------------------------

const mdxComponents = {
  img: ({
    src,
    alt,
    width,
    height,
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const safeSrc = typeof src === 'string' ? src : '';
    return (
      <span className="my-8 block overflow-hidden rounded-xl">
        <Image
          src={safeSrc}
          alt={alt ?? ''}
          width={Number(width) || 1200}
          height={Number(height) || 675}
          className="w-full object-cover"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </span>
    );
  },
  a: ({
    href,
    children,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href?.startsWith('/');
    if (isInternal) {
      return (
        <Link href={href ?? '/'} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, post.tags, 2);

  return (
    <>
      {blogPostingJsonLd(post)}

      {/* Hero image */}
      <div className="relative w-full aspect-video max-h-96 md:max-h-112 overflow-hidden bg-surface-alt">
        <Image
          src={post.heroImage}
          alt={post.heroImageAlt}
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ivory/40" aria-hidden="true" />
      </div>

      {/* Article header */}
      <Section tone="ivory" spacing="sm">
        <Container size="narrow">
          <RevealOnScroll>
            <header className="space-y-4">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-label text-ink-muted">
                  <li>
                    <Link href="/journal" className="hover:text-rose transition-colors">
                      Journal
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-ink-muted truncate max-w-xs" aria-current="page">
                    {post.title}
                  </li>
                </ol>
              </nav>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-label bg-rose-soft text-rose rounded-full px-3 py-0.5 tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="font-display text-display-sm md:text-display text-ink text-balance">
                {post.title}
              </h1>

              <div className="bg-gold h-px w-16" aria-hidden="true" />

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-ink-muted">
                <span>
                  By <span className="font-medium text-ink">{post.author}</span>
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingMinutes} min read</span>
              </div>
            </header>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* MDX body */}
      <Section tone="ivory" spacing="sm">
        <Container size="narrow">
          <article className="journal-prose"
          >
            <MDXRemote source={post.content} components={mdxComponents} />
          </article>
        </Container>
      </Section>

      {/* Related posts */}
      {related.length > 0 && (
        <Section tone="surface-alt" spacing="md">
          <Container>
            <RevealOnScroll>
              <div className="space-y-8">
                <div>
                  <span className="text-label text-rose tracking-widest uppercase">
                    Continue reading
                  </span>
                  <h2 className="font-display text-display-sm text-ink mt-2">
                    From the journal
                  </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/journal/${rel.slug}`}
                      className="group block overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md"
                      aria-label={`Read: ${rel.title}`}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={rel.heroImage}
                          alt={rel.heroImageAlt}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                      <div className="p-5 space-y-2">
                        <h3 className="font-display text-headline text-ink text-balance group-hover:text-rose transition-colors">
                          {rel.title}
                        </h3>
                        <p className="text-small text-ink-muted">
                          {rel.readingMinutes} min read
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </Section>
      )}

      {/* Back link */}
      <Section tone="ivory" spacing="sm">
        <Container size="narrow">
          <Link
            href="/journal"
            className="text-small text-rose hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded"
          >
            ← Back to the journal
          </Link>
        </Container>
      </Section>
    </>
  );
}
