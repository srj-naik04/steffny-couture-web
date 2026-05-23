// src/content/marketing/services.ts
// Three service pages' copy — Phase 3 marketing content
// Services: alterations, custom-bridal, bridesmaid
// Voice: warm, precise, no hype, British English, sentence case.

export type ServiceHero = {
  kicker: string;
  headline: string;
  subhead: string;
};

export type WhatWeDo = {
  heading: string;
  items: string[];
};

export type ProcessStep = {
  title: string;
  body: string;
};

export type Process = {
  heading: string;
  steps: ProcessStep[];
};

export type Faq = {
  question: string;
  answer: string;
};

export type ServiceCta = {
  headline: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export type ServicePage = {
  slug: 'alterations' | 'custom-bridal' | 'bridesmaid';
  hero: ServiceHero;
  intro: string;
  what_we_do: WhatWeDo;
  process: Process;
  faqs: Faq[];
  cta: ServiceCta;
};

// ─── Alterations ─────────────────────────────────────────────────────────────

export const alterations: ServicePage = {
  slug: 'alterations',
  hero: {
    kicker: 'Alterations, Hounslow',
    headline: 'Your dress, made to fit the body you have.',
    subhead:
      'Expert alterations for wedding dresses, South Asian bridal wear, evening gowns, and occasion pieces — carried out by hand in our Hounslow studio.',
  },
  intro:
    "Not every dress arrives fitting perfectly. Sometimes a piece is bought in a standard size, inherited, or found in a vintage shop and needs careful work before it becomes what you imagined. Steffi and the studio have been altering bridal and occasion wear for over twenty years — from simple hem adjustments to full structural rebuilds on embellished lehengas and Western gowns. We work with what you bring us, examine how it was originally constructed, and carry out alterations that respect the fabric and the original maker's intent. Every altered piece leaves the studio hand-finished.",
  what_we_do: {
    heading: 'What we take in',
    items: [
      'Wedding dress alterations — hem, bodice, back, strap, and full restructuring',
      'Lehenga and anarkali alterations, including heavily embellished borders and dupattas',
      'Saree blouse fitting and reshaping to exact measurements',
      'Bridesmaid dress alterations for parties of any size',
      'Evening gown and occasion wear — hem, take-in, let-out, strap and sleeve adjustments',
      'Vintage and inherited garments handled with particular care',
    ],
  },
  process: {
    heading: 'How alterations work',
    steps: [
      {
        title: 'Bring the piece in',
        body: 'Book an appointment and bring the garment with the undergarments and shoes you plan to wear on the day. We examine the construction and discuss what needs to change. The initial consultation is free.',
      },
      {
        title: 'Measurement and pinning',
        body: 'You try the dress on and Steffi works through every adjustment — pinning, measuring, and recording each change. We talk through the order of operations, because some alterations depend on others being done first. You leave with a written quote and a timeline.',
      },
      {
        title: 'Skilled tailoring',
        body: 'The work is carried out in the studio by Steffi and, where needed, her trusted team. We never rush a piece to meet an unrealistic deadline — if you come to us with a tight timeframe, we will tell you honestly whether it is achievable.',
      },
      {
        title: 'Final fitting and collection',
        body: 'You return for a final fitting before collection. If anything needs a last-minute refinement — a stitch, a press, a minor adjustment — it is done then and there. You collect the piece only when both of us are satisfied with the result.',
      },
    ],
  },
  faqs: [
    {
      question: 'How far in advance should I book an alterations appointment?',
      answer:
        'For wedding dresses, we recommend booking at least ten to twelve weeks before your ceremony date. This allows time for multiple fittings and any unexpected changes. For simpler alterations — a bridesmaid hem, an evening gown taken in — four to six weeks is usually sufficient. If you are coming to us at short notice, contact us directly and we will be honest about what is feasible.',
    },
    {
      question: 'How much do alterations cost?',
      answer:
        'We give written quotes after the first fitting, once we have seen the garment and the work required. Wedding dress alterations typically range from £80 to £350 depending on complexity. A simple hem is at the lower end; a full bodice restructure with hand-finished seams is at the higher. We will always tell you the full cost before any work begins.',
    },
    {
      question: 'Do you work with heavily embellished South Asian bridal wear?',
      answer:
        'Yes. A significant proportion of our work involves lehengas, anarkalis, and sharara sets with extensive embroidery, zari work, and stone detailing. We know how to handle embellished borders, how to preserve beadwork through a hem alteration, and how to take in or let out a heavily decorated bodice without disturbing the surface detail.',
    },
    {
      question: 'Can you alter a dress I bought online or from a high-street retailer?',
      answer:
        'Absolutely. Many of our customers arrive with dresses from ASOS, H&M, or online bridal retailers that fit in some places and not others. Bring it in and we will assess what can be done. Most standard alterations are straightforward; occasionally, the construction of a very cheap garment limits what is achievable, and we will tell you so honestly.',
    },
    {
      question: 'What should I bring to my first appointment?',
      answer:
        'Bring the dress, the shoes you plan to wear, and any shapewear or undergarments you intend to use on the day. If you have a strapless bra or specific slip that affects the fit, bring those too. For South Asian bridal wear, bring the blouse and the underskirt if they are separate. The more accurate the picture we have in that first session, the better the result.',
    },
    {
      question: 'Do you offer alterations outside the studio?',
      answer:
        'All our work is carried out at our Hounslow studio. We do not currently offer home visits. If travelling to us is difficult, please get in touch and we will see what we can arrange.',
    },
  ],
  cta: {
    headline: 'Book an alterations appointment',
    body:
      'The first consultation is free. Bring the piece and we will talk through exactly what it needs.',
    primaryCta: {
      label: 'Book a fitting',
      href: '/book',
    },
    secondaryCta: {
      label: 'Get in touch',
      href: '/contact',
    },
  },
};

// ─── Custom bridal ────────────────────────────────────────────────────────────

export const customBridal: ServicePage = {
  slug: 'custom-bridal',
  hero: {
    kicker: 'Custom bridal, Hounslow',
    headline: 'A bridal piece made entirely around you.',
    subhead:
      'From the first consultation sketch to the final hand-finished seam — bespoke bridal couture for South Asian ceremonies, Western weddings, and everything between.',
  },
  intro:
    "A custom bridal piece is not simply an altered dress — it is something conceived for your specific silhouette, your ceremony, your sense of who you are on that day. Steffi works with brides across the full range of bridal traditions. She has made lehengas for Hindu and Sikh ceremonies, fusion pieces that carry both a South Asian embroidery tradition and a contemporary Western cut, and classical Western gowns where the client wanted something that could not be found on a rail. Every commission begins with a conversation and ends with a piece that was made for no one else.",
  what_we_do: {
    heading: 'What a custom bridal commission includes',
    items: [
      'Initial consultation to discuss silhouette, fabric, embellishment, and occasion requirements',
      'Toile (calico working model) to perfect the shape before cutting the final fabric',
      'Fabric sourcing guidance — from Hounslow market specialists to London textile suppliers',
      'Lehengas, anarkalis, fusion bridal silhouettes, and Western gowns — all from scratch',
      'Hand-finished seams, couture-level construction, and multiple fittings throughout',
      'Dupatta, blouse, and underskirt made as part of the same commission where required',
    ],
  },
  process: {
    heading: 'The custom bridal process',
    steps: [
      {
        title: 'Consultation',
        body: 'The first appointment is unhurried and free. You bring your ideas — photographs, fabric swatches, sketches, or simply a feeling you want to capture. Steffi asks questions about the ceremony, the venue, the time of day, what you want to feel like wearing it. Together you agree on a direction. A detailed brief and written quote follow within a few days.',
      },
      {
        title: 'Design and toile',
        body: "Before any of your chosen fabric is cut, Steffi makes a toile — a working version of the garment in inexpensive calico. You come in, try it on, and the two of you refine every detail: the neckline depth, the bodice line, the skirt weight and volume. Changes at this stage are easy and cost nothing extra. Changes after the final fabric is cut are costly and sometimes impossible, so we don't rush past the toile.",
      },
      {
        title: 'First and second fittings',
        body: 'Once the toile is approved and the final fabric is cut and assembled, you attend two fittings in the studio. The first fitting checks the foundational structure; the second checks embellishment, final proportions, and the way the piece moves. Between fittings, Steffi is doing the detailed hand-finishing — the work that cannot be rushed.',
      },
      {
        title: 'Final delivery',
        body: 'Your completed piece is pressed and prepared for collection at a final appointment. Steffi will show you how to put it on, how to move in it, and how to care for it after the ceremony. If anything needs a last-minute refinement, it is done before you leave.',
      },
    ],
  },
  faqs: [
    {
      question: 'How long does a custom bridal piece take?',
      answer:
        'Most custom bridal commissions take between fourteen and twenty weeks from consultation to delivery, depending on complexity and embellishment. A heavily embroidered lehenga takes longer than a clean-lined Western gown. We recommend getting in touch as soon as you have a wedding date confirmed — the earlier you contact us, the more creative latitude we all have.',
    },
    {
      question: 'What sizes do you work with?',
      answer:
        'Custom bridal is made to your exact measurements, so standard sizing does not apply. We take a full set of measurements at the first fitting and work to those throughout the process. There is no minimum or maximum — a custom piece is sized for the person wearing it, full stop.',
    },
    {
      question: 'How much does a custom bridal commission cost?',
      answer:
        'Custom bridal is priced on enquiry, once we have discussed the garment in detail. The cost reflects the complexity of the silhouette, the fabric chosen, and the degree of embellishment. We give a written quote after the first consultation. A deposit is required to confirm the commission, with the balance due at final collection.',
    },
    {
      question: 'Can you work with fabric I source myself?',
      answer:
        'Yes. Many brides bring fabric they have chosen themselves — perhaps from Southall market, from a family trip to India or Pakistan, or from an online textile supplier. We will examine the fabric at the consultation and advise on its suitability for your chosen silhouette. If it will not behave the way you need, we will tell you so before work begins.',
    },
    {
      question: 'Can you make a fusion piece that combines South Asian and Western elements?',
      answer:
        'This is some of the most interesting work we do. If you want a lehenga skirt with a structured Western bodice, a gown with Mughal-inspired embroidery at the hem, or a silhouette that has no easy category — yes. Bring a reference or simply describe the feeling. We will work out how to make it real.',
    },
    {
      question: 'Do you offer fittings outside the studio?',
      answer:
        'All fittings take place at our Hounslow studio, which is set up for the work — mirrors, lighting, and the equipment required to assess fit properly. We are not able to do justice to a custom commission in a home visit setting. If travel to Hounslow is a genuine difficulty, please contact us and we will discuss options.',
    },
  ],
  cta: {
    headline: 'Begin your custom bridal consultation',
    body:
      'The first conversation is free and without obligation. Tell us about the dress — or the idea of it — and we will take it from there.',
    primaryCta: {
      label: 'Book a consultation',
      href: '/book',
    },
    secondaryCta: {
      label: 'See the studio',
      href: '/about',
    },
  },
};

// ─── Bridesmaid dresses ───────────────────────────────────────────────────────

export const bridesmaid: ServicePage = {
  slug: 'bridesmaid',
  hero: {
    kicker: 'Bridesmaid dresses, Hounslow',
    headline: 'Every person in the party, fitted properly.',
    subhead:
      'Coordinated bridesmaid dresses — made from scratch or altered to fit — with synchronised appointments for the whole group at our Hounslow studio.',
  },
  intro:
    "Bridesmaid dresses are one of the more demanding aspects of bridal styling — not because they are complicated in themselves, but because the same design must work across a group of people with different bodies, different heights, and often very different views on what they are comfortable wearing. We approach bridesmaid commissions the same way we approach everything else: with careful measurement, honest conversations, and enough time in the fitting room to get it right. Whether you are having us make the dresses from scratch or alter pieces you have already purchased, the goal is the same — a group where every person feels at ease in what they are wearing.",
  what_we_do: {
    heading: 'What we offer for bridal parties',
    items: [
      'Custom bridesmaid dresses made to each person\'s measurements — coordinated in colour, fabric, and silhouette',
      'Alterations on purchased bridesmaid dresses — hem, take-in, take-out, strap and sleeve adjustments',
      'South Asian bridesmaid sets — coordinated lehengas, anarkalis, or sharara suits',
      'Group fitting appointments with dedicated studio time for the whole party',
      'Colour-matching advice and fabric sourcing across the group',
      'Flower girl dresses and junior bridesmaids accommodated within the same commission',
    ],
  },
  process: {
    heading: 'How bridesmaid commissions work',
    steps: [
      {
        title: 'Group consultation',
        body: "The bride (and ideally at least one or two bridesmaids) comes in for an initial consultation. We discuss the look you are aiming for, the degree of coordination you want across the party, each person's comfort with different silhouettes, and the logistics of getting everyone fitted. This appointment is free and sets the direction for everything that follows.",
      },
      {
        title: 'Design or selection',
        body: 'For custom commissions, we agree on a design — sometimes identical across the group, sometimes with small variations in neckline or sleeve to suit each person. For purchased dresses, we examine each piece and plan the alteration schedule. In either case, we give each bridesmaid a written list of what we will be doing for their specific garment.',
      },
      {
        title: 'Synchronised fittings',
        body: 'Where possible, we coordinate fittings so that the bride and bridesmaids can be in the studio at the same time — this makes colour-checking, length decisions, and group styling much easier. For larger parties, we stagger appointments across a single day or weekend. We keep detailed notes on each person so that fittings run efficiently even when not everyone can attend at once.',
      },
      {
        title: 'Co-ordinated delivery',
        body: 'All garments are completed and pressed for collection within the agreed timeframe, with a final individual fitting for each person before they take their piece home. If someone is travelling from outside London, we can discuss collection logistics. On-the-day alterations are available for a small additional fee if something shifts between the final fitting and the ceremony.',
      },
    ],
  },
  faqs: [
    {
      question: 'How far in advance should we book for bridesmaid dresses?',
      answer:
        'For custom bridesmaid dresses, we recommend booking at least twelve to sixteen weeks before the wedding date, particularly if the party is large. For alterations on purchased dresses, six to eight weeks is usually sufficient. Contact us as soon as the bride has chosen the general direction — the earlier, the more breathing room everyone has.',
    },
    {
      question: 'What if my bridesmaids are coming from different cities or countries?',
      answer:
        'It happens regularly. Where a bridesmaid cannot attend in person until close to the wedding, we can take measurements from them remotely using a detailed measurement guide we send out. We then carry out the initial construction and do a final fitting when they arrive. It is not ideal, but we have made it work many times.',
    },
    {
      question: 'Can you work with a colour we have already committed to?',
      answer:
        "Yes. If you have already purchased fabric, chosen a shade from a specific retailer, or committed to a colour that appears in the rest of the wedding's styling, bring a swatch. We will source or work with fabric as close a match as possible. For custom commissions, we recommend visiting our studio with the swatch before committing to anything.",
    },
    {
      question: 'Do you work with South Asian bridesmaid sets — lehengas or salwar suits?',
      answer:
        'Yes. Coordinated South Asian bridesmaid sets are a significant part of our work. We can make lehenga sets, anarkali suits, or sharara outfits for the full party in coordinated fabrics and embellishment, adjusted to fit each person individually. We have done this for mehndi parties, sangeets, and the main wedding day.',
    },
    {
      question: 'What if one bridesmaid drops out after we have started work?',
      answer:
        "We deal with this on a case-by-case basis. If the garment has not yet been cut, we can refund the deposit for that piece. If work has already begun, we will discuss what has been done and agree a fair position. We always aim to be reasonable — we understand that wedding party logistics are unpredictable.",
    },
    {
      question: 'Can you make flower girl dresses to match?',
      answer:
        "Yes — flower girl and junior bridesmaid dresses can be included in the same commission. We adapt the silhouette and details to be age-appropriate while keeping the colour palette and fabric consistent with the rest of the party. Tell us at the initial consultation and we will factor them into the quote.",
    },
  ],
  cta: {
    headline: 'Book a bridesmaid consultation',
    body:
      'Come in with the bride and however many of the party can make it. The initial consultation is free and we will plan the full commission together.',
    primaryCta: {
      label: 'Book a fitting',
      href: '/book',
    },
    secondaryCta: {
      label: 'See our work',
      href: '/dresses',
    },
  },
};
