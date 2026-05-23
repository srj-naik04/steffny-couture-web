'use client';

/**
 * BookingWizard — Phase 6
 *
 * 6-step multi-step form for booking a fitting or alteration.
 *
 * Steps:
 *   1 — Service type (alteration / custom / consultation)
 *   2 — Photos (optional, up to 5)
 *   3 — Garment details (type + description)
 *   4 — Appointment date + time
 *   5 — Contact details (name, email, phone)
 *   6 — Review + confirm
 *
 * Patterns:
 *   - Single React Hook Form instance across all steps (preserves state)
 *   - Per-step validation via trigger() before advancing
 *   - Draft saved to Zustand/localStorage on every change (debounced)
 *   - Framer Motion slide transition between steps (respects useReducedMotion)
 *   - On success: saves last booking to sessionStorage, clears draft, redirects
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Sparkles,
  MessageSquare,
  Camera,
  CalendarDays,
  User,
  ClipboardList,
} from 'lucide-react';

import { cn } from '@/lib/cn';
import { isDemoMode } from '@/lib/env';
import { STUDIO } from '@/constants/brand';
import { bookingFullSchema, type BookingFullValues } from '../schema';
import { submitBooking } from '../action';
import { useBookingDraftStore } from '../draft-store';
import { PhotoUploader } from './PhotoUploader';

// ---------------------------------------------------------------------------
// Wizard step definitions
// ---------------------------------------------------------------------------

const STEPS = [
  { id: 1, label: 'Service', icon: Scissors },
  { id: 2, label: 'Photos', icon: Camera },
  { id: 3, label: 'Details', icon: ClipboardList },
  { id: 4, label: 'Schedule', icon: CalendarDays },
  { id: 5, label: 'Contact', icon: User },
  { id: 6, label: 'Review', icon: ClipboardList },
] as const;

type StepId = (typeof STEPS)[number]['id'];

// Fields belonging to each step — used by trigger() for per-step validation
const STEP_FIELDS: Record<StepId, (keyof BookingFullValues)[]> = {
  1: ['type'],
  2: [],                 // Photos are optional — no validation gate
  3: ['garmentType', 'description'],
  4: ['appointmentDate', 'appointmentTime'],
  5: ['guestName', 'guestEmail', 'guestPhone'],
  6: [],
};

// ---------------------------------------------------------------------------
// Service type cards
// ---------------------------------------------------------------------------

const SERVICE_TYPES = [
  {
    value: 'alteration' as const,
    label: 'Alterations',
    description: 'Taking in, letting out, hemming, or reshaping an existing garment.',
    icon: Scissors,
  },
  {
    value: 'custom' as const,
    label: 'Custom piece',
    description: 'A new garment made to your measurements — bridal, occasion, or couture.',
    icon: Sparkles,
  },
  {
    value: 'consultation' as const,
    label: 'Consultation',
    description: 'Not sure yet? Come in for a conversation with Steffi and see what is possible.',
    icon: MessageSquare,
  },
];

// ---------------------------------------------------------------------------
// Time slots helper (09:30 – 18:30, 30-minute increments)
// ---------------------------------------------------------------------------

function buildTimeSlots(): { value: string; label: string }[] {
  const slots: { value: string; label: string }[] = [];
  for (let h = 9; h <= 18; h++) {
    for (const m of [0, 30]) {
      if (h === 9 && m === 0) continue; // Studio opens at 09:30
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const value = `${hh}:${mm}`;
      const hour = h > 12 ? h - 12 : h;
      const ampm = h >= 12 ? 'pm' : 'am';
      const label = `${hour}:${mm} ${ampm}`;
      slots.push({ value, label });
      if (h === 18 && m === 30) break;
    }
  }
  return slots;
}

const TIME_SLOTS = buildTimeSlots();

// Today and max-date for the date input
function getTodayIso(): string {
  return new Date().toISOString().split('T')[0];
}
function getMaxDateIso(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().split('T')[0];
}

// ---------------------------------------------------------------------------
// Shared input / field styles
// ---------------------------------------------------------------------------

const inputClass = cn(
  'block h-12 w-full rounded-lg px-4',
  'bg-surface-alt text-ink placeholder:text-ink-subtle text-body',
  'border border-border focus:border-rose',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
  'transition-colors duration-200',
);
const inputErrorClass = 'border-danger focus:border-danger focus-visible:ring-danger';

const textareaClass = cn(
  'block w-full rounded-lg px-4 py-3',
  'bg-surface-alt text-ink placeholder:text-ink-subtle text-body',
  'border border-border focus:border-rose',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
  'transition-colors duration-200 resize-none',
);

const selectClass = cn(
  'block h-12 w-full rounded-lg px-4',
  'bg-surface-alt text-ink text-body',
  'border border-border focus:border-rose',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
  'transition-colors duration-200',
  'appearance-none cursor-pointer',
);

// ---------------------------------------------------------------------------
// Field wrapper
// ---------------------------------------------------------------------------

function Field({
  id,
  label,
  error,
  required,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const ariaDescribedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-label uppercase tracking-widest text-ink-muted"
      >
        {label}
        {required && (
          <span className="ml-1 text-danger" aria-label="required">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-small text-ink-subtle">
          {hint}
        </p>
      )}
      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        id,
        'aria-required': required,
        'aria-describedby': ariaDescribedBy,
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

// ---------------------------------------------------------------------------
// Progress indicator
// ---------------------------------------------------------------------------

function ProgressIndicator({
  currentStep,
}: {
  currentStep: StepId;
}) {
  return (
    <nav aria-label="Booking progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <li
                className="flex flex-col items-center gap-1"
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-small font-medium transition-colors duration-200',
                    isDone
                      ? 'bg-success text-ivory'
                      : isCurrent
                        ? 'bg-rose text-ivory'
                        : 'bg-surface-alt text-ink-subtle',
                  )}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                      <span className="sr-only">
                        Step {step.id}, {step.label} — completed
                      </span>
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">{step.id}</span>
                      <span className="sr-only">
                        Step {step.id}, {step.label}
                        {isCurrent ? ' — current' : ' — upcoming'}
                      </span>
                    </>
                  )}
                </div>
                <span
                  className={cn(
                    'hidden text-[11px] sm:block',
                    isCurrent ? 'font-medium text-ink' : 'text-ink-subtle',
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
                    'mb-5 h-px flex-1 mx-1',
                    currentStep > step.id ? 'bg-success' : 'bg-border',
                  )}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Service type
// ---------------------------------------------------------------------------

function ServiceTypeStep({
  value,
  onChange,
  error,
}: {
  value: BookingFullValues['type'] | undefined;
  onChange: (v: BookingFullValues['type']) => void;
  error?: string;
}) {
  return (
    <fieldset className="border-none p-0 m-0">
      <legend className="mb-2 font-display text-title text-ink">
        What can we help with?
      </legend>
      <p className="mb-6 text-body text-ink-muted">
        Select the service that best describes your visit.
      </p>
      <div className="space-y-3">
        {SERVICE_TYPES.map((service) => {
          const isSelected = value === service.value;
          const Icon = service.icon;
          return (
            <button
              key={service.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(service.value)}
              className={cn(
                'flex w-full items-start gap-4 rounded-2xl border p-5 text-left',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2',
                isSelected
                  ? 'border-rose bg-rose-soft ring-1 ring-rose'
                  : 'border-border bg-surface hover:border-border-strong hover:bg-surface-alt',
              )}
            >
              <div
                className={cn(
                  'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full',
                  isSelected ? 'bg-rose text-ivory' : 'bg-surface-alt text-ink-muted',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-ink">{service.label}</p>
                <p className="mt-0.5 text-small text-ink-muted">{service.description}</p>
              </div>
              {isSelected && (
                <CheckCircle2
                  className="ml-auto mt-0.5 size-5 shrink-0 text-rose"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-3 flex items-center gap-1.5 text-small text-danger">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Photos
// ---------------------------------------------------------------------------

function PhotosStep({
  onChange,
  draftId,
}: {
  onChange: (paths: string[]) => void;
  draftId: string;
}) {
  return (
    <fieldset className="border-none p-0 m-0 space-y-4">
      <legend className="font-display text-title text-ink">
        Add photos (optional)
      </legend>
      <p className="text-body text-ink-muted">
        Photos of your garment help Steffi arrive prepared. You can always share
        them later over WhatsApp if you prefer.
      </p>
      <PhotoUploader onChange={onChange} draftId={draftId} />
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Details
// ---------------------------------------------------------------------------

function DetailsStep({
  register,
  errors,
  bookingType,
}: {
  register: ReturnType<typeof useForm<BookingFullValues>>['register'];
  errors: ReturnType<typeof useForm<BookingFullValues>>['formState']['errors'];
  bookingType: BookingFullValues['type'] | undefined;
}) {
  const garmentPlaceholder =
    bookingType === 'alteration'
      ? 'e.g. wedding lehenga, bridesmaid gown, saree blouse'
      : bookingType === 'custom'
        ? 'e.g. bridal lehenga, reception gown, fusion piece'
        : 'e.g. wedding dress, occasion wear, bridal outfit';

  const descriptionPlaceholder =
    bookingType === 'alteration'
      ? 'Describe what needs to be altered — e.g. take in the waist by 2 inches, hem 3 cm, add boning to bodice.'
      : bookingType === 'custom'
        ? 'Tell Steffi about your vision — style, fabric, colours, any reference images you have in mind.'
        : 'What would you like to discuss? Any ideas, occasions, or questions you have.';

  return (
    <fieldset className="border-none p-0 m-0 space-y-5">
      <legend className="font-display text-title text-ink">
        Tell us about your garment
      </legend>
      <p className="text-body text-ink-muted">
        The more detail you share here, the better Steffi can prepare for your appointment.
      </p>

      <Field
        id="garmentType"
        label="Garment type"
        required
        error={errors.garmentType?.message}
        hint="Briefly describe the item — e.g. wedding lehenga, evening gown, saree blouse."
      >
        <input
          {...register('garmentType')}
          type="text"
          placeholder={garmentPlaceholder}
          autoComplete="off"
          className={cn(inputClass, errors.garmentType && inputErrorClass)}
        />
      </Field>

      <Field
        id="description"
        label="Description"
        required
        error={errors.description?.message}
        hint="Min 10 characters. Max 2000."
      >
        <textarea
          {...register('description')}
          rows={5}
          placeholder={descriptionPlaceholder}
          className={cn(textareaClass, errors.description && inputErrorClass)}
        />
      </Field>
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Schedule
// ---------------------------------------------------------------------------

function ScheduleStep({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<BookingFullValues>>['register'];
  errors: ReturnType<typeof useForm<BookingFullValues>>['formState']['errors'];
}) {
  const today = getTodayIso();
  const maxDate = getMaxDateIso();

  return (
    <fieldset className="border-none p-0 m-0 space-y-5">
      <legend className="font-display text-title text-ink">
        When would you like to come in?
      </legend>
      <p className="text-body text-ink-muted">
        Choose a preferred date and time. Steffi will confirm availability over WhatsApp
        within one working day.
      </p>

      <Field
        id="appointmentDate"
        label="Preferred date"
        required
        error={errors.appointmentDate?.message}
      >
        <input
          {...register('appointmentDate')}
          type="date"
          min={today}
          max={maxDate}
          className={cn(inputClass, errors.appointmentDate && inputErrorClass)}
        />
      </Field>

      <Field
        id="appointmentTime"
        label="Preferred time"
        required
        error={errors.appointmentTime?.message}
        hint="Studio hours: 09:30 – 18:30"
      >
        <select
          {...register('appointmentTime')}
          className={cn(selectClass, errors.appointmentTime && inputErrorClass)}
          defaultValue=""
        >
          <option value="" disabled>
            Select a time
          </option>
          {TIME_SLOTS.map((slot) => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
        </select>
      </Field>

      {/* Studio hours reminder */}
      <div className="rounded-xl border border-border bg-surface p-4 text-small text-ink-muted">
        <p className="font-medium text-ink mb-2">Studio hours</p>
        <ul className="space-y-0.5">
          {STUDIO.hours.map((h) => (
            <li key={h.day} className="flex justify-between gap-4">
              <span>{h.day}</span>
              <span>{h.open}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-ink-subtle">
          All appointments are by arrangement. Steffi will confirm your slot personally.
        </p>
      </div>
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// Step 5 — Contact
// ---------------------------------------------------------------------------

function ContactStep({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<BookingFullValues>>['register'];
  errors: ReturnType<typeof useForm<BookingFullValues>>['formState']['errors'];
}) {
  return (
    <fieldset className="border-none p-0 m-0 space-y-5">
      <legend className="font-display text-title text-ink">
        Your contact details
      </legend>
      <p className="text-body text-ink-muted">
        Steffi will use these to confirm your appointment and answer any questions.
      </p>

      <Field
        id="guestName"
        label="Full name"
        required
        error={errors.guestName?.message}
      >
        <input
          {...register('guestName')}
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          className={cn(inputClass, errors.guestName && inputErrorClass)}
        />
      </Field>

      <Field
        id="guestEmail"
        label="Email address"
        required
        error={errors.guestEmail?.message}
      >
        <input
          {...register('guestEmail')}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          placeholder="you@example.com"
          className={cn(inputClass, errors.guestEmail && inputErrorClass)}
        />
      </Field>

      <Field
        id="guestPhone"
        label="Phone number"
        required
        error={errors.guestPhone?.message}
        hint="We will WhatsApp or call this number to confirm your appointment."
      >
        <input
          {...register('guestPhone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+44 7700 900000"
          className={cn(inputClass, errors.guestPhone && inputErrorClass)}
        />
      </Field>
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// Step 6 — Review
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  if (!iso) return '';
  const [year, month, day] = iso.split('-');
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(hhmm: string): string {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const ampm = h >= 12 ? 'pm' : 'am';
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 py-3 border-b border-border last:border-0">
      <dt className="text-small text-ink-muted">{label}</dt>
      <dd className="text-small font-medium text-ink text-right">{value}</dd>
    </div>
  );
}

function ReviewStep({ values }: { values: BookingFullValues }) {
  const serviceLabel = SERVICE_TYPES.find((s) => s.value === values.type)?.label ?? values.type;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-title text-ink">Review your booking</h2>
        <p className="mt-2 text-body text-ink-muted">
          Check the details below, then tap &ldquo;Send booking request&rdquo; to confirm.
        </p>
      </div>

      <dl className="rounded-2xl border border-border bg-surface p-5">
        <ReviewRow label="Service" value={serviceLabel} />
        <ReviewRow label="Garment" value={values.garmentType} />
        <ReviewRow
          label="Description"
          value={
            <span className="max-w-[220px] text-right leading-snug">{values.description}</span>
          }
        />
        <ReviewRow
          label="Photos"
          value={
            values.photoPaths && values.photoPaths.length > 0
              ? `${values.photoPaths.length} photo${values.photoPaths.length === 1 ? '' : 's'} attached`
              : 'None added'
          }
        />
        <ReviewRow label="Date" value={formatDate(values.appointmentDate)} />
        <ReviewRow label="Time" value={formatTime(values.appointmentTime)} />
        <ReviewRow label="Name" value={values.guestName} />
        <ReviewRow label="Email" value={values.guestEmail} />
        <ReviewRow label="Phone" value={values.guestPhone} />
      </dl>

      <div className="rounded-xl border border-border bg-rose-soft/30 px-5 py-4 text-small text-ink">
        <p>
          Steffi will confirm your appointment personally over WhatsApp within one working day.
          This is a booking request — not a confirmed slot.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// What happens next sidebar
// ---------------------------------------------------------------------------

function WhatHappensNext() {
  return (
    <aside
      aria-label="What happens next"
      className="space-y-5 lg:sticky lg:top-28"
    >
      <div className="rounded-2xl bg-rose-soft p-6">
        <h2 className="font-display text-xl text-rose">What happens next</h2>
        <ol className="mt-4 space-y-4 text-small text-ink">
          <li className="flex gap-3">
            <span className="font-display text-rose tabular-nums shrink-0">1.</span>
            <span>Steffi sees your request in the studio app within minutes.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-rose tabular-nums shrink-0">2.</span>
            <span>Steffi will WhatsApp you within one working day to confirm.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-rose tabular-nums shrink-0">3.</span>
            <span>
              Steffi will reply on WhatsApp or email within one working day to confirm
              the slot and let you know what to bring.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-rose tabular-nums shrink-0">4.</span>
            <span>Come in to the Hounslow studio at your confirmed time.</span>
          </li>
        </ol>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="font-display text-base text-ink">Prefer to chat first?</h3>
        <p className="mt-2 text-small text-ink-muted">
          Send a message on WhatsApp and Steffi will reply directly.
        </p>
        <a
          href={STUDIO.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'mt-4 inline-flex h-11 items-center justify-center rounded-full px-6',
            'border border-border-strong bg-surface text-small font-medium text-ink',
            'transition-colors hover:bg-surface-alt',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose',
          )}
        >
          Open WhatsApp
        </a>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 text-small space-y-2">
        <h3 className="font-display text-base text-ink">Cancellations</h3>
        <p className="text-ink-muted">
          You can cancel or reschedule up to 24 hours before your appointment.
          Contact Steffi directly on WhatsApp.
        </p>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Spinner icon
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
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// BookingWizard (main)
// ---------------------------------------------------------------------------

export function BookingWizard() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const { draft, setDraft, clearDraft } = useBookingDraftStore();
  const [currentStep, setCurrentStep] = React.useState<StepId>(1);
  const storedStep = useBookingDraftStore((s) => s.draft.currentStep);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Stable draftId for photo upload path prefix — persists across renders
  const draftId = React.useRef<string>(
    typeof window !== 'undefined' && localStorage.getItem('steffny-booking-draft-id')
      ? (localStorage.getItem('steffny-booking-draft-id') as string)
      : (() => {
          const id = crypto.randomUUID();
          try { localStorage.setItem('steffny-booking-draft-id', id); } catch { /* ok */ }
          return id;
        })(),
  );

  // -------------------------------------------------------------------
  // React Hook Form
  // -------------------------------------------------------------------

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm<BookingFullValues>({
    resolver: zodResolver(bookingFullSchema),
    defaultValues: {
      type: draft.type,
      photoPaths: draft.photoPaths ?? [],
      garmentType: draft.garmentType ?? '',
      description: draft.description ?? '',
      alterationTypeId: draft.alterationTypeId ?? '',
      appointmentDate: draft.appointmentDate ?? '',
      appointmentTime: draft.appointmentTime ?? '',
      guestName: draft.guestName ?? '',
      guestEmail: draft.guestEmail ?? '',
      guestPhone: draft.guestPhone ?? '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  // -------------------------------------------------------------------
  // Persist draft to localStorage on field changes (debounced)
  // -------------------------------------------------------------------

  React.useEffect(() => {
    const subscription = watch((values) => {
      setDraft({
        type: values.type,
        photoPaths: values.photoPaths as string[],
        garmentType: values.garmentType,
        description: values.description,
        alterationTypeId: values.alterationTypeId ?? '',
        appointmentDate: values.appointmentDate,
        appointmentTime: values.appointmentTime,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, setDraft]);

  // Restore persisted step after hydration — fires when persist middleware
  // writes the stored value into the store. On first render `storedStep` is 1
  // (DEFAULT_DRAFT) because persist hydration runs after render, so we must NOT
  // lock the ref until we actually have a real value from localStorage.
  const restoredRef = React.useRef(false);
  React.useEffect(() => {
    if (restoredRef.current) return;
    if (storedStep && storedStep >= 1 && storedStep <= 6) {
      if (storedStep !== currentStep) {
        setCurrentStep(storedStep as StepId);
      }
      // Only lock the guard once we've seen a non-default value from persist,
      // otherwise the user's stored step (e.g. 3) would arrive after the lock.
      if (storedStep > 1) {
        restoredRef.current = true;
      }
    }
  }, [storedStep, currentStep]);

  // Sync currentStep to draft whenever it changes, but skip the first render
  // so the mount write cannot overwrite the value the restore effect will set.
  const initialSyncSkippedRef = React.useRef(false);
  React.useEffect(() => {
    if (!initialSyncSkippedRef.current) {
      initialSyncSkippedRef.current = true;
      return;
    }
    setDraft({ currentStep });
  }, [currentStep, setDraft]);

  // -------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------

  async function handleNext() {
    const fields = STEP_FIELDS[currentStep];
    const valid = fields.length === 0 ? true : await trigger(fields);
    if (valid && currentStep < 6) {
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

  // -------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------

  const onSubmit = handleSubmit(async (data: BookingFullValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await submitBooking(data);

    if (!result.success) {
      setSubmitError(result.error);
      setIsSubmitting(false);
      return;
    }

    // Persist last booking for the confirmation page
    try {
      sessionStorage.setItem(
        'steffny-last-booking',
        JSON.stringify({
          reference: result.reference,
          type: data.type,
          garmentType: data.garmentType,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          guestName: data.guestName,
          guestEmail: data.guestEmail,
        }),
      );
    } catch {
      // sessionStorage unavailable — non-fatal
    }

    // Clear draft and draft id
    clearDraft();
    try { localStorage.removeItem('steffny-booking-draft-id'); } catch { /* ok */ }

    router.push(`/book/confirmation?ref=${result.reference}`);
  });

  // -------------------------------------------------------------------
  // Animation
  // -------------------------------------------------------------------

  const slideVariants = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  const transition = { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };

  // Current watched values for review step
  const currentValues = getValues();
  const bookingType = watch('type');

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
      {/* Main form column */}
      <div>
        {/* Demo mode notice */}
        {isDemoMode && (
          <div
            role="note"
            aria-label="Demo mode notice"
            className="mb-6 rounded-xl bg-gold-soft border border-gold/20 px-4 py-3 text-small text-ink"
          >
            <strong>Demo mode</strong> — your booking request will not be saved to a live
            database. Steffi will confirm your appointment over WhatsApp once this site goes live.
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <ProgressIndicator currentStep={currentStep} />

          <AnimatePresence mode="wait">
            {prefersReducedMotion ? (
              <div key={currentStep}>
                {currentStep === 1 && (
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <ServiceTypeStep
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.type?.message}
                      />
                    )}
                  />
                )}
                {currentStep === 2 && (
                  <Controller
                    name="photoPaths"
                    control={control}
                    render={({ field }) => (
                      <PhotosStep
                        onChange={(paths) => field.onChange(paths)}
                        draftId={draftId.current}
                      />
                    )}
                  />
                )}
                {currentStep === 3 && (
                  <DetailsStep
                    register={register}
                    errors={errors}
                    bookingType={bookingType}
                  />
                )}
                {currentStep === 4 && (
                  <ScheduleStep register={register} errors={errors} />
                )}
                {currentStep === 5 && (
                  <ContactStep register={register} errors={errors} />
                )}
                {currentStep === 6 && <ReviewStep values={currentValues} />}
              </div>
            ) : (
              <motion.div
                key={currentStep}
                initial={slideVariants.initial}
                animate={slideVariants.animate}
                exit={slideVariants.exit}
                transition={transition}
              >
                {currentStep === 1 && (
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <ServiceTypeStep
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.type?.message}
                      />
                    )}
                  />
                )}
                {currentStep === 2 && (
                  <Controller
                    name="photoPaths"
                    control={control}
                    render={({ field }) => (
                      <PhotosStep
                        onChange={(paths) => field.onChange(paths)}
                        draftId={draftId.current}
                      />
                    )}
                  />
                )}
                {currentStep === 3 && (
                  <DetailsStep
                    register={register}
                    errors={errors}
                    bookingType={bookingType}
                  />
                )}
                {currentStep === 4 && (
                  <ScheduleStep register={register} errors={errors} />
                )}
                {currentStep === 5 && (
                  <ContactStep register={register} errors={errors} />
                )}
                {currentStep === 6 && <ReviewStep values={currentValues} />}
              </motion.div>
            )}
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

            {currentStep < 6 && (
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

            {currentStep === 6 && (
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
                    Sending…
                  </>
                ) : (
                  'Send booking request'
                )}
              </button>
            )}
          </div>
        </form>

        {/* Alternative: contact via WhatsApp */}
        <p className="mt-6 text-center text-small text-ink-subtle">
          Prefer to book by phone?{' '}
          <a
            href={STUDIO.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-11 text-ink-muted underline underline-offset-2 hover:text-ink transition-colors"
          >
            Message on WhatsApp
          </a>
          {' '}or call{' '}
          <a
            href={STUDIO.phoneTel}
            className="inline-flex items-center min-h-11 text-ink-muted underline underline-offset-2 hover:text-ink transition-colors"
          >
            {STUDIO.phone}
          </a>
          .
        </p>
      </div>

      {/* Sidebar */}
      <WhatHappensNext />
    </div>
  );
}
