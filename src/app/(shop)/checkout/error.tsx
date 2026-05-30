/**
 * Checkout error boundary — Phase 5
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error monitoring in production (not console.log — this is intentional)
    console.error('[Checkout] Page error:', error.digest);
  }, [error]);

  return (
    <Section tone="ivory" spacing="lg">
      <Container size="narrow">
        <div className="py-16 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-soft">
            <AlertCircle className="size-8 text-danger" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-title text-ink">
              Something went wrong
            </h1>
            <p className="text-body text-ink-muted max-w-sm mx-auto">
              We could not load the checkout page. Please try again, or contact
              Steffi directly via WhatsApp.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-12 items-center justify-center rounded-full bg-rose px-7 text-small font-medium text-ink transition-colors hover:bg-rose-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
            >
              Try again
            </button>
            <Link
              href="/dresses"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-surface px-7 text-small font-medium text-ink transition-colors hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
            >
              Return to collection
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
