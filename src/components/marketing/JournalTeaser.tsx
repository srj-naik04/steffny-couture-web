/**
 * JournalTeaser — Phase 3
 *
 * Server component. Three placeholder journal post cards with images.
 * Phase 7 replaces with live MDX post data.
 * Images: beaded-bodice-detail, bride-white-tulle-moody, bride-maroon-interior
 * — unique to this section, no same-page duplication.
 */

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from './SectionHeader';
import type { JournalTeaser as JournalTeaserData } from '@/content/marketing/home';

// Placeholder posts — Phase 7 will replace with real MDX content
const PLACEHOLDER_POSTS = [
  {
    slug: 'wedding-dress-alteration-timeline',
    title: 'How far in advance should you book your wedding dress alterations?',
    excerpt:
      'The answer depends on the dress, the alterations needed, and your ceremony date. Here is a practical guide from our studio in Hounslow.',
    date: '15 January 2026',
    readingTime: '5 min read',
    category: 'Alterations',
    imageSrc: '/assets/hero/beaded-bodice-detail.jpg',
    imageAlt: 'Beaded bodice detail close-up — a bridal gown at Steffny Couture',
    imageBlur:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AB8RHhgYDhsbDiEPGiMWIB4bGiEbGwATEBULEiAPFRw3MysgHyIPERsWFBYAFBIEDxAqBwQXoZdyXE8/AgAOEBQYABEQAw8PGgkABZt9W8qkgBwQCgoQFwAKGidUZGOcmZPQrKf/9c6ol38DBxIADB4xU3J1fYyOYEtXVkZHkoRtPSwjABAYISE+RBQqNV5RYVhJVYBuW0AtHgAPFRYbLjgQJzlNSVexk5FxVksRCwsADxkaDBYhDRosNz5KqpGSQigsDw8XAAwpMhgcKRYTIDA6QmFcazwrQRkVH4wyL1w9zAG3AAAAAElFTkSuQmCC',
  },
  {
    slug: 'lehenga-vs-anarkali-what-to-choose',
    title: 'Lehenga versus anarkali: which works for your ceremony?',
    excerpt:
      'Two of the most popular South Asian bridal silhouettes, each with distinct advantages. We break down the practical differences from a fitting perspective.',
    date: '28 February 2026',
    readingTime: '7 min read',
    category: 'Bridal',
    imageSrc: '/assets/hero/bride-white-tulle-moody.jpg',
    imageAlt: 'Bride in a white tulle gown in a moody, atmospheric setting',
    imageBlur:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKCAIAAAAYbLhkAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxklEQVR4nGNQ0bezdAnzCs6wcw01MLbR1TFiEAQBYVFBUWE+XmFBXiFBCQYReUVpOQVRYTFRCVFBcTFxcQkGXmkFXj5BV0cHeXlFQXEJMTExBglxcRkhoQAHa1VpMWZGRnFxEQZxEUkJGTU/N7e1ixeEhsXx8wsy8IopF9f1LZw7/9LRI7///M8pbmRQ1Heesmjn+nU7c1Mz9xy8uOXAVQY7j3jPiNL2rpm1tZ2Z5X35Fd0Mpg7+tp7RfiFpQVG5th5xGnrWAMG4MgIswhhkAAAAAElFTkSuQmCC',
  },
  {
    slug: 'first-alteration-appointment-what-to-bring',
    title: 'What to bring to your first alteration appointment',
    excerpt:
      'The most important things to have with you — shoes, undergarments, and a clear sense of the occasion — and why each one matters to getting the fit right.',
    date: '10 March 2026',
    readingTime: '4 min read',
    category: 'Guide',
    imageSrc: '/assets/hero/bride-maroon-interior.jpg',
    imageAlt: 'Bride in a maroon dress inside an elegant interior setting',
    imageBlur:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAABQUlEQVR4nAE2Acn+AFZEPUA5F5BdNferY//GeN6gZs2RT3xlLiYbBjYsGAArFxUrIguVZz/tqmdpPB1nNBvrr21iRh9EMhpBLRoAOx4aGAcAm3ZP+MJ6hV83fk8z+sF+WzkaSi4bTCwXMSULPzERRzMUTDkWAKuHiJVyd5diXcilnuqxqfTBuM+smqqilJ6bkomaAFdMMFtEJmVWN3pkRqCRiMqqlrSVeI2Bc4FuXVNGNQBNPS9NNhxiUDRwYkGShXGfgm2hiGueaFBLPSwUCA8FAAAAAAElFTkSuQmCC',
  },
];

interface JournalTeaserProps {
  data: JournalTeaserData;
}

export function JournalTeaser({ data }: JournalTeaserProps) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow={data.eyebrow}
          headline={data.headline}
          subhead={data.body}
        />
        <Button href={data.cta.href} variant="secondary" className="shrink-0">
          {data.cta.label}
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {PLACEHOLDER_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/journal/${post.slug}`}
            className="group block overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md"
            aria-label={`Read: ${post.title}`}
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={post.imageSrc}
                alt={post.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
                blurDataURL={post.imageBlur}
                placeholder="blur"
              />
            </div>
            <div className="p-6">
              <span className="text-label text-rose tracking-widest uppercase">
                {post.category}
              </span>
              <h3 className="font-display text-headline text-ink mt-3 text-balance group-hover:text-rose transition-colors">
                {post.title}
              </h3>
              <p className="text-body text-ink-muted mt-3 text-pretty line-clamp-3">
                {post.excerpt}
              </p>
              <div className="text-label text-ink-subtle mt-4 flex items-center gap-3">
                <time>{post.date}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
