import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, baseTransition, staggerParent, viewportOnce } from "@/lib/motion";

type Props = {
  lines: ReactNode[];
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
};

/**
 * Reveals an array of lines/spans with a staggered upward fade.
 * Wrap each line in its own JSX node — the component handles overflow & motion.
 */
export function RevealText({ lines, className, stagger = 0.1, delay = 0, as = "h1" }: Props) {
  const Outer: any = (motion as any)[as] ?? motion.h1;
  return (
    <Outer
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={staggerParent(stagger, delay)}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block will-change-transform"
            variants={fadeUp}
            transition={baseTransition}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Outer>
  );
}