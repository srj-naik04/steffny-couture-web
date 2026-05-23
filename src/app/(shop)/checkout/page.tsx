/**
 * Checkout page — Phase 5
 *
 * Server component shell. The multi-step form and order summary sidebar
 * are client components that read from the Zustand cart store.
 */

import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';
import { CheckoutSummary } from '@/features/checkout/components/CheckoutSummary';

export const metadata: Metadata = {
  title: 'Checkout',
  description:
    'Complete your order from Steffny Couture. Hand-finished couture from Hounslow, London.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Section tone="ivory" spacing="lg">
      <Container>
        {/* Page header */}
        <header className="mb-10 border-b border-border pb-6">
          <p className="text-label uppercase tracking-widest text-ink-subtle mb-2">
            Secure checkout
          </p>
          <h1 className="font-display text-display-sm md:text-display text-ink">
            Complete your order
          </h1>
          <p className="mt-3 text-body text-ink-muted max-w-xl">
            Fill in your details below. Steffi will be in touch to confirm everything before your order is finalised.
          </p>
        </header>

        {/* Two-column layout: form + summary */}
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-12 xl:gap-16">
          {/* Multi-step form */}
          <div className="lg:order-1">
            <CheckoutForm />
          </div>

          {/* Order summary sidebar */}
          <aside className="mt-10 lg:order-2 lg:mt-0">
            <div className="sticky top-24">
              <CheckoutSummary />
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
