/**
 * Product not-found page — Phase 4
 *
 * Shown when getProductBySlugFromSource returns null for the given slug.
 * Brand-voice: no exclamation marks, sentence case, British English.
 */

import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function ProductNotFound() {
  return (
    <Section tone="ivory" spacing="md">
      <Container size="narrow">
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <div className="h-px w-16 bg-gold" aria-hidden="true" />
          <h1 className="font-display text-display-sm md:text-display text-ink">
            We cannot find that dress
          </h1>
          <p className="text-body text-ink-muted max-w-md text-pretty">
            The dress you are looking for may have moved, sold, or the link may
            be out of date. Browse the full collection or book a consultation
            and we can suggest something similar.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/dresses" variant="primary">
              View the collection
            </Button>
            <Button href="/book" variant="secondary">
              Book a fitting
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
