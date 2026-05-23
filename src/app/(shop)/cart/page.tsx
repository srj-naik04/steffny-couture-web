/**
 * Cart page — Phase 5
 *
 * Server component shell. The actual cart contents are rendered by
 * CartContents ("use client") which reads from the Zustand store.
 */

import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { CartContents } from '@/features/cart/components/CartContents';

export const metadata: Metadata = {
  title: 'Your cart',
  description:
    'Review your selected pieces and continue to checkout. Hand-finished couture from Steffny Couture, Hounslow.',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <Section tone="ivory" spacing="lg">
      <Container>
        {/* Page header */}
        <header className="mb-10 border-b border-border pb-6">
          <p className="text-label uppercase tracking-widest text-ink-subtle mb-2">
            Your selection
          </p>
          <h1 className="font-display text-display-sm md:text-display text-ink">
            Your cart
          </h1>
          <p className="mt-3 text-body text-ink-muted max-w-xl">
            Review your selection. Bring your details across to checkout when you
            are ready.
          </p>
        </header>

        <CartContents />
      </Container>
    </Section>
  );
}
