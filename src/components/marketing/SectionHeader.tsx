import { cn } from '@/lib/cn';

interface SectionHeaderProps {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  headline,
  subhead,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-2xl space-y-4',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <span className="text-label text-rose tracking-widest uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-display-sm md:text-display text-ink text-balance">
        {headline}
      </h2>
      {subhead && (
        <p className="text-body-lg text-ink-muted text-pretty">{subhead}</p>
      )}
    </div>
  );
}
