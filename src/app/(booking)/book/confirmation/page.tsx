/**
 * Booking confirmation page — Phase 6
 *
 * Server component. Reads `ref` from searchParams.
 * The LastBookingSummary client component reads the summary from sessionStorage
 * (written by BookingWizard on successful submit), displays it once, then clears.
 *
 * noindex: confirmation pages must not be crawled.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { STUDIO } from '@/constants/brand';
import { LastBookingSummary } from './LastBookingSummary';

export const metadata: Metadata = {
  title: 'Booking received',
  description:
    'Your booking request has been received by Steffny Couture. We will be in touch within one working day.',
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ ref?: string }>;
};

const REF_PATTERN = /^SC-[A-Z0-9]{6}$/;

export default async function BookConfirmationPage({ searchParams }: Props) {
  const { ref: rawRef } = await searchParams;
  const ref = rawRef && REF_PATTERN.test(rawRef) ? rawRef : undefined;

  return (
    <Section tone="ivory" spacing="lg">
      <Container size="narrow">
        {/* Success indicator */}
        <div className="text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
          </div>

          <h1 className="font-display text-display-sm md:text-display text-ink mb-4">
            Booking received
          </h1>

          {ref && (
            <div className="inline-flex items-baseline gap-2 rounded-full bg-gold-soft px-5 py-2 mb-6">
              <span className="text-label uppercase tracking-widest text-ink-muted">
                Reference
              </span>
              <span className="font-display text-title text-ink">{ref}</span>
            </div>
          )}

          <div className="space-y-4 text-body text-ink-muted mx-auto max-w-md mb-10">
            <p>
              We will be in touch within one working day to confirm your
              appointment, walk through what to bring, and answer any questions.
            </p>
            <p className="text-small text-ink-muted">
              Keep your reference number handy —{' '}
              {ref ? (
                <strong className="text-ink">{ref}</strong>
              ) : (
                'check your email for details'
              )}
              . We may ask for it when we contact you.
            </p>
          </div>
        </div>

        {/* Last booking summary (reads from sessionStorage) */}
        <div className="mb-10">
          <LastBookingSummary />
        </div>

        {/* What happens next */}
        <div className="mb-10 rounded-2xl bg-rose-soft p-6">
          <h2 className="font-display text-xl text-rose mb-4">What happens next</h2>
          <ol className="space-y-3 text-small text-ink">
            <li className="flex gap-3">
              <span className="font-display text-rose tabular-nums shrink-0">1.</span>
              <span>Your request has been received in the studio.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-rose tabular-nums shrink-0">2.</span>
              <span>
                We will reply on WhatsApp or email within one working day to confirm
                your slot and let you know what to bring.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-rose tabular-nums shrink-0">3.</span>
              <span>Come in to the studio at your confirmed time. The address is{' '}
                <strong className="text-ink">255 High Street, Hounslow TW3 1EA</strong>.
              </span>
            </li>
          </ol>
        </div>

        {/* WhatsApp shortcut */}
        <div className="mb-10 rounded-xl border border-border bg-surface p-5 text-center">
          <p className="text-small text-ink-muted mb-3">
            Need to ask something urgently? Message the studio directly.
          </p>
          <a
            href={STUDIO.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full bg-rose px-7 text-small font-medium text-ink transition-colors hover:bg-rose-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
          >
            Open WhatsApp
          </a>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-surface px-7 text-small font-medium text-ink transition-colors hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
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
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-transparent px-7 text-small font-medium text-ink-muted transition-colors hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
          >
            Contact the studio
          </Link>
        </div>
      </Container>
    </Section>
  );
}
