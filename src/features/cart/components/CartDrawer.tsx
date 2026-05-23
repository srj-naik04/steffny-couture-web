/**
 * CartDrawer — Phase 5
 *
 * Right-side slide-in sheet showing the current cart contents.
 * Accessible: role="dialog", aria-modal, focus-trap, ESC to close, backdrop click to close.
 * Body-scroll locked while open.
 * Mobile: 90vw; Desktop: max-w-md (420px).
 */

'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store';
import { useCartUiStore } from '../ui-store';
import { useHydrated } from '../hooks';
import { describeCartItem } from '../utils';
import { formatGBP } from '@/lib/currency';
import { backdropFade, drawerRight } from '@/lib/motion/presets';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Sub-components
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
    <div className="flex items-center gap-1" aria-label={`Quantity: ${quantity}`}>
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
        <Minus className="size-3" aria-hidden="true" />
      </button>
      <span
        id={id}
        className="w-6 text-center text-body font-medium text-ink"
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
        <Plus className="size-3" aria-hidden="true" />
      </button>
    </div>
  );
}

function CartLineItem({
  item,
  onClose,
}: {
  item: ReturnType<typeof useCartStore.getState>['items'][number];
  onClose: () => void;
}) {
  const { updateQuantity, removeItem } = useCartStore();

  const imageProps = item.imagePath
    ? { src: item.imagePath, alt: describeCartItem(item) }
    : null;

  return (
    <li className="flex gap-3 py-4 border-b border-border last:border-0">
      {/* Thumbnail */}
      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
        {imageProps ? (
          <Image
            src={imageProps.src}
            alt={imageProps.alt}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="size-6 text-ink-subtle" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <Link
          href={`/dresses/${item.slug}`}
          onClick={onClose}
          className="text-small font-medium text-ink hover:text-rose transition-colors line-clamp-2 leading-snug"
        >
          {item.name}
        </Link>

        {(item.size || item.colour) && (
          <p className="text-small text-ink-muted">
            {[item.size, item.colour].filter(Boolean).join(' · ')}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <QuantityStepper
            id={`qty-drawer-${item.id}`}
            quantity={item.quantity}
            itemName={item.name}
            onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
            onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
          />

          <div className="flex items-center gap-2">
            <span className="text-small font-medium text-ink">
              {formatGBP(item.price * item.quantity)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name} from cart`}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-ink-subtle',
                'transition-colors hover:bg-rose-soft hover:text-rose',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose',
              )}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function EmptyCartState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt">
        <ShoppingBag className="size-8 text-ink-subtle" aria-hidden="true" />
      </div>
      <div className="space-y-1.5">
        <p className="text-headline font-display text-ink">Your cart is empty</p>
        <p className="text-small text-ink-muted">
          Browse the collection and add pieces you love.
        </p>
      </div>
      <Link
        href="/dresses"
        onClick={onClose}
        className={cn(
          'mt-2 inline-flex h-11 items-center justify-center rounded-full',
          'bg-rose px-6 text-small font-medium text-ivory',
          'transition-colors hover:bg-rose-dark',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2',
        )}
      >
        Browse the collection
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CartDrawer
// ---------------------------------------------------------------------------

export function CartDrawer() {
  const { drawerOpen, closeDrawer } = useCartUiStore();
  const { items } = useCartStore();
  const hydrated = useHydrated();

  const headingId = React.useId();
  const openerRef = React.useRef<HTMLElement | null>(null);
  const drawerRef = React.useRef<HTMLElement | null>(null);

  // Capture opener element on open so we can restore focus on close
  React.useEffect(() => {
    if (drawerOpen) {
      openerRef.current = document.activeElement as HTMLElement;
    }
  }, [drawerOpen]);

  // Body scroll lock
  React.useEffect(() => {
    if (!drawerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [drawerOpen]);

  // Restore focus on close
  const handleClose = React.useCallback(() => {
    closeDrawer();
    // Brief timeout lets the AnimatePresence exit complete before restoring focus
    setTimeout(() => {
      openerRef.current?.focus();
    }, 150);
  }, [closeDrawer]);

  // ESC to close + Tab focus trap
  React.useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, handleClose]);

  // Focus trap — on open, move focus to first focusable element inside the drawer
  React.useEffect(() => {
    if (!drawerOpen || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }, [drawerOpen]);

  const subtotal = hydrated
    ? items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const hydratedItems = hydrated ? items : [];

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            className="bg-ink/40 fixed inset-0 z-40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            key="cart-drawer"
            ref={drawerRef as React.RefObject<HTMLElement>}
            variants={drawerRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            className={cn(
              'bg-ivory fixed top-0 right-0 bottom-0 z-50',
              'flex w-[90vw] max-w-md flex-col shadow-2xl',
            )}
          >
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
              <h2
                id={headingId}
                className="font-display text-title text-ink"
              >
                Your cart
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close cart"
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  'transition-colors hover:bg-surface-alt',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose',
                )}
              >
                <X className="size-5 text-ink" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            {hydratedItems.length === 0 ? (
              <EmptyCartState onClose={handleClose} />
            ) : (
              <>
                <ul
                  className="overflow-y-auto px-5 py-2 max-h-[60vh]"
                  aria-label="Cart items"
                >
                  {hydratedItems.map((item) => (
                    <CartLineItem
                      key={item.id}
                      item={item}
                      onClose={handleClose}
                    />
                  ))}
                </ul>

                {/* Footer */}
                <div className="shrink-0 border-t border-border bg-ivory px-5 py-5 space-y-4">
                  {/* Subtotal */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-body text-ink-muted">Subtotal</span>
                    <span className="text-body-lg font-medium text-ink">
                      {formatGBP(subtotal)}
                    </span>
                  </div>

                  <p className="text-small text-ink-subtle">
                    Delivery and final pricing confirmed with Steffi after placing your order.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/checkout"
                      onClick={handleClose}
                      className={cn(
                        'flex h-12 items-center justify-center rounded-full',
                        'bg-rose text-ivory text-small font-medium',
                        'transition-colors hover:bg-rose-dark',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                      )}
                    >
                      Proceed to checkout
                    </Link>
                    <Link
                      href="/cart"
                      onClick={handleClose}
                      className={cn(
                        'flex h-11 items-center justify-center rounded-full',
                        'border border-border-strong bg-surface text-ink text-small font-medium',
                        'transition-colors hover:bg-surface-alt',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                      )}
                    >
                      View cart
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
