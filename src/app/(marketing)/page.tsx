/**
 * Home page — Phase 3
 *
 * Server component. Fetches featured products from Supabase (gracefully
 * degrades if Supabase is not available). Composes all marketing sections.
 *
 * Steffi photo rule: bride-bangles-portrait.jpg is the hero image per
 * IMAGE_BRIEF.md — non-negotiable.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Hero } from '@/components/marketing/Hero';
import { FeaturedProductsStrip } from '@/components/marketing/FeaturedProductsStrip';
import { AboutTeaser } from '@/components/marketing/AboutTeaser';
import { ServicesPreview } from '@/components/marketing/ServicesPreview';
import { ReviewsStrip } from '@/components/marketing/ReviewsStrip';
import { JournalTeaser } from '@/components/marketing/JournalTeaser';
import { FinalCta } from '@/components/marketing/FinalCta';
import { RevealOnScroll } from '@/components/marketing/RevealOnScroll';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getFeaturedProducts } from '@/features/products/api';
import {
  heroHome,
  aboutTeaser,
  servicesPreview,
  journalTeaser,
  finalCta,
} from '@/content/marketing/home';
import { homeReviews } from '@/content/marketing/reviews-seed';
import type { ProductCard } from '@/features/products/api';

// blurDataURL for bride-bangles-portrait — from data/optimised-images.json
const BANGLES_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AJt6W5x+ZZ+Dc5iAbJ2AYYhqTWhMNQCehnG2n5JjUkk4JR2qlIKbfmiCYkwAn4Nxy6+hHwAAMxkQspSGrYt2kGpVAKCBZeG6onlSPqd9aNOnkJ93XpRvVwCynIHhwam9lX+vh3HdtZ2zkXiRcVgA38ywy7afyrOfxaubuZyOr5F5lHRUAPfiz72unsq9sc29sqyUiO/bzLeqmwDv5+LIwr718e///Pe2qp7S0M34//8A5eTp6erw8vX7+/v/1tDNt7a36e32ANDR0tfb3d7j7Obo8u7s8tTQ197d5xCciFay3+EUAAAAAElFTkSuQmCC';

export const metadata: Metadata = buildMetadata('/');

export default async function HomePage() {
  // Fetch featured products — gracefully degrade if Supabase not available
  let featuredProducts: ProductCard[] = [];
  try {
    featuredProducts = await getFeaturedProducts(4);
  } catch {
    // Supabase not available in local dev without credentials — render without
  }

  return (
    <>
      {/* Structured data */}
      {organizationJsonLd()}
      {websiteJsonLd()}

      {/* Hero — Steffi photo (bride-bangles-portrait.jpg) per IMAGE_BRIEF.md */}
      <Hero
        kicker={heroHome.kicker}
        headline={heroHome.headline}
        subhead={heroHome.subhead}
        primaryCta={heroHome.primaryCta}
        secondaryCta={heroHome.secondaryCta}
        image={{
          src: '/assets/hero/bride-bangles-portrait.jpg',
          alt: 'Steffi adjusts a bride\'s bangles before a fitting at the Steffny Couture studio in Hounslow',
          blurDataURL: BANGLES_BLUR,
          width: 1920,
          height: 2876,
        }}
        variant="home"
      />

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <Section tone="surface" spacing="md" id="collection">
          <Container>
            <RevealOnScroll>
              <div className="space-y-12">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="text-label text-rose tracking-widest uppercase">
                      From the studio
                    </span>
                    <h2 className="font-display text-display-sm md:text-display text-ink mt-3 text-balance">
                      A few pieces from the collection
                    </h2>
                  </div>
                  <Link
                    href="/dresses"
                    className="text-small text-rose shrink-0 font-medium hover:underline"
                  >
                    View all dresses →
                  </Link>
                </div>
                <FeaturedProductsStrip products={featuredProducts} />
              </div>
            </RevealOnScroll>
          </Container>
        </Section>
      )}

      {/* About teaser */}
      <Section tone="ivory" spacing="md">
        <Container>
          <RevealOnScroll>
            <AboutTeaser data={aboutTeaser} />
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Services preview */}
      <Section tone="surface-alt" spacing="md">
        <Container>
          <RevealOnScroll>
            <ServicesPreview data={servicesPreview} />
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Reviews */}
      <Section tone="surface" spacing="md">
        <Container>
          <RevealOnScroll>
            <ReviewsStrip reviews={homeReviews} />
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Journal teaser */}
      <Section tone="ivory" spacing="md">
        <Container>
          <RevealOnScroll>
            <JournalTeaser data={journalTeaser} />
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Final CTA */}
      <FinalCta
        headline={finalCta.headline}
        body={finalCta.body}
        primaryCta={finalCta.primaryCta}
        secondaryCta={finalCta.secondaryCta}
      />
    </>
  );
}
