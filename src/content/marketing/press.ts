// src/content/marketing/press.ts
// Press section copy and features array — Phase 7
//
// PENDING STEFFI'S INPUT: The pressFeatures array is intentionally empty.
// Populate it when Steffi confirms any press coverage with:
//   - outlet: publication name
//   - headline: the article headline or relevant quote
//   - url: link to the article (if publicly accessible)
//   - publishedAt: publication date (ISO string)
//   - logoSrc: outlet logo path under /assets/press/ (to be added)
//
// The phase-builder will render the press section only when this array is non-empty.
// Until populated, the section will be conditionally hidden on all pages.

export type PressFeature = {
  id: string;
  outlet: string;
  headline: string;
  url?: string;
  publishedAt: string;
  logoSrc?: string;
};

export const pressCopy = {
  hero: {
    kicker: 'In the press',
    headline: 'As seen in',
  },
  empty: 'We are gathering recent press mentions. Check back soon.',
} as const;

// Press features pending Steffi's confirmation.
// Populate this array when she provides outlet name, publication date, link, and quote.
export const pressFeatures: PressFeature[] = [];
