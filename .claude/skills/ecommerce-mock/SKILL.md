---
name: ecommerce-mock
description: Use this skill whenever building or modifying the e-commerce parts of the Steffny Couture website — product detail pages, cart, checkout flow, mock payment screen, order confirmation. Fires for any file in `/app/(shop)/` or `/features/cart/`. Enforces the demo-mode mock checkout (no real payments yet), the Stripe-ready architecture so we can swap in real payments later without rebuilding, and the patterns that make the fake flow feel real.
---

# E-Commerce Mock — Demo Mode

For v1, payments are **mocked** but the flow must feel real. The goal is two-fold:
1. **Demo well**: Bunty sees a customer can browse, add to cart, checkout, get a confirmation
2. **Future-proof**: When real Stripe payments are added later, swap out only the payment step, not the entire flow

## Architecture Principles

### Principle 1 — Cart is client-side only
No database persistence. Zustand + localStorage. The cart is per-browser, not per-account.

### Principle 2 — Checkout creates an `inquiry`, not an `order`
We're not actually selling online yet. The "order" is really an inquiry that Steffi follows up on via WhatsApp. This positions the site as "bespoke service" not "high street retail", which is honest to her business.

In a future phase, real `orders` table + Stripe integration.

### Principle 3 — Mock payment looks real
The payment screen has card fields, security badge, smooth processing animation. But form just delays 2 seconds then succeeds — no validation, no real charge.

### Principle 4 — Confirmation triggers real downstream action
On "payment success", we:
- Write the inquiry to Supabase
- Trigger email to customer (confirmation)
- Trigger email to Steffi (new inquiry alert) — same Edge Function as mobile app
- Show a beautiful confirmation page

This is the part that's not mock — Steffi actually gets to follow up.

## The Flow

```
[Product detail page]
        ↓ Add to cart
[Cart drawer or /cart]
        ↓ Checkout
[/checkout — address + details]
        ↓ Continue to payment
[/checkout/payment — mock card form]
        ↓ "Process" (2s fake delay)
[/checkout/confirmation]
        ↓ Real email + real DB write
```

## Implementation

### Add to cart (client component)

```tsx
'use client';
import { useCart } from '@/features/cart/store';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export function AddToCartButton({ product, variant }: Props) {
  const addItem = useCart((s) => s.addItem);

  function handleAdd() {
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
    });
    toast.success('Added to cart');
  }

  return <Button onClick={handleAdd}>Add to cart</Button>;
}
```

### Cart drawer (slide-in from header)

```tsx
'use client';
import { useCart } from '@/features/cart/store';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer({ open, onClose }: Props) {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const removeItem = useCart((s) => s.removeItem);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/40 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 w-[90vw] max-w-md bg-ivory z-50 flex flex-col"
          >
            <header className="flex items-center justify-between h-16 px-6 border-b border-border">
              <h2 className="font-display text-title">Your bag</h2>
              <CloseButton onClick={onClose} />
            </header>

            {items.length === 0 ? (
              <EmptyCart onClose={onClose} />
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <CartItemRow key={item.variantId} item={item} onRemove={() => removeItem(item.variantId)} />
                  ))}
                </ul>
                <footer className="border-t border-border p-6 space-y-4">
                  <div className="flex justify-between text-body-lg">
                    <span>Subtotal</span>
                    <span className="font-medium">£{total.toFixed(2)}</span>
                  </div>
                  <p className="text-small text-inkMuted">Delivery and any final adjustments confirmed at checkout.</p>
                  <Link href="/checkout" className="block w-full text-center bg-rose text-ivory py-4 rounded-full font-medium">
                    Checkout
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
```

### Checkout page (collect details)

```tsx
// app/(shop)/checkout/page.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/features/cart/store';
import { useRouter } from 'next/navigation';
import { checkoutSchema, type CheckoutInput } from '@/features/cart/schemas';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());

  const { control, handleSubmit } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  function onSubmit(values: CheckoutInput) {
    // Store in sessionStorage temporarily
    sessionStorage.setItem('checkout', JSON.stringify(values));
    router.push('/checkout/payment');
  }

  if (items.length === 0) {
    return <EmptyCheckout />;
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-12 container py-12 lg:py-20">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Address fields, contact, delivery options */}
      </form>
      <CheckoutSummary items={items} total={total} />
    </div>
  );
}
```

### Payment page (the mock)

```tsx
// app/(shop)/checkout/payment/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/features/cart/store';
import { Lock, ShieldCheck } from 'lucide-react';
import { processOrder } from '@/features/cart/actions';

export default function PaymentPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const clear = useCart((s) => s.clear);

  async function handlePay() {
    setProcessing(true);

    // Mock the payment processing (2s delay)
    await new Promise((r) => setTimeout(r, 2000));

    // Get checkout details from sessionStorage
    const checkoutData = JSON.parse(sessionStorage.getItem('checkout') ?? '{}');

    // Real backend action — creates inquiry, sends emails
    const result = await processOrder({
      ...checkoutData,
      items,
      total,
    });

    if (result.success) {
      clear();
      sessionStorage.removeItem('checkout');
      router.push(`/checkout/confirmation?ref=${result.reference}`);
    } else {
      setProcessing(false);
      // Show error
    }
  }

  return (
    <div className="container max-w-2xl py-12 lg:py-20">
      <div className="bg-surface border border-border rounded-2xl p-8 lg:p-12 space-y-8">
        <div className="flex items-center gap-3">
          <Lock size={20} className="text-rose" />
          <h1 className="font-display text-title">Secure payment</h1>
        </div>

        {/* Card form — looks real but is mocked */}
        <div className="space-y-6">
          <FormField label="Card number" placeholder="1234 5678 9012 3456" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Expiry" placeholder="MM / YY" />
            <FormField label="CVC" placeholder="123" />
          </div>
          <FormField label="Cardholder name" placeholder="As shown on card" />
        </div>

        {/* Trust signals */}
        <div className="flex items-center gap-2 text-small text-inkMuted">
          <ShieldCheck size={16} />
          <span>Encrypted transaction. Card details never leave your browser.</span>
        </div>

        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full bg-rose text-ivory py-4 rounded-full font-medium disabled:opacity-60 transition-all"
        >
          {processing ? (
            <span className="inline-flex items-center gap-2">
              <Spinner /> Processing payment…
            </span>
          ) : (
            <>Pay £{total.toFixed(2)}</>
          )}
        </button>
      </div>

      {/* Demo notice — subtle, only on demo deploy */}
      {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
        <p className="mt-6 text-center text-small text-inkSubtle">
          Demo mode — no real payment will be taken.
        </p>
      )}
    </div>
  );
}
```

### Order action (real downstream side effects)

```ts
// features/cart/actions.ts
'use server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

const orderSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  postcode: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string(),
    name: z.string(),
    price: z.number(),
    qty: z.number(),
  })),
  total: z.number(),
});

export async function processOrder(input: z.infer<typeof orderSchema>) {
  try {
    const parsed = orderSchema.parse(input);
    const supabase = await createClient();

    const reference = `SC-${nanoid(8).toUpperCase()}`;

    // Create inquiry (in production this would be a real order)
    const { error } = await supabase.from('inquiries').insert({
      reference,
      type: 'product_order',
      customer_name: parsed.name,
      customer_email: parsed.email,
      customer_phone: parsed.phone,
      delivery_address: `${parsed.address}, ${parsed.city}, ${parsed.postcode}`,
      items: parsed.items,
      total: parsed.total,
      status: 'new',
    });

    if (error) return { success: false, error: error.message };

    // Trigger emails (Edge Function, same as mobile app)
    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'order_confirmation',
        reference,
        to: parsed.email,
        name: parsed.name,
        items: parsed.items,
        total: parsed.total,
      }),
    });

    return { success: true, reference };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
```

### Confirmation page

```tsx
// app/(shop)/checkout/confirmation/page.tsx
import Link from 'next/link';
import { Check } from 'lucide-react';

type Props = { searchParams: Promise<{ ref?: string }> };

export default async function ConfirmationPage({ searchParams }: Props) {
  const { ref } = await searchParams;

  return (
    <div className="container max-w-xl py-16 lg:py-24 text-center">
      <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center">
        <Check size={36} className="text-success" />
      </div>

      <h1 className="font-display text-display-sm md:text-display text-ink mt-8">
        Thank you, your order is in.
      </h1>

      <div className="mt-4 inline-flex items-baseline gap-2 text-inkMuted">
        <span className="text-label uppercase tracking-widest">Order reference</span>
        <span className="font-display text-headline text-ink">{ref}</span>
      </div>

      <p className="mt-8 text-body-lg text-inkMuted">
        We've sent a confirmation to your email. Steffi will be in touch within 24 hours to confirm fit, alterations if needed, and delivery.
      </p>

      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="https://wa.me/447834877992"
          className="bg-rose text-ivory px-8 py-4 rounded-full font-medium"
        >
          Message on WhatsApp
        </a>
        <Link
          href="/dresses"
          className="bg-surface text-ink px-8 py-4 rounded-full font-medium border border-borderStrong"
        >
          Continue browsing
        </Link>
      </div>
    </div>
  );
}
```

## Demo Mode Flag

```ts
// .env.local
NEXT_PUBLIC_DEMO_MODE=true
```

Show the "Demo mode" notice on the payment page only when this flag is on. In production, set to `false` and add real Stripe integration.

## Future: Real Stripe Integration (Phase 9+)

When ready for real payments, the swap is contained:

1. Replace mock card form with Stripe `<PaymentElement />`
2. Replace 2-second `setTimeout` with `stripe.confirmPayment()`
3. Add webhook handler at `/api/webhooks/stripe`
4. Change `inquiries` insert to also create `orders` row
5. Verify payment server-side before order creation

The flow stays the same. The customer doesn't notice. The UI doesn't change.

## Anti-Patterns

- ❌ Storing cart in Supabase (overkill, slow, sync issues)
- ❌ Trusting client-side cart total at checkout (recalculate server-side from product IDs)
- ❌ Real Stripe keys in `.env.local` while still in demo mode
- ❌ Fake card validation that lets `1111 1111 1111 1111` "succeed" without indication
- ❌ Showing prices that don't match the database (always read server-side)
- ❌ "Demo mode" notice plastered everywhere — it should be subtle, near the payment button only
- ❌ Skipping the email side effect — that's the part that makes the demo feel real
