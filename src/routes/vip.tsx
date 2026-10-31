import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Check, Phone, ClipboardList, CalendarClock, LineChart, RefreshCw } from "lucide-react";
import { Section } from "@/components/Section";
import { SITE, waLink } from "@/lib/site";

const TITLE = "VIP Transformation Program | Meltaways Spa";
const DESC =
  "A guided, personalized Meltaways programme combining suitable body, beauty and wellness treatments with progress tracking and one convenient monthly payment.";

export const Route = createFileRoute("/vip")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VipPage,
});

const INCLUDES = [
  "Fat reduction",
  "Body sculpting and muscle toning",
  "Skin tightening",
  "Lymphatic support",
  "Laser hair removal",
  "Red light therapy",
  "Other suitable Meltaways body, beauty and wellness treatments",
];

const BENEFITS = [
  "A treatment roadmap built around your specific goals",
  "Suitable treatments organized into a connected programme",
  "Ongoing progress tracking",
  "Adjustments based on progress and professional assessment",
  "Priority appointment booking",
  "Preferred rates on selected premium services",
  "More focused support throughout an extensive transformation journey",
  "One convenient monthly payment",
];

const STEPS = [
  {
    icon: ClipboardList,
    title: "Private Consultation",
    body: "We learn about your goals, history, concerns, availability and preferred timeline.",
  },
  {
    icon: CalendarClock,
    title: "Personalized Planning",
    body: "Suitable treatments are organized into a structured programme based on your consultation.",
  },
  {
    icon: LineChart,
    title: "Treatment and Tracking",
    body: "Appointments are completed according to the recommended schedule while measurements, observations and milestones are tracked.",
  },
  {
    icon: RefreshCw,
    title: "Review and Adjustment",
    body: "The programme can be adjusted as you progress or your needs change.",
  },
];

const SUITABILITY = [
  "Have several related body, beauty or wellness goals",
  "Want a more structured approach than individual appointments",
  "Are prepared to follow a recommended appointment schedule",
  "Want their progress documented and reviewed",
  "Prefer one organized programme and monthly payment",
  "Are ready to commit to a longer transformation journey",
];

const SCHEDULE = [
  "Programmes may be structured across approximately three or six months, depending on your goals and recommended plan.",
  "Appointments may take place weekly or once every two weeks.",
  "The final schedule is confirmed after consultation.",
  "Treatment combinations and programme costs vary.",
  "Payment plans are available on request.",
  "Membership does not automatically renew.",
];

function VipPage() {
  return (
    <main>
      <Section className="!pt-14 !pb-10">
        <div className="rounded-[2rem] overflow-hidden border border-border/60 bg-cream/60 card-shadow">
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-primary font-semibold">
              Meltaways VIP Transformation Program
            </p>
            <h1 className="mt-5 font-serif text-3xl lg:text-[2.9rem] leading-[1.08] text-gold">
              Your Goals. Your Plan.<span className="block">Your Complete Transformation Journey.</span>
            </h1>
            <p className="mt-5 text-taupe leading-relaxed max-w-xl">
              The Meltaways VIP Transformation Program is designed for clients whose goals may require more
              than a single service or occasional appointment. Following a private consultation, we create a
              structured programme around your body, priorities, availability and progress.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/vipconsult"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 font-medium hover:opacity-90 lift-on-hover soft-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Crown className="w-4 h-4" aria-hidden /> Book Your VIP Consultation
              </Link>
              <a
                href={waLink("Hi Meltaways, I'd like to ask about the VIP Transformation Program.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-background border border-ink/15 px-6 py-3.5 font-medium hover:bg-blush lift-on-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
              >
                <Phone className="w-4 h-4" aria-hidden /> Call or WhatsApp 378-5630
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section className="!py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-serif text-2xl lg:text-3xl text-gold">What the programme can include</h2>
            <p className="mt-3 text-taupe leading-relaxed">
              A personalized programme can combine suitable services such as:
            </p>
            <ul className="mt-4 space-y-2">
              {INCLUDES.map((i) => (
                <li key={i} className="flex gap-2 text-sm text-ink/80">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-taupe leading-relaxed">
              Treatments are selected after consultation. Not every service will be suitable or necessary for
              every client.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl lg:text-3xl text-gold">Programme benefits</h2>
            <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2">
              {BENEFITS.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-ink/80">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="!py-12">
        <h2 className="font-serif text-2xl lg:text-3xl text-gold">How the programme works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-border/60 bg-cream/50 p-6">
              <span className="grid place-items-center w-11 h-11 rounded-full bg-primary text-primary-foreground">
                <s.icon className="w-5 h-5" aria-hidden />
              </span>
              <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-taupe">Step {i + 1}</p>
              <h3 className="mt-1 font-serif text-lg text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-taupe leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="!py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="rounded-2xl border border-border/60 bg-background p-7">
            <h2 className="font-serif text-2xl text-gold">Programme schedule and payments</h2>
            <ul className="mt-4 space-y-2">
              {SCHEDULE.map((s) => (
                <li key={s} className="flex gap-2 text-sm text-ink/80">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background p-7">
            <h2 className="font-serif text-2xl text-gold">Who it may be suitable for</h2>
            <p className="mt-3 text-sm text-taupe">The programme may suit clients who:</p>
            <ul className="mt-4 space-y-2">
              {SUITABILITY.map((s) => (
                <li key={s} className="flex gap-2 text-sm text-ink/80">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="!py-12">
        <div className="rounded-[2rem] border border-border/60 bg-cream/60 p-8 lg:p-12 text-center card-shadow">
          <h2 className="font-serif text-2xl lg:text-3xl text-gold">Limited availability</h2>
          <p className="mt-4 text-taupe leading-relaxed max-w-2xl mx-auto">
            VIP spaces are intentionally limited. This allows the Meltaways team to give every member the
            time, tracking and personalized attention their programme requires.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/vipconsult"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 font-medium hover:opacity-90 lift-on-hover soft-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Crown className="w-4 h-4" aria-hidden /> Book Your VIP Consultation
            </Link>
            <a
              href={waLink("Hi Meltaways, I'd like to ask about the VIP Transformation Program.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-background border border-ink/15 px-6 py-3.5 font-medium hover:bg-blush lift-on-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              <Phone className="w-4 h-4" aria-hidden /> Call or WhatsApp 378-5630
            </a>
          </div>
          <p className="mt-9 font-serif text-xl text-ink">Meltaways Spa</p>
          <p className="mt-1 font-serif italic text-gold">
            Where Confidence Begins and Your Transformation Starts.
          </p>
          <p className="mt-8 text-xs text-taupe max-w-3xl mx-auto leading-relaxed">
            Treatments require consultation. Suitability, treatment combinations, timelines and outcomes vary
            by client. Information provided on this page is not medical advice and does not guarantee specific
            results.
          </p>
          <p className="sr-only">{SITE.phone}</p>
        </div>
      </Section>
    </main>
  );
}
