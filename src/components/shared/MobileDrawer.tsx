'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PRIMARY_NAV } from '@/constants/nav';
import { STUDIO } from '@/constants/brand';
import { backdropFade, drawerRight } from '@/lib/motion/presets';
import { Button } from '@/components/ui/Button';
import { Logo } from './Logo';
import { cn } from '@/lib/cn';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileDrawer({ open, onClose }: Props) {
  const pathname = usePathname();

  // Lock body scroll while open.
  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close on Escape.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="bg-ivory/60 fixed inset-0 z-40 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />
          <motion.aside
            key="drawer"
            variants={drawerRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="bg-ivory fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-sm flex-col shadow-2xl md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-5">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="hover:bg-surface-alt -mr-2.5 rounded-full p-2.5 transition-colors"
              >
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="space-y-1">
                {PRIMARY_NAV.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          'font-display block rounded-md px-2 py-3 text-2xl transition-colors',
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

            <div className="border-border border-t px-5 py-6">
              <Button href="/book" variant="primary" fullWidth onClick={onClose}>
                Book a fitting
              </Button>
              <p className="text-small text-ink-muted mt-4">
                <a href={STUDIO.phoneTel} className="hover:text-rose transition-colors">
                  {STUDIO.phone}
                </a>
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
