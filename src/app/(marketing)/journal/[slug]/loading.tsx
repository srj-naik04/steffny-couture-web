/**
 * Journal post loading skeleton — Phase 7
 */

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export default function JournalPostLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="w-full aspect-video max-h-96 bg-surface-alt animate-pulse" />

      {/* Header skeleton */}
      <Section tone="ivory" spacing="sm">
        <Container size="narrow">
          <div className="space-y-4">
            <div className="h-4 w-40 bg-border rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-border rounded animate-pulse" />
            <div className="h-px w-16 bg-border animate-pulse" />
            <div className="h-4 w-56 bg-border rounded animate-pulse" />
          </div>
        </Container>
      </Section>

      {/* Body skeleton */}
      <Section tone="ivory" spacing="sm">
        <Container size="narrow">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-border rounded animate-pulse"
                style={{ width: `${85 + (i % 3) * 5}%` }}
              />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
