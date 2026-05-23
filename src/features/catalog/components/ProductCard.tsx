/**
 * ProductCard — Phase 4
 *
 * Server component. Shows product image, name, category label, price,
 * colour swatches, and a "View" link. Entire card is a link.
 * Hover: image zooms, card lifts slightly.
 */

import Image from 'next/image';
import Link from 'next/link';
import { formatGBP } from '@/lib/currency';
import type { ProductCard as ProductCardType } from '@/features/products/api';

interface ProductCardProps {
  product: ProductCardType;
}

const COLOUR_SWATCHES: Record<string, string> = {
  mauve: 'bg-swatch-mauve',
  plum: 'bg-swatch-plum',
  aqua: 'bg-swatch-aqua',
  coral: 'bg-swatch-coral',
  cobalt: 'bg-swatch-cobalt',
  blue: 'bg-swatch-blue',
  champagne: 'bg-swatch-champagne',
  maroon: 'bg-swatch-maroon',
  sage: 'bg-swatch-sage',
};

function ColourSwatch({ colour }: { colour: string }) {
  const key = colour.toLowerCase().split(' ')[0];
  // brand-tokens-exception: unknown product colours fall back to a neutral chip; swatch is product-data fidelity, not a UI surface
  const bg = COLOUR_SWATCHES[key] ?? 'bg-border-strong';
  return (
    <span
      role="img"
      className={`inline-block h-3 w-3 rounded-full border border-border ${bg}`}
      title={colour}
      aria-label={colour}
    />
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0];
  // For demo mode, storage_path is the local public path; for Supabase it's a bucket path.
  // storageUrl() is called only on client for Supabase paths; here we keep it simple:
  // if the path starts with /assets or /, use as-is; otherwise treat as local.
  const imageSrc =
    primaryImage?.storage_path?.startsWith('/')
      ? primaryImage.storage_path
      : primaryImage?.storage_path
        ? `/assets/products/${product.slug}/01.jpg`
        : `/assets/products/${product.slug}/01.jpg`;

  const blurDataURL = primaryImage?.blur_data_url ?? product.blur_data_url ?? undefined;

  const categoryLabel =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-surface shadow-sm transition-shadow duration-300 hover:shadow-md">
      <Link
        href={`/dresses/${product.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${product.name}`}
        tabIndex={0}
      />

      {/* Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-alt">
        <Image
          src={imageSrc}
          alt={primaryImage?.alt_text ?? `${product.name} — front view`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
          blurDataURL={blurDataURL}
          placeholder={blurDataURL ? 'blur' : 'empty'}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-label text-rose tracking-widest uppercase">
          {categoryLabel}
        </p>
        <h3 className="font-display text-headline text-ink group-hover:text-rose transition-colors leading-tight">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="text-small text-ink-muted line-clamp-2">
            {product.short_description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="font-display text-headline text-ink">
            {formatGBP(product.price)}
          </p>
          {product.available_colours.length > 0 && (
            <div className="flex items-center gap-1" aria-label="Available colours">
              {product.available_colours.slice(0, 4).map((colour) => (
                <ColourSwatch key={colour} colour={colour} />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
