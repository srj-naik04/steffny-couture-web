/**
 * Journal post not-found — Phase 7
 */

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export default function JournalPostNotFound() {
  return (
    <Section tone="ivory" spacing="lg">
      <Container size="narrow">
        <div className="text-center space-y-6">
          <span className="text-label text-rose tracking-widest uppercase">
            Post not found
          </span>
          <h1 className="font-display text-display-sm text-ink">
            This post could not be found
          </h1>
          <div className="bg-gold mx-auto h-px w-16" aria-hidden="true" />
          <p className="text-body text-ink-muted text-pretty max-w-md mx-auto">
            The post you are looking for may have been moved or does not exist.
            Browse all posts in the journal to find what you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/journal" variant="primary">
              Browse the journal
            </Button>
            <Button href="/" variant="secondary">
              Return home
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
