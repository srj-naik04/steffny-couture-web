/**
 * CheckoutForm — Phase 5
 *
 * Client component. Multi-step single-page checkout:
 *   Step 1 — Contact (name, email, phone)
 *   Step 2 — Delivery (UK address)
 *   Step 3 — Payment (mock card form)
 *   Step 4 — Review & place order
 *
 * Uses React Hook Form + Zod for validation.
 * On submit calls the `placeOrder` server action.
 * On success writes last-order summary to sessionStorage and redirects
 * to /checkout/confirmation?ref=<reference>.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';

import { useCartStore } from '@/features/cart/store';
import { useHydrated } from '@/features/cart/hooks';
import { placeOrder, type OrderItem } from '../action';
import { checkoutSchema, type CheckoutValues } from '../schema';
import { describeCartItem } from '@/features/cart/utils';
import { formatGBP } from '@/lib/currency';
import { isDemoMode } from '@/lib/env';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

const STEPS = [
  { id: 1, label: 'Contact' },
  { id: 2, label: 'Delivery' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Review' },
] as const;

type StepId = (typeof STEPS)[number]['id'];

// ---------------------------------------------------------------------------
// Field component
// ---------------------------------------------------------------------------

function Field({
  label,
  error,
  required,
  children,
  id,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  id: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-label uppercase tracking-widest text-ink-muted block"
      >
        {label}
        {required && (
          <span className="ml-1 text-danger" aria-label="required">
            *
          </span>
        )}
      </label>
      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        id,
        'aria-required': required,
        'aria-describedby': error ? errorId : undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {error && (
        <div
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-small text-danger"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Base input classes
const inputClass = cn(
  'block h-12 w-full rounded-lg px-4',
  'bg-surface-alt text-ink placeholder:text-ink-muted text-body',
  'border border-border focus:border-rose',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
  'transition-colors duration-200',
);
const inputErrorClass = 'border-danger focus:border-danger focus-visible:ring-danger';

const textareaClass = cn(
  'block w-full rounded-lg px-4 py-3',
  'bg-surface-alt text-ink placeholder:text-ink-muted text-body',
  'border border-border focus:border-rose',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
  'transition-colors duration-200 resize-none',
);

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

function ProgressIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: StepId;
  totalSteps: number;
}) {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-between mb-3">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <li
              className="flex items-center gap-1.5"
              aria-current={currentStep === step.id ? 'step' : undefined}
            >
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-small font-medium',
                  currentStep > step.id
                    ? 'bg-success text-ivory'
                    : currentStep === step.id
                      ? 'bg-rose text-ivory'
                      : 'bg-surface-alt text-ink-muted',
                )}
              >
                {currentStep > step.id ? (
                  <>
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    <span className="sr-only">Step {step.id}, {step.label} — completed</span>
                  </>
                ) : currentStep === step.id ? (
                  <>
                    <span aria-hidden="true">{step.id}</span>
                    <span className="sr-only">Step {step.id}, {step.label} — current</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">{step.id}</span>
                    <span className="sr-only">Step {step.id}, {step.label} — upcoming</span>
                  </>
                )}
              </div>
              <span
                className={cn(
                  'text-small hidden sm:block',
                  currentStep === step.id ? 'text-ink font-medium' : 'text-ink-muted',
                )}
                aria-hidden="true"
              >
                {step.label}
              </span>
            </li>
            {i < STEPS.length - 1 && (
              <li
                role="presentation"
                className={cn(
                  'flex-1 h-px mx-2',
                  currentStep > step.id ? 'bg-success' : 'bg-border',
                )}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        ))}
      </ol>
      <p className="text-small text-ink-muted text-right" aria-hidden="true">
        Step {currentStep} of {totalSteps}
      </p>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Contact
// ---------------------------------------------------------------------------

function ContactStep({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<CheckoutValues>>['register'];
  errors: ReturnType<typeof useForm<CheckoutValues>>['formState']['errors'];
}) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-title text-ink">Contact details</h2>
      <p className="text-body text-ink-muted">
        Steffi will use these details to get in touch about your order.
      </p>

      <Field label="Full name" required error={errors.fullName?.message} id="fullName">
        <input
          {...register('fullName')}
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          className={cn(inputClass, errors.fullName && inputErrorClass)}
        />
      </Field>

      <Field label="Email address" required error={errors.email?.message} id="email">
        <input
          {...register('email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          placeholder="you@example.com"
          className={cn(inputClass, errors.email && inputErrorClass)}
        />
      </Field>

      <Field label="Phone number" required error={errors.phone?.message} id="phone">
        <input
          {...register('phone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+44 7700 900000"
          className={cn(inputClass, errors.phone && inputErrorClass)}
        />
      </Field>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Delivery
// ---------------------------------------------------------------------------

function DeliveryStep({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<CheckoutValues>>['register'];
  errors: ReturnType<typeof useForm<CheckoutValues>>['formState']['errors'];
}) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-title text-ink">Delivery address</h2>
      <p className="text-body text-ink-muted">
        Your order will be sent to this address. Steffi will confirm delivery
        timing over WhatsApp.
      </p>

      <Field label="Address line 1" required error={errors.addressLine1?.message} id="addressLine1">
        <input
          {...register('addressLine1')}
          type="text"
          autoComplete="address-line1"
          placeholder="House number and street"
          className={cn(inputClass, errors.addressLine1 && inputErrorClass)}
        />
      </Field>

      <Field label="Address line 2" error={errors.addressLine2?.message} id="addressLine2">
        <input
          {...register('addressLine2')}
          type="text"
          autoComplete="address-line2"
          placeholder="Flat, suite, building (optional)"
          className={cn(inputClass, errors.addressLine2 && inputErrorClass)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="City" required error={errors.city?.message} id="city">
          <input
            {...register('city')}
            type="text"
            autoComplete="address-level2"
            placeholder="London"
            className={cn(inputClass, errors.city && inputErrorClass)}
          />
        </Field>
        <Field label="Postcode" required error={errors.postcode?.message} id="postcode">
          <input
            {...register('postcode')}
            type="text"
            autoComplete="postal-code"
            placeholder="TW3 1EA"
            className={cn(inputClass, errors.postcode && inputErrorClass)}
          />
        </Field>
      </div>

      <Field label="Country" required id="country">
        <input
          {...register('country')}
          type="text"
          readOnly
          defaultValue="United Kingdom"
          className={cn(inputClass, 'cursor-default opacity-70')}
        />
      </Field>

      <Field label="Order notes" error={errors.notes?.message} id="notes">
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Any notes for Steffi — fitting preferences, delivery instructions, special requests."
          className={cn(textareaClass, errors.notes && inputErrorClass)}
        />
      </Field>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Payment (mock)
// ---------------------------------------------------------------------------

function PaymentStep({
  register,
  errors,
  demoMode,
}: {
  register: ReturnType<typeof useForm<CheckoutValues>>['register'];
  errors: ReturnType<typeof useForm<CheckoutValues>>['formState']['errors'];
  demoMode: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <Lock className="size-5 text-rose shrink-0" aria-hidden="true" />
        <h2 className="font-display text-title text-ink">Card details</h2>
      </div>

      {/* Demo mode notice */}
      {demoMode && (
        <div
          className="rounded-xl bg-rose-soft px-4 py-3 text-small text-ink"
          role="note"
          aria-label="Demo mode notice"
        >
          <strong>Demo mode</strong> — no payment is taken. Steffi will confirm
          your order over WhatsApp before any charges apply.
        </div>
      )}

      <Field label="Name on card" required error={errors.cardName?.message} id="cardName">
        <input
          {...register('cardName')}
          type="text"
          autoComplete="cc-name"
          placeholder="As shown on your card"
          className={cn(inputClass, errors.cardName && inputErrorClass)}
        />
      </Field>

      {/* Card number + security group */}
      <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
        <Field label="Card number" required error={errors.cardNumber?.message} id="cardNumber">
          <input
            {...register('cardNumber')}
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            maxLength={23}
            className={cn(inputClass, errors.cardNumber && inputErrorClass)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiry (MM/YY)" required error={errors.expiry?.message} id="expiry">
            <input
              {...register('expiry')}
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              maxLength={5}
              className={cn(inputClass, errors.expiry && inputErrorClass)}
            />
          </Field>
          <Field label="CVC" required error={errors.cvc?.message} id="cvc">
            <input
              {...register('cvc')}
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              maxLength={4}
              className={cn(inputClass, errors.cvc && inputErrorClass)}
            />
          </Field>
        </div>
      </div>

      {/* Trust signal */}
      <div className="flex items-center gap-2 text-small text-ink-muted">
        <ShieldCheck className="size-4 shrink-0 text-success" aria-hidden="true" />
        <span>Your card details are encrypted. No payment is taken until Steffi confirms your order.</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Review
// ---------------------------------------------------------------------------

function ReviewStep({
  values,
  items,
  subtotal,
}: {
  values: CheckoutValues;
  items: OrderItem[];
  subtotal: number;
}) {
  // Mask card number — show last 4 digits only
  const maskedCard = values.cardNumber
    ? `•••• •••• •••• ${values.cardNumber.replace(/\s/g, '').slice(-4)}`
    : '';

  return (
    <div className="space-y-6">
      <h2 className="font-display text-title text-ink">Review your order</h2>

      {/* Items */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-label uppercase tracking-widest text-ink-muted">Items</h3>
        </div>
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.productId + (item.variantId ?? '')} className="flex items-center gap-3 px-5 py-3">
              <div className="relative h-12 w-10 shrink-0 rounded-lg overflow-hidden bg-surface-alt">
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
              <p className="text-small font-medium text-ink shrink-0">
                {formatGBP(item.price * item.quantity)}
                {item.quantity > 1 && (
                  <span className="ml-1 text-ink-muted font-normal">×{item.quantity}</span>
                )}
              </p>
            </li>
          ))}
        </ul>
        <div className="px-5 py-3 border-t border-border flex justify-between">
          <span className="text-body text-ink-muted">Total</span>
          <span className="text-body font-medium text-ink">{formatGBP(subtotal)}</span>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-xl border border-border bg-surface p-5 space-y-1.5">
        <h3 className="text-label uppercase tracking-widest text-ink-muted mb-3">Contact</h3>
        <p className="text-body text-ink">{values.fullName}</p>
        <p className="text-small text-ink-muted">{values.email}</p>
        <p className="text-small text-ink-muted">{values.phone}</p>
      </div>

      {/* Delivery */}
      <div className="rounded-xl border border-border bg-surface p-5 space-y-1">
        <h3 className="text-label uppercase tracking-widest text-ink-muted mb-3">Delivery</h3>
        <p className="text-small text-ink">{values.addressLine1}</p>
        {values.addressLine2 && <p className="text-small text-ink">{values.addressLine2}</p>}
        <p className="text-small text-ink">
          {values.city}, {values.postcode}
        </p>
        <p className="text-small text-ink">{values.country}</p>
        {values.notes && (
          <p className="mt-2 text-small text-ink-muted border-t border-border pt-2">
            Notes: {values.notes}
          </p>
        )}
      </div>

      {/* Card (masked) */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="text-label uppercase tracking-widest text-ink-muted mb-3">Payment</h3>
        <div className="flex items-center gap-2">
          <Lock className="size-4 text-ink-muted" aria-hidden="true" />
          <p className="text-small text-ink">{maskedCard || 'Card details confirmed'}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CheckoutForm (main)
// ---------------------------------------------------------------------------

export function CheckoutForm() {
  const router = useRouter();
  const { items, clear } = useCartStore();
  const hydrated = useHydrated();
  const [currentStep, setCurrentStep] = React.useState<StepId>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const hydratedItems = hydrated ? items : [];

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postcode: '',
      country: 'United Kingdom',
      notes: '',
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const subtotal = hydratedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Validate only the current step's fields before advancing
  const stepFields: Record<StepId, (keyof CheckoutValues)[]> = {
    1: ['fullName', 'email', 'phone'],
    2: ['addressLine1', 'city', 'postcode', 'country'],
    3: ['cardName', 'cardNumber', 'expiry', 'cvc'],
    4: [],
  };

  async function handleNext() {
    const fields = stepFields[currentStep];
    const valid = await trigger(fields);
    if (valid && currentStep < 4) {
      setCurrentStep((s) => (s + 1) as StepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((s) => (s - 1) as StepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const onSubmit = handleSubmit(async (data: CheckoutValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const orderItems: OrderItem[] = hydratedItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId ?? null,
      name: item.name,
      price: item.price,
      size: item.size,
      colour: item.colour,
      quantity: item.quantity,
      imagePath: item.imagePath,
    }));

    try {
      // 2-second fake processing delay (demo-mode UX polish)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Strip card fields — they must never transit to the server action
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { cardName: _cn, cardNumber: _num, expiry: _exp, cvc: _cvc, ...orderPayload } = data;
      const result = await placeOrder({
        ...orderPayload,
        items: orderItems,
        subtotal,
      });

      if (!result.success) {
        setSubmitError(result.error);
        setIsSubmitting(false);
        return;
      }

      // Persist the last order summary for the confirmation page
      try {
        sessionStorage.setItem(
          'steffny-last-order',
          JSON.stringify({
            reference: result.reference,
            items: orderItems,
            subtotal,
            fullName: data.fullName,
            email: data.email,
          }),
        );
      } catch {
        // sessionStorage may be unavailable in some browsers — non-fatal
      }

      // Clear the cart
      clear();

      router.push(`/checkout/confirmation?ref=${result.reference}`);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  });

  if (!hydrated) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading checkout">
        <div className="h-8 w-40 rounded bg-surface-alt animate-pulse" />
        <div className="h-48 rounded-xl bg-surface-alt animate-pulse" />
      </div>
    );
  }

  if (hydratedItems.length === 0) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-body text-ink-muted">
          Your cart is empty. Add items before proceeding to checkout.
        </p>
        <Link
          href="/dresses"
          className={cn(
            'inline-flex h-12 items-center justify-center rounded-full',
            'bg-rose px-7 text-small font-medium text-ivory',
            'transition-colors hover:bg-rose-dark',
          )}
        >
          Browse the collection
        </Link>
      </div>
    );
  }

  const currentValues = getValues();

  return (
    <form onSubmit={onSubmit} noValidate>
      <ProgressIndicator currentStep={currentStep} totalSteps={STEPS.length} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {currentStep === 1 && <ContactStep register={register} errors={errors} />}
          {currentStep === 2 && <DeliveryStep register={register} errors={errors} />}
          {currentStep === 3 && (
            <PaymentStep
              register={register}
              errors={errors}
              demoMode={isDemoMode}
            />
          )}
          {currentStep === 4 && (
            <ReviewStep
              values={currentValues}
              items={hydratedItems.map((item) => ({
                productId: item.productId,
                variantId: item.variantId ?? null,
                name: item.name,
                price: item.price,
                size: item.size,
                colour: item.colour,
                quantity: item.quantity,
                imagePath: item.imagePath,
              }))}
              subtotal={subtotal}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Server error */}
      {submitError && (
        <div
          role="alert"
          className="mt-6 flex items-center gap-2 rounded-xl bg-rose-soft px-4 py-3 text-small text-danger"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className={cn(
              'inline-flex h-12 items-center gap-1.5 rounded-full px-6',
              'border border-border-strong bg-surface text-small font-medium text-ink',
              'transition-colors hover:bg-surface-alt',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose',
            )}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < 4 && (
          <button
            type="button"
            onClick={handleNext}
            className={cn(
              'inline-flex h-12 items-center gap-1.5 rounded-full px-7',
              'bg-rose text-small font-medium text-ivory',
              'transition-colors hover:bg-rose-dark',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2',
            )}
          >
            Continue
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        )}

        {currentStep === 4 && (
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className={cn(
              'inline-flex h-12 items-center justify-center gap-2 rounded-full px-8',
              'bg-rose text-small font-medium text-ivory',
              'transition-all hover:bg-rose-dark',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {isSubmitting ? (
              <>
                <SpinnerIcon />
                Processing…
              </>
            ) : (
              `Place order — ${formatGBP(subtotal)}`
            )}
          </button>
        )}
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

function SpinnerIcon() {
  return (
    <svg
      className="size-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
