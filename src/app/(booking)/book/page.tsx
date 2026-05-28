/**
 * Book a fitting page — Phase 6
 *
 * Replaces the Phase 3 stub. Server component shell with:
 *   - Hero section (service image, brand-voice copy)
 *   - BookingWizard client component (6-step form)
 *
 * The page is crawlable — booking is a primary CTA. noindex applies only
 * to the /book/confirmation page.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { BookingWizard } from '@/features/bookings/components/BookingWizard';

export const metadata: Metadata = {
  title: 'Book a fitting',
  description:
    'Book a fitting, alteration, or bridal consultation at Steffny Couture in Hounslow. Every appointment is confirmed personally.',
  openGraph: {
    title: 'Book a fitting — Steffny Couture',
    description:
      'Book a fitting, alteration, or bridal consultation at Steffny Couture in Hounslow. Every appointment is confirmed personally.',
    images: [
      {
        url: '/assets/hero/bride-white-umbrella-interior.jpg',
        width: 800,
        height: 800,
        alt: 'A bride in a white gown photographed inside a bright studio interior',
      },
    ],
  },
};

export default function BookPage() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Page hero                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative bg-ivory overflow-hidden pt-10 pb-4 md:pt-14 md:pb-6 lg:pt-16 lg:pb-8">
        <Container className="relative z-10">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            {/* Text */}
            <div className="space-y-5 lg:pr-8">
              <span className="text-label uppercase tracking-widest text-rose">
                Book a fitting
              </span>
              <h1 className="font-display text-display-sm md:text-display text-ink text-balance">
                Bring your dress to the studio
              </h1>
              <div className="h-px w-16 bg-gold" aria-hidden="true" />
              <p className="text-body text-ink-muted max-w-xl text-pretty">
                Whether you need alterations, a custom piece, or an initial consultation,
                fill in the form and we will confirm your appointment within one
                working day.
              </p>
              <ul className="space-y-2 text-small text-ink-muted" aria-label="Booking assurances">
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-rose shrink-0" aria-hidden="true" />
                  Every booking is confirmed personally
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-rose shrink-0" aria-hidden="true" />
                  Cancellation accepted up to 24 hours before
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-rose shrink-0" aria-hidden="true" />
                  Free initial consultations available
                </li>
              </ul>
            </div>

            {/* Image */}
            <div className="relative w-full overflow-hidden rounded-2xl aspect-square lg:aspect-4/5 lg:max-h-140">
              <Image
                src="/assets/hero/bride-white-umbrella-interior.jpg"
                alt="A bride in a white gown photographed inside a bright studio interior, ready for a fitting"
                fill
                priority
                fetchPriority="high"
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAABQUlEQVR4nAE2Acn+AFZPT2NYV3xpaZN6ep+Kiqubm6ykpq2qraimrJuZngBbVFRtYGBtW1p6ZGKGcXGLfHyspae4tLizr7aloqcAW1NTZlhYIhEOKhkXWEVFSDs6o5udx8PHvr3CsK60ADwxMWVaVw0AAD8xLnNkYldLS7WusMS+xMC+xLSyuQBOREZiVlUOAQAhFQ64qqlPRkSYkJPIwse6uL6xr7UAUkdITkJBRTk2WlFL0cjE08zKpp+gubK5r62zpqOqAD0yMisjIUg+O42Gf87Hwv/8+L+7vaKcoqmnrZ+dowAcDxEgFxN3bmqXkYvCvrns5+Pl4OGblJqFgod4dn0AQDk3d3Ftn5uXm5WTtrOw4N/f7Ors1NHSs7GyamhpAIiCf6CalpiUj6qmpaqmpc7MzNXS1NnX2NTQ0aajppTVn5566m1zAAAAAElFTkSuQmCC"
                placeholder="blur"
              />
            </div>
          </div>
        </Container>

        {/* Subtle grain texture — decorative */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Booking wizard                                                       */}
      {/* ------------------------------------------------------------------ */}
      <Section tone="ivory" spacing="md">
        <Container>
          <BookingWizard />
        </Container>
      </Section>
    </>
  );
}
