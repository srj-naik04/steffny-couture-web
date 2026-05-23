/**
 * Prose — Phase 3
 *
 * Server component. Wraps rich text content with consistent typography:
 * max-w-prose, body font, relaxed leading, styled headings.
 * Used on about page and service pages for narrative body copy.
 */

import { cn } from '@/lib/cn';

interface ProseProps {
  children: React.ReactNode;
  className?: string;
}

export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        'max-w-prose',
        // Body
        'text-body text-ink-muted leading-relaxed',
        // Headings
        '[&_h2]:font-display [&_h2]:text-title [&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-4',
        '[&_h3]:font-display [&_h3]:text-headline [&_h3]:text-ink [&_h3]:mt-8 [&_h3]:mb-3',
        // Paragraphs
        '[&_p]:mb-6 [&_p:last-child]:mb-0',
        // Lists
        '[&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mb-2',
        '[&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mb-2',
        // Strong
        '[&_strong]:font-semibold [&_strong]:text-ink',
        className,
      )}
    >
      {children}
    </div>
  );
}
