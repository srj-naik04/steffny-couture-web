---
name: booking-fitting
description: Use this skill whenever working on the "Book a fitting" form, the web flow that lets customers request an alteration or consultation. Fires for any file in `/src/app/book-a-fitting/`, `/src/features/booking/`, or anything touching the shared `bookings` table that the mobile app also reads from. Enforces the critical contract that web bookings MUST appear in Steffi's mobile app kanban, photo upload rules, and the brand-voice form copy.
---

# Book a Fitting — Web → Shared Supabase → Mobile App

This is the single most important integration in the website. A customer fills the form on the web; the booking appears in Steffi's mobile app within seconds. This is what makes the web site and mobile app feel like one system.

## The Contract (do not break)

The mobile app reads from a `bookings` table with a fixed schema. The web's job is to **insert correctly-shaped rows into that table** with `source = 'web'`. Anything else breaks Steffi's kanban.

### Required columns when inserting

```ts
type WebBookingInsert = {
  alteration_type_id: string;     // FK to alteration_types
  customer_name: string;
  customer_email: string;
  customer_phone: string;          // UK format, normalised
  preferred_date: string;          // YYYY-MM-DD
  preferred_time_window: 'morning' | 'afternoon' | 'evening';
  description: string;             // freeform notes from customer
  photo_paths: string[];           // Supabase Storage paths in booking-photos bucket
  source: 'web';                   // hard-coded, never anything else
  status: 'new';                   // hard-coded, mobile app moves it through the kanban
  // The mobile app sets these — DO NOT touch:
  // - booking_ref (auto-generated)
  // - id, created_at, updated_at
  // - assigned_to, internal_notes, completed_at
};
```

Before any insert, verify the schema by reading the mobile app's `001_initial.sql` migration in `E:\steffny-couture\supabase\migrations\`. If columns have changed there, this skill is out of date.

### Anonymous insert via RLS

The web inserts as `anon` (no user session). The mobile app's RLS policy on `bookings` must allow `anon` to insert rows where `source = 'web'`. If migration `007_guest_access.sql` from the mobile app handles this, great. If not, web's `011_web_rls.sql` adds it:

```sql
-- Allow web visitors to create bookings
CREATE POLICY "anon can insert web bookings"
ON public.bookings FOR INSERT
TO anon
WITH CHECK (source = 'web' AND status = 'new');

-- Allow customer to read their own booking by reference + email
CREATE POLICY "customer reads own booking"
ON public.bookings FOR SELECT
TO anon
USING (
  booking_ref = current_setting('request.jwt.claims', true)::json->>'ref'
  AND customer_email = current_setting('request.jwt.claims', true)::json->>'email'
);
```

But: anon-reading-their-own-booking is complex and the demo doesn't need it. **For v1, just allow anon insert.** Customer gets confirmation page with their booking ref, an email follows. They don't need to look up their booking on the site.

## The Form UX

The mobile app has a 5-step wizard. On web, condense to **a single scrollable page** with sectioned form. Desktop users hate route changes mid-form.

### Sections (top to bottom)

1. **What are you bringing in?** — alteration type radio cards
2. **Tell us about it** — description textarea + photo upload
3. **When works for you?** — date picker + time window
4. **Your details** — name, email, phone
5. **Anything else?** — optional notes
6. **Submit** — primary CTA "Send to Steffi"

Each section is wrapped in a `<fieldset>` with a `<legend>` (proper semantics for screen readers and SEO).

### Mobile vs desktop

- **Mobile:** sections stack, each takes full width, generous padding
- **Desktop (≥1024px):** two-column layout — left column is the form, right column is a sticky "What happens next" panel that updates as they fill the form

### What happens next panel (desktop sticky aside)

```tsx
function WhatHappensNext() {
  return (
    <aside className="sticky top-24 space-y-6">
      <div className="rounded-2xl bg-rose-soft p-6">
        <h3 className="font-display text-xl text-rose">What happens next</h3>
        <ol className="mt-4 space-y-3 text-sm text-ink">
          <li className="flex gap-3">
            <span className="font-display text-rose tabular-nums">1.</span>
            <span>Steffi sees your request in the studio app within minutes.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-rose tabular-nums">2.</span>
            <span>You'll get a confirmation email with your booking reference.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-rose tabular-nums">3.</span>
            <span>Steffi or someone from the team will reply on WhatsApp or email within a day to confirm timing.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-rose tabular-nums">4.</span>
            <span>Come in for your fitting at the Hounslow atelier.</span>
          </li>
        </ol>
      </div>

      <div className="rounded-2xl border border-border p-6">
        <h3 className="font-display text-base">Prefer to chat?</h3>
        <p className="mt-2 text-sm text-ink-muted">
          Open WhatsApp and Steffi will reply directly.
        </p>
        <Button variant="secondary" size="sm" asChild className="mt-3">
          <a href="https://wa.me/447834877992" target="_blank" rel="noopener">
            Open WhatsApp
          </a>
        </Button>
      </div>
    </aside>
  );
}
```

## Photo Upload

The most error-prone part. Customers attach 1-5 photos of the garment.

### Rules
- Min 0, max 5 photos
- Each photo max 8MB before upload (resize on client if larger)
- Accept JPEG, PNG, HEIC (iPhone default)
- Upload happens **before** form submit — files go to Storage, paths get stored in form state
- Show preview thumbnails as they upload
- Allow removal of individual photos
- Drag-and-drop on desktop, native file picker on mobile

### Pattern

```tsx
'use client';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

type Photo = { path: string; previewUrl: string };

export function PhotoUploader({
  onChange,
  draftId,
}: {
  onChange: (paths: string[]) => void;
  draftId: string;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    setError(null);
    const remainingSlots = 5 - photos.length;
    if (remainingSlots <= 0) {
      setError('Five photos is the limit');
      return;
    }

    const toUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    const supabase = createClient();
    const newPhotos: Photo[] = [];

    for (const file of toUpload) {
      if (file.size > 8 * 1024 * 1024) {
        setError(`${file.name} is over 8MB — try compressing first`);
        continue;
      }
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `web-drafts/${draftId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('booking-photos')
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        setError("One of the photos didn't upload — try again");
        continue;
      }

      newPhotos.push({ path, previewUrl: URL.createObjectURL(file) });
    }

    const updated = [...photos, ...newPhotos];
    setPhotos(updated);
    onChange(updated.map((p) => p.path));
    setUploading(false);
  }

  function removePhoto(index: number) {
    URL.revokeObjectURL(photos[index].previewUrl);
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    onChange(updated.map((p) => p.path));
    // Optionally delete from Storage too — but draft-cleanup cron can handle stale files
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor="photo-upload"
        className="block rounded-2xl border-2 border-dashed border-border-strong bg-surface-alt p-8 text-center cursor-pointer hover:bg-surfaceAlt/70 transition-colors"
      >
        <Upload className="mx-auto size-8 text-ink-muted" />
        <p className="mt-3 text-sm font-medium text-ink">
          Tap to add photos, or drop them here
        </p>
        <p className="mt-1 text-xs text-ink-subtle">
          Up to 5 photos · JPG, PNG, HEIC · max 8MB each
        </p>
        <input
          id="photo-upload"
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif"
          multiple
          disabled={uploading || photos.length >= 5}
          className="sr-only"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </label>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <Loader2 className="size-4 animate-spin" />
          Uploading…
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {photos.length > 0 && (
        <ul className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {photos.map((photo, i) => (
            <li key={photo.path} className="relative aspect-square rounded-xl overflow-hidden bg-surface-alt">
              <Image src={photo.previewUrl} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                aria-label={`Remove photo ${i + 1}`}
                className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-ink/70 text-ivory hover:bg-ink transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Server Action for the Booking

```ts
// src/features/booking/actions.ts
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { bookingSchema } from './schemas';

export async function submitBooking(_prev: unknown, formData: FormData) {
  const raw = {
    alteration_type_id: formData.get('alteration_type_id'),
    customer_name: formData.get('customer_name'),
    customer_email: formData.get('customer_email'),
    customer_phone: formData.get('customer_phone'),
    preferred_date: formData.get('preferred_date'),
    preferred_time_window: formData.get('preferred_time_window'),
    description: formData.get('description'),
    photo_paths: JSON.parse((formData.get('photo_paths') as string) || '[]'),
  };

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Check the form and try again' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...parsed.data,
      source: 'web',
      status: 'new',
    })
    .select('booking_ref')
    .single();

  if (error) {
    console.error('Booking insert failed', error);
    return { ok: false, error: "That didn't go through — please try WhatsApp instead" };
  }

  // Trigger the same email Edge Function the mobile app uses
  await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      template: 'booking-confirmation',
      to: parsed.data.customer_email,
      data: { name: parsed.data.customer_name, ref: data.booking_ref },
    }),
  }).catch((e) => console.error('Email send failed (non-fatal)', e));

  redirect(`/book-a-fitting/sent?ref=${data.booking_ref}`);
}
```

## Schema (Zod)

```ts
// src/features/booking/schemas.ts
import { z } from 'zod';
import { ukPhone, emailField, customerName } from '@/features/_shared/schemas';

export const bookingSchema = z.object({
  alteration_type_id: z.string().uuid('Choose what you're bringing in'),
  customer_name: customerName,
  customer_email: emailField,
  customer_phone: ukPhone,
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date'),
  preferred_time_window: z.enum(['morning', 'afternoon', 'evening']),
  description: z
    .string()
    .min(10, 'A bit more detail helps Steffi prepare')
    .max(2000, 'Keep it under 2000 characters'),
  photo_paths: z.array(z.string()).max(5),
});
```

## Confirmation Page

After successful submit, redirect to `/book-a-fitting/sent?ref=SC-A7K3F2`:

```tsx
// src/app/book-a-fitting/sent/page.tsx
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';

export const metadata = { title: 'Booking received' };

export default async function BookingSentPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <section className="container py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mx-auto size-20 rounded-full bg-rose-soft flex items-center justify-center">
          <Check className="size-10 text-rose" />
        </div>

        <h1 className="mt-8 font-display text-4xl md:text-5xl">Steffi has it</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Your booking reference is{' '}
          <span className="font-display tabular-nums text-ink">{ref ?? '—'}</span>
        </p>
        <p className="mt-6 text-base text-ink-muted max-w-md mx-auto">
          A confirmation email is on its way. Steffi will reply within a day to confirm timing
          and any details.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <a href="https://wa.me/447834877992" target="_blank" rel="noopener">
              Open WhatsApp
            </a>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/dresses">Browse the collection</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

## Verifying the End-to-End Flow

Before claiming this works, manually test:

1. Open the web booking form
2. Fill all fields with a real test email
3. Upload 2 photos (one PNG, one HEIC from iPhone)
4. Submit
5. Check Supabase Studio: row appears in `bookings` table with correct shape
6. Open the mobile app as Steffi (the tailor role)
7. Verify the new booking shows up in the "new" kanban column
8. Verify the photos load when she opens the booking detail
9. Check the test email arrived
10. Move the booking to "in progress" in the mobile app — confirm web doesn't break anything

If any step fails, the integration is broken. Do not ship.

## Anti-Patterns

- ❌ Inserting bookings with `source` set to anything other than `'web'`
- ❌ Setting `status` to anything other than `'new'` (mobile app controls the kanban)
- ❌ Touching `booking_ref`, `assigned_to`, `internal_notes` from web
- ❌ Uploading photos to a bucket other than `booking-photos`
- ❌ Photos in a path scheme that conflicts with mobile app's path scheme — use `web-drafts/{draftId}/` prefix
- ❌ Letting the form submit before photos finish uploading
- ❌ Stale photos left in Storage when user abandons the form (acceptable for now — add cleanup cron in Phase 7)
- ❌ Booking confirmation that pretends payment was taken (no payment is involved)
- ❌ Asking for fields the mobile app doesn't surface (waste of customer time)
- ❌ Multi-page wizard with route changes (single page only)
- ❌ Captcha that blocks mobile users — use honeypot instead

## Cross-Reference

- Schema: `E:\steffny-couture\supabase\migrations\001_initial.sql` (bookings table)
- RLS: `E:\steffny-couture\supabase\migrations\007_guest_access.sql`
- Mobile app's booking wizard: `E:\steffny-couture\app\(customer)\book\` (for UX reference)
- Email Edge Function: `E:\steffny-couture\supabase\functions\send-email\`
