import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, baseTransition, staggerParent, viewportOnce } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "section";
};

export function Stagger({ children, className, stagger = 0.09, delay = 0, as = "div" }: Props) {
  const Comp: any = (motion as any)[as] ?? motion.div;
  const arr = Array.isArray(children) ? children : [children];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={staggerParent(stagger, delay)}
    >
      {arr.map((child, i) => (
        <motion.div key={i} variants={fadeUp} transition={baseTransition}>
          {child}
        </motion.div>
      ))}
    </Comp>
  );
}