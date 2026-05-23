/**
 * InstagramGallery — Phase 7
 *
 * Server component. A static 6-image grid linking to the studio Instagram page.
 * Images are curated from assets not visible elsewhere on the home page.
 *
 * Images used here (verified unique to this section on the home page):
 *   bride-fuchsia-pampas, bride-burgundy-outdoor, bride-white-umbrella-interior,
 *   bride-maroon-chandelier, bride-maroon-radio, bride-white-ballgown-train
 *
 * NOTE: bride-bouquet-detail.jpg is reserved for home hero, about hero, and
 * contact founder card per IMAGE_BRIEF.md. Do not use it here.
 *
 * The auto-pull Instagram API approach (requires Business account + token refresh)
 * is deferred. This static grid serves the demo and can be swapped to API-driven
 * posts once the Instagram Business account is configured.
 *
 * External links: target=_blank rel="noopener noreferrer" per security best practice.
 */

import Image from 'next/image';
import { STUDIO } from '@/constants/brand';

interface GalleryImage {
  src: string;
  alt: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: '/assets/hero/bride-fuchsia-pampas.jpg',
    alt: 'Bride in a fuchsia gown among pampas grass — Steffny Couture',
  },
  {
    src: '/assets/hero/bride-burgundy-outdoor.jpg',
    alt: 'Bride in a burgundy gown outdoors in natural light — Steffny Couture',
  },
  {
    src: '/assets/hero/bride-white-umbrella-interior.jpg',
    alt: 'Bride in a white gown indoors with an umbrella prop — Steffny Couture',
  },
  {
    src: '/assets/hero/bride-maroon-chandelier.jpg',
    alt: 'Bride in a maroon gown beneath a chandelier — Steffny Couture',
  },
  {
    src: '/assets/hero/bride-maroon-radio.jpg',
    alt: 'Bride in a maroon outfit beside a vintage radio — Steffny Couture',
  },
  {
    src: '/assets/hero/bride-white-ballgown-train.jpg',
    alt: 'Bride in a white ballgown with a long flowing train — Steffny Couture',
  },
];

export function InstagramGallery() {
  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-label text-rose tracking-widest uppercase">
            Instagram
          </span>
          <h2 className="font-display text-display-sm md:text-display text-ink mt-2 text-balance">
            From the studio
          </h2>
        </div>
        <a
          href={STUDIO.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-small text-rose shrink-0 font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded"
          aria-label="View our Instagram profile"
        >
          Follow us →
        </a>
      </div>

      {/* Image grid */}
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3"
        aria-label="Instagram gallery"
        role="list"
      >
        {GALLERY_IMAGES.map((img) => (
          <a
            key={img.src}
            href={STUDIO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
            aria-label={`View on Instagram: ${img.alt}`}
            className="group relative block aspect-square overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            />
            {/* Subtle hover overlay */}
            <div
              className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-300"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
