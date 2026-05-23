// src/content/marketing/reviews-intro.ts
// Copy for the /reviews page — Phase 7
// Voice: warm, honest, not salesy. Sentence case. No exclamation marks.
// The "leave a review" form intro should invite without pressuring.
// The moderation note must be clear: reviews are not published immediately.

export const reviewsIntroCopy = {
  hero: {
    kicker: 'Reviews',
    headline: 'From customers, in their words',
    subhead:
      'Brides, bridesmaids, and alteration customers from Hounslow and across West London, sharing their experience of the studio.',
  },
  formIntro:
    "If you have visited the studio and would like to leave a review, we would be glad to hear from you. Steffi reads every submission personally before it is published.",
  formSubmitSuccess:
    'Thank you. Steffi will read your review and publish it within a few days — we appreciate you taking the time.',
  empty:
    'Reviews are being gathered — come back soon to read what customers have said about the studio.',
} as const;
