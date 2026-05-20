---
name: react-hook-form-zod-web
description: Use this skill whenever building forms, validating user input, or handling form state on the Steffny Couture website. Fires for any file with React Hook Form imports, Zod schemas, server actions handling form data, or any form component (contact, book-a-fitting, dress inquiry, review submission). Enforces the form patterns, brand-voice error messages, and the Next.js server-action-first approach.
---

# React Hook Form + Zod — Web Project

The website has several forms — contact, book-a-fitting, dress inquiry, review submission. They all follow the same patterns.

## The Setup

Install:
```bash
npm install react-hook-form @hookform/resolvers zod
```

For server actions + RHF integration, also useful:
```bash
npm install react-hook-form @hookform/resolvers zod
# For server-action progressive enhancement:
# native browser form posts work; RHF is for client-side enhancement
```

## Form Pattern — Server Action + RHF (recommended)

Forms write to the database via server actions. RHF provides client-side validation + UX. The same Zod schema validates both client and server.

### 1. Define the schema (shared)

```ts
// src/features/contact/schemas.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Your name please').max(80),
  email: z.string().email("That email doesn't look right"),
  phone: z.string().regex(/^(\+?44|0)7\d{9}$/, "That phone number doesn't look right").optional().or(z.literal('')),
  message: z.string().min(10, 'A bit more detail helps Steffi reply').max(1000),
});

export type ContactInput = z.infer<typeof contactSchema>;
```

### 2. Server action

```ts
// src/features/contact/actions.ts
'use server';

import { contactSchema } from './schemas';
import { createClient } from '@/lib/supabase/server';

type State =
  | { ok: false; error: string }
  | { ok: true }
  | null;

export async function submitContactForm(_prev: State, formData: FormData): Promise<State> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: 'Check the form and try again' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('inquiries').insert({
    type: 'general',
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
  });

  if (error) {
    console.error('Inquiry insert failed', error);
    return { ok: false, error: "That didn't go through" };
  }

  return { ok: true };
}
```

### 3. Client form component

```tsx
// src/features/contact/ContactForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect, useTransition } from 'react';
import { contactSchema, type ContactInput } from './schemas';
import { submitContactForm } from './actions';
import { Input, Textarea, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

export function ContactForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(submitContactForm, null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmit = (data: ContactInput) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v ?? ''));
    startTransition(() => formAction(formData));
  };

  useEffect(() => {
    if (state?.ok) {
      reset();
      router.push('/contact?sent=1');
    }
  }, [state, reset, router]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Your name"
        {...register('name')}
        error={errors.name?.message}
        autoComplete="name"
      />
      <Input
        label="Email"
        type="email"
        inputMode="email"
        autoCapitalize="off"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Phone (optional)"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        {...register('phone')}
        error={errors.phone?.message}
      />
      <Textarea
        label="Message"
        rows={5}
        {...register('message')}
        error={errors.message?.message}
        maxLength={1000}
      />
      {state && !state.ok && (
        <div className="text-sm text-danger" role="alert">{state.error}</div>
      )}
      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}
```

## Why This Pattern

- **Same Zod schema** validates client (RHF) and server (server action) — single source of truth
- **Progressive enhancement** — if JS fails, the native `<form action={formAction}>` still works
- **Server-side validation** is non-negotiable; client-side is UX
- **`useActionState`** is the new Next 15 / React 19 hook for action state (replaces `useFormState`)
- **`useTransition`** keeps the UI responsive during submission

## Brand-Voice Error Messages

Same rules as mobile app's brand voice:

```ts
// ✅ Good
z.string().email("That email doesn't look right")
z.string().min(2, 'Your name please')
z.string().min(10, 'A bit more detail helps Steffi reply')

// ❌ Bad
z.string().email('Invalid email address!')
z.string().min(2, 'Name is required.')
z.string().min(10, 'ERROR: Message too short')
```

Error display:
- Inline below the field
- `text-sm text-danger`
- Border on the input becomes `border-danger` when error is present
- Error icon (small `AlertCircle`) prefix optional

```tsx
{errors.name && (
  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
    <AlertCircle className="size-4 flex-shrink-0" />
    <span>{errors.name.message}</span>
  </div>
)}
```

## Common Schemas (shared across features)

```ts
// src/features/_shared/schemas.ts
import { z } from 'zod';

export const ukPhone = z
  .string()
  .regex(/^(\+?44|0)7\d{9}$/, "That phone number doesn't look right");

export const ukPhoneOptional = z
  .string()
  .regex(/^(\+?44|0)7\d{9}$/, "That phone number doesn't look right")
  .optional()
  .or(z.literal(''));

export const emailField = z
  .string()
  .min(1, 'Email needed')
  .email("That email doesn't look right");

export const customerName = z.string().min(2, 'Your name please').max(80);

export const ukPostcode = z
  .string()
  .regex(/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i, "That postcode doesn't look right");

export const longMessage = z.string().min(10, 'A bit more detail helps').max(1000);
```

Reuse these. Don't redefine in every feature.

## File Upload Forms (book-a-fitting)

For the multi-step booking form with photo uploads, this is more complex. Use a slimmer pattern:

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  /* fields */
  photos: z.array(z.string()).min(1, 'Add at least one photo').max(5),
});

export function BookFittingForm() {
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { photos: [], /* ... */ },
  });

  async function onFilesSelected(files: FileList) {
    setUploading(true);
    const supabase = createClient();
    const newPaths: string[] = [];

    for (const file of Array.from(files).slice(0, 5)) {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `bookings/web-drafts/${crypto.randomUUID()}.${ext}`;
      const { data, error } = await supabase.storage
        .from('booking-photos')
        .upload(path, file, { contentType: file.type });
      if (!error && data) newPaths.push(data.path);
    }

    const updated = [...uploadedPaths, ...newPaths].slice(0, 5);
    setUploadedPaths(updated);
    setValue('photos', updated, { shouldValidate: true });
    setUploading(false);
  }

  // ... rest of form
}
```

The photos field is registered with RHF but populated via Supabase upload triggered by an `<input type="file">`. RHF sees the array of paths, not the files themselves.

## Multi-Step Forms (the book-a-fitting wizard)

On web, multi-step forms can be a single page with conditional sections (accordion-style) OR split routes. For this project, **single page is preferred** — desktop users hate route changes mid-form.

Use `useForm` once for the whole form. Use `formState.errors` to determine if the current step is valid before allowing "Continue":

```tsx
const allFields = { step1: ['service'], step2: ['photos'], step3: ['description'], /* etc */ };

async function canProceed(step: number) {
  const fields = allFields[`step${step}`];
  return await trigger(fields); // RHF validates only these
}
```

## Validation Modes

| Mode | Use case |
|---|---|
| `onSubmit` | **Default for most forms** — don't badger as they type |
| `onBlur` | Long forms with many fields — quick per-field feedback |
| `onChange` | Rare — only when validation impacts other field state (e.g., password strength UI) |
| `reValidateMode: 'onChange'` | **Always pair with `onSubmit`** — once an error shows, clear it as they fix |

## Anti-Patterns

- ❌ Native browser validation messages (`required`, `pattern`) — they don't match the brand voice. Use Zod.
- ❌ Toast errors for field validation — must be inline below the field
- ❌ Re-defining `ukPhone` / `email` in each form — use `_shared/schemas.ts`
- ❌ No `defaultValues` — causes uncontrolled-to-controlled warnings
- ❌ Manually managed `useState` for form fields — defeats RHF
- ❌ Skipping the server-side validation in the action — client validation is bypassable
- ❌ Submit button disabled by `!isValid` — let them try, show inline errors instead
- ❌ Multiple toast messages on submit (use one source of truth: inline OR a single banner)
- ❌ Not resetting form on success
- ❌ Forms without `autoComplete` attributes — mobile UX disaster

## Honeypot for Spam (recommended)

Add an invisible field that bots fill but humans don't:

```tsx
<input
  type="text"
  name="website"
  tabIndex={-1}
  autoComplete="off"
  style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
  aria-hidden="true"
/>
```

In the action:
```ts
if (formData.get('website')) {
  // Bot. Return success but don't actually insert.
  return { ok: true };
}
```

Free spam protection. Not a substitute for rate limiting, but a strong first filter.

## Rate Limiting

Supabase has built-in rate limits on its `anon` key for inserts. For extra protection, add an Upstash Redis rate-limiter check at the top of every action:

```ts
import { Ratelimit } from '@upstash/ratelimit';
// ... check IP, throttle to 5 submissions per minute per IP
```

Defer to Phase 7 unless spam becomes a problem.

## Quick Reference

```tsx
// Imports
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useTransition, useEffect } from 'react';
import { z } from 'zod';

// Standard form setup
const { register, handleSubmit, formState: { errors }, reset } = useForm({
  resolver: zodResolver(schema),
  defaultValues: { /* ... */ },
  mode: 'onSubmit',
  reValidateMode: 'onChange',
});

const [state, formAction] = useActionState(action, null);
const [isPending, startTransition] = useTransition();
```
