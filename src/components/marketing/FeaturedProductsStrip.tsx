/**
 * FeaturedProductsStrip — Phase 3
 *
 * Server component. Renders up to 4 featured product cards in a responsive grid.
 * Accepts products as a prop (fetched server-side in the home page).
 * Renders a graceful empty state when no products are available.
 *
 * Phase 4 will replace the card internals with the full ProductCard component.
 */

import Image from 'next/image';
import Link from 'next/link';
import { formatGBP } from '@/lib/currency';
import type { ProductCard } from '@/features/products/api';

interface FeaturedProductsStripProps {
  products: ProductCard[];
}

export function FeaturedProductsStrip({ products }: FeaturedProductsStripProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => {
        const primaryImage = product.images?.[0];
        const imageSrc = primaryImage
          ? `/assets/products/${product.slug}/01.jpg`
          : null;

        return (
          <Link
            key={product.id}
            href={`/dresses/${product.slug}`}
            className="group block overflow-hidden rounded-xl bg-surface"
            aria-label={`View ${product.name}`}
          >
            {/* Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-alt">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={primaryImage?.alt_text ?? product.name}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  blurDataURL={product.blur_data_url ?? undefined}
                  placeholder={product.blur_data_url ? 'blur' : 'empty'}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-label text-ink-subtle uppercase tracking-widest">
                    Coming soon
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-4 space-y-1">
              <p className="text-label text-rose tracking-widest uppercase">
                {product.category}
              </p>
              <h3 className="font-display text-headline text-ink group-hover:text-rose transition-colors">
                {product.name}
              </h3>
              <p className="text-body text-ink-muted">
                {formatGBP(product.price)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
