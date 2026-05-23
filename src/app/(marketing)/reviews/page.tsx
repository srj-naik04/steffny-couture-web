/**
 * Reviews page — Phase 7
 *
 * Server component shell. Replaces the Phase 3 stub.
 * Left column: full grid of all 14 reviews (8 from Phase 3 seed + 6 extra).
 * Right column: leave-a-review form (client component).
 *
 * Reviews are currently static (from content files). Phase 8+ can migrate
 * to a live Supabase read for published reviews.
 */

import type { Metadata } from 'next';
import { Hero } from '@/components/marketing/Hero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { RevealOnScroll } from '@/components/marketing/RevealOnScroll';
import { buildMetadata } from '@/lib/seo/metadata';
import { ReviewForm } from '@/features/reviews/components/ReviewForm';
import { homeReviews } from '@/content/marketing/reviews-seed';
import { extraReviews } from '@/content/marketing/reviews-extra';
import { reviewsIntroCopy } from '@/content/marketing/reviews-intro';

export const metadata: Metadata = buildMetadata('/reviews');

const allReviews = [...homeReviews, ...extraReviews];

// ---------------------------------------------------------------------------
// Star rating display
// ---------------------------------------------------------------------------

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReviewsPage() {
  return (
    <>
      <Hero
        kicker={reviewsIntroCopy.hero.kicker}
        headline={reviewsIntroCopy.hero.headline}
        subhead={reviewsIntroCopy.hero.subhead}
        variant="contact"
      />

      <Section tone="ivory" spacing="md">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">

            {/* ---------------------------------------------------------------- */}
            {/* Reviews grid                                                      */}
            {/* ---------------------------------------------------------------- */}
            <div className="space-y-10">
              <div>
                <span className="text-label text-rose tracking-widest uppercase">
                  Customer reviews
                </span>
                <h2 className="font-display text-display-sm text-ink mt-2 text-balance">
                  {allReviews.length} reviews
                </h2>
                <div className="bg-gold mt-4 h-px w-16" aria-hidden="true" />
              </div>

              {allReviews.length === 0 ? (
                <p className="text-body text-ink-muted">{reviewsIntroCopy.empty}</p>
              ) : (
                <div
                  className="grid gap-6 sm:grid-cols-2"
                  role="list"
                  aria-label="Customer testimonials"
                >
                  {allReviews.map((review, i) => (
                    <RevealOnScroll key={review.id} delay={i * 0.03}>
                      <article
                        role="listitem"
                        className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6"
                      >
                        <StarRating rating={review.rating} />
                        <blockquote className="text-body text-ink-muted flex-1 text-pretty italic leading-relaxed">
                          &ldquo;{review.body}&rdquo;
                        </blockquote>
                        <footer className="mt-auto border-t border-border pt-4">
                          <p className="text-small font-semibold text-ink">
                            {review.name}
                          </p>
                          <p className="text-label text-ink-subtle mt-0.5">
                            {review.role}
                          </p>
                        </footer>
                      </article>
                    </RevealOnScroll>
                  ))}
                </div>
              )}
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Leave a review form                                               */}
            {/* ---------------------------------------------------------------- */}
            <aside aria-label="Leave a review">
              <div className="lg:sticky lg:top-24 space-y-6">
                <div>
                  <span className="text-label text-rose tracking-widest uppercase">
                    Share your experience
                  </span>
                  <h2 className="font-display text-title text-ink mt-2 text-balance">
                    Leave a review
                  </h2>
                  <div className="bg-gold mt-4 h-px w-12" aria-hidden="true" />
                </div>

                <p className="text-body text-ink-muted text-pretty">
                  {reviewsIntroCopy.formIntro}
                </p>

                <ReviewForm />
              </div>
            </aside>

          </div>
        </Container>
      </Section>
    </>
  );
}
