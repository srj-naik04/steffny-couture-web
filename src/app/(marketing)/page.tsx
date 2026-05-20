import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { BRAND } from '@/constants/brand';

export default function HomePage() {
  return (
    <>
      <Section tone="ivory" spacing="lg">
        <Container>
          <div className="max-w-3xl">
            <span className="text-label text-ink-muted tracking-widest uppercase">
              Crafted in London
            </span>
            <h1 className="font-display text-hero-sm md:text-hero text-ink mt-4 text-balance">
              {BRAND.tagline}
            </h1>
            <div className="bg-gold mt-6 h-px w-24" />
            <p className="text-body-lg text-ink-muted mt-8 max-w-xl text-pretty">
              Bespoke couture and alterations, hand-finished in our Hounslow studio. The
              site is still taking shape — the collection lands shortly.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/dresses" variant="primary">
                View dresses
              </Button>
              <Button href="/book" variant="secondary">
                Book a fitting
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="surface" spacing="md">
        <Container>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                label: 'Couture',
                title: 'Made to measure',
                body: 'Custom pieces drafted to your shape, your fabric, your occasion.',
              },
              {
                label: 'Alterations',
                title: 'Tailored to fit',
                body: 'Wedding, bridal party, evening — adjusted so the cut is yours.',
              },
              {
                label: 'Ready to wear',
                title: 'From the studio',
                body: 'A curated rail of pieces ready for fittings and final hems.',
              },
            ].map((item) => (
              <div key={item.title} className="space-y-3">
                <span className="text-label text-rose tracking-widest uppercase">
                  {item.label}
                </span>
                <h2 className="font-display text-title text-ink">{item.title}</h2>
                <p className="text-body text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
