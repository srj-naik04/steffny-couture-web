import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { BRAND } from '@/constants/brand';

type LogoProps = {
  tone?: 'ink' | 'ivory';
  className?: string;
};

export function Logo({ tone = 'ink', className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${BRAND.name} home`}
      className={cn(
        'font-display inline-flex flex-col leading-none',
        tone === 'ink' ? 'text-ink' : 'text-ivory',
        className,
      )}
    >
      <span className="text-xl font-bold tracking-tight md:text-2xl">Steffny</span>
      <span className="text-label mt-1 tracking-widest uppercase opacity-80">Couture</span>
    </Link>
  );
}
