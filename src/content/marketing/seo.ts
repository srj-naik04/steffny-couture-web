// src/content/marketing/seo.ts
// Per-page SEO metadata — Phase 3 marketing content
//
// IMPORTANT: The root layout in src/app/layout.tsx applies a title template
// that appends " — Steffny Couture" to each page title. Titles here are the
// page-specific portion only. Keep them short enough that the full composed
// title stays within 60 characters.
//
// Titles here: aim for ≤ 40 chars (leaves room for " — Steffny Couture" = 19 chars).
// Descriptions: 140-160 chars, complete sentences, include a location signal.
// OG images: Steffi photos used per IMAGE_BRIEF.md spotlight rule.
// Keywords: supplementary signals only — write for readers, not crawlers.

export type PageSeo = {
  /** Page-specific title fragment. Root layout appends " — Steffny Couture". */
  title: string;
  /** Meta description: 140-160 chars, complete sentence, location signal. */
  description: string;
  keywords?: string[];
  /** Relative path from /public, e.g. '/assets/hero/bride-bangles-portrait.jpg' */
  ogImage?: string;
};

export const marketingSeo: Record<string, PageSeo> = {
  // Home: full title = "Couture studio & alterations, Hounslow — Steffny Couture" = 57 chars ✓
  '/': {
    title: 'Couture studio & alterations, Hounslow',
    description:
      'Hand-finished couture and expert alterations in Hounslow, West London. South Asian and Western bridal wear. Book a free fitting with Steffi.',
    keywords: [
      'couture studio Hounslow',
      'wedding dress alterations Hounslow',
      'bridal alterations London',
      'South Asian bridal couture London',
      'dressmaker Hounslow',
    ],
    // Primary OG image must be a Steffi photo per IMAGE_BRIEF.md
    ogImage: '/assets/hero/bride-bangles-portrait.jpg',
  },

  // About: full title = "About the studio — Steffny Couture" = 35 chars ✓
  '/about': {
    title: 'About the studio',
    description:
      'Steffny Couture is a by-appointment couture and alterations studio in Hounslow, founded by Steffi with over twenty years of bridal experience.',
    keywords: [
      'about Steffny Couture',
      'Hounslow couture studio',
      'Steffi couturier Hounslow',
      'bridal studio West London',
    ],
    // About page opens with a Steffi photo per IMAGE_BRIEF.md
    ogImage: '/assets/hero/bride-bouquet-detail.jpg',
  },

  // Services: full title = "Bridal and alteration services — Steffny Couture" = 48 chars ✓
  '/services': {
    title: 'Bridal and alteration services',
    description:
      'Alterations, custom bridal commissions, and bridesmaid dresses — all hand-finished at our Hounslow studio. Free initial consultations.',
    keywords: [
      'bridal services Hounslow',
      'wedding dress services London',
      'couture services West London',
      'alterations and custom bridal Hounslow',
    ],
    ogImage: '/assets/hero/bride-maroon-chandelier.jpg',
  },

  // Alterations: full title = "Wedding dress alterations, Hounslow — Steffny Couture" = 53 chars ✓
  '/services/alterations': {
    title: 'Wedding dress alterations, Hounslow',
    description:
      'Expert alterations for wedding dresses, lehengas, saree blouses, and occasion wear in Hounslow. Multiple fittings, hand-finished seams, free consultation.',
    keywords: [
      'wedding dress alterations Hounslow',
      'bridal alterations London',
      'lehenga alterations London',
      'saree blouse alterations Hounslow',
      'dress alteration near me West London',
    ],
    ogImage: '/assets/hero/bride-maroon-radio.jpg',
  },

  // Custom bridal: full title = "Bespoke bridal couture, Hounslow — Steffny Couture" = 50 chars ✓
  '/services/custom-bridal': {
    title: 'Bespoke bridal couture, Hounslow',
    description:
      'Custom bridal dresses made from scratch in Hounslow. Lehengas, Western gowns, and fusion pieces — designed with Steffi from first sketch to final fitting.',
    keywords: [
      'bespoke bridal couture Hounslow',
      'custom lehenga London',
      'custom wedding dress London',
      'South Asian bridal couture West London',
      'made to measure wedding dress Hounslow',
    ],
    ogImage: '/assets/hero/bride-maroon-arch.jpg',
  },

  // Bridesmaid: full title = "Bridesmaid dresses, Hounslow — Steffny Couture" = 47 chars ✓
  '/services/bridesmaid': {
    title: 'Bridesmaid dresses, Hounslow',
    description:
      'Custom and altered bridesmaid dresses in Hounslow. South Asian bridal party sets, coordinated group fittings, and consistent results for every person.',
    keywords: [
      'bridesmaid dresses Hounslow',
      'bridesmaid alterations London',
      'South Asian bridesmaid set London',
      'coordinated bridesmaid dresses West London',
    ],
    ogImage: '/assets/hero/bride-burgundy-outdoor.jpg',
  },

  // Contact: full title = "Contact the studio — Steffny Couture" = 36 chars ✓
  '/contact': {
    title: 'Contact the studio',
    description:
      'Find Steffny Couture at 255 High Street, Hounslow TW3 1EA. Call, WhatsApp, or book a fitting online. Open Monday to Sunday by appointment.',
    keywords: [
      'contact Steffny Couture',
      'Hounslow couture studio address',
      'book bridal fitting Hounslow',
      'Steffny Couture opening hours',
    ],
    ogImage: '/assets/hero/bride-red-roses.jpg',
  },

  // Reviews: full title = "Customer reviews — Steffny Couture" = 34 chars ✓
  '/reviews': {
    title: 'Customer reviews',
    description:
      'What brides, bridesmaids, and occasion-wear customers say about Steffny Couture in Hounslow. Honest reviews from real customers across West London.',
    keywords: [
      'Steffny Couture reviews',
      'couture studio Hounslow reviews',
      'bridal alterations reviews London',
    ],
    ogImage: '/assets/hero/bride-bangles-portrait.jpg',
  },

  // Journal: full title = "Journal — Steffny Couture" = 25 chars ✓
  '/journal': {
    title: 'Journal',
    description:
      'Practical bridal guidance from the Steffny Couture studio in Hounslow — fitting timelines, South Asian bridal wear advice, alteration tips, and more.',
    keywords: [
      'bridal fitting advice London',
      'lehenga vs anarkali',
      'wedding dress alteration timeline UK',
      'bridal journal Hounslow',
    ],
  },

  // Dresses: full title = "The dress collection — Steffny Couture" = 38 chars ✓
  '/dresses': {
    title: 'The dress collection',
    description:
      'Browse the Steffny Couture collection — ready-to-wear gowns for weddings, South Asian ceremonies, and special occasions. Hand-finished in Hounslow.',
    keywords: [
      'couture dresses Hounslow',
      'wedding guest dresses West London',
      'evening gowns Hounslow',
      'South Asian occasion dresses London',
    ],
  },

  // Cart: full title = "Your cart — Steffny Couture" = 27 chars ✓
  // noindex — cart pages should not be crawled
  '/cart': {
    title: 'Your cart',
    description:
      'Review your selected pieces from Steffny Couture and proceed to checkout. Hand-finished couture from Hounslow, London.',
  },

  // Checkout: full title = "Checkout — Steffny Couture" = 26 chars ✓
  // noindex — checkout pages should not be crawled
  '/checkout': {
    title: 'Checkout',
    description:
      'Complete your order from Steffny Couture. Enter your contact, delivery, and payment details. No payment is taken until Steffi confirms your order.',
  },

  // Confirmation: full title = "Order received — Steffny Couture" = 32 chars ✓
  // noindex — confirmation pages should not be crawled
  '/checkout/confirmation': {
    title: 'Order received',
    description:
      'Your order has been received by Steffny Couture. Steffi will be in touch within one working day to confirm sizing, finishing, and final pricing.',
  },

  // Book a fitting: full title = "Book a fitting — Steffny Couture" = 32 chars ✓
  '/book': {
    title: 'Book a fitting',
    description:
      'Book a fitting, alteration, or bridal consultation at Steffny Couture in Hounslow. Steffi confirms every appointment personally. Available 7 days a week.',
    keywords: [
      'book bridal fitting Hounslow',
      'book alteration appointment London',
      'book consultation couture Hounslow',
      'bridal fitting appointment West London',
    ],
    ogImage: '/assets/hero/bride-white-umbrella-interior.jpg',
  },

  // Book confirmation: full title = "Booking received — Steffny Couture" = 34 chars ✓
  // noindex — confirmation pages should not be crawled
  '/book/confirmation': {
    title: 'Booking received',
    description:
      'Your booking request has been received by Steffny Couture. Steffi will be in touch within one working day to confirm your appointment.',
  },
};
