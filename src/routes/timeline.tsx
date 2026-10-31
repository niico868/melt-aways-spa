import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Clock, Calendar, Sparkles, Heart } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { CONCIERGE_WA, CONCIERGE_MESSAGE, waClick } from "@/lib/site";

export const Route = createFileRoute("/timeline")({
  head: () => ({ meta: [
    { title: "Plan Your Treatment Before You Arrive — Melt Aways" },
    { name: "description", content: "Treatment timeline for visiting clients planning body sculpting, skin tightening and facial care before Carnival, Christmas, Weddings, Summer Trips and birthdays." },
    { property: "og:title", content: "Plan Your Treatment Before You Arrive — Melt Aways" },
    { property: "og:description", content: "How far ahead to plan body contouring, skin tightening, lymphatic drainage and facial treatments before your event in Trinidad." },
  ]}),
  component: Timeline,
});

const phases = [
  {
    icon: Calendar,
    when: "3 to 6 months before event",
    body: "Best for full body contouring plans, skin tightening programs, weight loss support, stretch mark rejuvenation, and multiple session treatments.",
  },
  {
    icon: Sparkles,
    when: "6 to 8 weeks before event",
    body: "Best for body sculpting, fat melting, lymphatic drainage, facial rejuvenation, and treatment combinations.",
  },
  {
    icon: Heart,
    when: "2 to 4 weeks before event",
    body: "Best for maintenance, smoothing, tightening, facials, glow treatments, and consultation based quick plans.",
  },
  {
    icon: Clock,
    when: "Final week before event",
    body: "Best for lymphatic drainage, facials, non invasive finishing treatments, and light maintenance.",
  },
];

function Timeline() {
  return (
    <Section>
      <div className="max-w-3xl mx-auto text-center mb-14">
        <Eyebrow>Treatment Timeline</Eyebrow>
        <h1 className="text-4xl lg:text-6xl font-light text-ink leading-tight">Plan Your Treatment Before You Arrive</h1>
        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-primary/80">Treatment Timeline for Visiting Clients</p>
        <p className="mt-5 text-taupe leading-relaxed">
          Not every treatment is right for every body. We start with consultation, then recommend the best
          direction based on your goals, timeline, and health history. Use the guide below to see how early
          most clients begin planning before Carnival, Christmas, Weddings, Summer Trips, and Birthdays.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/visiting" className="rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium soft-shadow hover:opacity-90 transition">
            Plan My Visit
          </Link>
          <a href={CONCIERGE_WA} onClick={waClick(CONCIERGE_MESSAGE)} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 font-medium hover:opacity-90 transition">
            <MessageCircle className="w-4 h-4" /> Speak With Our Treatment Concierge
          </a>
        </div>
      </div>

      <ol className="relative max-w-3xl mx-auto border-l-2 border-blush pl-8 space-y-10">
        {phases.map(p => (
          <li key={p.when} className="relative">
            <span className="absolute -left-[2.55rem] top-1 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <p.icon className="w-4 h-4" />
            </span>
            <div className="bg-background rounded-2xl border border-border/60 p-6 card-shadow">
              <h2 className="text-xl text-ink">{p.when}</h2>
              <p className="mt-2 text-sm text-taupe leading-relaxed">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="max-w-3xl mx-auto mt-16 rounded-3xl bg-cream p-8 lg:p-12 text-center">
        <p className="font-script text-3xl text-gold">Ready when you are</p>
        <h2 className="mt-2 text-2xl lg:text-3xl text-ink">Let our team help plan your visit.</h2>
        <p className="mt-3 text-taupe">Results vary. Suitability is confirmed during consultation.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/visiting" className="rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium soft-shadow hover:opacity-90 transition">Plan My Visit</Link>
          <a href={CONCIERGE_WA} onClick={waClick(CONCIERGE_MESSAGE)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 font-medium hover:opacity-90 transition">
            <MessageCircle className="w-4 h-4" /> Speak With Our Treatment Concierge
          </a>
        </div>
      </div>
    </Section>
  );
}