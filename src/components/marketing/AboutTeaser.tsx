/**
 * AboutTeaser — Phase 3
 *
 * Server component. A two-column section: text on the left, image on the right.
 * Uses bride-red-roses.jpg — home hero uses bride-bangles-portrait.jpg (Steffi),
 * so this teaser uses a non-Steffi image to avoid same-page duplication.
 * Data comes from src/content/marketing/home.ts aboutTeaser export.
 */

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import type { AboutTeaser as AboutTeaserData } from '@/content/marketing/home';

// blurDataURL for bride-red-roses — from data/optimised-images.json
const RED_ROSES_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAABQUlEQVR4nAE2Acn+AHFbXL+uxqOkxyQzPgwFAP+5q8Cbk1VSVVI6LS4oGQAjQSpudn6Wg6Q7MT44Ggn/yLWEZlMAAgA2LCAUFAcAICkTXHZqln6SxYOU/5iZ/8W9/5iVxkxbXi0oCgkAABkAADVBK25CTJEyPf9hW/9wWf9+fP+Lm+yUiyUPAACOnWqmm36jX15fGxjYQyn/d1P/dW7XcVr/786bhl0Ajqpompts/cu0h1RBlCUZ/4Fy/5GO/8Op8bSJhYRHAIOTUIWGT+SskuOAd/+Qk/96ff+LmP+AfuV0XJyEUABzjkilfFPqdm7oUlf/x87/fYf/lJ3/hoT/g3rFcVUAcGxBxGlh/6+0uz9A/2Nh/3dh/4qJ/5+g/3Js/31vAGVTMmwSEP6Ams9gX+1NR/9kQf99d/+0u/+Fcv+HikPPmVbXnGY1AAAAAElFTkSuQmCC';

interface AboutTeaserProps {
  data: AboutTeaserData;
}

export function AboutTeaser({ data }: AboutTeaserProps) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      {/* Text */}
      <div className="space-y-6 lg:order-2">
        <span className="text-label text-rose tracking-widest uppercase">
          {data.eyebrow}
        </span>
        <h2 className="font-display text-display-sm md:text-display text-ink text-balance">
          {data.headline}
        </h2>
        <div className="bg-gold h-px w-16" aria-hidden="true" />
        <p className="text-body-lg text-ink-muted text-pretty">{data.body}</p>
        <Button href={data.cta.href} variant="secondary">
          {data.cta.label}
        </Button>
      </div>

      {/* Bride with red roses — bride-red-roses.jpg (non-Steffi, avoids home-page duplication) */}
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl lg:order-1">
        <Image
          src="/assets/hero/bride-red-roses.jpg"
          alt="Bride surrounded by red roses — Steffny Couture studio, Hounslow"
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
          blurDataURL={RED_ROSES_BLUR}
          placeholder="blur"
        />
      </div>
    </div>
  );
}
