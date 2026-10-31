import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/Section";
import { SERVICES } from "@/lib/site";
import { SERVICES_CONTENT, type ServiceContent } from "@/lib/services-content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import fatMelting from "@/assets/treatments/Fat_Melting.png.asset.json";
import skinTight from "@/assets/treatments/Skin_Tightening.png.asset.json";
import antiAging from "@/assets/treatments/Anti_Aging.png.asset.json";
import muscleToning from "@/assets/treatments/Muscle_Toning.png.asset.json";
import breastFiller from "@/assets/treatments/Breast_Filler.png.asset.json";
import buttFiller from "@/assets/treatments/Butt_Lift.png.asset.json";
import cavitation from "@/assets/treatments/Cavitation.jpg.asset.json";
import lymphatic from "@/assets/treatments/Lymphatic_Drainage.png.asset.json";
import slimming from "@/assets/treatments/Fat_Dissolving.png.asset.json";
import peptides from "@/assets/treatments/Peptides.png.asset.json";
import bodyContour from "@/assets/treatments/Body_Contouring.png.asset.json";
import ivTherapy from "@/assets/treatments/IV_Therapy.jpg";

const IMAGES: Record<string, string> = {
  "fat-melting": fatMelting.url,
  "skin-tightening": skinTight.url,
  "anti-aging": antiAging.url,
  "muscle-toning": muscleToning.url,
  "breast-filler": breastFiller.url,
  "butt-filler": buttFiller.url,
  "cavitation": cavitation.url,
  "lymphatic-drainage": lymphatic.url,
  "slimming-injections": slimming.url,
  "peptides": peptides.url,
  "body-contouring": bodyContour.url,
  "iv-therapy": ivTherapy,
};

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    const content = SERVICES_CONTENT[params.slug];
    if (!service || !content) throw notFound();
    return { service, content };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Treatment not found — Melt Aways" }, { name: "robots", content: "noindex" }] };
    }
    const { service, content } = loaderData;
    const title = `${service.name} — Melt Aways`;
    const desc = content.tagline || service.desc;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: () => (
    <Section>
      <div className="text-center">
        <h1 className="text-3xl">Treatment not found</h1>
        <Link to="/services" className="mt-4 inline-block text-primary">Back to services</Link>
      </div>
    </Section>
  ),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service, content } = Route.useLoaderData();
  const c: ServiceContent = content;
  const image = IMAGES[service.slug];

  return (
    <Section>
      <div className="max-w-3xl mx-auto">
        <Eyebrow>Our Treatments</Eyebrow>
        <h1 className="text-4xl lg:text-6xl font-light text-ink leading-tight">{service.name}</h1>
        {c.tagline && <p className="mt-5 text-taupe text-lg">{c.tagline}</p>}

        {image && (
          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-3xl bg-blush">
            <img src={image} alt={service.name} className="w-full h-full object-cover" />
          </div>
        )}

        <Prose title="Overview" body={c.overview} />
        <Prose title="How it works" body={c.howItWorks} />
        <List title="Benefits" items={c.benefits} />
        <List title="Ideal for" items={c.idealFor} />
        <Prose title="What to expect" body={c.whatToExpect} />
        <Prose title="Aftercare" body={c.aftercare} />

        {(c.duration || c.sessions) && (
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {c.duration && <InfoCard label="Session duration" value={c.duration} />}
            {c.sessions && <InfoCard label="Recommended sessions" value={c.sessions} />}
          </div>
        )}

        {c.faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl text-ink mb-4">Frequently asked</h2>
            <Accordion type="single" collapsible className="w-full">
              {c.faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                  <AccordionContent className="text-taupe leading-relaxed">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        <div className="mt-12 rounded-3xl bg-cream p-8 lg:p-10 text-center">
          <p className="font-script text-3xl text-gold">Start with consultation</p>
          <h2 className="mt-2 text-2xl text-ink">Let our team recommend the right direction for you.</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/booking" search={{ service: service.name }} className="rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium soft-shadow hover:opacity-90 transition">Book Consultation</Link>
            <Link to="/services" className="rounded-full border border-ink/20 px-6 py-3 font-medium hover:bg-blush transition">All treatments</Link>
          </div>
          {c.disclaimer ? (
            <p className="mt-4 text-xs text-taupe italic">{c.disclaimer}</p>
          ) : (
            <p className="mt-4 text-xs text-taupe italic">Results vary. Consultation required.</p>
          )}
        </div>
      </div>
    </Section>
  );
}

function Prose({ title, body }: { title: string; body: string }) {
  if (!body) return null;
  return (
    <div className="mt-10">
      <h2 className="text-2xl text-ink">{title}</h2>
      {body.split(/\n\n+/).map((p, i) => (
        <p key={i} className="mt-3 text-taupe leading-relaxed whitespace-pre-line">{p}</p>
      ))}
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-10">
      <h2 className="text-2xl text-ink">{title}</h2>
      <ul className="mt-3 space-y-2 text-taupe leading-relaxed list-disc list-inside">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 p-5 bg-background">
      <p className="text-xs uppercase tracking-wide text-taupe/70">{label}</p>
      <p className="mt-1 text-ink">{value}</p>
    </div>
  );
}