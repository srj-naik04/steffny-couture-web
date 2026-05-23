'use client';

/**
 * RevealOnScroll — Phase 3 (cycle-2 fix)
 *
 * Uses Framer Motion whileInView + viewport.once for a robust scroll-triggered
 * entrance animation. This is more reliable than the manual useInView pattern
 * because Framer Motion handles the IntersectionObserver lifecycle correctly.
 *
 * Choice rationale: whileInView avoids the bug where content stays at opacity:0
 * if useInView fires before the ref is attached, or if animate fires before JS
 * hydrates. With whileInView the element is rendered at its initial state (hidden)
 * and the browser's IntersectionObserver triggers the animation once in view.
 *
 * Reduced-motion: useReducedMotion returns a static visible div — no flicker.
 */

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before the animation starts once in view */
  delay?: number;
  /** Amount of element that must be visible before triggering (0–1) */
  threshold?: number;
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  threshold = 0.15,
}: RevealOnScrollProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
