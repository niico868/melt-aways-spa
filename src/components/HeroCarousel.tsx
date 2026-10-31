import heroBanner from "@/assets/hero-banner-treatment.png.asset.json";

/**
 * HeroMedia — full-bleed autoplaying background video with a warm readability
 * wash so the left-aligned headline stays legible.
 */
export function HeroMedia() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <img
        src={heroBanner.url}
        alt=""
        aria-hidden
        className="w-full h-full object-cover object-center"
        fetchPriority="high"
        decoding="async"
      />

      {/* Mobile readability wash — heavy white over the headline area */}
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{
          background:
            "linear-gradient(165deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 40%, rgba(255,255,255,0.55) 72%, rgba(255,255,255,0.18) 100%)",
        }}
      />
      {/* Desktop wash — dense white over left text column, fades to clear on the right */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.6) 55%, rgba(255,255,255,0.2) 78%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
}

// Preserve the old name as an alias to avoid breaking any lingering imports.
export function HeroCarousel() {
  return <HeroMedia />;
}
