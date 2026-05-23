/**
 * JournalTeaser — Phase 3 (updated Phase 7)
 *
 * Server component. Renders up to 3 journal post cards.
 * Phase 7: accepts real post data from the journal loader; falls back to
 * placeholder posts if none are supplied (consistent with Phase 3 behaviour).
 */

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from './SectionHeader';
import type { JournalTeaser as JournalTeaserData } from '@/content/marketing/home';

// ---------------------------------------------------------------------------
// Placeholder posts — retained as fallback if loader is unavailable
// ---------------------------------------------------------------------------

const PLACEHOLDER_POSTS = [
  {
    slug: 'bridal-alterations-timeline',
    title: 'Bridal alterations timeline: what to expect from first fitting to wedding day',
    excerpt:
      'A clear, honest guide to bridal dress alterations in the UK — how many fittings you need, when to start, and how to look after your dress once it is finished.',
    date: '18 April 2026',
    readingTime: '7 min read',
    category: 'Alterations',
    imageSrc: '/assets/hero/bride-maroon-interior.jpg',
    imageAlt: 'A bride in a deep maroon gown photographed in a warm interior setting',
    imageBlur:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAABQUlEQVR4nAE2Acn+AFZPT2NYV3xpaZN6ep+Kiqubm6ykpq2qraimrJuZngBbVFRtYGBtW1p6ZGKGcXGLfHyspae4tLizr7aloqcAW1NTZlhYIhEOKhkXWEVFSDs6o5udx8PHvr3CsK60ADwxMWVaVw0AAD8xLnNkYldLS7WusMS+xMC+xLSyuQBOREZiVlUOAQAhFQ64qqlPRkSYkJPIwse6uL6xr7UAUkdITkJBRTk2WlFL0cjE08zKpp+gubK5r62zpqOqAD0yMisjIUg+O42Gf87Hwv/8+L+7vaKcoqmnrZ+dowAcDxEgFxN3bmqXkYvCvrns5+Pl4OGblJqFgod4dn0AQDk3d3Ftn5uXm5WTtrOw4N/f7Ors1NHSs7GyamhpAIiCf6CalpiUj6qmpaqmpc7MzNXS1NnX2NTQ0aajppTVn5566m1zAAAAAElFTkSuQmCC',
  },
  {
    slug: 'how-to-choose-a-wedding-dress-in-hounslow',
    title: 'How to choose a wedding dress in Hounslow',
    excerpt:
      'A practical guide for brides in West London — from setting a realistic budget and lead time to what actually happens at a first fitting with a couturier.',
    date: '5 April 2026',
    readingTime: '8 min read',
    category: 'Bridal',
    imageSrc: '/assets/hero/bride-white-tulle-moody.jpg',
    imageAlt: 'Bride in a white tulle gown in a moody, atmospheric setting',
    imageBlur:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKCAIAAAAYbLhkAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxklEQVR4nGNQ0bezdAnzCs6wcw01MLbR1TFiEAQBYVFBUWE+XmFBXiFBCQYReUVpOQVRYTFRCVFBcTFxcQkGXmkFXj5BV0cHeXlFQXEJMTExBglxcRkhoQAHa1VpMWZGRnFxEQZxEUkJGTU/N7e1ixeEhsXx8wsy8IopF9f1LZw7/9LRI7///M8pbmRQ1Heesmjn+nU7c1Mz9xy8uOXAVQY7j3jPiNL2rpm1tZ2Z5X35Fd0Mpg7+tp7RfiFpQVG5th5xGnrWAMG4MgIswhhkAAAAAElFTkSuQmCC',
  },
  {
    slug: 'south-asian-bridal-and-bridesmaid-wear',
    title: 'South Asian bridal and bridesmaid wear: a guide from the studio',
    excerpt:
      'From lehenga to anarkali, sharara to gharara — a practical guide to South Asian bridal silhouettes, colour coordination, and dressing a mixed bridal party in West London.',
    date: '22 March 2026',
    readingTime: '9 min read',
    category: 'Bridal',
    imageSrc: '/assets/hero/bride-maroon-arch.jpg',
    imageAlt: 'A bride in a rich maroon lehenga standing beneath a decorative arch',
    imageBlur:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAABQUlEQVR4nAE2Acn+AFZPT2NYV3xpaZN6ep+Kiqubm6ykpq2qraimrJuZngBbVFRtYGBtW1p6ZGKGcXGLfHyspae4tLizr7aloqcAW1NTZlhYIhEOKhkXWEVFSDs6o5udx8PHvr3CsK60ADwxMWVaVw0AAD8xLnNkYldLS7WusMS+xMC+xLSyuQBOREZiVlUOAQAhFQ64qqlPRkSYkJPIwse6uL6xr7UAUkdITkJBRTk2WlFL0cjE08zKpp+gubK5r62zpqOqAD0yMisjIUg+O42Gf87Hwv/8+L+7vaKcoqmnrZ+dowAcDxEgFxN3bmqXkYvCvrns5+Pl4OGblJqFgod4dn0AQDk3d3Ftn5uXm5WTtrOw4N/f7Ors1NHSs7GyamhpAIiCf6CalpiUj6qmpaqmpc7MzNXS1NnX2NTQ0aajppTVn5566m1zAAAAAElFTkSuQmCC',
  },
];

// ---------------------------------------------------------------------------
// Shape for real post data passed from the page
// ---------------------------------------------------------------------------

export interface JournalPostPreview {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO e.g. '2026-04-18'
  readingMinutes: number;
  tags: string[];
  heroImage: string;
  heroImageAlt: string;
}

interface JournalTeaserProps {
  data: JournalTeaserData;
  posts?: JournalPostPreview[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function JournalTeaser({ data, posts }: JournalTeaserProps) {
  // Use real posts if provided; fall back to placeholders
  const items =
    posts && posts.length > 0
      ? posts.slice(0, 3).map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          date: formatDate(p.date),
          readingTime: `${p.readingMinutes} min read`,
          category: p.tags[0] ?? 'Journal',
          imageSrc: p.heroImage,
          imageAlt: p.heroImageAlt,
          imageBlur: undefined as string | undefined,
        }))
      : PLACEHOLDER_POSTS;

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
        {items.map((post) => (
          <Link
            key={post.slug}
            href={`/journal/${post.slug}`}
            className="group block overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
            aria-label={`Read: ${post.title}`}
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={post.imageSrc}
                alt={post.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
                {...(post.imageBlur
                  ? { blurDataURL: post.imageBlur, placeholder: 'blur' as const }
                  : {})}
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
              <div className="text-label text-ink-muted mt-4 flex items-center gap-3">
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
