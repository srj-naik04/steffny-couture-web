/**
 * Dresses error boundary — Phase 4
 *
 * Shown when the server component throws (e.g. Supabase failure).
 * Offers a "Try again" button via the reset() prop from Next.js error.tsx.
 */

'use client';

import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DressesError({ reset }: ErrorProps) {
  return (
    <Section tone="ivory" spacing="md">
      <Container size="narrow">
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <div className="h-px w-16 bg-gold" aria-hidden="true" />
          <h1 className="font-display text-display-sm text-ink">
            The collection is not loading right now
          </h1>
          <p className="text-body text-ink-muted max-w-md text-pretty">
            Try refreshing, or visit us at the studio. If the problem continues,
            please get in touch and we can help you directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={reset} variant="primary">
              Try again
            </Button>
            <Button href="/contact" variant="secondary">
              Get in touch
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
