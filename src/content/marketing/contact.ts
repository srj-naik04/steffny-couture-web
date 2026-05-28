// src/content/marketing/contact.ts
// Contact page copy — Phase 3 marketing content
// Studio address, hours, and contact details sourced from src/constants/brand.ts (STUDIO constant).
// Voice: warm, direct, no hype, British English.

export type ContactHero = {
  kicker: string;
  headline: string;
  subhead: string;
};

export type StudioHours = {
  day: string;
  hours: string;
};

export type ContactDetails = {
  studioName: string;
  addressLines: string[];
  phone: string;
  whatsapp: string;
  email: string;
  instagramHandle: string;
  hours: StudioHours[];
  appointmentNote: string;
};

export type FounderCard = {
  name: 'Steffi';
  role: string;
  bio: string;
};

export const contactHero: ContactHero = {
  kicker: 'Get in touch',
  headline: 'We are always happy to talk.',
  subhead:
    'Whether you have a dress that needs attention, an idea for something new, or simply a question — come in, call, or send a message and we will get back to you.',
};

export const contactIntro: string =
  "The studio is in Hounslow, on the High Street. We work by appointment only — there is no walk-in waiting area. If you would like to visit, book a slot through the form below or call us directly. For a quick question, WhatsApp is usually the fastest way to reach the studio. We aim to reply to all enquiries within one working day.";

export const contactDetails: ContactDetails = {
  studioName: 'Steffny Couture',
  addressLines: [
    '255 High Street',
    'Hounslow',
    'London',
    'TW3 1EA',
  ],
  // All values below are sourced from STUDIO in src/constants/brand.ts
  phone: '+44 7834 877992',
  whatsapp: 'https://wa.me/447834877992',
  email: 'hello@steffnycouture.co.uk',
  instagramHandle: '@steffnycouture',
  hours: [
    { day: 'Monday to Friday', hours: '9:30 am – 7:00 pm' },
    { day: 'Saturday', hours: '10:00 am – 7:00 pm' },
    { day: 'Sunday', hours: '11:00 am – 6:00 pm' },
  ],
  appointmentNote:
    'The studio operates by appointment only. Please book before visiting so we can give you our full attention.',
};

// Pairs with bride-bouquet-detail.jpg per IMAGE_BRIEF.md founder-card rule
export const founderCard: FounderCard = {
  name: 'Steffi',
  role: 'Founder and lead couturier',
  bio: "Steffi founded Steffny Couture after more than two decades of working with brides, bridesmaids, and occasion-wear customers across West London. She handles every consultation personally and oversees all the work that leaves the studio. If you book an appointment, you will work with Steffi directly — from the first fitting to the last stitch.",
};
