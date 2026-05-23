/**
 * Checkout loading state — Phase 5
 */

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export default function CheckoutLoading() {
  return (
    <Section tone="ivory" spacing="lg">
      <Container>
        <div className="mb-10 border-b border-border pb-6 space-y-3">
          <div className="h-3 w-28 rounded bg-surface-alt animate-pulse" />
          <div className="h-8 w-48 rounded bg-surface-alt animate-pulse" />
          <div className="h-4 w-80 rounded bg-surface-alt animate-pulse" />
        </div>
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-12">
          <div className="space-y-5">
            <div className="h-6 w-32 rounded bg-surface-alt animate-pulse" />
            <div className="h-12 w-full rounded-lg bg-surface-alt animate-pulse" />
            <div className="h-12 w-full rounded-lg bg-surface-alt animate-pulse" />
            <div className="h-12 w-full rounded-lg bg-surface-alt animate-pulse" />
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="h-64 w-full rounded-2xl bg-surface-alt animate-pulse" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
