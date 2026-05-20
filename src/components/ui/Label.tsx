import * as React from 'react';
import { cn } from '@/lib/cn';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, children, ...rest }: LabelProps) {
  return (
    <label
      className={cn('text-label text-ink-muted block tracking-widest uppercase', className)}
      {...rest}
    >
      {children}
    </label>
  );
}
