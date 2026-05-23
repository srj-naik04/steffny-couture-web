/**
 * About page — Phase 3
 *
 * Server component. Full brand story with photos.
 * Opens with Steffi photo (bride-bouquet-detail.jpg) per IMAGE_BRIEF.md.
 * About-page placeholders are Pexels stock and marked data-placeholder="true".
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Hero } from '@/components/marketing/Hero';
import { FinalCta } from '@/components/marketing/FinalCta';
import { Prose } from '@/components/marketing/Prose';
import { RevealOnScroll } from '@/components/marketing/RevealOnScroll';
import { buildMetadata } from '@/lib/seo/metadata';
import { personJsonLd } from '@/lib/seo/jsonld';
import { aboutHero, aboutSections, aboutQuote } from '@/content/marketing/about';

// blurDataURL for bride-bouquet-detail — from data/optimised-images.json
const BOUQUET_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AJt6W5x+ZZ+Dc5iAbJ2AYYhqTWhMNQCehnG2n5JjUkk4JR2qlIKbfmiCYkwAn4Nxy6+hHwAAMxkQspSGrYt2kGpVAKCBZeG6onlSPqd9aNOnkJ93XpRvVwCynIHhwam9lX+vh3HdtZ2zkXiRcVgA38ywy7afyrOfxaubuZyOr5F5lHRUAPfiz72unsq9sc29sqyUiO/bzLeqmwDv5+LIwr718e///Pe2qp7S0M34//8A5eTp6erw8vX7+/v/1tDNt7a36e32ANDR0tfb3d7j7Obo8u7s8tTQ197d5xCciFay3+EUAAAAAElFTkSuQmCC';

export const metadata: Metadata = buildMetadata('/about');

// Placeholder images for the about gallery (Pexels stock — replace before launch)
const PLACEHOLDER_IMAGES = [
  {
    src: '/assets/about/placeholder-boutique-interior.jpg',
    alt: 'The Steffny Couture studio interior — placeholder, to be replaced with studio photograph',
    caption: 'The studio on the High Street, Hounslow',
  },
  {
    src: '/assets/about/placeholder-designer-fitting.jpg',
    alt: 'A fitting session at the Steffny Couture studio — placeholder, to be replaced with real studio photograph',
    caption: 'Every fitting is given the time it deserves',
  },
  {
    src: '/assets/about/placeholder-hands-sewing.jpg',
    alt: 'Hands sewing fabric detail — placeholder, to be replaced with real studio photograph',
    caption: 'Hand-finished seams throughout',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Structured data */}
      {personJsonLd()}

      {/* Hero — Steffi photo (bride-bouquet-detail.jpg) per IMAGE_BRIEF.md */}
      <Hero
        kicker={aboutHero.kicker}
        headline={aboutHero.headline}
        subhead={aboutHero.subhead}
        image={{
          src: '/assets/hero/bride-bouquet-detail.jpg',
          alt: 'Steffi, founder of Steffny Couture, with a bridal bouquet — the studio in Hounslow',
          blurDataURL: BOUQUET_BLUR,
          width: 1920,
          height: 2876,
        }}
        variant="about"
      />

      {/* Narrative sections */}
      <Section tone="ivory" spacing="md">
        <Container size="narrow">
          <div className="space-y-16">
            {aboutSections.map((section, index) => (
              <RevealOnScroll key={section.heading} delay={index * 0.05}>
                <div className="space-y-4">
                  <h2 className="font-display text-title text-ink">
                    {section.heading}
                  </h2>
                  <div className="bg-gold h-px w-12" aria-hidden="true" />
                  <Prose>
                    <p>{section.body}</p>
                  </Prose>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* Pull quote */}
      <Section tone="surface-alt" spacing="sm">
        <Container size="narrow">
          <RevealOnScroll>
            <figure className="mx-auto max-w-prose text-center space-y-4">
              <div className="text-gold text-5xl font-display leading-none" aria-hidden="true">
                &ldquo;
              </div>
              <blockquote className="font-display text-display-sm text-ink text-balance italic">
                {aboutQuote.quote}
              </blockquote>
              <figcaption className="text-body text-ink-muted">
                {aboutQuote.attribution}
              </figcaption>
            </figure>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Photo gallery — Pexels placeholders, marked for replacement */}
      <Section tone="ivory" spacing="md">
        <Container>
          <RevealOnScroll>
            <div className="space-y-8">
              <div className="text-center">
                <span className="text-label text-rose tracking-widest uppercase">
                  The studio
                </span>
                <h2 className="font-display text-display-sm text-ink mt-3">
                  Where the work happens
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3" aria-label="Studio photographs">
                {PLACEHOLDER_IMAGES.map((img) => (
                  <figure
                    key={img.src}
                    className="space-y-2"
                    data-placeholder="true"
                  >
                    <div className="relative aspect-3/4 overflow-hidden rounded-xl">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                    <figcaption className="text-label text-ink-subtle text-center">
                      {img.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>

              <p className="text-label text-ink-subtle text-center">
                Studio photographs coming soon — Steffi to provide final images.
              </p>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Final CTA */}
      <FinalCta
        headline="Ready to visit the studio?"
        body="Book a free consultation and come and see where the work happens. No obligation, just a conversation about your piece."
        primaryCta={{ label: 'Book a fitting', href: '/book' }}
        secondaryCta={{ label: 'Contact us', href: '/contact' }}
      />
    </>
  );
}
