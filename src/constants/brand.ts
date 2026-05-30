// Single source of truth for non-style brand tokens (copy, motion timings,
// social URLs, studio details). Colour, typography, and spacing tokens are
// declared in src/app/globals.css via Tailwind v4 `@theme` and consumed
// through utility classes — keep that file in sync with the values here.

export const BRAND = {
  name: 'Steffny Couture',
  tagline: 'Elegance, made in London.',
  description:
    'Bespoke couture and alterations in Hounslow, London. Hand-finished by Steffi and her studio.',
  url: 'https://www.steffnycouture.co.uk',
  locale: 'en-GB',
  twitter: '@steffnycouture',
} as const;

export const STUDIO = {
  address: '255 High Street, Hounslow, London TW3 1EA',
  phone: '+44 7834 877992',
  phoneTel: 'tel:+447834877992',
  email: 'hello@steffnycouture.co.uk',
  whatsapp: 'https://wa.me/447834877992',
  instagram: 'https://instagram.com/steffnycouture',
  hours: [
    { day: 'Monday to Friday', open: '9:30 am – 7:00 pm' },
    { day: 'Saturday', open: '10:00 am – 7:00 pm' },
    { day: 'Sunday', open: '11:00 am – 6:00 pm' },
  ],
} as const;

// Reference copy of design tokens, mirrored in globals.css `@theme`.
// MIDNIGHT COUTURE variant (feat/midnight-theme) — warm-onyx palette.
// Original ivory values shown in comments. Token KEYS unchanged; only VALUES inverted.
export const COLORS = {
  ivory: '#1A1714',         // was #FAF7F2 — warm deep charcoal (page bg)
  surface: '#22201D',       // was #FFFFFF — lifted card surface
  surfaceAlt: '#2B2825',    // was #F4EFE8 — input/textarea bg
  rose: '#BC4D66',          // was #7C2D3E — lifted mid-rose for dark-bg legibility
  roseDark: '#9A3A52',      // was #5A1F2C — hover state, richer than base
  roseSoft: '#3A1C25',      // was #F2D9DE — dark rose tint (selection bg)
  gold: '#C9A961',          // unchanged — divider accent
  goldSoft: '#3D311A',      // was #F5EBD2 — dark gold tint
  ink: '#F4ECDC',           // was #1F1B1A — champagne cream primary text
  inkMuted: '#C9BFAE',      // was #5C5551 — warm muted cream body
  inkSubtle: '#8C8478',     // was #9A9089 — mid-tone caption
  success: '#3F6E4A',       // unchanged — semantic
  warning: '#B8741A',       // unchanged
  danger: '#9B2C2C',        // unchanged
  info: '#3A5878',          // unchanged
  border: '#3A3531',        // was #E8E0D7 — subtle hairline on dark
  borderStrong: '#4F4843',  // was #D4C8BA — stronger divider
} as const;

export const EASING = {
  out: [0.4, 0, 0.2, 1] as const,
  standard: [0.25, 0.1, 0.25, 1] as const,
  page: [0.6, 0.05, 0.01, 0.99] as const,
};

export const DURATION = {
  micro: 0.2,
  default: 0.4,
  slow: 0.6,
  page: 0.6,
} as const;
