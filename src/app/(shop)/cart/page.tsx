/**
 * Cart page stub — Phase 3
 *
 * Placeholder until Phase 5 (Cart & Mock Checkout) implements the full
 * cart experience with quantity controls and checkout flow. Uses shop layout.
 */

import type { Metadata } from 'next';
import { Hero } from '@/components/marketing/Hero';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Your cart',
  description:
    'Your shopping cart at Steffny Couture. Review your selected pieces and proceed to checkout.',
};

export default function CartPage() {
  return (
    <>
      <Hero
        kicker="Your selection"
        headline="Your cart"
        subhead="The cart and checkout flow are coming in Phase 5 of the build. To enquire about a piece in the meantime, please book a fitting or get in touch."
        variant="contact"
      />

      <Section tone="ivory" spacing="md">
        <Container size="narrow">
          <div className="space-y-6 text-center">
            <p className="text-body text-ink-muted text-pretty">
              The full shopping cart — with quantity controls, a mock checkout, and an order
              confirmation — arrives in Phase 5. Until then, you are very welcome to enquire
              directly and we will guide you through the process.
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
