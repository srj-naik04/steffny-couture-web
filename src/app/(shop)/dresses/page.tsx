/**
 * Dresses catalogue page stub — Phase 3
 *
 * Placeholder until Phase 4 (Dress Catalogue & Product Detail) implements
 * the full grid with filters and product cards. Uses shop layout.
 */

import type { Metadata } from 'next';
import { Hero } from '@/components/marketing/Hero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata('/dresses');

export default function DressesPage() {
  return (
    <>
      <Hero
        kicker="The collection"
        headline="The dress collection"
        subhead="We are curating the full catalogue. The collection page — with filters by colour, occasion, and price — is coming in Phase 4 of the build."
        variant="contact"
      />

      <Section tone="ivory" spacing="md">
        <Container size="narrow">
          <div className="space-y-6 text-center">
            <p className="text-body text-ink-muted text-pretty">
              The full collection grid, with multi-angle product images and size variant selectors,
              arrives in Phase 4. To enquire about a particular piece or commission something new,
              get in touch or book a consultation at the studio.
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
