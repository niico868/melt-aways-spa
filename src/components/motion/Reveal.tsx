import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, fadeLeft, fadeRight, slideInScale, baseTransition, viewportOnce } from "@/lib/motion";

type Props = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  variants?: Variants;
  direction?: "up" | "left" | "right" | "scale";
  as?: "div" | "section" | "li" | "article" | "span";
};

export function Reveal({
  children,
  delay = 0,
  duration,
  className,
  variants,
  direction = "up",
  as = "div",
}: Props) {
  const Comp: any = (motion as any)[as] ?? motion.div;
  const picked =
    variants ??
    (direction === "left" ? fadeLeft :
     direction === "right" ? fadeRight :
     direction === "scale" ? slideInScale :
     fadeUp);
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={picked}
      transition={{ ...baseTransition, delay, ...(duration ? { duration } : {}) }}
    >
      {children}
    </Comp>
  );
}