import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue } from "framer-motion";

type Line = { text: string; italic?: boolean };

/**
 * Scroll-pinned headline: the section pins to the viewport while the user
 * scrolls, revealing characters of the headline as scroll progresses. Scroll
 * up un-reveals it. Implemented with a tall outer container + sticky inner.
 */
export function ScrollPinHeadline({ lines, className }: { lines: Line[]; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  // Total characters across all lines.
  const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0);
  // Map scroll progress 0.05 → 0.85 onto character count, so there's a small
  // settling buffer at top/bottom of the pin.
  const revealedRaw = useTransform(scrollYProgress, [0.05, 0.85], [0, totalChars]);
  const revealed = useMotionValue(0);
  useMotionValueEvent(revealedRaw, "change", (v) => revealed.set(Math.round(v)));

  // For each line, compute its starting char offset.
  let offset = 0;
  const lineMeta = lines.map((l) => {
    const start = offset;
    offset += l.text.length;
    return { ...l, start };
  });

  return (
    <div ref={wrapRef} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center px-5 lg:px-12">
        <h2 className={className}>
          {lineMeta.map((l, i) => (
            <Char key={i} text={l.text} start={l.start} italic={l.italic} revealed={revealed} />
          ))}
        </h2>
      </div>
    </div>
  );
}

function Char({
  text,
  start,
  italic,
  revealed,
}: {
  text: string;
  start: number;
  italic?: boolean;
  revealed: import("framer-motion").MotionValue<number>;
}) {
  const Tag: any = italic ? "em" : "span";
  return (
    <Tag className={`block ${italic ? "not-italic italic text-primary" : ""}`}>
      {text.split("").map((ch, idx) => {
        const charIndex = start + idx;
        return <CharSpan key={idx} ch={ch} index={charIndex} revealed={revealed} />;
      })}
    </Tag>
  );
}

function CharSpan({
  ch,
  index,
  revealed,
}: {
  ch: string;
  index: number;
  revealed: import("framer-motion").MotionValue<number>;
}) {
  const opacity = useTransform(revealed, (v) => (v > index ? 1 : 0.08));
  const y = useTransform(revealed, (v) => (v > index ? 0 : 8));
  return (
    <motion.span style={{ opacity, y, display: "inline-block" }}>
      {ch === " " ? "\u00A0" : ch}
    </motion.span>
  );
}