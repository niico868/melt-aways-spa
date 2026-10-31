import type { Variants, Transition } from "framer-motion";

export const easeLux: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -64, filter: "blur(8px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)" },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 64, filter: "blur(8px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)" },
};

export const slideInScale: Variants = {
  hidden: { opacity: 0, y: 56, scale: 0.94, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
};

export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 40 },
  show: { opacity: 1, scale: 1, y: 0 },
};

export const staggerParent = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const baseTransition: Transition = { duration: 1.0, ease: easeLux };
export const slowTransition: Transition = { duration: 1.3, ease: easeLux };

// `amount: "some"` fires whenever any part of the element enters the viewport.
// Using a numeric amount (e.g. 0.25) breaks on mobile for sections taller than
// the viewport — 25% of the element is never visible at once, so the Reveal
// wrapper stays hidden and the section renders as blank white space.
export const viewportOnce = { once: true, amount: "some" } as const;