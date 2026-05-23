/**
 * Product detail loading state — Phase 4
 *
 * Skeleton that matches the layout of the real detail page:
 * left column image placeholder + right column text placeholders.
 */

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export default function ProductDetailLoading() {
  return (
    <>
      {/* Breadcrumb skeleton */}
      <div className="bg-ivory border-border border-b">
        <Container>
          <div className="flex items-center gap-2 py-3">
            <div className="h-3 w-10 animate-pulse rounded bg-surface-alt" />
            <div className="h-3 w-2 animate-pulse rounded bg-surface-alt" />
            <div className="h-3 w-14 animate-pulse rounded bg-surface-alt" />
            <div className="h-3 w-2 animate-pulse rounded bg-surface-alt" />
            <div className="h-3 w-32 animate-pulse rounded bg-surface-alt" />
          </div>
        </Container>
      </div>

      <Section tone="ivory" spacing="md">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Image skeleton */}
            <div className="space-y-3">
              <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-surface-alt" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 w-16 animate-pulse rounded-lg bg-surface-alt"
                  />
                ))}
              </div>
            </div>

            {/* Info skeleton */}
            <div className="flex flex-col gap-5">
              <div className="h-3 w-20 animate-pulse rounded bg-surface-alt" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-surface-alt" />
              <div className="h-px w-12 animate-pulse bg-surface-alt" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-surface-alt" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-surface-alt" />
              </div>
              <div className="h-8 w-24 animate-pulse rounded bg-surface-alt" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-surface-alt" />
                <div className="h-4 w-full animate-pulse rounded bg-surface-alt" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-surface-alt" />
              </div>
              <div className="space-y-3 pt-2">
                <div className="h-12 w-full animate-pulse rounded-full bg-surface-alt" />
                <div className="h-12 w-full animate-pulse rounded-full bg-surface-alt" />
                <div className="h-12 w-full animate-pulse rounded-full bg-surface-alt" />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
