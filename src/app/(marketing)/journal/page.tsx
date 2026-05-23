/**
 * Journal index page — Phase 7
 *
 * Server component. Replaces the Phase 3 stub.
 * Renders a grid of journal post cards from MDX files in content/journal/.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/marketing/Hero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { RevealOnScroll } from '@/components/marketing/RevealOnScroll';
import { buildMetadata } from '@/lib/seo/metadata';
import { getAllPosts } from '@/features/journal/loader';
import { journalIndexCopy } from '@/content/marketing/journal-index';

export const metadata: Metadata = buildMetadata('/journal');

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function JournalPage() {
  const posts = getAllPosts();

  return (
    <>
      <Hero
        kicker={journalIndexCopy.hero.kicker}
        headline={journalIndexCopy.hero.headline}
        subhead={journalIndexCopy.hero.subhead}
        variant="contact"
      />

      <Section tone="ivory" spacing="md">
        <Container>
          {posts.length === 0 ? (
            <p className="text-body text-ink-muted text-center py-16">
              {journalIndexCopy.empty}
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <RevealOnScroll key={post.slug} delay={i * 0.05}>
                  <Link
                    href={`/journal/${post.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                    aria-label={`Read: ${post.title}`}
                  >
                    {/* Hero image */}
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={post.heroImage}
                        alt={post.heroImageAlt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    {/* Card body */}
                    <div className="p-6 space-y-3">
                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <span className="text-label text-rose tracking-widest uppercase">
                          {post.tags[0]}
                        </span>
                      )}

                      <h2 className="font-display text-headline text-ink text-balance group-hover:text-rose transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-body text-ink-muted text-pretty line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="text-label text-ink-muted flex items-center gap-3 pt-1">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <span aria-hidden="true">·</span>
                        <span>{post.readingMinutes} min read</span>
                      </div>
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
