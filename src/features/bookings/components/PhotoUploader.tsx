'use client';

/**
 * PhotoUploader — Phase 6
 *
 * Lets customers attach up to 5 garment photos to their booking request.
 *
 * Upload strategy:
 *   - Live mode (Supabase configured): uploads to `booking-photos` bucket
 *     (migration 20260523_0007_booking_photos_bucket.sql) under
 *     `web-drafts/<draftId>/<uuid>.<ext>` via the browser Supabase client.
 *   - Demo mode (no Supabase credentials): shows previews locally; returns
 *     `demo://<uuid>.<ext>` paths so the wizard can proceed without errors.
 *
 * Parent receives the array of storage paths via `onChange(paths)`.
 *
 * Accepted types: JPEG, PNG, WebP, HEIC/HEIF (common iPhone default format).
 * Max file size: 8 MB per file (matches the bucket limit).
 * Max photos: 5.
 */

import * as React from 'react';
import Image from 'next/image';
import { X, Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { hasSupabase } from '@/lib/env';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB
const MAX_PHOTOS = 5;
const BUCKET = 'booking-photos';

interface Photo {
  /** Supabase Storage path (or demo://... in demo mode) */
  path: string;
  /** Local object URL for preview — revoked on remove */
  previewUrl: string;
  /** Original file name for display */
  name: string;
}

interface PhotoUploaderProps {
  onChange: (paths: string[]) => void;
  draftId: string;
}

export function PhotoUploader({ onChange, draftId }: PhotoUploaderProps) {
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [statusMessage, setStatusMessage] = React.useState('');
  const statusTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  function announceStatus(message: string) {
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    setStatusMessage(message);
    statusTimerRef.current = setTimeout(() => setStatusMessage(''), 3000);
  }

  // Revoke all object URLs on unmount to avoid memory leaks
  React.useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFiles(files: FileList) {
    setError(null);
    const remainingSlots = MAX_PHOTOS - photos.length;
    if (remainingSlots <= 0) {
      setError(`You have reached the limit of ${MAX_PHOTOS} photos.`);
      return;
    }

    const toUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);
    const newPhotos: Photo[] = [];

    for (const file of toUpload) {
      if (!ACCEPTED_TYPES.includes(file.type.toLowerCase())) {
        setError(`${file.name} is not a supported format. Please use JPEG, PNG, WebP, or HEIC.`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(`${file.name} is over 8 MB. Please compress or resize before uploading.`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      const ext = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() ?? 'jpg' : 'jpg';
      const uuid = crypto.randomUUID();

      if (!hasSupabase) {
        // Demo mode: use a placeholder path
        newPhotos.push({ path: `demo://${uuid}.${ext}`, previewUrl, name: file.name });
        continue;
      }

      // Live mode: upload to Supabase Storage
      try {
        const { createBrowserSupabaseClient } = await import('@/lib/supabase/client');
        const supabase = createBrowserSupabaseClient();
        const storagePath = `web-drafts/${draftId}/${uuid}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, file, { contentType: file.type, upsert: false });

        if (uploadError) {
          console.warn('[PhotoUploader] Upload failed:', uploadError.message);
          setError("One of the photos could not be uploaded. Please try again.");
          URL.revokeObjectURL(previewUrl);
          continue;
        }

        newPhotos.push({ path: storagePath, previewUrl, name: file.name });
      } catch {
        setError("Could not connect to upload storage. Please try again.");
        URL.revokeObjectURL(previewUrl);
      }
    }

    setUploading(false);

    if (newPhotos.length > 0) {
      const updated = [...photos, ...newPhotos];
      setPhotos(updated);
      onChange(updated.map((p) => p.path));
      const lastName = newPhotos[newPhotos.length - 1].name;
      announceStatus(`${lastName} added. ${updated.length} of ${MAX_PHOTOS} photos selected.`);
    }
  }

  async function removePhoto(index: number) {
    const photo = photos[index];
    URL.revokeObjectURL(photo.previewUrl);

    // Attempt to delete from Storage (best-effort; stale files cleaned by cron)
    if (hasSupabase && !photo.path.startsWith('demo://')) {
      try {
        const { createBrowserSupabaseClient } = await import('@/lib/supabase/client');
        const supabase = createBrowserSupabaseClient();
        await supabase.storage.from(BUCKET).remove([photo.path]);
      } catch {
        // Non-fatal — cron will clean up stale drafts
      }
    }

    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    onChange(updated.map((p) => p.path));
    announceStatus(`${photo.name} removed.`);
  }

  const isDisabled = uploading || photos.length >= MAX_PHOTOS;

  return (
    <div className="space-y-4">
      {/* Drop zone / file input trigger */}
      <label
        htmlFor="photo-upload"
        className={cn(
          'flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center',
          'transition-colors duration-200',
          isDisabled
            ? 'cursor-not-allowed border-border bg-surface-alt opacity-50'
            : 'cursor-pointer border-border-strong bg-surface-alt hover:border-rose hover:bg-rose-soft/20',
        )}
      >
        <Upload
          className={cn('size-8', isDisabled ? 'text-ink-muted' : 'text-ink-muted')}
          aria-hidden="true"
        />
        <span className="text-body font-medium text-ink">
          {photos.length >= MAX_PHOTOS
            ? 'Maximum photos added'
            : 'Tap to add photos, or drop them here'}
        </span>
        <span className="text-small text-ink-muted">
          Up to {MAX_PHOTOS} photos · JPEG, PNG, WebP, HEIC · max 8 MB each
        </span>
        <input
          id="photo-upload"
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          disabled={isDisabled}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) {
              void handleFiles(e.target.files);
              // Reset input value so the same file can be re-selected after removal
              e.target.value = '';
            }
          }}
        />
      </label>

      {/* Persistent aria-live region — always rendered so screen readers pick it up */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">{statusMessage}</p>

      {/* Uploading indicator (visual only) */}
      {uploading && (
        <div className="flex items-center gap-2 text-small text-ink-muted" aria-hidden="true">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          <span>Uploading photo…</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p role="alert" className="text-small text-danger">
          {error}
        </p>
      )}

      {/* Photo thumbnails */}
      {photos.length > 0 && (
        <ul
          className="grid grid-cols-3 gap-3 sm:grid-cols-5"
          aria-label={`${photos.length} photo${photos.length === 1 ? '' : 's'} added`}
        >
          {photos.map((photo, i) => (
            <li
              key={photo.path}
              className="relative aspect-square overflow-hidden rounded-xl bg-surface-alt"
            >
              <Image
                src={photo.previewUrl}
                alt={`Uploaded photo ${i + 1}: ${photo.name}`}
                fill
                sizes="(max-width: 640px) 33vw, 20vw"
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => void removePhoto(i)}
                aria-label={`Remove photo: ${photo.name.length > 40 ? photo.name.slice(0, 40) + '…' : photo.name}`}
                className={cn(
                  'absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full',
                  'bg-ink/70 text-ivory transition-colors hover:bg-ink',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose',
                )}
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
