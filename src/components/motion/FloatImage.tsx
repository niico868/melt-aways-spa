import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
};

/** Subtle floating wrapper — disabled for reduced motion. */
export function FloatImage({ children, className, amplitude = 8, duration = 7 }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
}