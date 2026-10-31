import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Melt Aways — Personalized Body Contouring in Trinidad & Tobago" },
      { name: "description", content: "Learn about Melt Aways: our mission, values, and consultation-led philosophy for body contouring and wellness in Trinidad & Tobago." },
      { property: "og:title", content: "About Melt Aways" },
      { property: "og:description", content: "A space where clients feel seen, respected, and guided." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const values = [
    "We lead with care.",
    "We protect your privacy.",
    "We honour every body.",
    "We guide with honesty.",
    "We treat with skill, patience, and intention.",
    "We celebrate progress that feels real.",
  ];
  return (
    <Section>
      <div className="max-w-3xl mx-auto text-center">
        <Eyebrow>About Melt Aways</Eyebrow>
        <h1 className="font-serif text-4xl lg:text-6xl text-ink leading-tight">
          A space where clients feel <em className="not-italic text-primary">seen, respected, and guided</em>.
        </h1>
        <p className="mt-6 text-taupe leading-relaxed">
          Melt Aways exists to give women and men a place where they can talk about their body and
          their goals without judgement. We focus on clear guidance, personal attention, and treatment
          plans built around your comfort, your confidence, and the results you want to achieve.
        </p>
      </div>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
        <Reveal direction="left" className="bg-background border border-border/60 rounded-3xl p-7 card-shadow">
          <div className="text-xs uppercase tracking-[0.22em] text-primary/70 mb-2">Mission</div>
          <p className="text-ink/90 leading-relaxed">
            To make non-surgical body and wellness care feel personal, private, and results-focused —
            delivered by trained treatment specialists who listen first, guide honestly, and help
            every client feel more confident in their own body.
          </p>
        </Reveal>
        <Reveal direction="up" className="bg-background border border-border/60 rounded-3xl p-7 card-shadow">
          <div className="text-xs uppercase tracking-[0.22em] text-primary/70 mb-2">Values</div>
          <ul className="space-y-2 text-ink/90">
            {values.map((v) => (
              <li key={v} className="flex gap-2.5 leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden />
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal direction="right" className="bg-background border border-border/60 rounded-3xl p-7 card-shadow">
          <div className="text-xs uppercase tracking-[0.22em] text-primary/70 mb-2">Philosophy</div>
          <p className="text-ink/90 leading-relaxed">
            Melt Aways care begins with understanding the person, not just the treatment. We welcome
            all bodies, listen without judgement, and create safe, personalized treatment plans that
            support confidence, comfort, and real progress.
          </p>
        </Reveal>
      </div>
      <div className="mt-14 text-center">
        <Link to="/booking" className="inline-flex items-center gap-2 rounded-full bg-fresh text-fresh-foreground px-7 py-4 font-medium soft-shadow lift-on-hover">
          Book a Consultation <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Section>
  );
}