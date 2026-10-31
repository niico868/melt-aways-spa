import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles, MessageCircle } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { saveLead, waLink, PACKAGES } from "@/lib/site";
import { postEnquiry } from "@/lib/booking-api";
import {
  FINDER_GOALS, FINDER_AREAS, suggestPackage, qualifiesForConsult, toLead,
  type FinderAnswers,
} from "@/lib/treatment-finder";
import { easeLux } from "@/lib/motion";

export const Route = createFileRoute("/treatment-finder")({
  head: () => ({
    meta: [
      { title: "Treatment Finder — Personalized Treatment Match | Melt Aways" },
      { name: "description", content: "Answer a few quick questions about your goals, concerns, and timeline. We'll suggest the right Melt Aways treatment path and tell you if you qualify for a free consultation." },
      { property: "og:title", content: "Melt Aways · Treatment Finder" },
      { property: "og:description", content: "Personalized body, skin & wellness treatment recommendations — built around your goals." },
    ],
  }),
  component: TreatmentFinderPage,
});

const EMPTY: FinderAnswers = {
  fullName: "", email: "", phone: "", age: "",
  goals: [], targetAreas: [], timeline: "",
  concerns: "", pregnancy: "", medications: "", preferredDate: "",
};

const STEPS = ["About you", "Your goals", "Target areas", "Your timeline", "Health & safety", "Preferred date"] as const;

function TreatmentFinderPage() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<FinderAnswers>(EMPTY);
  const [done, setDone] = useState<null | { suggested: string; qualifies: boolean }>(null);

  const total = STEPS.length;
  const progress = ((step + 1) / total) * 100;

  function update<K extends keyof FinderAnswers>(k: K, v: FinderAnswers[K]) {
    setA((s) => ({ ...s, [k]: v }));
  }
  function toggle(field: "goals" | "targetAreas", v: string) {
    setA((s) => {
      const has = s[field].includes(v);
      return { ...s, [field]: has ? s[field].filter((x) => x !== v) : [...s[field], v] };
    });
  }

  async function submit() {
    const suggested = suggestPackage(a);
    const qualifies = qualifiesForConsult(a);
    try { saveLead(toLead(a, suggested)); } catch {}
    setDone({ suggested, qualifies });
    try {
      await fetch("/api/public/submit-consultation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          full_name: a.fullName,
          phone: a.phone,
          email: a.email,
          concern: a.concerns,
          areas: a.targetAreas.join(", "),
          notes: [
            a.goals.length && `Goals: ${a.goals.join(", ")}`,
            a.timeline && `Timeline: ${a.timeline}`,
            a.medications && `Medications: ${a.medications}`,
            a.pregnancy && `Pregnancy: ${a.pregnancy}`,
          ].filter(Boolean).join("\n"),
          preferred_date: a.preferredDate,
          suggested_package: suggested,
        }),
      });
    } catch { /* non-blocking */ }
    // Also forward the enquiry to the salon booking API (non-blocking, silent on failure)
    void postEnquiry({
      source: "treatment-finder",
      name: a.fullName,
      phone: a.phone,
      email: a.email,
      message: [
        `Suggested plan: ${suggested}`,
        a.goals.length && `Goals: ${a.goals.join(", ")}`,
        a.targetAreas.length && `Target areas: ${a.targetAreas.join(", ")}`,
        a.timeline && `Timeline: ${a.timeline}`,
        a.age && `Age: ${a.age}`,
        a.concerns && `Concerns: ${a.concerns}`,
        a.medications && `Medications: ${a.medications}`,
        a.pregnancy && `Pregnancy: ${a.pregnancy}`,
        a.preferredDate && `Preferred date: ${a.preferredDate}`,
      ].filter(Boolean).join(". "),
    });
  }

  const canNext = (() => {
    switch (step) {
      case 0: return a.fullName.trim().length > 1 && a.phone.length >= 7;
      case 1: return a.goals.length > 0;
      case 2: return a.targetAreas.length > 0;
      case 3: return a.timeline !== "";
      case 4: return a.pregnancy !== "";
      case 5: return true;
      default: return false;
    }
  })();

  if (done) {
    const pkg = PACKAGES.find((p) => p.name === done.suggested);
    const message = `Hi Melt Aways, I just completed the Treatment Finder. My suggested plan is ${done.suggested}. I'd love to book a consultation.`;
    return (
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: easeLux }}
          className="max-w-2xl mx-auto bg-background border border-border/60 rounded-[2.5rem] p-10 lg:p-14 card-shadow text-center"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-fresh/15 text-fresh-foreground flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <Eyebrow>Your Match</Eyebrow>
          <h1 className="font-serif text-3xl lg:text-5xl text-ink leading-tight">
            Suggested plan: <em className="not-italic text-primary">{done.suggested}</em>
          </h1>
          {pkg && (
            <p className="mt-4 text-taupe leading-relaxed">{pkg.desc}</p>
          )}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-blush px-4 py-2 text-sm text-primary">
            <Check className="w-4 h-4" />
            {done.qualifies
              ? "You qualify for a free 1:1 consultation."
              : "A consultation is required to confirm suitability."}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/booking" className="inline-flex items-center gap-2 rounded-full bg-fresh text-fresh-foreground px-7 py-4 font-medium btn-lux soft-shadow">
              Book Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={waLink(message)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-7 py-4 font-medium hover:opacity-90 lift-on-hover">
              <MessageCircle className="w-4 h-4" /> Continue on WhatsApp
            </a>
          </div>
        </motion.div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="max-w-2xl mx-auto">
        <Eyebrow>Treatment Finder</Eyebrow>
        <h1 className="font-serif text-3xl lg:text-5xl text-ink leading-tight">
          Let's point you in the right direction.
        </h1>
        <p className="mt-3 text-taupe">A short intake — about 90 seconds. Step {step + 1} of {total}: {STEPS[step]}.</p>

        {/* progress bar */}
        <div className="mt-6 h-1 w-full bg-blush rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: easeLux }} />
        </div>

        <div className="mt-10 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 60, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -60, filter: "blur(8px)" }}
              transition={{ duration: 0.55, ease: easeLux }}
            >
              {step === 0 && (
                <div className="grid gap-4">
                  <Field label="Full name"><input className={input} value={a.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Your name" /></Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Email"><input className={input} type="email" value={a.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" /></Field>
                    <Field label="Phone (WhatsApp)"><input className={input} value={a.phone} onChange={e => update("phone", e.target.value)} placeholder="+1 868 ..." /></Field>
                  </div>
                  <Field label="Age range (optional)"><input className={input} value={a.age} onChange={e => update("age", e.target.value)} placeholder="e.g. 32" /></Field>
                </div>
              )}
              {step === 1 && <ChipGrid options={FINDER_GOALS} value={a.goals} onToggle={(v) => toggle("goals", v)} />}
              {step === 2 && <ChipGrid options={FINDER_AREAS} value={a.targetAreas} onToggle={(v) => toggle("targetAreas", v)} />}
              {step === 3 && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { v: "under-1-month", label: "Under 1 month" },
                    { v: "1-3-months", label: "1 – 3 months" },
                    { v: "3-6-months", label: "3 – 6 months" },
                    { v: "flexible", label: "I'm flexible" },
                  ].map(o => (
                    <button key={o.v} onClick={() => update("timeline", o.v as any)} className={`text-left p-4 rounded-2xl border transition-all ${a.timeline === o.v ? "border-primary bg-blush/40" : "border-border/60 hover:border-primary/40"}`}>
                      <div className="font-medium text-ink">{o.label}</div>
                    </button>
                  ))}
                </div>
              )}
              {step === 4 && (
                <div className="grid gap-5">
                  <Field label="Are you currently pregnant or breastfeeding?">
                    <div className="flex flex-wrap gap-2">
                      {[{v:"no",label:"No"},{v:"yes",label:"Yes"},{v:"na",label:"Prefer not to say"}].map(o => (
                        <button key={o.v} onClick={() => update("pregnancy", o.v as any)} className={`px-4 py-2 rounded-full text-sm border ${a.pregnancy === o.v ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/40"}`}>{o.label}</button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Concerns, conditions, or notes"><textarea rows={3} className={input} value={a.concerns} onChange={e => update("concerns", e.target.value)} placeholder="Anything we should know — recent surgery, allergies, etc." /></Field>
                  <Field label="Current medications (optional)"><input className={input} value={a.medications} onChange={e => update("medications", e.target.value)} placeholder="Optional" /></Field>
                </div>
              )}
              {step === 5 && (
                <Field label="Preferred consultation date (optional)">
                  <input type="date" className={input} value={a.preferredDate} onChange={e => update("preferredDate", e.target.value)} />
                </Field>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-sm text-taupe disabled:opacity-30 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < total - 1 ? (
            <button
              onClick={() => canNext && setStep(s => s + 1)}
              disabled={!canNext}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium disabled:opacity-40 hover:opacity-90 lift-on-hover"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submit}
              className="inline-flex items-center gap-2 rounded-full bg-fresh text-fresh-foreground px-7 py-3 text-sm font-medium btn-lux soft-shadow"
            >
              See My Match <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Section>
  );
}

const input = "w-full rounded-xl border border-border bg-background px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-[0.18em] text-primary/70 mb-2">{label}</div>
      {children}
    </label>
  );
}

function ChipGrid({ options, value, onToggle }: { options: readonly string[]; value: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map(o => {
        const active = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={`px-4 py-2.5 rounded-full text-sm border transition-all ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/40 hover:bg-blush/40"}`}
          >
            {active && <Check className="inline-block w-3.5 h-3.5 mr-1.5 -mt-0.5" />}
            {o}
          </button>
        );
      })}
    </div>
  );
}