/**
 * Custom bridal service page — Phase 3
 *
 * Server component. Hero + intro + what we do + process + FAQs + CTA.
 * Uses bride-maroon-arch.jpg — custom-bridal Steffi rule relaxed per phase-3 cycle-2 brief.
 */

import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Hero } from '@/components/marketing/Hero';
import { FinalCta } from '@/components/marketing/FinalCta';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Prose } from '@/components/marketing/Prose';
import { RevealOnScroll } from '@/components/marketing/RevealOnScroll';
import { buildMetadata } from '@/lib/seo/metadata';
import { customBridal } from '@/content/marketing/services';

// blurDataURL for bride-maroon-arch — from data/optimised-images.json
const MAROON_ARCH_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAIAAABPmPnhAAAACXBIWXMAAAsTAAALEwEAmpwYAAABA0lEQVR4nAH4AAf/ABgRABcHACgXDiETCSAYCCQfD11QQZuGc5aFYezatAAdFQAgEgA2JRoQAAAZDwA0LhsmGwVzYE2yoYDz5L8AJBYAJBQAKxsLFwAAKxwOPzAhRjgkeWxUyr2c/fPQACoYACsaATUkERkAACUPADckFxcAAIiAZdbNrv/52QA4JAcvIARCNR80Hg9mRzyMal8bAACZj3fY0LL//uAAPikSPzMaMykTMxsNjWNgvoyLMBEEf3Fe5dvC//3hAEs4H0A4HjYyHC0WDVgnKXg8QTEIBIlyZurcwv/w1ABNPCRGQCg8OCUQAAA9DBKMR1I3BAaNcmry3sTn1LgVpEuWnda7VwAAAABJRU5ErkJggg==';

export const metadata: Metadata = buildMetadata('/services/custom-bridal');

export default function CustomBridalPage() {
  const { hero, intro, what_we_do, process, faqs, cta } = customBridal;

  return (
    <>
      {/* Hero — bride-maroon-arch.jpg — unique to this page, no duplication */}
      <Hero
        kicker={hero.kicker}
        headline={hero.headline}
        subhead={hero.subhead}
        primaryCta={{ label: 'Book a consultation', href: '/book' }}
        secondaryCta={{ label: 'Learn about the studio', href: '/about' }}
        image={{
          src: '/assets/hero/bride-maroon-arch.jpg',
          alt: 'Bride in a maroon gown beneath a floral arch — Steffny Couture custom bridal, Hounslow',
          blurDataURL: MAROON_ARCH_BLUR,
          width: 800,
          height: 600,
        }}
        variant="service"
      />

      {/* Intro */}
      <Section tone="ivory" spacing="md">
        <Container size="narrow">
          <RevealOnScroll>
            <Prose>
              <p>{intro}</p>
            </Prose>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* What a commission includes */}
      <Section tone="surface-alt" spacing="md">
        <Container>
          <RevealOnScroll>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
              <SectionHeader
                eyebrow="What's included"
                headline={what_we_do.heading}
              />
              <ul className="space-y-4" aria-label="What a custom bridal commission includes">
                {what_we_do.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 size-5 shrink-0 rounded-full bg-rose-soft flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        className="size-3 text-rose"
                        aria-hidden="true"
                      >
                        <path d="M10.28 2.28 4.75 7.81 2.22 5.28 1 6.5l3.75 3.75 6.75-6.75z" />
                      </svg>
                    </span>
                    <span className="text-body text-ink-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Process */}
      <Section tone="ivory" spacing="md">
        <Container>
          <RevealOnScroll>
            <div className="space-y-12">
              <SectionHeader
                eyebrow="The process"
                headline={process.heading}
              />
              <ol
                className="grid gap-6 sm:grid-cols-2"
                aria-label="Custom bridal commission process"
              >
                {process.steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="rounded-xl border border-border bg-surface p-6 space-y-3"
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-rose text-ivory text-label font-medium"
                      aria-label={`Step ${index + 1}`}
                    >
                      {index + 1}
                    </span>
                    <h3 className="font-display text-headline text-ink">
                      {step.title}
                    </h3>
                    <p className="text-body text-ink-muted">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* FAQs */}
      <Section tone="surface-alt" spacing="md">
        <Container size="narrow">
          <RevealOnScroll>
            <div className="space-y-8">
              <SectionHeader
                eyebrow="Questions"
                headline="Frequently asked questions"
              />
              <div className="divide-y divide-border">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                      <span className="font-display text-headline text-ink">
                        {faq.question}
                      </span>
                      <span
                        className="mt-0.5 shrink-0 text-rose transition-transform group-open:rotate-45"
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 16 16" fill="currentColor" className="size-5">
                          <path d="M8 2a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H9v4a1 1 0 1 1-2 0V9H3a1 1 0 1 1 0-2h4V3a1 1 0 0 1 1-1z" />
                        </svg>
                      </span>
                    </summary>
                    <p className="text-body text-ink-muted mt-4 text-pretty">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      <FinalCta
        headline={cta.headline}
        body={cta.body}
        primaryCta={cta.primaryCta}
        secondaryCta={cta.secondaryCta}
      />
    </>
  );
}
