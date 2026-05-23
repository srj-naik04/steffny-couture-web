// src/content/marketing/home.ts
// Home page section copy — Phase 3 marketing content
// All copy follows Steffny Couture brand voice: no exclamation marks, British English,
// sentence case headings, warm but refined tone.

export type Cta = {
  label: string;
  href: string;
};

export type HeroHome = {
  kicker: string;
  headline: string;
  subhead: string;
  primaryCta: Cta;
  secondaryCta: Cta;
};

export type AboutTeaser = {
  eyebrow: string;
  headline: string;
  body: string;
  cta: Cta;
};

export type ServicePreviewItem = {
  slug: string;
  title: string;
  summary: string;
  href: string;
};

export type ServicesPreview = {
  headline: string;
  subhead: string;
  items: ServicePreviewItem[];
};

export type JournalTeaser = {
  eyebrow: string;
  headline: string;
  body: string;
  cta: Cta;
};

export type FinalCta = {
  headline: string;
  body: string;
  primaryCta: Cta;
  secondaryCta: Cta;
};

export const heroHome: HeroHome = {
  kicker: 'Couture studio, Hounslow',
  headline: 'Dresses made the way they should be.',
  subhead:
    'Hand-finished couture and expert alterations from our studio in Hounslow. Whether you need a dress made from scratch or a cherished piece brought back to life, Steffi and the team are here.',
  primaryCta: {
    label: 'Book a fitting',
    href: '/book',
  },
  secondaryCta: {
    label: 'View dresses',
    href: '/dresses',
  },
};

export const aboutTeaser: AboutTeaser = {
  eyebrow: 'About the studio',
  headline: 'Two decades of craft, one Hounslow studio.',
  body:
    'Steffny Couture was founded by Steffi — a couturier who trained in precision tailoring and has spent over twenty years fitting brides, bridesmaids, and occasion-wear customers across West London. The studio is by appointment, unhurried, and built around getting the fit exactly right.',
  cta: {
    label: 'Meet Steffi',
    href: '/about',
  },
};

export const servicesPreview: ServicesPreview = {
  headline: 'What we do',
  subhead:
    'Three services, all rooted in the same discipline: careful hands, good fabric, and a fitting that gives you time.',
  items: [
    {
      slug: 'alterations',
      title: 'Alterations',
      summary:
        'From a single hem to a full restructure — wedding dresses, evening gowns, South Asian bridal wear, and occasion pieces. We work with what you bring us, and we treat it with care.',
      href: '/services/alterations',
    },
    {
      slug: 'custom-bridal',
      title: 'Custom bridal',
      summary:
        'A bridal piece designed around you, from the first consultation sketch to the final fitting. Lehengas, gowns, fusion silhouettes, or something entirely your own — we start from scratch.',
      href: '/services/custom-bridal',
    },
    {
      slug: 'bridesmaid',
      title: 'Bridesmaid dresses',
      summary:
        'Co-ordinated bridal party dresses made or altered to fit every person in the group. Synchronised fittings, consistent colour, and a result where no one is adjusting a strap on the day.',
      href: '/services/bridesmaid',
    },
  ],
};

export const journalTeaser: JournalTeaser = {
  eyebrow: 'From the journal',
  headline: 'A few things worth knowing before your wedding.',
  body:
    'Fitting timelines, lehenga versus anarkali, what to bring to your first alteration appointment — practical guidance written from twenty years of working with brides in West London.',
  cta: {
    label: 'Read the journal',
    href: '/journal',
  },
};

export const finalCta: FinalCta = {
  headline: 'Ready to start?',
  body:
    'Consultations are free and without obligation. Bring the dress, bring your ideas, or come with nothing but a date — we will work from there.',
  primaryCta: {
    label: 'Book a fitting',
    href: '/book',
  },
  secondaryCta: {
    label: 'Get in touch',
    href: '/contact',
  },
};
