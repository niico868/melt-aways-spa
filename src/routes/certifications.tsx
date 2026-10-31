import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Download, ShieldCheck, X, ZoomIn, ZoomOut } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  CERTIFICATIONS,
  CATEGORY_PILLS,
  CREDENTIAL_TAGS,
  INSTITUTIONS,
  TREATMENT_MAP,
  CERT_COUNT,
  type Certification,
} from "@/lib/certifications";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications · Professionally Trained. Continuously Certified. | Melt Aways" },
      {
        name: "description",
        content:
          "Every Melt Aways treatment is backed by internationally recognized training. Explore the certifications, institutions, and skills behind our care.",
      },
      { property: "og:title", content: "Melt Aways · Professional Certifications" },
      {
        property: "og:description",
        content: "Formal training, not trends. Explore the credentials behind every Melt Aways treatment.",
      },
    ],
  }),
  component: CertificationsPage,
});

function CertificationsPage() {
  const [active, setActive] = useState<Certification | null>(null);
  const [zoom, setZoom] = useState(1);
  const [focusId, setFocusId] = useState<string | null>(null);

  const byYear = useMemo(() => {
    const map = new Map<number, Certification[]>();
    for (const c of CERTIFICATIONS) {
      if (!map.has(c.year)) map.set(c.year, []);
      map.get(c.year)!.push(c);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, []);

  const scrollTo = (id: string) => {
    setFocusId(id);
    document.getElementById(`cert-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setFocusId(null), 2500);
  };

  const openCert = (c: Certification) => {
    setActive(c);
    setZoom(1);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blush/30 to-background pt-24 lg:pt-32 pb-16 lg:pb-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-10 text-center">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary/80">
              <ShieldCheck className="w-4 h-4" /> Credentialed Care
            </p>
            <h1 className="mt-4 font-serif text-4xl lg:text-6xl text-ink leading-[1.05]">
              Professionally Trained.
              <span className="block italic text-primary">Continuously Certified.</span>
            </h1>
            <p className="mt-6 text-taupe max-w-2xl mx-auto leading-relaxed">
              Your treatments are performed by practitioners who continue investing in
              internationally recognized education and advanced aesthetic training.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="text-center">
                <div className="font-serif text-7xl lg:text-8xl text-primary leading-none">
                  <CountUp value={CERT_COUNT} />
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.25em] text-taupe">
                  Professional Certifications
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                {CATEGORY_PILLS.map((p) => (
                  <span key={p} className="text-xs px-3 py-1.5 rounded-full bg-background border border-border/70 text-ink/80">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Credentials Strip */}
      <Section>
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Eyebrow>Credentials at a glance</Eyebrow>
            <h2 className="font-serif text-3xl lg:text-4xl text-ink">Trained across every treatment we offer.</h2>
            <p className="mt-3 text-taupe text-sm">Tap any credential to jump to the certificate.</p>
          </div>
        </Reveal>
        <div className="flex flex-wrap justify-center gap-3">
          {CREDENTIAL_TAGS.map((t, i) => (
            <button
              key={`${t.label}-${i}`}
              onClick={() => scrollTo(t.id)}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-background border border-border hover:border-primary/60 hover:bg-blush/40 transition-all"
            >
              <span className="w-5 h-5 rounded-full bg-fresh/15 text-fresh flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm text-ink/90">{t.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Institution Cards (flip / expand) */}
      <Section className="bg-blush/20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow>Training Institutions</Eyebrow>
            <h2 className="font-serif text-3xl lg:text-4xl text-ink">
              Six accredited providers. <span className="italic text-primary">Nine certifications.</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CERTIFICATIONS.map((c) => (
            <article
              key={c.id}
              id={`cert-${c.id}`}
              className={`group relative bg-background rounded-3xl border card-shadow overflow-hidden transition-all ${
                focusId === c.id ? "ring-2 ring-primary border-primary" : "border-border/60"
              }`}
            >
              <div className="p-6 min-h-[220px] flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.2em] text-primary/70">{c.institution}</div>
                    <h3 className="mt-2 font-serif text-xl text-ink leading-tight">{c.course}</h3>
                  </div>
                  <span className="shrink-0 w-9 h-9 rounded-full bg-fresh/15 text-fresh flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-4 text-xs text-taupe">Completed · {c.date}</div>

                <div className="mt-4 flex-1 flex flex-wrap gap-1.5">
                  {c.skills.slice(0, 3).map((s) => (
                    <span key={s} className="text-[11px] px-2 py-1 rounded-full bg-blush/60 text-ink/70">
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => openCert(c)}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all self-start"
                >
                  View Certificate <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>Practitioner Timeline</Eyebrow>
            <h2 className="font-serif text-3xl lg:text-4xl text-ink">
              A growing record of <span className="italic text-primary">continued education.</span>
            </h2>
          </div>
        </Reveal>
        <div className="relative max-w-3xl mx-auto pl-8 lg:pl-0">
          <div className="absolute left-3 lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" aria-hidden />
          <ol className="space-y-12">
            {byYear.map(([year, items], idx) => (
              <li key={year} className="relative">
                <div className="lg:grid lg:grid-cols-2 lg:gap-12">
                  <div className={`${idx % 2 === 0 ? "lg:text-right lg:pr-10" : "lg:col-start-2 lg:pl-10"}`}>
                    <div className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow">
                      {String(year).slice(-2)}
                    </div>
                    <div className="ml-10 lg:ml-0">
                      <div className="font-serif text-3xl text-primary">{year}</div>
                      <ul className="mt-3 space-y-2">
                        {items.map((c) => (
                          <li key={c.id} className="flex items-start gap-2 text-sm text-ink/90">
                            <Check className="w-4 h-4 mt-0.5 text-fresh shrink-0" />
                            <button onClick={() => openCert(c)} className="text-left hover:text-primary transition-colors">
                              {c.course}
                              <span className="block text-xs text-taupe">{c.institution}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Treatment mapping */}
      <Section className="bg-blush/20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Eyebrow>Treatment × Certification</Eyebrow>
            <h2 className="font-serif text-3xl lg:text-4xl text-ink">Every treatment is credentialed.</h2>
          </div>
        </Reveal>
        {/* Desktop table */}
        <div className="hidden sm:block max-w-3xl mx-auto rounded-3xl overflow-hidden border border-border/60 bg-background card-shadow">
          <table className="w-full text-left">
            <thead className="bg-blush/40 text-ink">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium">Treatment</th>
                <th className="px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium text-right">Certified</th>
              </tr>
            </thead>
            <tbody>
              {TREATMENT_MAP.map((row, i) => (
                <tr key={row.treatment} className={i % 2 === 1 ? "bg-blush/10" : ""}>
                  <td className="px-6 py-3.5 text-ink">{row.treatment}</td>
                  <td className="px-6 py-3.5 text-right">
                    <span className="inline-flex w-7 h-7 rounded-full bg-fresh/15 text-fresh items-center justify-center">
                      <Check className="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="sm:hidden max-w-md mx-auto space-y-3">
          {TREATMENT_MAP.map((row) => (
            <div key={row.treatment} className="flex items-center justify-between bg-background rounded-2xl border border-border/60 px-4 py-3">
              <span className="text-ink">{row.treatment}</span>
              <span className="inline-flex w-7 h-7 rounded-full bg-fresh/15 text-fresh items-center justify-center">
                <Check className="w-4 h-4" />
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Closing statement */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="font-serif text-2xl lg:text-3xl text-ink leading-relaxed italic">
              "You trust us with more than your time, you trust us with you. So we keep learning,
              keep growing, keep earning that trust, appointment after appointment."
            </p>
          </Reveal>
          <div className="mt-10">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-fresh text-fresh-foreground px-7 py-4 font-medium btn-lux soft-shadow"
            >
              Book Your Treatment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Modal */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-4xl p-0 bg-background border-border overflow-hidden">
          {active && (
            <div className="flex flex-col max-h-[90vh]">
              <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-border/60">
                <div className="min-w-0">
                  <h3 className="font-serif text-xl text-ink truncate">{active.course}</h3>
                  <p className="text-xs text-taupe mt-0.5">
                    {active.institution} · Completed {active.date}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} className="p-2 rounded-full hover:bg-blush/50 text-ink" aria-label="Zoom out">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="p-2 rounded-full hover:bg-blush/50 text-ink" aria-label="Zoom in">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <a href={active.certificate} download className="p-2 rounded-full hover:bg-blush/50 text-ink" aria-label="Download">
                    <Download className="w-4 h-4" />
                  </a>
                  <button onClick={() => setActive(null)} className="p-2 rounded-full hover:bg-blush/50 text-ink" aria-label="Close">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-ink/90 p-4 flex items-center justify-center">
                <img
                  src={active.certificate}
                  alt={`${active.course} certificate`}
                  className="max-w-full h-auto rounded-md shadow-2xl transition-transform duration-200"
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                />
              </div>
              <div className="px-6 py-4 border-t border-border/60 bg-blush/10">
                <div className="text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">Skills covered</div>
                <div className="flex flex-wrap gap-1.5">
                  {active.skills.map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-background border border-border/60 text-ink/80">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
