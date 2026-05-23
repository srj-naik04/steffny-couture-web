/**
 * Dresses loading state — Phase 4
 *
 * Skeleton grid while the server component fetches products.
 * Brand-token shimmer using surface/surface-alt colours.
 */

import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl bg-surface">
      {/* Image placeholder */}
      <div className="aspect-[3/4] w-full animate-pulse bg-surface-alt" />
      {/* Content placeholder */}
      <div className="space-y-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-surface-alt" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-surface-alt" />
        <div className="h-3 w-full animate-pulse rounded bg-surface-alt" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-surface-alt" />
        <div className="h-5 w-24 animate-pulse rounded bg-surface-alt" />
      </div>
    </div>
  );
}

export default function DressesLoading() {
  return (
    <Section tone="ivory" spacing="md">
      <Container>
        {/* Mimic the header row */}
        <div className="mb-8 h-6 w-24 animate-pulse rounded bg-surface-alt" />

        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
          {/* Filter skeleton */}
          <div className="hidden space-y-4 lg:block">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-surface-alt" />
                <div className="flex gap-2">
                  <div className="h-8 w-16 animate-pulse rounded-full bg-surface-alt" />
                  <div className="h-8 w-20 animate-pulse rounded-full bg-surface-alt" />
                  <div className="h-8 w-14 animate-pulse rounded-full bg-surface-alt" />
                </div>
              </div>
            ))}
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
