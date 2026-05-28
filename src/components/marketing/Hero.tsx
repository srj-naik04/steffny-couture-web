/**
 * Hero component — Phase 3 (updated: full-bleed split layout)
 *
 * Server component. Renders a full-bleed hero section with a Steffi photo
 * (or any supplied image) and CTA buttons.
 *
 * For image variants (home/about/service): on lg+ screens the IMAGE column
 * bleeds to the right edge of the viewport while the TEXT column's left edge
 * aligns with the site's centered container (max-w-7xl + lg:px-12), matching
 * the header/nav alignment. On mobile (<lg) layout stacks text then image,
 * both within normal container padding — no full-bleed on mobile.
 *
 * For the contact variant (no image): remains a normal centered container
 * layout, unchanged.
 *
 * variant:
 *   'home'    — tall, with image, full-bleed split on lg+
 *   'about'   — slightly shorter, with image, full-bleed split on lg+
 *   'service' — compact, with image, full-bleed split on lg+
 *   'contact' — minimal, no image, centered layout
 *
 * objectPosition in HeroImage: a Tailwind object-position class string
 * (e.g. 'object-top', 'object-center', 'object-[center_20%]').
 * Defaults to 'object-center'. Use 'object-top' for portrait images where
 * the subject's head would otherwise crop at the top.
 */

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';

export interface HeroImage {
  src: string;
  alt: string;
  blurDataURL?: string;
  width?: number;
  height?: number;
  /**
   * Tailwind object-position class, e.g. 'object-top', 'object-center',
   * 'object-[center_20%]'. Default: 'object-center'.
   */
  objectPosition?: string;
}

export interface HeroCta {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface HeroProps {
  kicker?: string;
  headline: string;
  subhead?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  image?: HeroImage;
  variant?: 'home' | 'about' | 'service' | 'contact';
  className?: string;
}

export function Hero({
  kicker,
  headline,
  subhead,
  primaryCta,
  secondaryCta,
  image,
  variant = 'home',
  className,
}: HeroProps) {
  const isHome = variant === 'home';
  const hasImage = Boolean(image);

  // Contact variant (no image) — keep the original centered Container layout
  if (!hasImage || variant === 'contact') {
    return (
      <section
        className={cn(
          'relative bg-ivory overflow-hidden',
          'pt-10 pb-4 md:pt-14 md:pb-6 lg:pt-16 lg:pb-8',
          className,
        )}
      >
        <Container className="relative z-10">
          <div className="max-w-2xl space-y-6">
            {kicker && (
              <span className="text-label text-rose tracking-widest uppercase">
                {kicker}
              </span>
            )}
            <h1 className="font-display text-display-sm md:text-display text-ink text-balance">
              {headline}
            </h1>
            <div className="bg-gold h-px w-16" aria-hidden="true" />
            {subhead && (
              <p className="text-body-lg text-ink-muted max-w-xl text-pretty">
                {subhead}
              </p>
            )}
            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap gap-4 pt-2">
                {primaryCta && (
                  <Button href={primaryCta.href} variant={primaryCta.variant ?? 'primary'} size="lg">
                    {primaryCta.label}
                  </Button>
                )}
                {secondaryCta && (
                  <Button href={secondaryCta.href} variant={secondaryCta.variant ?? 'secondary'} size="lg">
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Container>

        {/* Subtle grain texture overlay — decorative */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />
      </section>
    );
  }

  // Image variants (home / about / service) — full-bleed split on lg+
  // The section itself has no padding; the text column handles its own padding.
  const objectPositionClass = image?.objectPosition ?? 'object-center';

  return (
    <section
      className={cn(
        'relative bg-ivory overflow-hidden',
        isHome ? 'lg:max-h-176' : 'lg:max-h-152',
        className,
      )}
    >
      {/*
       * Full-viewport-width grid on lg+: two equal columns.
       * TEXT column: padding is managed so the text left edge aligns with the
       * max-w-7xl container used by the header/nav.
       *   - px-5 sm:px-6 on mobile (matches Container default)
       *   - lg:pl-12 xl:pl-[max(3rem,calc((100vw-80rem)/2+3rem))]
       *     80rem = max-w-7xl = 1280px; 3rem = lg:px-12
       *     At exactly 1280px: calc((1280 - 1280)/2 + 48) = 48px = 3rem ✓
       *     At 1920px: calc((1920 - 1280)/2 + 48) = 320 + 48 = 368px
       *     This makes the text left edge match the logo/nav left edge at any width.
       *
       * IMAGE column: on lg+ fills the right half edge-to-edge (no right padding,
       * no max-width constraint). On mobile it stacks below the text at a sensible
       * aspect ratio within normal container padding.
       *
       * Horizontal overflow is prevented by overflow-hidden on the section.
       * The calc() only applies at xl+ so there is no overflow risk at lg.
       *)
      */}
      <div className="relative z-10 lg:grid lg:grid-cols-2 lg:items-stretch lg:min-h-128">
        {/* TEXT column */}
        <div className="flex items-center">
          <div
            className={cn(
              'w-full px-5 sm:px-6 py-10 md:py-14',
              isHome ? 'lg:py-20' : 'lg:py-16',
              // Align text left edge with the site container on wide screens
              'lg:pl-12 xl:pl-[max(3rem,calc((100vw-80rem)/2+3rem))]',
              'lg:pr-10',
            )}
          >
            <div className="mx-auto w-full max-w-xl lg:mx-0 lg:max-w-136 space-y-6">
              {kicker && (
                <span className="text-label text-rose tracking-widest uppercase">
                  {kicker}
                </span>
              )}
              <h1
                className={cn(
                  'font-display text-ink text-balance',
                  isHome
                    ? 'text-hero-sm md:text-hero'
                    : 'text-display-sm md:text-display',
                )}
              >
                {headline}
              </h1>
              {/* Decorative gold rule */}
              <div className="bg-gold h-px w-16" aria-hidden="true" />
              {subhead && (
                <p className="text-body-lg text-ink-muted max-w-xl text-pretty">
                  {subhead}
                </p>
              )}
              {(primaryCta || secondaryCta) && (
                <div className="flex flex-wrap gap-4 pt-2">
                  {primaryCta && (
                    <Button href={primaryCta.href} variant={primaryCta.variant ?? 'primary'} size="lg">
                      {primaryCta.label}
                    </Button>
                  )}
                  {secondaryCta && (
                    <Button href={secondaryCta.href} variant={secondaryCta.variant ?? 'secondary'} size="lg">
                      {secondaryCta.label}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* IMAGE column — bleeds to the right edge on lg+ */}
        <div
          className={cn(
            'relative w-full overflow-hidden',
            // Mobile: stacked image with aspect ratio + container padding
            'aspect-4/5 sm:aspect-3/2',
            // lg+: fills the full right column height; aspect-auto lets fill do its job
            'lg:aspect-auto',
          )}
        >
          <Image
            src={image!.src}
            alt={image!.alt}
            fill
            priority
            fetchPriority="high"
            className={cn('object-cover hero-ken-burns', objectPositionClass)}
            sizes="(max-width: 1024px) 100vw, 50vw"
            blurDataURL={image!.blurDataURL}
            placeholder={image!.blurDataURL ? 'blur' : 'empty'}
          />
        </div>
      </div>

      {/* Subtle grain texture overlay — decorative */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />
    </section>
  );
}
