'use client';

/**
 * ContactForm — Phase 3
 *
 * Client component. React Hook Form + Zod.
 * Calls the submitContactForm server action on submission.
 * Shows brand-voice validation errors and a success state.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { contactFormSchema, type ContactFormValues } from '@/features/contact/schema';
import { submitContactForm, type ContactFormResult } from '@/features/contact/actions';

export function ContactForm() {
  const [result, setResult] = useState<ContactFormResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    const res = await submitContactForm(values);
    setResult(res);
    if (res.success) {
      reset();
    }
  }

  if (result?.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-border bg-surface p-8 text-center space-y-3"
      >
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-soft"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-6 text-rose"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="font-display text-title text-ink">Message sent</p>
        <p className="text-body text-ink-muted">{result.message}</p>
        <Button
          onClick={() => setResult(null)}
          variant="secondary"
          className="mt-2"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
      aria-label="Contact form"
    >
      {/* Error banner */}
      {result && !result.success && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3"
        >
          <p className="text-small text-danger">{result.error}</p>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">
          Your name <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={Boolean(errors.name)}
          className={cn(errors.name && 'border-danger focus-visible:ring-danger')}
          {...register('name')}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-small text-danger">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">
          Email address <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          aria-required="true"
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={Boolean(errors.email)}
          className={cn(errors.email && 'border-danger focus-visible:ring-danger')}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-small text-danger">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">
          Phone number{' '}
          <span className="text-ink-subtle font-normal">(optional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
          aria-invalid={Boolean(errors.phone)}
          className={cn(errors.phone && 'border-danger focus-visible:ring-danger')}
          {...register('phone')}
        />
        <p id="phone-hint" className="text-label text-ink-subtle">
          We may use this for a quick reply, if you prefer.
        </p>
        {errors.phone && (
          <p id="phone-error" role="alert" className="text-small text-danger">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message">
          Message <span aria-hidden="true">*</span>
        </Label>
        <textarea
          id="message"
          rows={5}
          aria-required="true"
          aria-describedby={errors.message ? 'message-error' : 'message-hint'}
          aria-invalid={Boolean(errors.message)}
          className={cn(
            'border-border bg-surface-alt text-ink placeholder:text-ink-subtle',
            'w-full rounded-lg border px-4 py-3 text-base transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2',
            errors.message && 'border-danger focus-visible:ring-danger',
          )}
          placeholder="Tell us about the piece you have in mind, or simply introduce yourself."
          {...register('message')}
        />
        <p id="message-hint" className="text-label text-ink-subtle">
          Tell us what you need — the occasion, the garment, and anything else that will help us understand.
        </p>
        {errors.message && (
          <p id="message-error" role="alert" className="text-small text-danger">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Sending…' : 'Send message'}
      </Button>

      <p className="text-label text-ink-subtle text-center">
        We reply within one working day. For urgent enquiries, please use WhatsApp.
      </p>
    </form>
  );
}
