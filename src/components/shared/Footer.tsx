import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { BRAND, STUDIO } from '@/constants/brand';
import { FOOTER_NAV } from '@/constants/nav';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface text-ink border-t border-border">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-4 md:gap-8 md:py-20">
          <div className="space-y-4">
            <Logo tone="ink" />
            <p className="text-small text-ink/70 max-w-xs">{BRAND.description}</p>
            <a
              href={STUDIO.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Steffny Couture on Instagram"
              className="hover:bg-ink/10 inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>

          {FOOTER_NAV.map((group) => (
            <div key={group.heading} className="space-y-4">
              <h3 className="text-label text-ink/60 tracking-widest uppercase">
                {group.heading}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-small text-ink/85 hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border grid gap-4 border-t py-6 md:grid-cols-2">
          <p className="text-small text-ink/70">
            {STUDIO.address} ·{' '}
            <a href={STUDIO.phoneTel} className="hover:text-ink transition-colors">
              {STUDIO.phone}
            </a>
          </p>
          <p className="text-small text-ink/60 md:text-right">
            © {year} {BRAND.name}. Crafted in London.
          </p>
        </div>
      </Container>
    </footer>
  );
}
