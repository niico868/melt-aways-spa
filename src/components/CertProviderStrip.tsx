import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { INSTITUTIONS, CATEGORY_PILLS, CERT_COUNT } from "@/lib/certifications";

// Doubled list creates a seamless loop for the CSS marquee.
const SKILL_LOOP = [...CATEGORY_PILLS, ...CATEGORY_PILLS];
const INSTITUTION_LOOP = [...INSTITUTIONS, ...INSTITUTIONS];

export function CertProviderStrip() {
  return (
    <section className="relative bg-gradient-to-b from-background to-blush/20 py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary/80">
              <ShieldCheck className="w-4 h-4" /> Credentialed Care
            </p>
            <h2 className="mt-4 font-serif text-3xl lg:text-5xl text-ink leading-[1.1]">
              Professionally Trained.
              <span className="block italic text-primary">Continuously Certified.</span>
            </h2>
            <p className="mt-5 text-taupe leading-relaxed">
              Your treatments are performed by practitioners who continue investing in
              internationally recognized education and advanced aesthetic training.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 text-center">
            <div className="font-serif text-6xl lg:text-7xl text-primary leading-none">
              <CountUp value={CERT_COUNT} />
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.25em] text-taupe">
              Professional Certifications
            </div>
          </div>
        </Reveal>

        <div className="mt-10 text-center">
          <Link
            to="/certifications"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
          >
            View All Certifications <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Skills marquee — auto-scrolls left to right at a moderate speed */}
      <div
        className="mt-14 relative overflow-hidden py-4 border-y border-border/60 bg-background/60"
        aria-label="Certified subject areas"
      >
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
          {SKILL_LOOP.map((skill, i) => (
            <span key={`${skill}-${i}`} className="flex items-center gap-8">
              <span className="text-sm lg:text-base tracking-wide uppercase text-ink/80">
                {skill}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/70" aria-hidden />
            </span>
          ))}
        </div>
      </div>

      {/* Institutions floating logo bar — moderate scroll, opposite direction */}
      <div
        className="mt-6 relative overflow-hidden py-5 bg-blush/25"
        aria-label="Training institutions"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-blush/60 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-blush/60 to-transparent z-10" />
        <div className="flex w-max animate-marquee-slow items-center gap-16">
          {INSTITUTION_LOOP.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="shrink-0 h-14 min-w-[220px] px-6 rounded-2xl bg-background border border-border/60 shadow-sm flex items-center justify-center"
            >
              <span className="font-serif text-sm lg:text-base tracking-wide text-taupe/80 whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
