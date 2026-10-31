import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Phone, Check, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Section } from "@/components/Section";
import { waLink } from "@/lib/site";
import { postEnquiry } from "@/lib/booking-api";
import {
  VIP_GOALS, VIP_AREAS, VIP_HEALTH_QUESTIONS, VIP_START_PERIODS,
  emptyVipForm, validateVipStep, type VipFormState, type YesNo,
} from "@/lib/vip-consult";

const TITLE = "Book a VIP Consultation | Meltaways Spa";
const DESC =
  "Apply for the Meltaways VIP Transformation Program. Share your goals, availability and preferences so our team can prepare for a focused VIP consultation.";

export const Route = createFileRoute("/vipconsult")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VipConsultPage,
});

const STEP_LABELS = ["Contact", "Goals", "Readiness", "Health", "Review"];
const field =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40";

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-destructive" role="alert">{msg}</p>;
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="block text-sm font-medium text-ink mb-1.5">{children}</label>;
}

function YesNoGroup({
  name, label, value, onChange, error,
}: { name: string; label: string; value: YesNo; onChange: (v: YesNo) => void; error?: string }) {
  return (
    <fieldset className="mt-4">
      <legend className="text-sm font-medium text-ink mb-1.5">{label}</legend>
      <div className="flex gap-2">
        {(["yes", "no"] as const).map((v) => (
          <label
            key={v}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm capitalize transition focus-within:ring-2 focus-within:ring-primary/40 ${
              value === v ? "bg-primary text-primary-foreground border-primary" : "bg-background border-ink/15 hover:bg-blush"
            }`}
          >
            <input
              type="radio" name={name} value={v} checked={value === v}
              onChange={() => onChange(v)} className="sr-only"
            />
            {v}
          </label>
        ))}
      </div>
      <Err msg={error} />
    </fieldset>
  );
}

function CheckGroup({
  legend, options, selected, onToggle, error,
}: { legend: string; options: readonly string[]; selected: string[]; onToggle: (v: string) => void; error?: string }) {
  return (
    <fieldset className="mt-4">
      <legend className="text-sm font-medium text-ink mb-2">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <label
              key={o}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition focus-within:ring-2 focus-within:ring-primary/40 ${
                on ? "bg-primary text-primary-foreground border-primary" : "bg-background border-ink/15 hover:bg-blush"
              }`}
            >
              <input type="checkbox" checked={on} onChange={() => onToggle(o)} className="sr-only" />
              {o}
            </label>
          );
        })}
      </div>
      <Err msg={error} />
    </fieldset>
  );
}

function VipConsultPage() {
  const [step, setStep] = useState(1);
  const [f, setF] = useState<VipFormState>(emptyVipForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const set = <K extends keyof VipFormState>(k: K, v: VipFormState[K]) => setF((p) => ({ ...p, [k]: v }));
  const toggle = (k: "goals" | "target_areas", v: string) =>
    setF((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));
  const setHealth = (key: string, patch: Partial<{ answer: YesNo; details: string }>) =>
    setF((p) => ({
      ...p,
      health: {
        ...p.health,
        [key]: {
          answer: patch.answer ?? p.health[key]?.answer ?? "",
          details: patch.details ?? p.health[key]?.details ?? "",
        },
      },
    }));

  function next() {
    const e = validateVipStep(step, f);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep((s) => Math.min(5, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const all = [1, 2, 3, 4, 5].reduce<Record<string, string>>((acc, s) => ({ ...acc, ...validateVipStep(s, f) }), {});
    setErrors(all);
    if (Object.keys(all).length) {
      setErrMsg("Please complete the highlighted fields.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/public/submit-vip-consultation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...f, mk_hp: honeypot }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Submission failed");
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Also forward the enquiry to the salon booking API (non-blocking, silent on failure)
      void postEnquiry({
        source: "consultation",
        name: f.full_name,
        phone: f.phone,
        email: f.email,
        message: [
          "VIP consultation request",
          f.primary_goal && `Primary goal: ${f.primary_goal}`,
          f.goals.length && `Goals: ${f.goals.join(", ")}`,
          f.target_areas.length && `Target areas: ${f.target_areas.join(", ")}`,
          f.start_period && `Start: ${f.start_period}`,
          f.preferred_date && `Preferred date: ${f.preferred_date}`,
          f.preferred_time && `Preferred time: ${f.preferred_time}`,
          f.location && `Location: ${f.location}`,
        ].filter(Boolean).join(". "),
        mk_hp: honeypot,
      });
    } catch (err: any) {
      setStatus("error");
      setErrMsg(err?.message || "Something went wrong. Please call or WhatsApp us instead.");
    }
  }

  if (status === "done") {
    return (
      <main>
        <Section className="!py-20">
          <div className="max-w-2xl mx-auto text-center rounded-[2rem] border border-border/60 bg-cream/60 p-10 card-shadow">
            <span className="grid place-items-center w-14 h-14 mx-auto rounded-full bg-primary text-primary-foreground">
              <Check className="w-7 h-7" aria-hidden />
            </span>
            <h1 className="mt-6 font-serif text-3xl text-gold">Your VIP consultation request has been received.</h1>
            <p className="mt-4 text-taupe leading-relaxed">
              The Meltaways team will review your goals and contact you to arrange the next step. Your
              programme, treatment options and schedule will only be confirmed after your consultation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 font-medium hover:opacity-90">
                Return to Homepage
              </Link>
              <a
                href={waLink("Hi Meltaways, I just submitted a VIP consultation request.")}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-background border border-ink/15 px-6 py-3.5 font-medium hover:bg-blush"
              >
                <Phone className="w-4 h-4" aria-hidden /> Call or WhatsApp 378-5630
              </a>
            </div>
          </div>
        </Section>
      </main>
    );
  }

  return (
    <main>
      <Section className="!py-14">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold">
            Meltaways VIP Transformation Program
          </p>
          <h1 className="mt-4 font-serif text-3xl lg:text-[2.6rem] leading-tight text-gold">
            Let’s Build Your Transformation Plan.
          </h1>
          <p className="mt-4 text-taupe leading-relaxed">
            Tell us where you are now, what you would like to work toward and the level of support you are
            looking for. Your answers will help the Meltaways team prepare for a more focused VIP consultation.
          </p>

          <ol className="mt-8 flex flex-wrap gap-2" aria-label="Form progress">
            {STEP_LABELS.map((l, i) => {
              const n = i + 1;
              const state = n === step ? "current" : n < step ? "done" : "todo";
              return (
                <li
                  key={l}
                  aria-current={state === "current" ? "step" : undefined}
                  className={`flex-1 min-w-[110px] rounded-full px-3 py-2 text-center text-xs font-medium border ${
                    state === "current"
                      ? "bg-primary text-primary-foreground border-primary"
                      : state === "done"
                        ? "bg-blush text-ink border-primary/30"
                        : "bg-background text-taupe border-ink/10"
                  }`}
                >
                  {n}. {l}
                </li>
              );
            })}
          </ol>

          <form onSubmit={submit} noValidate className="mt-8 rounded-[1.5rem] border border-border/60 bg-background p-6 lg:p-9">
            <input
              type="text" tabIndex={-1} autoComplete="off" aria-hidden
              value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
              name="mk_hp" className="hidden"
            />

            {step === 1 && (
              <div>
                <h2 className="font-serif text-2xl text-ink">Contact information</h2>
                <div className="mt-5 grid gap-4">
                  <div>
                    <Label htmlFor="full_name">Full name *</Label>
                    <input id="full_name" className={field} value={f.full_name} onChange={(e) => set("full_name", e.target.value)} autoComplete="name" />
                    <Err msg={errors.full_name} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone number *</Label>
                      <input id="phone" className={field} value={f.phone} onChange={(e) => set("phone", e.target.value)} inputMode="tel" autoComplete="tel" />
                      <Err msg={errors.phone} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email address *</Label>
                      <input id="email" type="email" className={field} value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                      <Err msg={errors.email} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferred_contact">Preferred contact method *</Label>
                      <select id="preferred_contact" className={field} value={f.preferred_contact} onChange={(e) => set("preferred_contact", e.target.value as any)}>
                        <option value="">Select…</option>
                        <option value="Call">Call</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Email">Email</option>
                      </select>
                      <Err msg={errors.preferred_contact} />
                    </div>
                    <div>
                      <Label htmlFor="location">Preferred Meltaways location</Label>
                      <select id="location" className={field} value={f.location} onChange={(e) => set("location", e.target.value)}>
                        <option value="El Dorado">El Dorado</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferred_date">Preferred consultation date *</Label>
                      <input id="preferred_date" type="date" className={field} value={f.preferred_date} onChange={(e) => set("preferred_date", e.target.value)} />
                      <Err msg={errors.preferred_date} />
                    </div>
                    <div>
                      <Label htmlFor="preferred_time">Preferred consultation time *</Label>
                      <input id="preferred_time" type="time" className={field} value={f.preferred_time} onChange={(e) => set("preferred_time", e.target.value)} />
                      <Err msg={errors.preferred_time} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-serif text-2xl text-ink">Goals and areas of concern</h2>
                <CheckGroup
                  legend="What would you most like to improve? *"
                  options={VIP_GOALS} selected={f.goals}
                  onToggle={(v) => toggle("goals", v)} error={errors.goals}
                />
                {f.goals.includes("Other") && (
                  <div className="mt-3">
                    <Label htmlFor="goals_other">Please tell us more</Label>
                    <input id="goals_other" className={field} value={f.goals_other} onChange={(e) => set("goals_other", e.target.value)} />
                    <Err msg={errors.goals_other} />
                  </div>
                )}
                <div className="mt-5">
                  <Label htmlFor="primary_goal">Which goal is your highest priority? *</Label>
                  <select id="primary_goal" className={field} value={f.primary_goal} onChange={(e) => set("primary_goal", e.target.value)}>
                    <option value="">Select…</option>
                    {(f.goals.length ? f.goals : VIP_GOALS).map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <Err msg={errors.primary_goal} />
                </div>
                <CheckGroup
                  legend="Which areas would you like us to assess? *"
                  options={VIP_AREAS} selected={f.target_areas}
                  onToggle={(v) => toggle("target_areas", v)} error={errors.target_areas}
                />
                {f.target_areas.includes("Other") && (
                  <div className="mt-3">
                    <Label htmlFor="target_areas_other">Please tell us more</Label>
                    <input id="target_areas_other" className={field} value={f.target_areas_other} onChange={(e) => set("target_areas_other", e.target.value)} />
                    <Err msg={errors.target_areas_other} />
                  </div>
                )}
                <div className="mt-5">
                  <Label htmlFor="worthwhile">What changes would make this programme feel worthwhile to you?</Label>
                  <textarea id="worthwhile" rows={3} className={field} value={f.worthwhile} onChange={(e) => set("worthwhile", e.target.value)} />
                </div>
                <YesNoGroup
                  name="prior_treatments"
                  label="Have you tried any body, beauty or wellness treatments before? *"
                  value={f.prior_treatments} onChange={(v) => set("prior_treatments", v)} error={errors.prior_treatments}
                />
                {f.prior_treatments === "yes" && (
                  <div className="mt-3">
                    <Label htmlFor="prior_detail">Which treatments and what was your experience?</Label>
                    <textarea id="prior_detail" rows={3} className={field} value={f.prior_treatments_detail} onChange={(e) => set("prior_treatments_detail", e.target.value)} />
                    <Err msg={errors.prior_treatments_detail} />
                  </div>
                )}
                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event_related">Is there a particular date or event connected to your goal?</Label>
                    <input id="event_related" className={field} value={f.event_related} onChange={(e) => set("event_related", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="event_date">Event date (optional)</Label>
                    <input id="event_date" type="date" className={field} value={f.event_date} onChange={(e) => set("event_date", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="current_weight">Current weight (optional)</Label>
                    <input id="current_weight" className={field} value={f.current_weight} onChange={(e) => set("current_weight", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="goal_weight">Desired weight or body-composition goal (optional)</Label>
                    <input id="goal_weight" className={field} value={f.goal_weight} onChange={(e) => set("goal_weight", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-serif text-2xl text-ink">Programme readiness and availability</h2>
                <div className="mt-5">
                  <Label htmlFor="start_period">When would you ideally like to begin? *</Label>
                  <select id="start_period" className={field} value={f.start_period} onChange={(e) => set("start_period", e.target.value)}>
                    <option value="">Select…</option>
                    {VIP_START_PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <Err msg={errors.start_period} />
                </div>
                <YesNoGroup name="weekly_ok" label="Could you attend appointments weekly? *" value={f.weekly_ok} onChange={(v) => set("weekly_ok", v)} error={errors.weekly_ok} />
                <YesNoGroup name="biweekly_ok" label="Could you attend appointments once every two weeks? *" value={f.biweekly_ok} onChange={(v) => set("biweekly_ok", v)} error={errors.biweekly_ok} />
                <div className="mt-5">
                  <Label htmlFor="best_days">Which days and times are normally best?</Label>
                  <input id="best_days" className={field} value={f.best_days} onChange={(e) => set("best_days", e.target.value)} />
                </div>
                <YesNoGroup name="open_three_months" label="Are you open to a three-month programme? *" value={f.open_three_months} onChange={(v) => set("open_three_months", v)} error={errors.open_three_months} />
                <YesNoGroup name="open_six_months" label="Are you open to a six-month programme? *" value={f.open_six_months} onChange={(v) => set("open_six_months", v)} error={errors.open_six_months} />
                <YesNoGroup name="monthly_payment_ok" label="Are you comfortable with a convenient monthly payment arrangement? *" value={f.monthly_payment_ok} onChange={(v) => set("monthly_payment_ok", v)} error={errors.monthly_payment_ok} />
                <YesNoGroup name="wants_payment_info" label="Would you like information about available payment-plan options?" value={f.wants_payment_info} onChange={(v) => set("wants_payment_info", v)} />
                <div className="mt-5">
                  <Label htmlFor="support_level">What level of support would help you remain consistent?</Label>
                  <textarea id="support_level" rows={2} className={field} value={f.support_level} onChange={(e) => set("support_level", e.target.value)} />
                </div>
                <div className="mt-4">
                  <Label htmlFor="attendance_barriers">Is there anything that could make it difficult for you to attend appointments consistently?</Label>
                  <textarea id="attendance_barriers" rows={2} className={field} value={f.attendance_barriers} onChange={(e) => set("attendance_barriers", e.target.value)} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="font-serif text-2xl text-ink">Health and treatment screening</h2>
                <p className="mt-3 text-sm text-taupe leading-relaxed">
                  These answers are for preliminary screening only. They do not replace professional or medical
                  assessment, and nothing here asks you to diagnose yourself.
                </p>
                {VIP_HEALTH_QUESTIONS.map((q) => (
                  <div key={q.key}>
                    <YesNoGroup
                      name={`health_${q.key}`} label={`${q.label} *`}
                      value={f.health[q.key]?.answer ?? ""}
                      onChange={(v) => setHealth(q.key, { answer: v })}
                      error={errors[`health_${q.key}`]}
                    />
                    {f.health[q.key]?.answer === "yes" && (
                      <div className="mt-2">
                        <Label htmlFor={`d_${q.key}`}>Please share any details you are comfortable providing</Label>
                        <textarea id={`d_${q.key}`} rows={2} className={field}
                          value={f.health[q.key]?.details ?? ""}
                          onChange={(e) => setHealth(q.key, { details: e.target.value })} />
                        <Err msg={errors[`health_${q.key}_details`]} />
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-5">
                  <Label htmlFor="health_other">Is there anything else the practitioner should know before contacting you?</Label>
                  <textarea id="health_other" rows={3} className={field} value={f.health_other} onChange={(e) => set("health_other", e.target.value)} />
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="font-serif text-2xl text-ink">Review and consent</h2>
                <dl className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <Summary label="Name" value={f.full_name} />
                  <Summary label="Phone" value={f.phone} />
                  <Summary label="Email" value={f.email} />
                  <Summary label="Preferred contact" value={f.preferred_contact} />
                  <Summary label="Consultation" value={[f.preferred_date, f.preferred_time].filter(Boolean).join(" · ")} />
                  <Summary label="Primary goal" value={f.primary_goal} />
                  <Summary label="Target areas" value={f.target_areas.join(", ")} />
                  <Summary label="Preferred start" value={f.start_period} />
                </dl>
                <div className="mt-6 space-y-3">
                  {([
                    ["confirm_accurate", "The information I have submitted is accurate to the best of my knowledge."],
                    ["confirm_not_guaranteed", "I understand that submitting this form does not guarantee acceptance into the VIP programme."],
                    ["confirm_consultation_required", "I understand that a professional consultation is required before any treatment plan is confirmed."],
                    ["consent_contact", "I consent to Meltaways contacting me about my consultation."],
                    ["confirm_privacy", "I have reviewed the privacy policy."],
                  ] as const).map(([key, label]) => (
                    <div key={key}>
                      <label className="flex gap-3 items-start text-sm text-ink/85">
                        <input
                          type="checkbox" checked={f[key] as boolean}
                          onChange={(e) => set(key, e.target.checked as any)}
                          className="mt-1 size-4 accent-[color:var(--color-primary,#7a5a3f)]"
                        />
                        <span>
                          {label}
                          {key === "confirm_privacy" && (
                            <> <Link to="/policies" className="text-primary underline underline-offset-4">View privacy policy</Link></>
                          )}
                        </span>
                      </label>
                      <Err msg={errors[key]} />
                    </div>
                  ))}
                </div>
                {status === "error" && errMsg && (
                  <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
                    {errMsg}
                  </p>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6">
              <button
                type="button" onClick={back} disabled={step === 1}
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-medium disabled:opacity-40 hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden /> Back
              </button>
              {step < 5 ? (
                <button
                  type="button" onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3 font-medium hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Continue <ArrowRight className="w-4 h-4" aria-hidden />
                </button>
              ) : (
                <button
                  type="submit" disabled={status === "sending"}
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3 font-medium hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {status === "sending"
                    ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Sending…</>
                    : <><Crown className="w-4 h-4" aria-hidden /> Request My VIP Consultation</>}
                </button>
              )}
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-taupe">
            Prefer to talk?{" "}
            <a href={waLink("Hi Meltaways, I'd like to ask about the VIP Transformation Program.")}
              target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">
              Call or WhatsApp 378-5630
            </a>
          </p>
        </div>
      </Section>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-taupe">{label}</dt>
      <dd className="text-ink">{value || "—"}</dd>
    </div>
  );
}
