import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { GALLERY } from "@/lib/ba";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [
    { title: "Before & After Gallery — Melt Aways" },
    { name: "description", content: "Before and after photos from Melt Aways clients organised by treatment category. Results vary. Consultation required." },
  ]}),
  component: Gallery,
});

function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const cats = Object.entries(GALLERY);
  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Eyebrow>Client Results</Eyebrow>
        <h1 className="text-4xl lg:text-6xl font-light text-ink leading-tight">Before & After Gallery</h1>
        <p className="mt-5 text-taupe leading-relaxed">
          Real Melt Aways clients, organised by treatment category. Tap any photo to view it larger.
        </p>
        <p className="mt-3 text-xs italic text-taupe">Results vary. Consultation required.</p>
      </div>

      <div className="space-y-16">
        {cats.map(([title, items]) => (
          <section key={title}>
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl lg:text-3xl text-ink">{title}</h2>
              <span className="text-xs text-taupe italic">Results vary. Consultation required.</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((it, i) => (
                <button key={i} onClick={() => setLightbox(it.src)}
                  className="group bg-background rounded-2xl overflow-hidden border border-border/60 card-shadow hover:-translate-y-0.5 transition">
                  <div className="aspect-[3/4] overflow-hidden bg-blush">
                    <img src={it.src} alt={`${title} before and after`} loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out">
          <button onClick={() => setLightbox(null)} className="absolute top-5 right-5 text-white p-2" aria-label="Close">
            <X className="w-6 h-6" />
          </button>
          <img src={lightbox} alt="Before and after enlarged" className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl" />
        </div>
      )}
    </Section>
  );
}