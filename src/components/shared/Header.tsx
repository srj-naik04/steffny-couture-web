'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { PRIMARY_NAV } from '@/constants/nav';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { MobileDrawer } from './MobileDrawer';
import { CartIcon } from './CartIcon';
import { cn } from '@/lib/cn';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-30 transition-colors duration-200',
          scrolled ? 'bg-ivory/90 border-border border-b backdrop-blur-md' : 'bg-ivory/0',
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Logo />

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {PRIMARY_NAV.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'text-small font-body rounded py-2 font-medium transition-colors',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose',
                          active ? 'text-rose' : 'text-ink hover:text-rose',
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <CartIcon />
              <Button href="/book" variant="primary" size="sm">
                Book a fitting
              </Button>
            </div>

            <div className="flex items-center gap-1 lg:hidden">
              <CartIcon />
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="hover:bg-surface-alt -mr-2 rounded-full p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              >
                <Menu className="size-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
