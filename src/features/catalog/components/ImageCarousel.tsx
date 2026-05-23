/**
 * ImageCarousel — Phase 4
 *
 * Client component. Full multi-image carousel for the product detail page.
 *
 * Features:
 * - Main image with keyboard navigation (←/→)
 * - Touch swipe via Framer Motion drag
 * - Thumbnail strip
 * - Pagination dots
 * - Hover zoom on desktop (CSS scale transform)
 * - Tap to fullscreen on mobile (dialog overlay)
 * - Aspect-ratio container prevents layout shift
 */

'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { ProductImage } from '@/lib/supabase/types';

interface ImageCarouselProps {
  images: ProductImage[];
  productName: string;
}

function buildImageSrc(img: ProductImage): string {
  const path = img.storage_path ?? '';
  if (path.startsWith('/')) return path;
  // Supabase storage path — shouldn't happen in demo mode but handled
  return `/assets/${path}`;
}

export function ImageCarousel({ images, productName }: ImageCarouselProps) {
  const [current, setCurrent] = React.useState(0);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [dragStart, setDragStart] = React.useState<number | null>(null);

  const safeImages = images.length > 0 ? images : [];
  const total = safeImages.length;

  const goTo = React.useCallback(
    (index: number) => {
      setCurrent(((index % total) + total) % total);
    },
    [total],
  );

  const goNext = React.useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = React.useCallback(() => goTo(current - 1), [current, goTo]);

  // Keyboard navigation is handled inline on the container div (onKeyDown)
  // and on the fullscreen overlay (onKeyDown). No window-level listener needed.

  if (total === 0) {
    return (
      <div className="aspect-3/4 w-full rounded-xl bg-surface-alt flex items-center justify-center">
        <span className="text-label text-ink-subtle uppercase tracking-widest">
          Image coming soon
        </span>
      </div>
    );
  }

  const activeImage = safeImages[current];
  const activeSrc = buildImageSrc(activeImage);
  const activeBlur = activeImage.blur_data_url ?? undefined;

  return (
    <>
      {/* Main image area */}
      <div className="space-y-3">
        <div
          className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-surface-alt cursor-zoom-in"
          onPointerDown={(e) => setDragStart(e.clientX)}
          onPointerUp={(e) => {
            if (dragStart === null) return;
            const diff = e.clientX - dragStart;
            if (Math.abs(diff) > 40) {
              if (diff < 0) goNext();
              else goPrev();
            } else {
              // Tap on mobile → fullscreen
              setFullscreen(true);
            }
            setDragStart(null);
          }}
          onClick={() => setFullscreen(true)}
          role="button"
          tabIndex={0}
          aria-label={`View full size: ${activeImage.alt_text ?? productName}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setFullscreen(true);
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 group"
            >
              <Image
                src={activeSrc}
                alt={activeImage.alt_text ?? `${productName} — view ${current + 1}`}
                fill
                priority={current === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                blurDataURL={activeBlur}
                placeholder={activeBlur ? 'blur' : 'empty'}
              />
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next arrows — visible on hover on desktop */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous image"
                className={cn(
                  'absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center',
                  'rounded-full bg-surface/80 text-ink shadow backdrop-blur-sm',
                  'opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100 focus-visible:opacity-100',
                )}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next image"
                className={cn(
                  'absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center',
                  'rounded-full bg-surface/80 text-ink shadow backdrop-blur-sm',
                  'opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100 focus-visible:opacity-100',
                )}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Pagination dots */}
        {total > 1 && (
          <div
            className="flex items-center justify-center gap-1.5"
            role="tablist"
            aria-label="Image navigation"
          >
            {safeImages.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to image ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-200',
                  i === current
                    ? 'w-6 bg-rose'
                    : 'w-1.5 bg-border hover:bg-border-strong',
                )}
              />
            ))}
          </div>
        )}

        {/* Thumbnail strip */}
        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Image thumbnails">
            {safeImages.map((img, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                onClick={() => goTo(i)}
                aria-selected={i === current}
                aria-label={`View image ${i + 1}: ${img.alt_text ?? productName}`}
                className={cn(
                  'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200',
                  i === current
                    ? 'border-rose shadow-sm'
                    : 'border-border opacity-60 hover:opacity-100',
                )}
              >
                <Image
                  src={buildImageSrc(img)}
                  alt={img.alt_text ?? `${productName} thumbnail ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover object-center"
                  blurDataURL={img.blur_data_url ?? undefined}
                  placeholder={img.blur_data_url ? 'blur' : 'empty'}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
            onClick={() => setFullscreen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setFullscreen(false);
              if (e.key === 'ArrowRight') goNext();
              if (e.key === 'ArrowLeft') goPrev();
            }}
          >
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Close full-size image"
              className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-surface/20 text-ivory transition-colors hover:bg-surface/30"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeSrc}
                alt={activeImage.alt_text ?? productName}
                width={activeImage.width ?? 800}
                height={activeImage.height ?? 1200}
                className="max-h-[90vh] w-auto object-contain"
                blurDataURL={activeBlur}
                placeholder={activeBlur ? 'blur' : 'empty'}
              />
            </div>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-surface/20 text-ivory hover:bg-surface/30"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-surface/20 text-ivory hover:bg-surface/30"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
