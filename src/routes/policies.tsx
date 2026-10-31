import { createFileRoute } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/Section";
import { POLICIES } from "@/lib/site";

export const Route = createFileRoute("/policies")({
  head: () => ({ meta: [
    { title: "Policies — Melt Aways" },
    { name: "description", content: "Booking, consultation, deposit, cancellation, refund and privacy policies for Melt Aways." },
  ]}),
  component: Policies,
});

function Policies() {
  return (
    <Section className="max-w-4xl">
      <div className="text-center mb-14">
        <Eyebrow>Policies</Eyebrow>
        <h1 className="text-4xl lg:text-5xl font-light text-ink">Our policies.</h1>
        <p className="mt-4 text-sm text-taupe italic">Final policy approval pending. Sections will be finalised with the client.</p>
      </div>
      <div className="space-y-6">
        {POLICIES.map(p => (
          <div key={p.title} className="bg-background rounded-3xl border border-border/60 p-7 card-shadow">
            <h2 className="text-xl text-ink">{p.title}</h2>
            <p className="mt-2 text-taupe leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}