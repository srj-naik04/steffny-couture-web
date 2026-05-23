/**
 * FounderCard — Phase 3
 *
 * Server component. Small card with Steffi's photo, name, role, and bio.
 * Used on contact page and about page.
 * Uses bride-bouquet-detail.jpg per IMAGE_BRIEF.md founder-card rule.
 */

import Image from 'next/image';

// blurDataURL for bride-bouquet-detail — from data/optimised-images.json
const BOUQUET_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AJt6W5x+ZZ+Dc5iAbJ2AYYhqTWhMNQCehnG2n5JjUkk4JR2qlIKbfmiCYkwAn4Nxy6+hHwAAMxkQspSGrYt2kGpVAKCBZeG6onlSPqd9aNOnkJ93XpRvVwCynIHhwam9lX+vh3HdtZ2zkXiRcVgA38ywy7afyrOfxaubuZyOr5F5lHRUAPfiz72unsq9sc29sqyUiO/bzLeqmwDv5+LIwr718e///Pe2qp7S0M34//8A5eTp6erw8vX7+/v/1tDNt7a36e32ANDR0tfb3d7j7Obo8u7s8tTQ197d5xCciFay3+EUAAAAAElFTkSuQmCC';

interface FounderCardProps {
  name: string;
  role: string;
  bio: string;
}

export function FounderCard({ name, role, bio }: FounderCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-start">
      {/* Steffi photo — bride-bouquet-detail.jpg per IMAGE_BRIEF.md */}
      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl sm:h-36 sm:w-36">
        <Image
          src="/assets/hero/bride-bouquet-detail.jpg"
          alt="Steffi, founder of Steffny Couture, with a bridal bouquet at the Hounslow studio"
          fill
          className="object-cover object-top"
          sizes="144px"
          blurDataURL={BOUQUET_BLUR}
          placeholder="blur"
        />
      </div>

      <div className="space-y-2">
        <p className="font-display text-title text-ink">{name}</p>
        <p className="text-label text-rose tracking-widest uppercase">{role}</p>
        <div className="bg-gold mt-2 h-px w-8" aria-hidden="true" />
        <p className="text-body text-ink-muted mt-3 text-pretty">{bio}</p>
      </div>
    </div>
  );
}
