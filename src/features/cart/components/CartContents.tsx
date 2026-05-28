/**
 * CartContents — Phase 5
 *
 * Client component that reads the Zustand cart store and renders
 * the full cart experience on the /cart page.
 * The page shell is a server component; only this component is client-side.
 */

'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store';
import { useHydrated } from '../hooks';
import { describeCartItem } from '../utils';
import { formatGBP } from '@/lib/currency';
import { stagger, staggerItem } from '@/lib/motion/presets';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Quantity stepper (shared with CartDrawer; local definition to avoid circular import)
// ---------------------------------------------------------------------------

function QuantityStepper({
  id,
  quantity,
  itemName,
  onDecrement,
  onIncrement,
}: {
  id: string;
  quantity: number;
  itemName: string;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={`Quantity: ${quantity}`}>
      <button
        type="button"
        onClick={onDecrement}
        aria-label={`Decrease quantity of ${itemName}`}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-full',
          'border border-border text-ink-muted',
          'transition-colors hover:border-border-strong hover:text-ink',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose',
        )}
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <span
        id={id}
        className="w-8 text-center text-body font-medium text-ink"
        aria-live="polite"
        aria-label={`${quantity} of ${itemName}`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label={`Increase quantity of ${itemName}`}
        disabled={quantity >= 10}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-full',
          'border border-border text-ink-muted',
          'transition-colors hover:border-border-strong hover:text-ink',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose',
          'disabled:cursor-not-allowed disabled:opacity-40',
        )}
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyCart() {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-alt">
        <ShoppingBag className="size-9 text-ink-muted" aria-hidden="true" />
      </div>
      <h2 className="font-display text-title text-ink mb-3">Your cart is empty</h2>
      <p className="text-body text-ink-muted mb-8 mx-auto max-w-sm">
        Browse the collection and add pieces you love, or book a fitting to discuss
        what you have in mind.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dresses"
          className={cn(
            'inline-flex h-12 items-center justify-center rounded-full',
            'bg-rose px-7 text-small font-medium text-ivory',
            'transition-colors hover:bg-rose-dark',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2',
          )}
        >
          Browse the collection
        </Link>
        <Link
          href="/book"
          className={cn(
            'inline-flex h-12 items-center justify-center rounded-full',
            'border border-border-strong bg-surface px-7 text-small font-medium text-ink',
            'transition-colors hover:bg-surface-alt',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2',
          )}
        >
          Book a fitting
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CartContents
// ---------------------------------------------------------------------------

export function CartContents() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const hydrated = useHydrated();

  const hydratedItems = hydrated ? items : [];
  const subtotal = hydratedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (!hydrated) {
    // Skeleton placeholder before client hydration
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading cart">
        {[1, 2].map((n) => (
          <div key={n} className="h-24 rounded-xl bg-surface-alt animate-pulse" />
        ))}
      </div>
    );
  }

  if (hydratedItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-12 xl:gap-16">
      {/* Items list */}
      <div>
        <motion.ul
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="divide-y divide-border"
          aria-label="Cart items"
        >
          <AnimatePresence initial={false}>
            {hydratedItems.map((item) => (
              <motion.li
                key={item.id}
                variants={staggerItem}
                exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                className="flex gap-4 py-6"
              >
                {/* Image */}
                <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-alt sm:h-32 sm:w-24">
                  {item.imagePath ? (
                    <Image
                      src={item.imagePath}
                      alt={describeCartItem(item)}
                      fill
                      sizes="(max-width: 640px) 80px, 96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag className="size-8 text-ink-muted" aria-hidden="true" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col gap-2 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={`/dresses/${item.slug}`}
                      className="font-display text-headline text-ink hover:text-rose transition-colors leading-tight"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className={cn(
                        'shrink-0 flex h-8 w-8 items-center justify-center rounded-full',
                        'text-ink-muted transition-colors hover:bg-rose-soft hover:text-rose',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose',
                      )}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  {(item.size || item.colour) && (
                    <p className="text-small text-ink-muted">
                      {[item.size, item.colour].filter(Boolean).join(' · ')}
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <QuantityStepper
                      id={`qty-page-${item.id}`}
                      quantity={item.quantity}
                      itemName={item.name}
                      onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                      onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                    />
                    <p className="text-body font-medium text-ink">
                      {formatGBP(item.price * item.quantity)}
                      {item.quantity > 1 && (
                        <span className="ml-1.5 text-small text-ink-muted font-normal">
                          ({formatGBP(item.price)} each)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Continue shopping */}
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            href="/dresses"
            className="text-small text-ink-muted hover:text-rose transition-colors inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">←</span> Continue shopping
          </Link>
        </div>
      </div>

      {/* Order summary */}
      <div className="mt-10 lg:mt-0">
        <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 space-y-5">
          <h2 className="font-display text-title text-ink">Order summary</h2>

          <div className="space-y-3 text-body">
            <div className="flex justify-between">
              <span className="text-ink-muted">Subtotal</span>
              <span className="font-medium text-ink">{formatGBP(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Delivery</span>
              <span className="text-ink-muted">To be confirmed</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-medium">
              <span className="text-ink">Total</span>
              <span className="text-ink">{formatGBP(subtotal)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className={cn(
              'flex h-12 w-full items-center justify-center rounded-full',
              'bg-rose text-ivory text-small font-medium',
              'transition-colors hover:bg-rose-dark',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2',
            )}
          >
            Proceed to checkout
          </Link>

          <p className="text-small text-ink-muted text-center leading-relaxed">
            All orders are confirmed by the studio before any payment is taken.
          </p>
        </div>
      </div>
    </div>
  );
}
