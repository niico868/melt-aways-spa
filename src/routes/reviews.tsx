import { createFileRoute } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/Section";
import { REVIEWS } from "@/lib/site";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [
    { title: "Reviews — Melt Aways" },
    { name: "description", content: "Real stories from Melt Aways clients in Trinidad & Tobago." },
  ]}),
  component: Reviews,
});

function Reviews() {
  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-16">
        <Eyebrow>Kind Words</Eyebrow>
        <h1 className="text-4xl lg:text-6xl font-light text-ink">Reviews from our clients.</h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REVIEWS.map(r => (
          <div key={r.initials} className="bg-background rounded-3xl p-8 card-shadow border border-border/60">
            <div className="text-gold text-3xl font-script mb-2 leading-none">"</div>
            <p className="text-ink/90 leading-relaxed">{r.text}</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center text-sm font-medium text-primary">{r.initials}</div>
              <div className="text-xs"><div className="font-medium">{r.initials}</div><div className="text-taupe">{r.service}</div></div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}