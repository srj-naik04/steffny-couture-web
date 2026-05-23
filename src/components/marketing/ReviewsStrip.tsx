/**
 * ReviewsStrip — Phase 3
 *
 * Server component. Renders a scrollable strip of testimonial cards.
 * Consumes homeReviews from src/content/marketing/reviews-seed.ts.
 * Phase 7 replaces this with live Supabase reads.
 */

import { SectionHeader } from './SectionHeader';
import type { HomeReview } from '@/content/marketing/reviews-seed';

interface ReviewsStripProps {
  reviews: HomeReview[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div role="img" className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 12 12"
          fill={i < rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1"
          className={`size-3.5 ${i < rating ? 'text-gold' : 'text-border-strong'}`}
          aria-hidden="true"
        >
          <path d="M6 0.5l1.545 3.13 3.455.502-2.5 2.437.59 3.44L6 8.395l-3.09 1.614.59-3.44L1 4.132l3.455-.502z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsStrip({ reviews }: ReviewsStripProps) {
  return (
    <div className="space-y-12">
      <SectionHeader
        eyebrow="Reviews"
        headline="From our customers"
        subhead="What brides, bridesmaids, and occasion-wear customers say about working with the studio."
        align="center"
      />

      {/* Scrollable card row */}
      <div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Customer testimonials"
      >
        {reviews.slice(0, 6).map((review) => (
          <article
            key={review.id}
            role="listitem"
            className="bg-surface border-border flex flex-col gap-4 rounded-xl border p-6"
          >
            <StarRating rating={review.rating} />
            <blockquote className="text-body text-ink-muted flex-1 text-pretty italic leading-relaxed">
              &ldquo;{review.body}&rdquo;
            </blockquote>
            <footer className="mt-auto border-t border-border pt-4">
              <p className="text-small font-semibold text-ink">{review.name}</p>
              <p className="text-label text-ink-muted mt-0.5">{review.role}</p>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
