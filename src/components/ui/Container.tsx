import * as React from 'react';
import { cn } from '@/lib/cn';

type ContainerSize = 'narrow' | 'default' | 'wide';

const sizes: Record<ContainerSize, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1536px]',
};

type ContainerProps = {
  size?: ContainerSize;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'children'>;

export function Container({
  size = 'default',
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-5 sm:px-6 lg:px-12', sizes[size], className)}
      {...rest}
    >
      {children}
    </div>
  );
}
