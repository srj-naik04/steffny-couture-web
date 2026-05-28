/**
 * CheckoutSummary — Phase 5
 *
 * Client component. Renders the order summary sidebar on the checkout page.
 * Reads from the Zustand cart store.
 */

'use client';

import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { useHydrated } from '@/features/cart/hooks';
import { describeCartItem } from '@/features/cart/utils';
import { formatGBP } from '@/lib/currency';

export function CheckoutSummary() {
  const { items } = useCartStore();
  const hydrated = useHydrated();

  const hydratedItems = hydrated ? items : [];
  const subtotal = hydratedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
      <h2 className="font-display text-headline text-ink">Order summary</h2>

      {!hydrated && (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="flex gap-3 py-2">
              <div className="h-12 w-10 rounded-lg bg-surface-alt animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-3/4 rounded bg-surface-alt animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-surface-alt animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hydrated && (
        <>
          <ul className="divide-y divide-border space-y-0">
            {hydratedItems.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
                  {item.imagePath ? (
                    <Image
                      src={item.imagePath}
                      alt={describeCartItem(item)}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag className="size-4 text-ink-muted" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-small font-medium text-ink truncate">{item.name}</p>
                  {(item.size || item.colour) && (
                    <p className="text-small text-ink-muted">
                      {[item.size, item.colour].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                <p className="text-small text-ink shrink-0">
                  {formatGBP(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-border pt-4 text-small">
            <div className="flex justify-between">
              <span className="text-ink-muted">Subtotal</span>
              <span className="text-ink">{formatGBP(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Delivery</span>
              <span className="text-ink-muted">To be confirmed</span>
            </div>
            <div className="flex justify-between font-medium pt-1 border-t border-border">
              <span className="text-ink">Total</span>
              <span className="text-ink">{formatGBP(subtotal)}</span>
            </div>
          </div>
        </>
      )}

      <p className="text-small text-ink-muted leading-relaxed pt-1 border-t border-border">
        No payment is taken today. We will contact you to confirm your order
        before any charges apply.
      </p>
    </div>
  );
}
