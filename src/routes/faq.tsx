import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { FAQS } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: "FAQ — Melt Aways" },
    { name: "description", content: "Common questions about consultations, treatments, results, and booking at Melt Aways." },
  ]}),
  component: Faq,
});

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section className="max-w-3xl">
      <div className="text-center mb-12">
        <Eyebrow>Questions</Eyebrow>
        <h1 className="text-4xl lg:text-5xl font-light text-ink">Things clients often ask.</h1>
      </div>
      <div className="divide-y divide-border border-y border-border">
        {FAQS.map((f, i) => (
          <div key={f.q} className="py-5">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 text-left">
              <span className="text-lg text-ink">{f.q}</span>
              {open === i ? <Minus className="w-5 h-5 text-primary shrink-0" /> : <Plus className="w-5 h-5 text-primary shrink-0" />}
            </button>
            {open === i && <p className="mt-3 text-taupe leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}
