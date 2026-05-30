/**
 * FinalCta — Phase 3
 *
 * Server component. Full-width rose-toned call-to-action band.
 * Can accept per-page copy or falls back to the home-page global CTA.
 */

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface FinalCtaProps {
  headline: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function FinalCta({
  headline,
  body,
  primaryCta,
  secondaryCta,
}: FinalCtaProps) {
  return (
    <section className="bg-rose py-20 md:py-28 text-ink">
      <Container>
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <h2 className="font-display text-display-sm md:text-display text-balance">
            {headline}
          </h2>
          <div className="bg-ivory/30 mx-auto h-px w-16" aria-hidden="true" />
          <p className="text-body-lg text-ink/80 text-pretty">{body}</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button href={primaryCta.href} variant="ghost" size="lg">
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button
                href={secondaryCta.href}
                variant="ghost"
                size="lg"
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
