'use client';

/**
 * ReviewForm — Phase 7
 *
 * Client component. React Hook Form + Zod for leave-a-review submissions.
 * On success shows a brand-voice thank-you message.
 * On error shows an inline message.
 */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitReviewSchema, type SubmitReviewValues } from '../schema';
import { submitReview } from '../action';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Star rating picker sub-component
// ---------------------------------------------------------------------------

function StarPicker({
  value,
  onChange,
  error,
}: {
  value: number;
  onChange: (v: number) => void;
  error?: string;
}) {
  const [hovered, setHovered] = useState(0);
  const effective = hovered || value;

  return (
    <div className="space-y-1.5">
      <div
        className="flex gap-1"
        role="radiogroup"
        aria-label="Rating"
        aria-required="true"
        aria-describedby={error ? 'rating-error' : undefined}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            className={cn(
              'size-11 rounded-md flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose',
              effective >= star ? 'text-gold' : 'text-border-strong',
            )}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-6"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
      {error && (
        <p id="rating-error" className="text-small text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main form
// ---------------------------------------------------------------------------

export function ReviewForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubmitReviewValues>({
    resolver: zodResolver(submitReviewSchema),
    defaultValues: {
      author_name: '',
      rating: 0,
      body: '',
      occasion: '',
      author_location: '',
    },
  });

  async function onSubmit(data: SubmitReviewValues) {
    setServerError(null);
    const result = await submitReview(data);
    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(result.error);
    }
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl border border-border bg-gold-soft p-8 space-y-4"
        role="status"
        aria-live="polite"
      >
        <div className="text-gold text-3xl font-display leading-none" aria-hidden="true">
          &ldquo;
        </div>
        <p className="font-display text-headline text-ink">
          Thank you for sharing your experience.
        </p>
        <p className="text-body text-ink-muted text-pretty">
          We read each review before publishing — you will see yours here
          once it has been approved.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Leave a review"
      className="space-y-6"
    >
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="author_name">
          Your name <span aria-hidden="true" className="text-danger">*</span>
        </Label>
        <Input
          id="author_name"
          type="text"
          autoComplete="name"
          placeholder="Priya M."
          aria-invalid={errors.author_name ? 'true' : 'false'}
          aria-describedby={errors.author_name ? 'author-name-error' : undefined}
          {...register('author_name')}
        />
        {errors.author_name && (
          <p id="author-name-error" className="text-small text-danger" role="alert">
            {errors.author_name.message}
          </p>
        )}
      </div>

      {/* Rating */}
      <div className="space-y-1.5">
        <span className="text-label text-ink-muted block tracking-widest uppercase">
          Your rating <span aria-hidden="true" className="text-danger">*</span>
        </span>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarPicker
              value={field.value}
              onChange={field.onChange}
              error={errors.rating?.message}
            />
          )}
        />
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <Label htmlFor="body">
          Your review <span aria-hidden="true" className="text-danger">*</span>
        </Label>
        <textarea
          id="body"
          rows={5}
          placeholder="Tell us about your experience — what service you had, how the fitting went, and how the result turned out."
          className={cn(
            'w-full rounded-lg border px-3 py-2.5 text-body text-ink bg-surface placeholder:text-ink-muted',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose',
            errors.body
              ? 'border-danger focus-visible:ring-danger'
              : 'border-border focus-visible:ring-rose',
          )}
          aria-invalid={errors.body ? 'true' : 'false'}
          aria-describedby={errors.body ? 'body-error' : 'body-hint'}
          {...register('body')}
        />
        <p id="body-hint" className="text-label text-ink-muted">
          Between 50 and 1,000 characters.
        </p>
        {errors.body && (
          <p id="body-error" className="text-small text-danger" role="alert">
            {errors.body.message}
          </p>
        )}
      </div>

      {/* Occasion — optional */}
      <div className="space-y-1.5">
        <Label htmlFor="occasion">
          Occasion{' '}
          <span className="text-ink-muted text-label">(optional)</span>
        </Label>
        <Input
          id="occasion"
          type="text"
          placeholder="e.g. Hindu wedding, evening occasion, bridal party"
          aria-invalid={errors.occasion ? 'true' : 'false'}
          {...register('occasion')}
        />
      </div>

      {/* Location — optional */}
      <div className="space-y-1.5">
        <Label htmlFor="author_location">
          Your location{' '}
          <span className="text-ink-muted text-label">(optional)</span>
        </Label>
        <Input
          id="author_location"
          type="text"
          autoComplete="address-level2"
          placeholder="e.g. Hounslow, Southall"
          aria-invalid={errors.author_location ? 'true' : 'false'}
          {...register('author_location')}
        />
      </div>

      {/* Server error */}
      {serverError && (
        <div
          className="rounded-lg border border-danger bg-rose-soft p-4 text-small text-danger"
          role="alert"
          aria-live="assertive"
        >
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting…' : 'Submit review'}
      </Button>
    </form>
  );
}
