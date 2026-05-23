/**
 * LastOrderSummary — Phase 5
 *
 * Client component. Reads the last order from sessionStorage
 * (written by CheckoutForm on successful submission) and displays
 * a summary of items on the confirmation page.
 *
 * If sessionStorage is unavailable or the key is missing, falls back
 * to a simple "Your items are confirmed" message.
 */

'use client';

import * as React from 'react';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { formatGBP } from '@/lib/currency';
import { describeCartItem } from '@/features/cart/utils';

interface OrderItem {
  productId: string;
  variantId?: string | null;
  name: string;
  price: number;
  size?: string | null;
  colour?: string | null;
  quantity: number;
  imagePath?: string | null;
}

interface LastOrder {
  reference: string;
  items: OrderItem[];
  subtotal: number;
  fullName: string;
  email: string;
}

export function LastOrderSummary() {
  const [order, setOrder] = React.useState<LastOrder | null>(null);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem('steffny-last-order');
      if (raw) {
        const parsed = JSON.parse(raw) as LastOrder;
        setOrder(parsed);
        // Clear after reading — single use
        sessionStorage.removeItem('steffny-last-order');
      }
    } catch {
      // sessionStorage unavailable or parse error — non-fatal
    }
  }, []);

  if (!order || !order.items?.length) {
    return (
      <p className="text-body text-ink-muted text-center">
        Your items are confirmed and Steffi will be in touch shortly.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden text-left">
      <div className="px-5 py-3 border-b border-border bg-surface-alt">
        <h3 className="text-label uppercase tracking-widest text-ink-muted">
          Items ordered
        </h3>
      </div>
      <ul className="divide-y divide-border">
        {order.items.map((item, i) => (
          <li
            key={`${item.productId}-${i}`}
            className="flex items-center gap-3 px-5 py-3"
          >
            <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
              {item.imagePath ? (
                <Image
                  src={item.imagePath}
                  alt={describeCartItem(item)}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShoppingBag className="size-5 text-ink-muted" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-small font-medium text-ink">{item.name}</p>
              {(item.size || item.colour) && (
                <p className="text-small text-ink-muted">
                  {[item.size, item.colour].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            <p className="text-small text-ink shrink-0">
              {formatGBP(item.price * item.quantity)}
              {item.quantity > 1 && (
                <span className="ml-1 text-ink-muted">×{item.quantity}</span>
              )}
            </p>
          </li>
        ))}
      </ul>
      <div className="px-5 py-3 border-t border-border flex justify-between text-small font-medium">
        <span className="text-ink-muted">Total</span>
        <span className="text-ink">{formatGBP(order.subtotal)}</span>
      </div>
    </div>
  );
}
