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
export const COLORS = {
  ivory: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceAlt: '#F4EFE8',
  rose: '#7C2D3E',
  roseDark: '#5A1F2C',
  roseSoft: '#F2D9DE',
  gold: '#C9A961',
  goldSoft: '#F5EBD2',
  ink: '#1F1B1A',
  inkMuted: '#5C5551',
  inkSubtle: '#9A9089',
  success: '#3F6E4A',
  warning: '#B8741A',
  danger: '#9B2C2C',
  info: '#3A5878',
  border: '#E8E0D7',
  borderStrong: '#D4C8BA',
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
