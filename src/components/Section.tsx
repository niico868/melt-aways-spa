import { ReactNode } from "react";

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-5 lg:px-10 py-20 lg:py-28 ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="script-eyebrow text-gold mb-3">{children}</p>;
}