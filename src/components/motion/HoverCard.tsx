import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { easeLux } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  lift?: number;
};

export function HoverCard({ children, className, lift = 4 }: Props) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -lift, scale: 1.01 }}
      transition={{ duration: 0.3, ease: easeLux }}
    >
      {children}
    </motion.div>
  );
}