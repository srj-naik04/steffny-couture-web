// src/content/marketing/reviews-seed.ts
// Home-page testimonial strip — Phase 3 seed data
// 8 reviews: varied services (custom bridal, alterations, bridesmaid, last-minute),
// varied tones, plausible South Asian + British first names, all within last 12 months.
// No exclamation marks. British English throughout.
// Phase 7 will replace these with live Supabase reads; for now they render on the home page.

export type HomeReview = {
  id: string;
  name: string;
  role: string;
  rating: 5;
  body: string;
  event_date?: string;
  published_at: string;
};

export const homeReviews: HomeReview[] = [
  {
    id: 'review-001',
    name: 'Priya M.',
    role: 'Bride — custom lehenga',
    rating: 5,
    body: "Steffi made my bridal lehenga entirely from scratch for my Hindu ceremony in March. I came to her with a fabric swatch I had brought back from India and a rough idea of what I wanted. She listened carefully, made a toile first so I could see the shape before anything was cut, and refined it across three fittings until it was exactly right. The embroidery placement on the border was her suggestion, not mine — and she was correct. I would not go anywhere else.",
    event_date: '2026-03-15',
    published_at: '2026-03-22',
  },
  {
    id: 'review-002',
    name: 'Charlotte B.',
    role: 'Bride — wedding dress alterations',
    rating: 5,
    body: "I bought a secondhand wedding dress that was two sizes too large and needed significant work. Steffi took in the bodice, shortened the hem, restructured the back closure, and added a small bustle. She was very clear about what was possible and what was not, gave me a written quote before touching anything, and kept to it exactly. The dress fitted better than any dress I have ever owned. Several guests assumed it had been made for me.",
    event_date: '2025-09-07',
    published_at: '2025-09-14',
  },
  {
    id: 'review-003',
    name: 'Amara O.',
    role: 'Bridesmaid — group fitting',
    rating: 5,
    body: "Our bridal party had six bridesmaids in different sizes and one of us was seven months pregnant by the wedding day. Steffi handled every fitting with complete calm, scheduled us in sensibly, and made adjustments as we went — including a last-minute panel addition for me at thirty-two weeks. The dresses were consistent in colour and finish across the group. Not a single person had to hold in their breath or tug at something all day.",
    event_date: '2025-11-23',
    published_at: '2025-11-30',
  },
  {
    id: 'review-004',
    name: 'Deepa R.',
    role: 'Customer — saree blouse alteration',
    rating: 5,
    body: "I brought in a heavily embroidered saree blouse that had been my mother's. It needed letting out at the back and taking in at the shoulders without disturbing the mirror-work at the collar. Steffi examined it for quite a while before she agreed to take it on — not because she doubted her ability, but because she wanted to be certain it could be done without risk to the embroidery. It came back perfect. The workmanship on something so delicate was handled with the kind of care I hoped for but did not fully expect.",
    event_date: '2025-07-19',
    published_at: '2025-07-26',
  },
  {
    id: 'review-005',
    name: 'Nadia K.',
    role: 'Bride — fusion bridal commission',
    rating: 5,
    body: "I wanted something that was neither a traditional lehenga nor a Western gown, but something in between — a fitted structured bodice with South Asian embroidery and a full skirt that moved like a gown. Steffi understood the brief immediately. She sketched two options at the first appointment and we worked from one of them. The result was genuinely unlike anything I had seen worn before. My ceremony was at a venue in Kew and the dress worked beautifully in both the registry photographs and the outdoor reception shots.",
    event_date: '2026-01-11',
    published_at: '2026-01-18',
  },
  {
    id: 'review-006',
    name: 'Sarah J.',
    role: 'Mother of the bride — occasion wear alteration',
    rating: 5,
    body: "I had a formal suit I had worn to another wedding five years ago that no longer fitted as well as it once did. I came to Steffny Couture on a recommendation and Steffi assessed what needed doing in about ten minutes. The jacket was taken in slightly at the back and the trousers were re-hemmed to work with my new shoes. It took two appointments, was ready ahead of schedule, and the tailoring is frankly better than the original. I have since recommended the studio to three people.",
    event_date: '2025-08-30',
    published_at: '2025-09-06',
  },
  {
    id: 'review-007',
    name: 'Zara H.',
    role: 'Bride — last-minute alteration',
    rating: 5,
    body: "I came to Steffi with eight weeks to go, which was my own fault for leaving it late. I was honest about the timeline and she was equally honest about what could be done in that time. She took the commission and delivered the dress four days before the wedding. The hem, the bodice adjustment, and a repair to the lace overlay were all completed to a standard I had not expected given the time pressure. I was not made to feel like a burden — she was professional throughout.",
    event_date: '2025-10-04',
    published_at: '2025-10-11',
  },
  {
    id: 'review-008',
    name: 'Roopa S.',
    role: 'Customer — bridesmaid lehenga set',
    rating: 5,
    body: "We had five bridesmaids needing coordinated lehenga sets for a Sikh wedding in Slough. Steffi made all five from coordinated fabric sourced through her recommendation. The fitting appointments were organised efficiently across two Saturdays, and she kept detailed notes so that when a bridesmaid could not attend the second session, her adjustments had already been accounted for. The finished sets were consistent in quality and colour. Every woman in the party looked polished and comfortable — which is rarer than it should be.",
    event_date: '2026-02-08',
    published_at: '2026-02-15',
  },
];
