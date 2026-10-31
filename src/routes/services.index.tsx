import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/Section";
import { SERVICES } from "@/lib/site";
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

const SERVICE_IMAGES: Record<string, string> = {
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

export const Route = createFileRoute("/services/")({
  head: () => ({ meta: [
    { title: "Services — Melt Aways" },
    { name: "description", content: "Body-contouring, fat melting, skin tightening, anti-aging, cavitation, lymphatic drainage and more — consultation-led at Melt Aways." },
  ]}),
  component: Services,
});

function Services() {
  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-16">
        <Eyebrow>Our Treatments</Eyebrow>
        <h1 className="text-4xl lg:text-6xl font-light text-ink leading-tight">Treatments designed around you.</h1>
        <p className="mt-5 text-taupe">Each service begins with a consultation so we can recommend the right path for your goals.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((s) => (
          <article key={s.slug} className="group bg-background rounded-3xl overflow-hidden border border-border/60 card-shadow flex flex-col">
            <Link to="/services/$slug" params={{ slug: s.slug }} className="aspect-[4/3] overflow-hidden bg-blush block">
              <img src={SERVICE_IMAGES[s.slug]} alt={s.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            </Link>
            <div className="p-7 flex flex-col flex-1">
              <h3 className="text-xl text-ink">
                <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:underline">{s.name}</Link>
              </h3>
              <p className="mt-2 text-sm text-taupe flex-1 leading-relaxed">{s.desc}</p>
              <div className="mt-3 text-xs text-taupe/70">Service price pending · Duration pending</div>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Link to="/services/$slug" params={{ slug: s.slug }} className="text-primary font-medium hover:underline">Learn more</Link>
                <span className="text-border">·</span>
                <Link to="/booking" search={{ service: s.name }} className="text-ink font-medium hover:underline">Book</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}