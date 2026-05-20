import type { Transition, Variants } from 'framer-motion';

export const easeOut: Transition['ease'] = [0.4, 0, 0.2, 1];
export const easeStandard: Transition['ease'] = [0.25, 0.1, 0.25, 1];
export const easePage: Transition['ease'] = [0.6, 0.05, 0.01, 0.99];

export const dur = {
  micro: 0.2,
  default: 0.4,
  slow: 0.6,
  page: 0.6,
} as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.default, ease: easeStandard },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.default, ease: easeStandard },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.default, ease: easeStandard },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: dur.default, ease: easeStandard },
  },
};

export const drawerRight: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.3, ease: easeOut },
  },
  exit: {
    x: '100%',
    transition: { duration: dur.micro, ease: easeOut },
  },
};

export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: dur.micro } },
  exit: { opacity: 0, transition: { duration: dur.micro } },
};
