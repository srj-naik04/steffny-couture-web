/**
 * Services overview page — Phase 3
 *
 * Server component. Hub page linking to the three service detail pages.
 * Data built from the three ServicePage exports in services.ts.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Hero } from '@/components/marketing/Hero';
import { FinalCta } from '@/components/marketing/FinalCta';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { RevealOnScroll } from '@/components/marketing/RevealOnScroll';
import { buildMetadata } from '@/lib/seo/metadata';
import { alterations, customBridal, bridesmaid } from '@/content/marketing/services';

export const metadata: Metadata = buildMetadata('/services');

interface ServiceCard {
  title: string;
  eyebrow: string;
  summary: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}

const serviceCards: ServiceCard[] = [
  {
    title: alterations.hero.headline,
    eyebrow: 'Perfect fit',
    summary:
      'Wedding dresses, lehengas, evening gowns, South Asian bridal wear — adjusted to fit your body as it is, not as a size chart imagines it.',
    href: '/services/alterations',
    imageSrc: '/assets/hero/bride-white-ballgown-train.jpg',
    imageAlt: 'Bride in a white ballgown with a long train — Steffny Couture alterations, Hounslow',
  },
  {
    title: customBridal.hero.headline,
    eyebrow: 'Made for you',
    summary:
      'A commission built from scratch, starting with a consultation and ending with a piece that was made for no one else. Gowns, lehengas, fusion silhouettes.',
    href: '/services/custom-bridal',
    imageSrc: '/assets/hero/bride-maroon-chandelier.jpg',
    imageAlt: 'Bride in a maroon gown beneath a chandelier — Steffny Couture custom bridal, Hounslow',
  },
  {
    title: bridesmaid.hero.headline,
    eyebrow: 'Co-ordinated party',
    summary:
      'Dresses made or altered to fit every person in your bridal party — same colour, same standard, every size. Synchronised fittings, consistent results.',
    href: '/services/bridesmaid',
    imageSrc: '/assets/hero/bride-fuchsia-pampas.jpg',
    imageAlt: 'Bride in a fuchsia gown among pampas grass — Steffny Couture bridesmaid service, Hounslow',
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Minimal text hero */}
      <Hero
        kicker="Steffny Couture"
        headline="What we offer"
        subhead="Three services, one discipline. Whether you are altering a cherished piece, commissioning something new, or dressing an entire bridal party, the approach is the same: patient, precise, and never rushed."
        variant="contact"
      />

      {/* Service cards */}
      <Section tone="ivory" spacing="md">
        <Container>
          <div className="grid gap-8 sm:grid-cols-3">
            {serviceCards.map((card) => (
              <RevealOnScroll key={card.href}>
                <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
                  {/* Image */}
                  <div className="relative aspect-4/3 w-full overflow-hidden">
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6 space-y-4">
                    <span className="text-label text-rose tracking-widest uppercase">
                      {card.eyebrow}
                    </span>
                    <h2 className="font-display text-title text-ink group-hover:text-rose transition-colors">
                      {card.title}
                    </h2>
                    <div className="bg-gold h-px w-8" aria-hidden="true" />
                    <p className="text-body text-ink-muted flex-1 text-pretty">
                      {card.summary}
                    </p>
                    <Button href={card.href} variant="secondary">
                      Learn more
                    </Button>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why us */}
      <Section tone="surface-alt" spacing="md">
        <Container>
          <RevealOnScroll>
            <div className="mx-auto max-w-2xl space-y-8">
              <SectionHeader
                eyebrow="Why choose us"
                headline="The same discipline across every service"
                subhead="Whether you come to us with a finished piece or a blank page, the approach does not change. We listen first, and we do not start work until we understand exactly what you need."
                align="center"
              />

              <dl className="grid gap-6 sm:grid-cols-3">
                {[
                  {
                    term: 'Free consultations',
                    detail:
                      'Every service begins with a free, unhurried consultation. No pressure, no commitment.',
                  },
                  {
                    term: 'Written quotes',
                    detail:
                      'We quote in writing before we begin. What we quote is what you pay.',
                  },
                  {
                    term: 'By appointment',
                    detail:
                      'The studio is yours for your slot. No waiting, no interruptions.',
                  },
                ].map((item) => (
                  <div key={item.term} className="space-y-2">
                    <dt className="font-display text-headline text-ink">
                      {item.term}
                    </dt>
                    <dd className="text-body text-ink-muted">{item.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      <FinalCta
        headline="Not sure which service you need?"
        body="Book a free consultation and bring whatever you have — a dress, a sketch, or just a date and a feeling. We will work it out together."
        primaryCta={{ label: 'Book a fitting', href: '/book' }}
        secondaryCta={{ label: 'Get in touch', href: '/contact' }}
      />
    </>
  );
}
