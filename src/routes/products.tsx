import { createFileRoute } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/Section";
import productsImg from "@/assets/products.jpg";
import petals from "@/assets/petals.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [
    { title: "Products — Melt Aways" },
    { name: "description", content: "Our curated wellness and aftercare products — coming soon." },
  ]}),
  component: Products,
});

const placeholders = [
  { name: "Aftercare Body Oil", note: "Coming Soon" },
  { name: "Glow Serum", note: "Coming Soon" },
  { name: "Wellness Tonic", note: "Coming Soon" },
  { name: "Sculpt Cream", note: "Coming Soon" },
  { name: "Lymphatic Brush", note: "Coming Soon" },
  { name: "Recovery Tea", note: "Coming Soon" },
];

function Products() {
  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-16">
        <Eyebrow>Products</Eyebrow>
        <h1 className="text-4xl lg:text-6xl font-light text-ink">A curated shop is on the way.</h1>
        <p className="mt-5 text-taupe">Aftercare, wellness, and home support designed to extend your in-spa results.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholders.map((p, i) => (
          <article key={p.name} className="bg-background rounded-3xl overflow-hidden border border-border/60 card-shadow">
            <div className="aspect-square bg-cream relative overflow-hidden">
              <img src={i % 2 ? productsImg : petals} alt="" loading="lazy" className="w-full h-full object-cover opacity-90" />
              <span className="absolute top-4 right-4 bg-background/90 backdrop-blur rounded-full px-3 py-1 text-xs font-medium text-primary">{p.note}</span>
            </div>
            <div className="p-6">
              <h3 className="text-lg text-ink">{p.name}</h3>
              <p className="mt-1 text-sm text-taupe">Product details pending</p>
              <button disabled className="mt-4 w-full rounded-full bg-blush text-primary px-5 py-2.5 text-sm font-medium opacity-70 cursor-not-allowed">Notify Me</button>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}