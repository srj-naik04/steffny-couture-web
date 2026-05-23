/**
 * ProductGrid — Phase 4
 *
 * Server component. Renders a responsive product card grid with stagger
 * animations via RevealOnScroll.
 *
 * Accepts filteredProducts (already filtered server-side based on URL params).
 */

import Link from 'next/link';
import { ProductCard } from './ProductCard';
import { RevealOnScroll } from '@/components/marketing/RevealOnScroll';
import type { ProductCard as ProductCardType } from '@/features/products/api';

interface ProductGridProps {
  products: ProductCardType[];
  hasActiveFilters: boolean;
}

export function ProductGrid({ products, hasActiveFilters }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-body-lg text-ink-muted">
          No matches yet. Try widening your filters.
        </p>
        {hasActiveFilters && (
          <Link
            href="/dresses"
            className="text-small text-rose font-medium underline underline-offset-2 hover:text-rose-dark"
          >
            Clear filters
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <RevealOnScroll
          key={product.id}
          delay={Math.min(index * 0.06, 0.4)}
          threshold={0.05}
        >
          <ProductCard product={product} />
        </RevealOnScroll>
      ))}
    </div>
  );
}
