import * as React from 'react';
import { cn } from '@/lib/cn';

type Tone = 'ivory' | 'surface' | 'surface-alt' | 'ink';
type Spacing = 'sm' | 'md' | 'lg';

const tones: Record<Tone, string> = {
  ivory: 'bg-ivory text-ink',
  surface: 'bg-surface text-ink',
  'surface-alt': 'bg-surface-alt text-ink',
  ink: 'bg-ink text-ivory',
};

const spacings: Record<Spacing, string> = {
  sm: 'py-8 md:py-10',
  md: 'py-10 md:py-14 lg:py-16',
  lg: 'py-14 md:py-18 lg:py-20',
};

type SectionProps = {
  tone?: Tone;
  spacing?: Spacing;
  className?: string;
  children: React.ReactNode;
  id?: string;
};

export function Section({
  tone = 'ivory',
  spacing = 'md',
  className,
  children,
  id,
}: SectionProps) {
  return (
    <section id={id} className={cn(tones[tone], spacings[spacing], className)}>
      {children}
    </section>
  );
}
