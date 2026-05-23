/**
 * CartIcon — Phase 5 (updated from Phase 4)
 *
 * Client component. Shows a shopping bag icon.
 * Clicking opens the CartDrawer (via ui-store).
 * The /cart route remains accessible via the drawer's "View cart" link
 * and via direct URL navigation.
 * Uses useHydrated() to avoid SSR/localStorage mismatch.
 */

'use client';

import { useCartCount, useHydrated } from '@/features/cart/hooks';
import { useCartUiStore } from '@/features/cart/ui-store';
import { cn } from '@/lib/cn';

export function CartIcon() {
  const count = useCartCount();
  const hydrated = useHydrated();
  const openDrawer = useCartUiStore((s) => s.openDrawer);

  const label =
    hydrated && count > 0 ? `Cart — ${count} item${count === 1 ? '' : 's'}` : 'Cart';

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={label}
      className={cn(
        'relative flex h-11 w-11 items-center justify-center rounded-full',
        'transition-colors hover:bg-surface-alt',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
      )}
    >
      {/* Shopping bag SVG */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-ink"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {/* Badge */}
      {hydrated && count > 0 && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center',
            'rounded-full bg-rose text-ivory text-[10px] font-medium leading-none',
          )}
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
