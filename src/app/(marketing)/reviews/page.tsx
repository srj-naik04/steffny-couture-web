/**
 * Reviews page stub — Phase 3
 *
 * Placeholder until Phase 7 (Reviews, Journal, Polish) implements the full page.
 * Uses marketing layout (Header + Footer) inherited from (marketing)/layout.tsx.
 */

import type { Metadata } from 'next';
import { Hero } from '@/components/marketing/Hero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata('/reviews');

export default function ReviewsPage() {
  return (
    <>
      <Hero
        kicker="What our customers say"
        headline="Customer reviews"
        subhead="We are putting the finishing touches on this section. In the meantime, you are very welcome to book a fitting or get in touch directly."
        variant="contact"
      />

      <Section tone="ivory" spacing="md">
        <Container size="narrow">
          <div className="space-y-6 text-center">
            <p className="text-body text-ink-muted text-pretty">
              Reviews from brides, bridesmaids, and occasion-wear customers across Hounslow and
              West London will be published here shortly. Phase 7 of the build brings the full
              reviews grid and submission form.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/book" variant="primary">
                Book a fitting
              </Button>
              <Button href="/contact" variant="secondary">
                Get in touch
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
