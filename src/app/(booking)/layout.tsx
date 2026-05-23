/**
 * Booking route group layout — Phase 3 stub
 *
 * Mirrors (marketing)/layout.tsx: Header + skip-link + main + Footer.
 * Phase 6 (Fitting/Alteration Booking) will keep this layout and add
 * wizard state management around it.
 */

import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-rose focus:px-4 focus:py-2 focus:text-ivory focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
