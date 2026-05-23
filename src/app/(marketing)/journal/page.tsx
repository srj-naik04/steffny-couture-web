/**
 * Journal page stub — Phase 3
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

export const metadata: Metadata = buildMetadata('/journal');

export default function JournalPage() {
  return (
    <>
      <Hero
        kicker="From the studio"
        headline="Journal"
        subhead="Practical bridal guidance from our studio in Hounslow — fitting timelines, South Asian bridal wear advice, alteration tips, and more. Coming shortly."
        variant="contact"
      />

      <Section tone="ivory" spacing="md">
        <Container size="narrow">
          <div className="space-y-6 text-center">
            <p className="text-body text-ink-muted text-pretty">
              Our journal publishes advice on fitting timelines, choosing the right silhouette, and
              preparing for your first appointment at the studio. Phase 7 of the build brings the
              full journal with individual post pages.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/book" variant="primary">
                Book a fitting
              </Button>
              <Button href="/contact" variant="secondary">
                Contact the studio
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
