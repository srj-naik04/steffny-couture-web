/**
 * AddToCartButton — Phase 4
 *
 * Client component. Reads selected size + colour from VariantContext,
 * adds the item to the Zustand cart store on click, and shows a brief
 * in-button "Added" confirmation for 2 seconds.
 *
 * Disabled when size or colour selection is required but not yet made.
 */

'use client';

import * as React from 'react';
import { useVariant } from './VariantContext';
import { useCart } from '@/features/cart/hooks';
import { cn } from '@/lib/cn';

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  imagePath: string | null;
  requiresSize: boolean;
  requiresColour: boolean;
}

export function AddToCartButton({
  productId,
  slug,
  name,
  price,
  currency,
  imagePath,
  requiresSize,
  requiresColour,
}: AddToCartButtonProps) {
  const { size, colour } = useVariant();
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);

  const needsSize = requiresSize && !size;
  const needsColour = requiresColour && !colour;
  const disabled = needsSize || needsColour;

  function handleAdd() {
    if (disabled) return;
    addItem({ productId, slug, name, price, currency, size, colour, imagePath });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  let label: string;
  if (added) {
    label = 'Added';
  } else if (needsSize && needsColour) {
    label = 'Select size and colour';
  } else if (needsSize) {
    label = 'Select size';
  } else if (needsColour) {
    label = 'Select colour';
  } else {
    label = 'Add to cart';
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      aria-live="polite"
      aria-label={label}
      className={cn(
        'flex h-12 w-full items-center justify-center gap-2 rounded-full font-body text-base font-medium',
        'transition-colors duration-200 select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        added
          ? 'bg-success text-ivory'
          : disabled
            ? 'cursor-not-allowed bg-surface-alt text-ink-subtle'
            : 'bg-rose text-ivory hover:bg-rose-dark active:scale-[0.98]',
      )}
    >
      {added && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
      {label}
    </button>
  );
}
