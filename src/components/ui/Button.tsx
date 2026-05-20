import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-body font-medium ' +
  'transition-colors duration-200 select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-rose text-ivory hover:bg-rose-dark active:scale-[0.98]',
  secondary:
    'bg-surface text-ink border border-border-strong hover:bg-surface-alt active:scale-[0.98]',
  ghost:
    'bg-transparent text-ivory border border-ivory/40 hover:bg-ivory/10 active:scale-[0.98]',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-7 text-base',
  lg: 'h-14 px-9 text-base',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | 'href'> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', fullWidth, className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);

  if ('href' in props && props.href) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, variant: _v, size: _s, fullWidth: _fw, className: _c, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, fullWidth: _fw, className: _c, children: _ch, ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
