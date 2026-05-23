import * as React from 'react';
import { cn } from '@/lib/cn';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'block h-12 w-full rounded-lg px-4',
        'bg-surface-alt text-ink placeholder:text-ink-muted text-base',
        'border-border focus:border-rose border',
        'focus-visible:ring-rose focus-visible:ring-offset-ivory focus-visible:ring-2 focus-visible:ring-offset-2',
        'transition-colors duration-200',
        error && 'border-danger focus:border-danger focus:ring-danger',
        className,
      )}
      {...rest}
    />
  );
});
