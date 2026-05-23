// src/content/marketing/about.ts
// About page narrative copy — Phase 3 marketing content
// Covers: Steffi's training and craft, the Hounslow studio, customer base,
// philosophy, and the "Crafted in London" identity.
// Voice: first-person plural ("we"), warm, specific, no hype.

export type AboutHero = {
  kicker: string;
  headline: string;
  subhead: string;
};

export type AboutSection = {
  heading: string;
  body: string;
};

export type AboutQuote = {
  quote: string;
  attribution: string;
};

export const aboutHero: AboutHero = {
  kicker: 'Crafted in London',
  headline: 'A studio built on patience and precision.',
  subhead:
    "Steffny Couture is Steffi’s life work — a couture and alterations studio in Hounslow, West London, where every fitting is given the time it deserves.",
};

export const aboutSections: AboutSection[] = [
  {
    heading: 'Where it started',
    body: "Steffi came to couture through a belief that clothing, made well, should feel like an extension of the person wearing it. She trained in precision tailoring — learning how seams behave under movement, how fabric drape changes with the body, how a single centimetre at the shoulder can alter the entire line of a gown. That foundation has shaped everything she has done since. Steffny Couture opened in Hounslow because this is where Steffi has always worked, and because Hounslow's wedding community — rich in South Asian ceremony, British tradition, and everything in between — deserved a studio that understood both.",
  },
  {
    heading: 'The studio',
    body: "The studio is on the High Street in Hounslow — quiet, unhurried, and by appointment only. We do not operate as a walk-in shop. Every appointment is set aside specifically for you, which means the fitting room is yours for as long as the work requires. There is no queue outside the door, no one waiting for your mirror. We find that brides and bridesmaids relax when they know the time is genuinely theirs, and that relaxation — that stillness — is when the best fitting decisions get made.",
  },
  {
    heading: 'Who we work with',
    body: "Our customers are brides preparing for South Asian ceremonies, Christian church weddings, civil ceremonies at West London venues, and everything that sits between those traditions. We work with bridesmaids who need a coordinated set altered to fit five different body shapes. We work with mothers of the bride who have found a piece they love but need adjusted. We work with customers who come in with a vague idea and leave with a commission. Some people find us with six months to spare; a few have arrived with six weeks. We have managed both.",
  },
  {
    heading: 'The craft',
    body: "Every piece that leaves the studio is hand-finished. Steffi does not believe in cutting corners that the customer will eventually feel — a poorly finished seam, a hem that sits at the wrong weight, a silhouette that photographs well but pulls at the waist by mid-afternoon. The work we do is measured in millimetres and checked across multiple fittings. For custom commissions, that means a toile first — a working model in calico that lets us refine the shape before a single piece of the final fabric is cut. For alterations, it means bringing a piece in, examining how it was originally made, and working with that construction rather than against it.",
  },
  {
    heading: 'South Asian and Western bridal — both, fluently',
    body: "Hounslow sits at the crossroads of London's South Asian wedding culture and its broader West London social calendar. We have spent twenty years working with lehengas, anarkalis, sarees, and their accompanying blouses. We have fitted sharara sets and restructured heavily embellished dupattas. We have also made Western gowns, restructured vintage dresses, and altered contemporary bridal from the high street. Understanding both traditions — and knowing where they can meet, when a bride wants to carry both into a single day — is something we do not take lightly.",
  },
  {
    heading: 'Our approach',
    body: "Consultations are free, and they are never rushed. We would rather spend an extra twenty minutes in the first appointment than discover at the third fitting that we have been working from an assumption. We will ask about the venue, the ceremony timing, the shoes, the dupatta, the lighting — all of it shapes the dress. Pricing is discussed openly once we have seen the work, and quotes are given in writing. We do not add charges after the fact. What we quote is what you pay.",
  },
];

export const aboutQuote: AboutQuote = {
  quote:
    'The fitting is where I do my real work. The sewing is just how I record it.',
  attribution: 'Steffi — Founder, Steffny Couture',
};
