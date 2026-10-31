import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plane, MessageCircle, Check } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { CONCIERGE_WA, CONCIERGE_MESSAGE, waLink, waClick } from "@/lib/site";
import { postEnquiry } from "@/lib/booking-api";

export const Route = createFileRoute("/visiting")({
  head: () => ({ meta: [
    { title: "Visiting Trinidad — Plan Your Treatment | Melt Aways" },
    { name: "description", content: "Visiting Trinidad for Carnival, Christmas, Summer Trips, or Weddings? Book your consultation before you arrive and let our team plan the right treatment schedule." },
    { property: "og:title", content: "Visiting Trinidad — Plan Your Treatment | Melt Aways" },
    { property: "og:description", content: "Plan body sculpting, skin tightening and facial treatments before you land in Trinidad." },
  ]}),
  component: Visiting,
});

function Visiting() {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", country: "", arrival: "", departure: "", occasion: "", interest: "",
    concern: "", whatsapp: "", urgency: "", priorTreatments: "", priorList: [] as string[], medical: "",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const togglePrior = (t: string) =>
    setForm(f => ({ ...f, priorList: f.priorList.includes(t) ? f.priorList.filter(x => x !== t) : [...f.priorList, t] }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const msg = [
      "Hi Melt Aways, I am planning treatment before visiting Trinidad.",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Country: ${form.country}`,
      `Travel dates: ${form.arrival} to ${form.departure}`,
      `Occasion: ${form.occasion}`,
      `Treatment interest: ${form.interest}`,
      `Main concern: ${form.concern}`,
      `WhatsApp: ${form.whatsapp}`,
      `Results timing: ${form.urgency}`,
      `Prior body treatments: ${form.priorTreatments}${form.priorTreatments === "Yes" && form.priorList.length ? " — " + form.priorList.join(", ") : ""}`,
      `Medical conditions or medications: ${form.medical}`,
    ].join("\n");
    window.open(waLink(msg), "_blank", "noopener,noreferrer");
    setDone(true);
    // Record the lead and trigger the consultation confirmation email
    try {
      await fetch("/api/public/submit-consultation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          full_name: form.name,
          phone: form.whatsapp,
          email: form.email,
          concern: form.concern,
          areas: form.interest,
          notes: [
            `Visiting Trinidad — ${form.country}`,
            `Travel: ${form.arrival} to ${form.departure}`,
            form.occasion && `Occasion: ${form.occasion}`,
            form.urgency && `Results timing: ${form.urgency}`,
            form.medical && `Medical: ${form.medical}`,
          ].filter(Boolean).join("\n"),
          preferred_date: form.arrival,
          location: "Visiting Trinidad",
          suggested_package: form.interest,
        }),
      });
    } catch { /* non-blocking */ }
    // Also forward the enquiry to the salon booking API (non-blocking, silent on failure)
    void postEnquiry({
      source: "visit",
      name: form.name,
      phone: form.whatsapp,
      email: form.email,
      message: [
        `Country: ${form.country}`,
        `Travel dates: ${form.arrival} to ${form.departure}`,
        form.occasion && `Occasion: ${form.occasion}`,
        form.interest && `Treatment interest: ${form.interest}`,
        form.concern && `Main concern: ${form.concern}`,
        form.urgency && `Results timing: ${form.urgency}`,
        form.priorTreatments && `Prior body treatments: ${form.priorTreatments}${form.priorTreatments === "Yes" && form.priorList.length ? " — " + form.priorList.join(", ") : ""}`,
        form.medical && `Medical: ${form.medical}`,
      ].filter(Boolean).join(". "),
    });
  }

  return (
    <Section>
      <div className="max-w-3xl mx-auto text-center mb-12">
        <Eyebrow>Visiting Trinidad?</Eyebrow>
        <h1 className="text-4xl lg:text-6xl font-light text-ink leading-tight">Plan your treatment before you arrive.</h1>
        <p className="mt-5 text-taupe leading-relaxed">
          Visiting Trinidad for Carnival, Christmas, Summer Trips, or Weddings? Share a few details and our team will help
          you plan the right treatment schedule around your trip, event dates, and availability.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={CONCIERGE_WA} onClick={waClick(CONCIERGE_MESSAGE)} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 font-medium soft-shadow hover:opacity-90 transition">
            <MessageCircle className="w-4 h-4" /> Speak With Our Treatment Concierge
          </a>
          <Link to="/timeline" className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 font-medium hover:bg-blush transition">
            See Treatment Timeline
          </Link>
        </div>
      </div>

      {done ? (
        <div className="max-w-2xl mx-auto bg-cream rounded-3xl p-10 text-center card-shadow">
          <div className="w-14 h-14 mx-auto rounded-full bg-primary/15 flex items-center justify-center">
            <Check className="w-7 h-7 text-primary" />
          </div>
          <h2 className="mt-5 text-2xl text-ink">Thank you. WhatsApp is opening.</h2>
          <p className="mt-3 text-sm text-taupe">
            Our concierge team will review your travel and treatment details and reply with a recommended plan.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="max-w-3xl mx-auto bg-background rounded-3xl p-8 lg:p-12 card-shadow border border-border/60 grid gap-5">
          <div className="flex items-center gap-3 text-primary"><Plane className="w-5 h-5" /><h2 className="text-xl text-ink">Plan My Visit</h2></div>
          <Row label="Full name"><input required value={form.name} onChange={e => set("name", e.target.value)} className={inp} /></Row>
          <Row label="Email address"><input required type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inp} placeholder="you@email.com" /></Row>
          <Row label="Country">
            <select required value={form.country} onChange={e => set("country", e.target.value)} className={inp}>
              <option value="">Select your country</option>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Row>
          <div className="grid sm:grid-cols-2 gap-4">
            <Row label="Arrival date"><input required type="date" value={form.arrival} onChange={e => set("arrival", e.target.value)} className={inp} /></Row>
            <Row label="Departure date"><input required type="date" value={form.departure} onChange={e => set("departure", e.target.value)} className={inp} /></Row>
          </div>
          <Row label="Event or occasion">
            <select value={form.occasion} onChange={e => set("occasion", e.target.value)} className={inp}>
              <option value="">Select an occasion</option>
              {OCCASIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </Row>
          <Row label="Treatment interest">
            <select value={form.interest} onChange={e => set("interest", e.target.value)} className={inp}>
              <option value="">Select a treatment</option>
              {TREATMENTS.map(t => <option key={t}>{t}</option>)}
            </select>
          </Row>
          <Row label="Main concern">
            <select value={form.concern} onChange={e => set("concern", e.target.value)} className={inp}>
              <option value="">Select your main concern</option>
              {CONCERNS.map(c => <option key={c}>{c}</option>)}
            </select>
          </Row>
          <Row label="WhatsApp number"><input required value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} className={inp} placeholder="With country code" /></Row>
          <Row label="How soon do you want visible results?">
            <select value={form.urgency} onChange={e => set("urgency", e.target.value)} className={inp}>
              <option value="">Select a timeframe</option>
              <option>Within the next week</option>
              <option>2 to 4 weeks</option>
              <option>6 to 8 weeks</option>
              <option>3 to 6 months</option>
            </select>
          </Row>
          <Row label="Have you done body treatments before?">
            <select value={form.priorTreatments} onChange={e => set("priorTreatments", e.target.value)} className={inp}>
              <option value="">Select an answer</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </Row>
          {form.priorTreatments === "Yes" && (
            <Row label="Which treatments have you done?">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TREATMENTS.map(t => {
                  const checked = form.priorList.includes(t);
                  return (
                    <label key={t} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer transition ${checked ? "bg-blush border-primary text-primary" : "bg-cream/40 border-input text-ink hover:border-primary/50"}`}>
                      <input type="checkbox" className="accent-primary" checked={checked} onChange={() => togglePrior(t)} />
                      {t}
                    </label>
                  );
                })}
              </div>
            </Row>
          )}
          <Row label="Any medical conditions or medications we should know?">
            <textarea rows={3} value={form.medical} onChange={e => set("medical", e.target.value)} className={inp} />
          </Row>
          <p className="text-xs text-taupe italic">Submitting opens WhatsApp so our concierge can confirm details and recommend the right plan. No diagnosis is provided online.</p>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-full bg-primary text-primary-foreground px-7 py-4 font-medium soft-shadow hover:opacity-90 transition">
              Plan My Visit
            </button>
            <button type="submit" className="rounded-full bg-[#25D366] text-white px-7 py-4 font-medium hover:opacity-90 transition inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Submit and Message Us
            </button>
          </div>
        </form>
      )}
    </Section>
  );
}

const inp = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Barbados", "Jamaica", "Guyana", "Suriname",
  "Grenada", "St Lucia", "St Vincent & the Grenadines", "Antigua & Barbuda", "St Kitts & Nevis",
  "Dominica", "Bahamas", "Cayman Islands", "Puerto Rico", "Panama", "Venezuela", "Brazil",
  "Germany", "France", "Netherlands", "Spain", "Italy", "Australia", "Other",
];

const OCCASIONS = [
  "Carnival", "Wedding", "Birthday", "Anniversary", "Vacation", "Family visit",
  "Business trip", "Christmas / Holidays", "Summer trip", "Other",
];

const TREATMENTS = [
  "Body Contouring", "Fat Melting", "Cavitation", "Skin Tightening", "Anti-Aging",
  "Wellness", "Peptides", "Slimming Injections", "Lymphatic Drainage",
  "Muscle Toning", "Breast Filler", "Butt Filler", "Facial", "Not sure yet",
];

const CONCERNS = [
  "Stubborn fat", "Loose skin", "Cellulite", "Post-pregnancy body", "Weight loss support",
  "Facial aging", "Body shape / contour", "Muscle definition", "Wellness reset", "Not sure yet",
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-ink font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}