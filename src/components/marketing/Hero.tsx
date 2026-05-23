/**
 * Hero component — Phase 3
 *
 * Server component. Renders a full-bleed hero section with a Steffi photo
 * (or any supplied image) and CTA buttons.
 *
 * variant:
 *   'home'    — tall, full viewport height at lg, two-column image layout
 *   'about'   — slightly shorter, image fills right column
 *   'service' — compact, image optional or smaller
 *   'contact' — minimal, no image
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
  const isAbout = variant === 'about';
  const hasImage = Boolean(image);

  return (
    <section
      className={cn(
        'relative bg-ivory overflow-hidden',
        isHome && 'min-h-[85vh] lg:min-h-[90vh]',
        (isAbout || variant === 'service') && 'min-h-[55vh] lg:min-h-[65vh]',
        variant === 'contact' && 'py-20 md:py-28',
        className,
      )}
    >
      <Container
        className={cn(
          'relative z-10 flex h-full flex-col justify-center',
          isHome && 'py-20 md:py-28 lg:py-0 lg:min-h-[90vh]',
          (isAbout || variant === 'service') &&
            'py-16 md:py-20 lg:py-0 lg:min-h-[65vh]',
        )}
      >
        <div
          className={cn(
            'grid items-center gap-12',
            hasImage && 'lg:grid-cols-2',
            !hasImage && 'max-w-2xl',
          )}
        >
          {/* Text column */}
          <div className={cn('space-y-6', hasImage && 'lg:pr-8')}>
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

          {/* Image column */}
          {hasImage && image && (
            <div
              className={cn(
                'relative w-full overflow-hidden rounded-2xl',
                isHome
                  ? 'aspect-3/4 lg:aspect-4/5 lg:max-h-[75vh]'
                  : 'aspect-3/4 lg:aspect-4/5',
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                fetchPriority="high"
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                blurDataURL={image.blurDataURL}
                placeholder={image.blurDataURL ? 'blur' : 'empty'}
              />
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
