import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { MotionConfigProvider } from '@/components/shared/MotionConfigProvider';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { BRAND, COLORS } from '@/constants/brand';
import { siteUrl } from '@/lib/env';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-fraunces',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${BRAND.name}`,
    default: `${BRAND.name} — ${BRAND.tagline}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteUrl,
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
  },
  // Allow indexing only when VERCEL_ENV is 'production' (or undefined for local
  // builds) AND NEXT_PUBLIC_SITE_URL matches the canonical production domain.
  // This blocks staging hosts, tunnels, and local dev that lack the correct
  // env configuration from accidentally allowing indexing.
  robots: (() => {
    const CANONICAL = 'https://www.steffnycouture.co.uk';
    const isProductionContext =
      (process.env.VERCEL_ENV === 'production' ||
        process.env.VERCEL_ENV === undefined) &&
      process.env.NEXT_PUBLIC_SITE_URL === CANONICAL;
    return isProductionContext
      ? { index: true, follow: true }
      : { index: false, follow: false };
  })(),
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: COLORS.ivory,
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${fraunces.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-ivory text-ink font-body min-h-dvh antialiased">
        <MotionConfigProvider>
          {children}
          {/* CartDrawer mounted at root so it's available across all route groups */}
          <CartDrawer />
        </MotionConfigProvider>
      </body>
    </html>
  );
}
