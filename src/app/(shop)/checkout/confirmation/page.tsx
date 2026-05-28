/**
 * Order confirmation page — Phase 5
 *
 * Server component. Reads the `ref` search param from the URL.
 * The order summary is rendered by LastOrderSummary (client component)
 * which reads from sessionStorage — populated by CheckoutForm on success.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { LastOrderSummary } from './LastOrderSummary';

export const metadata: Metadata = {
  title: 'Order received',
  description: 'Your order has been received by Steffny Couture. We will be in touch shortly.',
  robots: { index: false, follow: false },
};

const REF_PATTERN = /^SC-[A-Z0-9]{6}$/;

type Props = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function ConfirmationPage({ searchParams }: Props) {
  const { ref } = await searchParams;
  const validatedRef = ref && REF_PATTERN.test(ref) ? ref : undefined;

  return (
    <Section tone="ivory" spacing="lg">
      <Container size="narrow">
        {/* Success indicator */}
        <div className="text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
          </div>

          <h1 className="font-display text-display-sm md:text-display text-ink mb-4">
            Order received
          </h1>

          {validatedRef && (
            <div className="inline-flex items-baseline gap-2 rounded-full bg-gold-soft px-5 py-2 mb-6">
              <span className="text-label uppercase tracking-widest text-ink-muted">
                Reference
              </span>
              <span className="font-display text-title text-ink">{validatedRef}</span>
            </div>
          )}

          <div className="space-y-4 text-body text-ink-muted mx-auto max-w-md mb-10">
            <p>
              We will be in touch within one working day to confirm sizing,
              finishing, and final pricing.
            </p>
            <p className="font-medium text-ink">
              Your card has not been charged.
            </p>
          </div>
        </div>

        {/* Order summary (reads from sessionStorage) */}
        <div className="mb-10">
          <LastOrderSummary />
        </div>

        {/* Divider with brand note */}
        <div className="mb-10 rounded-xl border border-border bg-surface p-5 text-center space-y-1.5">
          <p className="text-small text-ink-muted">
            Keep this reference number handy:{' '}
            {validatedRef ? (
              <strong className="text-ink">{validatedRef}</strong>
            ) : (
              'check your email for details'
            )}
            . We may ask for it when we contact you.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-rose px-7 text-small font-medium text-ivory transition-colors hover:bg-rose-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
          >
            Back to home
          </Link>
          <Link
            href="/dresses"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-surface px-7 text-small font-medium text-ink transition-colors hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
          >
            View the collection
          </Link>
          <Link
            href="/book"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-transparent px-7 text-small font-medium text-ink-muted transition-colors hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
          >
            Book a fitting
          </Link>
        </div>
      </Container>
    </Section>
  );
}
