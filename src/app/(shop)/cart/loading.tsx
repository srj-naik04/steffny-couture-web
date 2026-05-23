/**
 * Cart page loading state — Phase 5
 *
 * Shown by Next.js while the page suspends.
 * The cart is client-side so this is minimal — just a branded skeleton.
 */

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export default function CartLoading() {
  return (
    <Section tone="ivory" spacing="lg">
      <Container>
        <div className="mb-10 border-b border-border pb-6 space-y-3">
          <div className="h-3 w-24 rounded bg-surface-alt animate-pulse" />
          <div className="h-8 w-36 rounded bg-surface-alt animate-pulse" />
          <div className="h-4 w-72 rounded bg-surface-alt animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="flex gap-4 py-6 border-b border-border"
            >
              <div className="h-28 w-20 rounded-xl bg-surface-alt animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-48 rounded bg-surface-alt animate-pulse" />
                <div className="h-4 w-24 rounded bg-surface-alt animate-pulse" />
                <div className="h-9 w-28 rounded-full bg-surface-alt animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
