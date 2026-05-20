export type NavLink = {
  label: string;
  href: string;
};

export const PRIMARY_NAV: NavLink[] = [
  { label: 'Dresses', href: '/dresses' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_NAV: { heading: string; links: NavLink[] }[] = [
  {
    heading: 'Studio',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Journal', href: '/journal' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Alterations', href: '/services/alterations' },
      { label: 'Custom bridal', href: '/services/custom-bridal' },
      { label: 'Bridesmaid dresses', href: '/services/bridesmaid' },
      { label: 'Book a fitting', href: '/book' },
    ],
  },
  {
    heading: 'Shop',
    links: [
      { label: 'All dresses', href: '/dresses' },
      { label: 'Cart', href: '/cart' },
    ],
  },
];
