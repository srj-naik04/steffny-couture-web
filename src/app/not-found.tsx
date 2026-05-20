import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex flex-1 items-center">
        <Container>
          <div className="mx-auto max-w-xl py-24 text-center md:py-32">
            <span className="text-label text-ink-muted tracking-widest uppercase">
              404
            </span>
            <h1 className="font-display text-display-sm md:text-display text-ink mt-4">
              We couldn&rsquo;t find that page.
            </h1>
            <p className="text-body-lg text-ink-muted mt-6">
              The link may be old, or the page has moved. Try our collection or get in
              touch with the studio.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href="/" variant="primary">
                Back to home
              </Button>
              <Button href="/dresses" variant="secondary">
                View dresses
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
