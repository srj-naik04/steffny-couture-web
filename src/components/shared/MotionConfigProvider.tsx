'use client';

import { MotionConfig } from 'framer-motion';
import * as React from 'react';

export function MotionConfigProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
