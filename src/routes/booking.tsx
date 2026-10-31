import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Home, Loader2 } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { Calendar } from "@/components/ui/calendar";
import { SITE } from "@/lib/site";
import {
  availableSlots, formatTime, isDateDisabled, toIso, type Busy,
} from "@/lib/booking-slots";

import { BOOKING_API_URL, normalizeServiceName } from "@/lib/booking-api";

export const Route = createFileRoute("/booking")({
  validateSearch: (search: Record<string, unknown>): { service?: string } =>
    typeof search.service === "string" ? { service: search.service } : {},
  head: () => ({ meta: [
    { title: "Book an Appointment — Melt Aways" },
    { name: "description", content: "Choose a treatment, pick an open time and book your Melt Aways appointment online." },
    { property: "og:title", content: "Book an Appointment — Melt Aways" },
    { property: "og:description", content: "Choose a treatment, pick an open time and book your Melt Aways appointment online." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: Booking,
});

type Service = { id: string; name: string; category: string; price: number; duration_min: number };
type Hours = { days: number[]; open: string; close: string; utc_offset?: string };

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const prettyDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

function Booking() {
  const { service: preselect } = Route.useSearch();
  const [services, setServices] = useState<Service[]>([]);
  const [hours, setHours] = useState<Hours>({ days: [2, 3, 4, 5, 6], open: "10:00", close: "16:00" });
  const [loadErr, setLoadErr] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState<string>("");
  const [busy, setBusy] = useState<Busy[]>([]);
  const [closed, setClosed] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ service: string; date: string; time: string } | null>(null);

  useEffect(() => {
    fetch(BOOKING_API_URL).then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const list: Service[] = d.services ?? [];
        setServices(list);
        if (d.hours) setHours((h) => ({ ...h, ...d.hours }));
        if (preselect) {
          const target = normalizeServiceName(preselect);
          const match = list.find((s) => normalizeServiceName(s.name) === target);
          if (match) setServiceId(match.id);
        }
      })
      .catch(() => setLoadErr(true));
  }, [preselect]);

  const loadDay = useCallback(async (d: string) => {
    setLoadingDay(true);
    try {
      const r = await fetch(`${BOOKING_API_URL}?date=${d}`);
      const j = await r.json();
      setBusy(j.busy ?? []);
      setClosed(!!j.closed);
    } catch {
      setBusy([]); setClosed(true);
    } finally { setLoadingDay(false); }
  }, []);

  useEffect(() => { if (date) { setTime(""); loadDay(date); } }, [date, loadDay]);

  const grouped = useMemo(() => {
    const g: Record<string, Service[]> = {};
    for (const s of services) (g[s.category || "Other"] ??= []).push(s);
    return g;
  }, [services]);
  const service = services.find((s) => s.id === serviceId);
  const slots = useMemo(() => (date && service && !closed
    ? availableSlots({ date, durationMin: service.duration_min, busy, open: hours.open, close: hours.close })
    : []), [date, service, busy, closed, hours]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!service || !date || !time) { setError("Please choose a service, date and time."); return; }
    const f = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      const name = String(f.get("name") || "").trim();
      const phone = String(f.get("phone") || "").trim();
      const email = String(f.get("email") || "").trim();
      const notes = String(f.get("notes") || "").trim();
      const r = await fetch(BOOKING_API_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          notes,
          mk_hp: String(f.get("mk_hp") || ""),
          service_id: service.id,
          service_name: service.name,
          starts_at: toIso(date, time),
        }),
      });
      if (r.status === 201) {
        setDone({ service: service.name, date, time });
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Also save to Lovable Cloud and send the owner's email + WhatsApp alerts.
        // Never blocks the confirmation; only runs after a 201.
        try {
          await fetch("/api/public/submit-consultation", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              full_name: name,
              phone,
              email,
              concern: service.name,
              notes,
              preferred_date: date,
              preferred_time: formatTime(time),
              suggested_package: service.name,
            }),
          });
        } catch (e) {
          console.log("Lovable Cloud booking save failed:", e);
        }
      } else if (r.status === 409) {
        setError("Sorry, that time was just taken. Please pick another time.");
        setTime("");
        await loadDay(date);
      } else if (r.status === 400) {
        const j = await r.json().catch(() => ({}));
        setError(j.error || j.message || "Please check your details and try again.");
      } else {
        setError(`Something went wrong. Please call the salon at ${SITE.phone} to book.`);
      }
    } catch {
      setError(`Something went wrong. Please call the salon at ${SITE.phone} to book.`);
    } finally { setSubmitting(false); }
  }

  if (done) {
    return (
      <Section className="max-w-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-blush text-primary flex items-center justify-center mx-auto"><Check className="w-7 h-7" /></div>
        <Eyebrow>Booked</Eyebrow>
        <h1 className="text-3xl lg:text-5xl font-light text-ink">You're booked in.</h1>
        <div className="mt-8 bg-background border border-border/60 rounded-3xl p-7 text-left card-shadow space-y-2">
          <p><span className="text-taupe">Service:</span> <span className="text-ink font-medium">{done.service}</span></p>
          <p><span className="text-taupe">Date:</span> <span className="text-ink font-medium">{prettyDate(done.date)}</span></p>
          <p><span className="text-taupe">Time:</span> <span className="text-ink font-medium">{formatTime(done.time)}</span></p>
        </div>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 font-medium hover:bg-blush transition">
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </Section>
    );
  }

  const inputCls = "mt-2 w-full rounded-2xl border border-input bg-cream/40 px-4 py-3 outline-none focus:border-primary transition";

  return (
    <Section className="max-w-3xl">
      <div className="text-center mb-12 bg-cream rounded-3xl px-6 py-10 border border-border/60">
        <Eyebrow>Book Online</Eyebrow>
        <h1 className="text-4xl lg:text-5xl font-light text-ink">Book your appointment.</h1>
        <p className="mt-4 text-ink/70 max-w-xl mx-auto">Open Tuesday to Saturday, 10:00 AM – 4:00 PM.</p>
      </div>

      <form onSubmit={onSubmit} className="bg-background rounded-3xl border border-border/60 card-shadow p-7 lg:p-10 space-y-8">
        <div>
          <label className="text-sm font-medium text-ink">1. Choose a service <span className="text-primary">*</span></label>
          {loadErr ? (
            <p className="mt-2 text-sm text-destructive">We couldn't load services. Please call the salon at {SITE.phone}.</p>
          ) : services.length === 0 ? (
            <p className="mt-2 text-sm text-taupe inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading services…</p>
          ) : (
            <div className="mt-3 space-y-5">
              {Object.entries(grouped).map(([cat, list]) => (
                <div key={cat}>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{cat}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {list.map((s) => (
                      <button type="button" key={s.id} onClick={() => { setServiceId(s.id); setTime(""); }}
                        className={`text-left rounded-2xl border px-4 py-3 transition ${serviceId === s.id ? "bg-blush border-primary" : "bg-cream/40 border-input hover:border-primary/50"}`}>
                        <span className="block text-ink font-medium">{s.name}</span>
                        <span className="block text-sm text-taupe">{Number(s.price) > 0 ? `TT$${Number(s.price).toLocaleString()}` : "Price on consultation"} · {s.duration_min} min</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-ink">2. Pick a date <span className="text-primary">*</span></label>
            <Calendar
              mode="single"
              selected={date ? new Date(`${date}T12:00:00`) : undefined}
              onSelect={(d) => d && setDate(ymd(d))}
              disabled={(d: Date) => isDateDisabled(ymd(d), hours.days)}
              className="mt-2 rounded-2xl border border-input bg-cream/40 pointer-events-auto"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">3. Pick a time <span className="text-primary">*</span></label>
            <div className="mt-2">
              {!service ? <p className="text-sm text-taupe">Choose a service first.</p>
                : !date ? <p className="text-sm text-taupe">Choose a date.</p>
                : loadingDay ? <p className="text-sm text-taupe inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Checking times…</p>
                : slots.length === 0 ? <p className="text-sm text-ink">Sorry, {prettyDate(date)} is fully booked. Please choose another day.</p>
                : (
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((t) => (
                      <button type="button" key={t} onClick={() => setTime(t)}
                        className={`rounded-xl border px-2 py-2 text-sm transition ${time === t ? "bg-primary text-primary-foreground border-primary" : "bg-cream/40 border-input hover:border-primary/50"}`}>
                        {formatTime(t)}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div><label className="text-sm font-medium text-ink">Full name <span className="text-primary">*</span></label><input name="name" required className={inputCls} /></div>
          <div><label className="text-sm font-medium text-ink">Phone <span className="text-primary">*</span></label><input name="phone" type="tel" required className={inputCls} /></div>
          <div className="sm:col-span-2"><label className="text-sm font-medium text-ink">Email</label><input name="email" type="email" className={inputCls} /></div>
          <div className="sm:col-span-2"><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={3} className={inputCls} /></div>
        </div>
        <input type="text" name="mk_hp" tabIndex={-1} autoComplete="off" aria-hidden="true"
          defaultValue="" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }} />

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={submitting}
          className="rounded-full bg-primary text-primary-foreground px-7 py-4 font-medium soft-shadow hover:opacity-90 transition disabled:opacity-60 inline-flex items-center gap-2">
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Book Appointment
        </button>
      </form>
    </Section>
  );
}
