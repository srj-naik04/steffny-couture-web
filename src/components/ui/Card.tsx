import * as React from 'react';
import { cn } from '@/lib/cn';

type CardProps = {
  as?: 'div' | 'article' | 'section';
  className?: string;
  children: React.ReactNode;
};

export function Card({ as = 'article', className, children }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'bg-surface border-border rounded-lg border p-6 md:p-8',
        'transition-shadow duration-200 hover:shadow-md',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
