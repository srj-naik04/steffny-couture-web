// src/content/marketing/reviews-extra.ts
// Additional reviews for /reviews page — Phase 7
// 6 new records to bring total (with Phase 3 seed) to 14.
// Mix: 2 wedding/bridal, 2 alterations, 1 occasion wear, 1 bridesmaid group.
// No duplicate names with reviews-seed.ts:
//   avoid: Priya M., Charlotte B., Amara O., Deepa R., Nadia K., Sarah J., Zara H., Roopa S.
// Dates spread from 2025-06 to 2026-04.
// No exclamation marks. British English. Warm, specific, varied sentence structure.

import { type HomeReview } from './reviews-seed';

export const extraReviews: HomeReview[] = [
  {
    id: 'review-009',
    name: 'Meera T.',
    role: 'Bride — bespoke bridal lehenga',
    rating: 5,
    body: "I had a very specific vision for my wedding lehenga — structured choli, full circular skirt, and embellishment drawn from my mother's own bridal pieces. Steffi worked with all of it without hesitation. The fabric sourcing suggestions she made were better than anything I had found independently, and the construction across three fittings was precise and patient. I have never felt more like myself in a garment. Everything was finished exactly as discussed, ahead of schedule.",
    event_date: '2026-04-12',
    published_at: '2026-04-19',
  },
  {
    id: 'review-010',
    name: 'Isabelle W.',
    role: 'Bride — wedding gown alterations',
    rating: 5,
    body: "The dress I bought was a sample sale find in excellent condition but entirely the wrong size for me. I came to Steffny Couture with a twelve-week window and a fairly long list of changes. Steffi quoted everything itemised, kept to the quote, and communicated clearly throughout. The final result was a dress that looked as though it had been made for me — which is a better outcome than I had originally hoped for. I would recommend her without any reservation.",
    event_date: '2025-10-25',
    published_at: '2025-11-01',
  },
  {
    id: 'review-011',
    name: 'Ananya P.',
    role: 'Customer — saree blouse and lehenga set',
    rating: 5,
    body: "I brought in two pieces for my sister's reception — a silk saree blouse that had never fitted properly and a lehenga that had been sitting unworn for three years because the waistband was uncomfortable. Both came back transformed. The blouse now sits correctly at the back without straining; the lehenga waistband was reworked so completely that I forgot the original version had been a problem. Steffi was thorough and clearly cared about the outcome.",
    event_date: '2025-06-14',
    published_at: '2025-06-21',
  },
  {
    id: 'review-012',
    name: 'Helen F.',
    role: 'Customer — evening gown alteration',
    rating: 5,
    body: "I had a formal gown I wanted to wear to a charity dinner that needed substantial work — the hem was too long, the bust was too large, and there was an unfortunate gap at the back closure. I had assumed it would be beyond saving but brought it in on the recommendation of a friend. Steffi assessed it calmly and explained exactly what was structurally possible. Two fittings later, the dress was unrecognisable in the best way. I wore it and felt genuinely good in it for the first time.",
    event_date: '2025-08-09',
    published_at: '2025-08-16',
  },
  {
    id: 'review-013',
    name: 'Sunita B.',
    role: 'Customer — mother of the bride occasion wear',
    rating: 5,
    body: "My daughter's wedding was in February and I had left my outfit later than I should have. Steffi fitted me into the schedule at short notice, adjusted a palazzo suit that had been sitting in my wardrobe for four years, and restyled the dupatta entirely. The adjustments were minor in scope but made a significant difference to how the outfit read. I felt properly dressed for the occasion rather than merely presentable — which is more than I had expected to achieve at that stage.",
    event_date: '2026-02-22',
    published_at: '2026-03-01',
  },
  {
    id: 'review-014',
    name: 'Caitlin M.',
    role: 'Bridesmaid — group of four',
    rating: 5,
    body: "We were four bridesmaids in different sizes needing coordinating dresses for an outdoor summer wedding. Steffi managed the whole process with very little fuss — she saw each of us at different times, kept notes that were evidently detailed because the fit was consistent across the group, and had everything ready two weeks before the wedding. On the day, all four of us were comfortable from ceremony to late evening. Given how often bridesmaid dresses go badly, that felt like a minor miracle.",
    event_date: '2025-07-05',
    published_at: '2025-07-12',
  },
];
