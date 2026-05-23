/**
 * Book a fitting page stub — Phase 3
 *
 * Placeholder until Phase 6 (Fitting/Alteration Booking) implements the
 * multi-step wizard. Uses booking layout (Header + Footer).
 */

import type { Metadata } from 'next';
import { Hero } from '@/components/marketing/Hero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Book a fitting',
  description:
    'Book a free fitting or alteration consultation at Steffny Couture in Hounslow. Bridal, South Asian, and occasion wear — by appointment.',
};

export default function BookPage() {
  return (
    <>
      <Hero
        kicker="Steffny Couture"
        headline="Book a fitting"
        subhead="We are building the online booking form. In the meantime, please get in touch via WhatsApp or email and we will find a time that suits you."
        variant="contact"
        primaryCta={{ label: 'Contact us', href: '/contact' }}
      />

      <Section tone="ivory" spacing="md">
        <Container size="narrow">
          <div className="space-y-6 text-center">
            <p className="text-body text-ink-muted text-pretty">
              The online booking wizard — where you can choose your service, pick a date, and
              confirm your appointment in under two minutes — is arriving in Phase 6 of the build.
              Until then, reach us directly via the contact page and we will confirm your slot by
              return.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/contact" variant="primary">
                Contact the studio
              </Button>
              <Button href="/services" variant="secondary">
                View all services
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
