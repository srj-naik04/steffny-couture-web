/**
 * Contact page — Phase 3
 *
 * Server component. Hero + contact details + map + ContactForm + FounderCard.
 * LocalBusiness JSON-LD structured data.
 * Founder card uses bride-bouquet-detail.jpg per IMAGE_BRIEF.md.
 *
 * Map: static OpenStreetMap embed (no API key required).
 */

import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Hero } from '@/components/marketing/Hero';
import { FinalCta } from '@/components/marketing/FinalCta';
import { ContactForm } from '@/components/marketing/ContactForm';
import { FounderCard } from '@/components/marketing/FounderCard';
import { RevealOnScroll } from '@/components/marketing/RevealOnScroll';
import { localBusinessJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { contactHero, contactIntro, contactDetails, founderCard } from '@/content/marketing/contact';
import { STUDIO } from '@/constants/brand';

export const metadata: Metadata = buildMetadata('/contact');

export default function ContactPage() {
  return (
    <>
      {/* Structured data */}
      {localBusinessJsonLd()}

      {/* Minimal hero — contact page doesn't need a hero image; saves Steffi photos */}
      <Hero
        kicker={contactHero.kicker}
        headline={contactHero.headline}
        subhead={contactHero.subhead}
        variant="contact"
      />

      {/* Two-column: contact details + form */}
      <Section tone="ivory" spacing="md">
        <Container>
          <RevealOnScroll>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left column: details */}
              <div className="space-y-10">
                {/* Intro */}
                <p className="text-body-lg text-ink-muted text-pretty">
                  {contactIntro}
                </p>

                {/* Address */}
                <div className="space-y-2">
                  <h2 className="font-display text-headline text-ink">
                    Studio address
                  </h2>
                  <address className="not-italic space-y-1">
                    <p className="text-body text-ink-muted font-medium">
                      {contactDetails.studioName}
                    </p>
                    {contactDetails.addressLines.map((line) => (
                      <p key={line} className="text-body text-ink-muted">
                        {line}
                      </p>
                    ))}
                  </address>
                  <p className="text-small text-ink-subtle italic">
                    {contactDetails.appointmentNote}
                  </p>
                </div>

                {/* Hours */}
                <div className="space-y-2">
                  <h2 className="font-display text-headline text-ink">
                    Opening hours
                  </h2>
                  <dl className="space-y-1">
                    {contactDetails.hours.map((slot) => (
                      <div key={slot.day} className="flex gap-4">
                        <dt className="text-body text-ink-muted w-44 shrink-0">
                          {slot.day}
                        </dt>
                        <dd className="text-body text-ink-muted">{slot.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Contact methods */}
                <div className="space-y-3">
                  <h2 className="font-display text-headline text-ink">
                    Get in touch
                  </h2>

                  <a
                    href={STUDIO.phoneTel}
                    className="flex items-center gap-3 group"
                    aria-label="Call the studio"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-alt group-hover:bg-rose-soft transition-colors"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 text-rose">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </span>
                    <span className="text-body text-ink group-hover:text-rose transition-colors">
                      {contactDetails.phone}
                    </span>
                  </a>

                  <a
                    href={STUDIO.whatsapp}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-3 group"
                    aria-label="Contact Steffi on WhatsApp"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-alt group-hover:bg-rose-soft transition-colors"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-rose">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </span>
                    <span className="text-body text-ink group-hover:text-rose transition-colors">
                      WhatsApp Steffi
                    </span>
                  </a>

                  <a
                    href={`mailto:${contactDetails.email}`}
                    className="flex items-center gap-3 group"
                    aria-label="Send an email to Steffny Couture"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-alt group-hover:bg-rose-soft transition-colors"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 text-rose">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </span>
                    <span className="text-body text-ink group-hover:text-rose transition-colors">
                      {contactDetails.email}
                    </span>
                  </a>

                  <a
                    href={STUDIO.instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-3 group"
                    aria-label="Follow Steffny Couture on Instagram"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-alt group-hover:bg-rose-soft transition-colors"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4 text-rose"
                        aria-hidden="true"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </span>
                    <span className="text-body text-ink group-hover:text-rose transition-colors">
                      {contactDetails.instagramHandle}
                    </span>
                  </a>
                </div>

                {/* Founder card — Steffi photo per IMAGE_BRIEF.md */}
                <FounderCard
                  name={founderCard.name}
                  role={founderCard.role}
                  bio={founderCard.bio}
                />
              </div>

              {/* Right column: form */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-title text-ink">
                    Send a message
                  </h2>
                  <p className="text-body text-ink-muted mt-2">
                    Use the form below for non-urgent enquiries. For a faster response, WhatsApp is usually best.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* Map — OpenStreetMap static embed, no API key needed */}
      <Section tone="surface-alt" spacing="sm">
        <Container>
          <RevealOnScroll>
            <div className="space-y-4">
              <h2 className="font-display text-headline text-ink">
                Find the studio
              </h2>
              <div
                className="relative h-80 overflow-hidden rounded-xl border border-border"
              >
                <iframe
                  title="Steffny Couture studio location on OpenStreetMap"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.3760%2C51.4630%2C-0.3530%2C51.4720&layer=mapnik&marker=51.4677%2C-0.3602"
                  loading="lazy"
                  className="border-0 w-full h-full"
                  sandbox="allow-scripts allow-same-origin"
                  referrerPolicy="no-referrer"
                  aria-label="Map showing Steffny Couture at 255 High Street, Hounslow TW3 1EA"
                />
              </div>
              <p className="text-small text-ink-subtle">
                255 High Street, Hounslow, London TW3 1EA ·{' '}
                <a
                  href="https://www.openstreetmap.org/?mlat=51.4677&mlon=-0.3602#map=16/51.4677/-0.3602"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-rose hover:underline"
                >
                  View larger map
                </a>
              </p>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>

      <FinalCta
        headline="Ready to come in?"
        body="Book your free consultation online, call, or WhatsApp — whichever is easiest for you. We aim to reply within one working day."
        primaryCta={{ label: 'Book a fitting', href: '/book' }}
        secondaryCta={{ label: 'WhatsApp us', href: STUDIO.whatsapp }}
      />
    </>
  );
}
