import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { CONCIERGE_WA, CONCIERGE_MESSAGE, waClick } from "@/lib/site";

type Page = {
  slug: string;
  title: string;
  h1: string;
  meta: string;
  about: string;
  suitable: string;
  consultation: string;
  safety: string;
  timing: string;
  branch: string;
};

const PAGES: Record<string, Page> = {
  "body-contouring-trinidad": {
    slug: "body-contouring-trinidad",
    title: "Body Contouring in Trinidad — Melt Aways",
    h1: "Body Contouring in Trinidad",
    meta: "Consultation led body contouring in Trinidad. Treatment planning for body confidence, Carnival prep, Weddings, and special events.",
    about: "Body contouring at Melt Aways supports clients looking for smoother, more sculpted body shape through non surgical treatment paths planned around your goals.",
    suitable: "Clients targeting stubborn areas, post pregnancy changes, fluctuating weight, or anyone wanting a more confident silhouette before a major event.",
    consultation: "Every body contouring plan begins with consultation. We review your goals, timeline, health history, and lifestyle before recommending a direction.",
    safety: "Not every treatment is right for every body. Pregnancy, certain medical conditions, and some medications may affect suitability.",
    timing: "Most clients begin a body contouring plan 6 weeks to 6 months before an event. See the Treatment Timeline for full guidance.",
    branch: "Available at our El Dorado studio.",
  },
  "fat-melting-treatments-trinidad": {
    slug: "fat-melting-treatments-trinidad",
    title: "Fat Melting Treatments in Trinidad — Melt Aways",
    h1: "Fat Melting Treatments in Trinidad",
    meta: "Non surgical fat melting treatments in Trinidad. Cavitation and contouring sessions, consultation led.",
    about: "Fat melting treatments help support reduction in stubborn areas when paired with consistency, lifestyle support, and a treatment plan built for you.",
    suitable: "Clients wanting to address stubborn fat areas on the abdomen, waist, back, thighs, hips, or arms.",
    consultation: "We recommend a consultation first so we can confirm if a fat melting plan is the right direction for you.",
    safety: "Pregnancy and certain conditions may make this service unsuitable. We will discuss this with you in consultation.",
    timing: "Most clients begin a fat melting plan 2 to 6 months before a major event.",
    branch: "Available at our El Dorado studio.",
  },
  "skin-tightening-trinidad": {
    slug: "skin-tightening-trinidad",
    title: "Skin Tightening in Trinidad — Melt Aways",
    h1: "Skin Tightening in Trinidad",
    meta: "Consultation led skin tightening treatments in Trinidad. Support for firmer looking skin, smoother body and face definition.",
    about: "Skin tightening at Melt Aways supports firmer looking skin and improved body and facial definition through a guided plan.",
    suitable: "Clients looking for support after weight changes, post pregnancy, or simply wanting a smoother and firmer look.",
    consultation: "Suitability and treatment plans are confirmed during consultation.",
    safety: "Some medical conditions and medications may affect suitability. We will review this with you before any session.",
    timing: "Most clients see best support with a course of sessions over several weeks.",
    branch: "Available at our El Dorado studio.",
  },
  "morpheus8-trinidad": {
    slug: "morpheus8-trinidad",
    title: "Morpheus8 in Trinidad — Melt Aways",
    h1: "Morpheus8 in Trinidad",
    meta: "Information about Morpheus8 treatment consultations at Melt Aways in Trinidad.",
    about: "Morpheus8 is an advanced skin treatment focused on smoothing, firming, and supporting healthier looking skin. Treatment availability is confirmed during consultation.",
    suitable: "Clients seeking improvement in skin texture, fine lines, and overall facial or body skin appearance.",
    consultation: "A consultation is required so we can review your skin, history, and goals.",
    safety: "Pregnancy, certain skin conditions, and active treatments may affect suitability. Health screening is part of the consultation.",
    timing: "Plan ahead for recovery time between sessions. Your plan will be confirmed at consultation.",
    branch: "Available at our El Dorado studio.",
  },
  "anti-aging-facial-trinidad": {
    slug: "anti-aging-facial-trinidad",
    title: "Anti Aging Facial in Trinidad — Melt Aways",
    h1: "Anti Aging Facial in Trinidad",
    meta: "Anti aging facial treatments in Trinidad designed to support glow, smoother texture, and firmer looking skin.",
    about: "Our anti aging facial direction supports glow, hydration, and a more refreshed appearance through guided care.",
    suitable: "Clients looking for support with skin texture, dullness, fine lines, and a more confident everyday glow.",
    consultation: "Each facial direction is confirmed in consultation so we can match the right approach for your skin.",
    safety: "Active skin conditions, recent procedures, and certain medications may affect suitability.",
    timing: "Most clients benefit from a course of facials, with maintenance between key events.",
    branch: "Available at our El Dorado studio.",
  },
  "body-sculpting-before-carnival": {
    slug: "body-sculpting-before-carnival",
    title: "Body Sculpting Before Carnival in Trinidad — Melt Aways",
    h1: "Body Sculpting Before Carnival in Trinidad",
    meta: "Body sculpting and contouring treatments in Trinidad for clients preparing for Carnival season.",
    about: "Carnival prep is one of the most common reasons clients begin a treatment plan. We help you plan early, stay consistent, and feel confident in costume.",
    suitable: "Masqueraders, performers, and clients wanting to feel more sculpted and confident across costume sections.",
    consultation: "Carnival prep plans start with consultation. Earlier is always better than last minute.",
    safety: "We review goals, timing, health history, and any medications before recommending a Carnival prep direction.",
    timing: "Many clients begin 3 to 6 months before Carnival. Shorter plans are possible based on consultation outcome.",
    branch: "Available at our El Dorado studio.",
  },
  "beauty-clinic-woodbrook": {
    slug: "beauty-clinic-woodbrook",
    title: "Beauty Clinic for Woodbrook Clients — Melt Aways",
    h1: "Beauty Clinic for Woodbrook Clients",
    meta: "Melt Aways serves clients from Woodbrook and Port of Spain from our El Dorado studio: consultation-led body contouring, skin tightening, facials, and wellness.",
    about: "Melt Aways operates from a single premium studio in El Dorado, welcoming many clients travelling in from Woodbrook and the Port of Spain area.",
    suitable: "Clients living or working in the Port of Spain area looking for a trusted beauty and body clinic.",
    consultation: "All services begin with consultation so we can recommend the right path for you.",
    safety: "Treatment suitability is confirmed during consultation. We do not provide diagnosis online.",
    timing: "Plan ahead of events to allow for the right number of sessions.",
    branch: "Visit us at #240 Eastern Main Road, El Dorado.",
  },
  "body-contouring-st-augustine": {
    slug: "body-contouring-st-augustine",
    title: "Body Contouring for St Augustine Clients — Melt Aways",
    h1: "Body Contouring for St Augustine Clients",
    meta: "Body contouring for St Augustine and the East/Central corridor, delivered from our Melt Aways studio in nearby El Dorado.",
    about: "Our El Dorado studio is a short drive from St Augustine and supports clients on the East and Central side of Trinidad.",
    suitable: "Clients on the East or Central side wanting a closer trusted clinic for body and skin care.",
    consultation: "Treatment paths are confirmed during consultation. We listen first, then recommend.",
    safety: "Pregnancy, certain conditions, and medications may affect suitability. We review this with you before booking.",
    timing: "Plan ahead of major events to allow time for a full treatment plan.",
    branch: "Visit us at #240 Eastern Main Road, El Dorado.",
  },
};

export const Route = createFileRoute("/locations/$slug")({
  loader: ({ params }) => {
    const page = PAGES[params.slug];
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.page;
    if (!p) return { meta: [{ title: "Not found — Melt Aways" }] };
    return { meta: [
      { title: p.title },
      { name: "description", content: p.meta },
      { property: "og:title", content: p.title },
      { property: "og:description", content: p.meta },
    ]};
  },
  notFoundComponent: () => (
    <Section>
      <div className="text-center"><h1 className="text-3xl">Page not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary">Return home</Link>
      </div>
    </Section>
  ),
  component: LocationPage,
});

function LocationPage() {
  const { page: p } = Route.useLoaderData();
  return (
    <Section>
      <div className="max-w-3xl mx-auto">
        <Eyebrow>Trinidad & Tobago</Eyebrow>
        <h1 className="text-4xl lg:text-6xl font-light text-ink leading-tight">{p.h1}</h1>
        <p className="mt-6 text-taupe leading-relaxed">{p.about}</p>

        <Block title="Who it may be suitable for">{p.suitable}</Block>
        <Block title="Why consultation matters">{p.consultation}</Block>
        <Block title="Safety and health history">{p.safety}</Block>
        <Block title="Suggested treatment timing">{p.timing}</Block>
        <Block title="Location">{p.branch}</Block>

        <div className="mt-12 rounded-3xl bg-cream p-8 lg:p-10 text-center">
          <p className="font-script text-3xl text-gold">Start with consultation</p>
          <h2 className="mt-2 text-2xl text-ink">Let our team recommend the right direction for you.</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/booking" className="rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium soft-shadow hover:opacity-90 transition">Book Consultation</Link>
            <Link to="/visiting" className="rounded-full border border-ink/20 px-6 py-3 font-medium hover:bg-blush transition">Visiting Trinidad? Plan My Visit</Link>
            <a href={CONCIERGE_WA} onClick={waClick(CONCIERGE_MESSAGE)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 font-medium hover:opacity-90 transition">
              <MessageCircle className="w-4 h-4" /> Speak With Our Treatment Concierge
            </a>
          </div>
          <p className="mt-4 text-xs text-taupe italic">Results vary. Consultation required.</p>
        </div>
      </div>
    </Section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl text-ink">{title}</h2>
      <p className="mt-2 text-sm text-taupe leading-relaxed">{children}</p>
    </div>
  );
}