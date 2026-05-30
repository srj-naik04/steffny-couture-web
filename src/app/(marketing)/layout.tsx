import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-rose focus:px-4 focus:py-2 focus:text-ink focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
