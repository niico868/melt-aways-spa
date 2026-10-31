import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { PACKAGES } from "@/lib/site";

export const Route = createFileRoute("/packages")({
  head: () => ({ meta: [
    { title: "Treatment Packages — Melt Aways" },
    { name: "description", content: "Curated treatment packages: Sculpt & Smooth, Melt & Tighten, Glow & Firm, Full Body Confidence, Wellness Reset." },
  ]}),
  component: Packages,
});

function Packages() {
  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-16">
        <Eyebrow>Treatment Packages</Eyebrow>
        <h1 className="text-4xl lg:text-6xl font-light text-ink leading-tight">Plans built for your goals.</h1>
        <p className="mt-5 text-taupe">Not every treatment is right for every body. We start with consultation, then recommend the best direction based on your goals, timeline, and health history.</p>
      </div>

      {/* Your Melt Aways Experience */}
      <div className="max-w-5xl mx-auto bg-cream rounded-3xl p-8 lg:p-10 mb-14">
        <div className="text-center mb-8">
          <p className="font-script text-3xl text-gold leading-none">Your Journey</p>
          <h2 className="mt-1 text-2xl lg:text-3xl text-ink">Your Melt Aways Experience</h2>
        </div>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Submit your treatment interest",
            "Complete your consultation form",
            "Speak with our team by WhatsApp or call",
            "Choose your treatment plan",
            "Visit Woodbrook or St. Augustine",
            "Complete your sessions and aftercare",
          ].map((step, i) => (
            <li key={step} className="bg-background rounded-2xl p-5 border border-border/60 flex gap-3">
              <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium flex items-center justify-center text-sm">{i + 1}</span>
              <span className="text-sm text-ink leading-snug">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        {PACKAGES.map(p => (
          <article key={p.name} className="bg-background rounded-2xl px-6 py-5 lg:px-8 lg:py-6 border border-border/60 card-shadow flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="lg:w-1/3">
              <h3 className="text-xl lg:text-2xl text-ink leading-snug">{p.name} Package</h3>
              <p className="mt-1.5 text-sm text-taupe leading-relaxed">{p.desc}</p>
            </div>
            <div className="lg:w-1/3">
              <div className="text-[11px] uppercase tracking-wider text-primary">Best for</div>
              <p className="text-sm text-ink">{p.bestFor}</p>
              <div className="mt-2 text-[11px] uppercase tracking-wider text-primary">Includes</div>
              <ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-3 text-sm text-ink">
                {p.includes.map(i => <li key={i} className="flex gap-1.5"><Check className="w-3.5 h-3.5 text-primary mt-1" />{i}</li>)}
              </ul>
            </div>
            <div className="lg:w-1/3 lg:text-right flex flex-col gap-2 lg:items-end">
              <span className="text-xs text-taupe italic">Price shared after consultation</span>
              <Link to="/booking" search={{ service: p.name }} className="inline-flex justify-center rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium soft-shadow hover:opacity-90 transition">
                Book Consultation
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}