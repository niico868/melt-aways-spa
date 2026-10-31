import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  MessageCircle, ArrowRight, Plane, Sparkles, Heart,
  ClipboardList, UserCog, Wand2, LineChart, Sprout, Star, Quote,
} from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { REVIEWS, CONCIERGE_WA, CONCIERGE_MESSAGE, waClick } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { HeroMedia } from "@/components/HeroCarousel";
import { CertProviderStrip } from "@/components/CertProviderStrip";
import { VipProgram } from "@/components/VipProgram";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BA_IMAGES } from "@/lib/ba";
import heroBanner from "@/assets/hero-banner-treatment.png.asset.json";
import maVisiting from "@/assets/ma-visiting.png.asset.json";
import homeToning from "@/assets/treatments/Muscle_Toning.png.asset.json";
import homeSkinTightening from "@/assets/treatments/Skin_Tightening.png.asset.json";
import homeCavitation from "@/assets/treatments/Cavitation.jpg.asset.json";
import homeButtFiller from "@/assets/treatments/Butt_Lift.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Melt Aways · Personalized Body Contouring for Real Bodies | Trinidad & Tobago" },
      { name: "description", content: "Consultation-led body contouring, skin tightening, and wellness treatments in Trinidad & Tobago. Personalized care plans built around real goals, real bodies, and honest conversation." },
      { property: "og:title", content: "Melt Aways · Personalized Body Contouring for Real Bodies" },
      { property: "og:description", content: "Real bodies. Real goals. Consultation first. Premium body contouring and wellness in Trinidad & Tobago." },
      { property: "og:image", content: heroBanner.url },
    ],
    links: [
      { rel: "preload", as: "image", href: homeToning.url },
      { rel: "preload", as: "image", href: homeSkinTightening.url },
      { rel: "preload", as: "image", href: homeCavitation.url },
      { rel: "preload", as: "image", href: homeButtFiller.url },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Reveal><RealResults /></Reveal>
      <Reveal><VipProgram /></Reveal>
      <Reveal><VisitingTrinidad /></Reveal>
      <Reveal><Method /></Reveal>
      <Reveal><FeaturedTreatments /></Reveal>
      <CertProviderStrip />
      <Reveal><ClientReviews /></Reveal>
      <Reveal><TreatmentFinder /></Reveal>
    </div>
  );
}

/* ───────────────────────── HERO ───────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[640px] lg:min-h-[760px]">
      <HeroMedia />
      <div className="bg-bloom" aria-hidden />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-20 pt-24 lg:pt-40 pb-24 lg:pb-40 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-7 lg:pl-6">
          <Reveal delay={0.1}>
            <p className="script-hero text-gold mb-6">Your most confident self lives here.</p>
          </Reveal>
          <Reveal delay={0.25}>
            <h2 className="font-serif tracking-[0.18em] uppercase text-primary text-sm sm:text-base lg:text-lg mb-4">
              Melt Elite Aesthetics
            </h2>
          </Reveal>
          <Reveal delay={0.4}>
            <h1 className="font-serif text-[2rem] sm:text-5xl lg:text-[3.6rem] leading-[1.05] text-ink">
              Personalized Body Contouring
              <span className="block italic text-primary">for Real Bodies</span>
              <span className="block">and Real Goals.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.9}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/booking" className="inline-flex items-center gap-2 rounded-full bg-fresh text-fresh-foreground px-7 py-4 font-medium btn-lux soft-shadow">
                Book a Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="hidden lg:block lg:col-span-5" aria-hidden />
      </div>
    </section>
  );
}

/* ─────────────────── REAL RESULTS, REAL PEOPLE ─────────────────── */
function RealResults() {
  return (
    <section className="relative bg-gradient-to-b from-background via-blush/40 to-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-10 text-center">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary/80">
          <Sprout className="w-4 h-4" /> Real Results. Real People.
        </p>
        <h2 className="mt-5 font-serif text-4xl lg:text-6xl text-ink leading-[1.05]">
          Real Results, Real <em className="not-italic text-primary">Confidence</em>.
        </h2>
        <p className="mt-5 text-taupe max-w-2xl mx-auto">
          See the difference personalized care and the right treatment plan can make. Each story below
          is built around a real consultation, a real goal, and a real timeline.
        </p>

        {/* Stat row */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Stat value="60+" label="Happy Clients" sub="and counting" duration={4.5} flicker />
          <a
            href="https://share.google/efNeYdAQwEjKkmsPC"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl hover:bg-blush/30 transition-colors"
            aria-label="See our Google reviews"
          >
            <Stat value="4.9" label="Google Rating" sub="Read on Google ↗" icon={<StarRow />} />
          </a>
          <Stat value="Trusted" label="Across Trinidad and Tobago" sub="and beyond" icon={<Sparkles className="w-7 h-7 text-primary" />} large={false} />
        </div>

        {/* Result preview cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {RESULT_PREVIEWS.map((r) => (
            <ResultCard key={r.name} {...r} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link to="/gallery" className="inline-flex items-center gap-2 rounded-full bg-background border border-ink/15 px-6 py-3 text-sm font-medium hover:bg-blush lift-on-hover">
            View All Results
          </Link>
        </div>
      </div>
    </section>
  );
}

const RESULT_PREVIEWS = [
  { name: "Amara",  treatment: "Body Contouring",   duration: "After 6 sessions", quote: "I feel lighter, stronger, and more confident in my own skin.", image: BA_IMAGES[6] },
  { name: "Gary",   treatment: "Fat Melting",       duration: "After 8 weeks",    quote: "My clothes fit better and I finally feel like myself again.",   image: BA_IMAGES[0] },
  { name: "Kiana",  treatment: "Skin Tightening",   duration: "After 4 sessions", quote: "I see a difference every time I look in the mirror.",          image: BA_IMAGES[5] },
  { name: "Naomi",  treatment: "Stretch Mark Care", duration: "After 6 weeks",    quote: "My waist is more defined and I feel so much better.",          image: BA_IMAGES[2] },
];

function ResultCard({ name, treatment, duration, quote, image }: { name: string; treatment: string; duration: string; quote: string; image: string }) {
  return (
    <article className="bg-background rounded-3xl overflow-hidden border border-border/60 card-shadow lift-on-hover hover:-translate-y-1 text-left">
      <div className="aspect-[4/5] overflow-hidden bg-blush">
        <img src={image} alt={`${name} – ${treatment} before & after`} className="w-full h-full object-contain" loading="eager" decoding="async" fetchPriority="high" />
      </div>
      <div className="p-5">
        <h3 className="font-serif text-2xl text-primary">{name}</h3>
        <p className="mt-0.5 text-sm font-medium text-ink">{treatment}</p>
        <p className="text-xs text-taupe">{duration}</p>
        <p className="mt-3 text-sm italic text-taupe/90 leading-relaxed border-l-2 border-primary/30 pl-3">
          "{quote}"
        </p>
      </div>
    </article>
  );
}

function Stat({ value, label, sub, icon, large = true, duration, flicker }: { value: string; label: string; sub: string; icon?: React.ReactNode; large?: boolean; duration?: number; flicker?: boolean }) {
  // Detect a leading numeric in the value (e.g. "500+", "4.9") for CountUp animation.
  const m = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const numeric = m ? parseFloat(m[1]) : null;
  const decimals = m && m[1].includes(".") ? (m[1].split(".")[1]?.length ?? 0) : 0;
  const suffix = m ? m[2] : "";
  return (
    <div className="flex items-center justify-center gap-4 px-4 py-5 rounded-2xl">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blush text-primary">
        {icon ?? <Heart className="w-6 h-6" />}
      </div>
      <div className="text-left">
        <div className={`font-serif text-ink ${large ? "text-4xl" : "text-2xl"}`}>
          {numeric !== null ? (
            <CountUp value={numeric} decimals={decimals} suffix={suffix} duration={duration} flicker={flicker} />
          ) : (
            value
          )}
        </div>
        <div className="text-sm font-medium text-ink/80">{label}</div>
        <div className="text-xs text-primary/70">{sub}</div>
      </div>
    </div>
  );
}

function StarRow() {
  return (
    <div className="flex">
      {[0, 1, 2, 3, 4].map(i => (
        <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
      ))}
    </div>
  );
}

/* ─────────────────── THE MELT AWAYS METHOD ─────────────────── */
function Method() {
  type Step = { icon: React.ReactNode; tag: string; title: string; body: string };
  const steps: Step[] = [
    { icon: <ClipboardList className="w-5 h-5" />, tag: "CONSULT",     title: "We Start With Understanding",      body: "Every plan begins with a private, unhurried conversation about your goals, lifestyle, and history." },
    { icon: <UserCog className="w-5 h-5" />,       tag: "PERSONALIZE", title: "No One-Size-Fits-All Treatments",  body: "We design a treatment pathway shaped around your body, your timeline, and your comfort level." },
    { icon: <Wand2 className="w-5 h-5" />,         tag: "TREAT",       title: "Treatments With Purpose",          body: "Every session is intentional. We treat with care, explain as we go, and never rush a result." },
    { icon: <LineChart className="w-5 h-5" />,     tag: "TRACK",       title: "Progress You Can See",             body: "We document measurements and milestones so progress is clear, honest, and personal." },
    { icon: <Sprout className="w-5 h-5" />,        tag: "MAINTAIN",    title: "Long-Term Confidence",             body: "Maintenance plans support results between sessions and keep confidence steady year-round." },
  ];
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start 75%", "end 25%"] });
  const vineLen = useTransform(scrollYProgress, [0, 0.92], [0, 1]);
  const bloomScale = useTransform(scrollYProgress, [0.85, 1], [0.4, 1]);
  const bloomOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  // Pre-compute leaf opacities (hooks cannot live inside .map)
  const leaf0 = useTransform(scrollYProgress, [0.13, 0.23], [0, 1]);
  const leaf1 = useTransform(scrollYProgress, [0.31, 0.41], [0, 1]);
  const leaf2 = useTransform(scrollYProgress, [0.50, 0.60], [0, 1]);
  const leaf3 = useTransform(scrollYProgress, [0.69, 0.79], [0, 1]);
  const leaves = [
    { cx: 18, cy: 180, op: leaf0 },
    { cx: 42, cy: 360, op: leaf1 },
    { cx: 18, cy: 550, op: leaf2 },
    { cx: 42, cy: 740, op: leaf3 },
  ];
  return (
    <Section>
      <div className="text-center max-w-3xl mx-auto">
        <Eyebrow>The Melt Aways Method™</Eyebrow>
        <h2 className="font-serif text-4xl lg:text-6xl text-ink leading-[1.05]">
          Every body is different,
          <span className="block italic text-primary">so treatment never comes first.</span>
        </h2>
        <p className="mt-5 text-taupe leading-relaxed">
          Understanding comes first. Through a consultation-led approach, a personalized treatment
          pathway is created around goals, lifestyle, timeline, and comfort level.
        </p>
      </div>

      <div ref={wrapRef} className="mt-16 relative">
        {/* Vine SVG — grows with scroll */}
        <svg
          className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 h-full w-16 pointer-events-none"
          viewBox="0 0 60 1000"
          preserveAspectRatio="none"
          aria-hidden
        >
          <motion.path
            d="M30 0 C 18 120, 42 220, 30 340 S 14 540, 30 680 S 46 860, 30 980"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-primary/60"
            style={{ pathLength: vineLen }}
          />
          {/* Tiny leaves along the vine */}
          {leaves.map((l, i) => (
            <motion.circle
              key={i}
              cx={l.cx}
              cy={l.cy}
              r="4"
              className="fill-fresh"
              style={{ opacity: l.op }}
            />
          ))}
          {/* Final bloom */}
          <motion.g style={{ scale: bloomScale, opacity: bloomOpacity, transformOrigin: "30px 985px" }}>
            <circle cx="30" cy="985" r="10" className="fill-primary/80" />
            <circle cx="22" cy="978" r="6" className="fill-rose" />
            <circle cx="38" cy="978" r="6" className="fill-rose" />
            <circle cx="22" cy="992" r="6" className="fill-rose" />
            <circle cx="38" cy="992" r="6" className="fill-rose" />
            <circle cx="30" cy="985" r="3.5" className="fill-gold" />
          </motion.g>
        </svg>
        {/* Mobile subtle line */}
        <div className="lg:hidden absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" aria-hidden />

        <ol className="space-y-12 lg:space-y-20 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <li key={s.tag} className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center`}>
              <Reveal
                direction={i % 2 === 0 ? "left" : "right"}
                duration={1.0}
                className={`${i % 2 ? "lg:order-2" : "lg:order-1"} bg-background border border-border/60 rounded-3xl p-7 lg:p-9 card-shadow lift-on-hover hover:-translate-y-1`}
              >
                <div className="flex items-center gap-3 text-primary">
                  <span className="w-11 h-11 rounded-full bg-blush flex items-center justify-center">
                    {s.icon}
                  </span>
                  <span className="text-xs tracking-[0.25em] uppercase">Step 0{i + 1} · {s.tag}</span>
                </div>
                <h3 className="mt-4 font-serif text-2xl lg:text-3xl text-ink">{s.title}</h3>
                <p className="mt-3 text-taupe leading-relaxed">{s.body}</p>
              </Reveal>
              <div className={`hidden lg:block ${i % 2 ? "lg:order-1" : "lg:order-2"}`} aria-hidden />
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14 text-center">
        <Link to="/booking" className="inline-flex items-center gap-2 rounded-full bg-fresh text-fresh-foreground px-7 py-4 font-medium hover:opacity-90 lift-on-hover soft-shadow">
          Find My Treatment Path <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Section>
  );
}

/* ─────────────────── FEATURED TREATMENTS ─────────────────── */
function FeaturedTreatments() {
  const featured = [
    { slug: "muscle-toning",   name: "Body Sculpting / Toning", desc: "Define and strengthen targeted areas with body-sculpting support designed to complement your lifestyle.", image: homeToning.url },
    { slug: "skin-tightening", name: "Skin Tightening",         desc: "Support firmer-looking skin and smoother body definition through treatment plans created around your goals.", image: homeSkinTightening.url },
    { slug: "cavitation",      name: "Cavitation",              desc: "A non-surgical body-contouring treatment commonly used to support stubborn fat reduction.", image: homeCavitation.url },
    { slug: "butt-filler",     name: "Butt Filler",             desc: "A consultation-led contouring service designed for shape, volume, and body confidence.", image: homeButtFiller.url },
  ];
  return (
    <Section>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <Eyebrow>Featured Treatments</Eyebrow>
          <h2 className="font-serif text-4xl lg:text-5xl text-ink leading-tight">
            A short list of the treatments clients ask for most.
          </h2>
          <p className="mt-4 text-taupe">
            Not sure which fits? Your consultation will recommend the right combination,
            sequence, and timeline.
          </p>
        </div>
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
          View all services <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featured.map((s) => (
          <article key={s.slug} className="group bg-background rounded-3xl overflow-hidden border border-border/60 card-shadow lift-on-hover hover:-translate-y-1 flex flex-col">
            <div className="aspect-[4/3] overflow-hidden bg-blush">
              <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="eager" decoding="async" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-serif text-2xl text-ink">{s.name}</h3>
              <p className="mt-2 text-sm text-taupe leading-relaxed flex-1">{s.desc}</p>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-xs uppercase tracking-[0.2em] text-primary/70">Starting with consultation</span>
                <Link to="/booking" className="text-ink font-medium hover:text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Book <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────── CLIENT REVIEWS ─────────────────── */
function ClientReviews() {
  const REVIEW_NAMES: Record<string, string> = {
    "K.B.": "Kayla",
    "D.S.": "Danielle",
    "A.R.": "Anika",
    "M.J.": "Maya",
    "C.P.": "Camille",
    "N.G.": "Nia",
    "L.W.": "Leah",
  };
  const homeReviews = REVIEWS.slice(0, 3);
  const [open, setOpen] = useState<number | null>(null);
  const active = open !== null ? homeReviews[open] : null;
  const activeName = active ? (REVIEW_NAMES[active.initials] ?? active.initials) : "";
  return (
    <section className="bg-gradient-to-b from-background via-blush/30 to-background py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <Eyebrow>Kind Words</Eyebrow>
          <h2 className="font-serif text-4xl lg:text-5xl text-ink leading-tight">
            From the people we've worked with.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homeReviews.map((r, i) => {
            const name = REVIEW_NAMES[r.initials] ?? r.initials;
            return (
              <button
                key={r.initials}
                onClick={() => setOpen(i)}
                className="text-left bg-background rounded-3xl p-8 card-shadow lift-on-hover hover:-translate-y-1 relative focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <Quote className="w-7 h-7 text-primary/40 absolute top-6 right-6" />
                <StarRow />
                <p className="mt-5 font-serif text-lg text-ink/90 leading-relaxed line-clamp-2">{r.text}</p>
                <span className="mt-3 inline-block text-xs uppercase tracking-[0.2em] text-primary/70">Read full review →</span>
                <div className="mt-6 text-sm">
                  <div className="font-medium text-ink">{name}</div>
                  <div className="text-taupe text-xs">{r.service}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <Link to="/reviews" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
            Read more reviews <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-ink">{activeName}</DialogTitle>
                <p className="text-xs uppercase tracking-[0.2em] text-primary/70">{active.service}</p>
              </DialogHeader>
              <StarRow />
              <p className="mt-2 font-serif text-base lg:text-lg text-ink/90 leading-relaxed whitespace-pre-line">
                {active.text}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ─────────────────── TREATMENT FINDER ─────────────────── */
function TreatmentFinder() {
  return (
    <Section>
      <div className="rounded-[2.5rem] bg-gradient-to-br from-blush via-background to-cream border border-border/60 p-10 lg:p-16 overflow-hidden relative text-center max-w-4xl mx-auto">
        <div className="absolute -right-32 -top-32 w-[420px] h-[420px] rounded-full bg-rose/30 blur-3xl" aria-hidden />
        <div className="relative">
          <Eyebrow>Treatment Finder</Eyebrow>
          <h2 className="font-serif text-4xl lg:text-5xl text-ink leading-tight">
            Not sure where to start?
            <span className="block italic text-primary">Let's point you in the right direction.</span>
          </h2>
          <p className="mt-6 text-taupe leading-relaxed max-w-2xl mx-auto">
            Complete a quick intake form with your personal details, goals, concerns, and timeline.
            Based on your answers, we'll suggest suitable treatment options and let you know if you
            qualify for a free consultation.
          </p>
          <Link to="/treatment-finder" className="mt-8 inline-flex items-center gap-2 rounded-full bg-fresh text-fresh-foreground px-7 py-4 font-medium btn-lux soft-shadow">
            Start Treatment Finder <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}


/* ─────────────────── VISITING TRINIDAD ─────────────────── */
function VisitingTrinidad() {
  return (
    <Section className="!py-16">
      <div className="rounded-[2rem] overflow-hidden border border-border/60 bg-background card-shadow lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.95fr)] lg:items-stretch">
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <p className="script-hero text-primary mb-2">Visiting Trinidad & Tobago 🇹🇹</p>
          <h3 className="mt-1 font-serif text-2xl lg:text-3xl text-ink leading-snug">Plan your treatment before you arrive.</h3>
          <p className="mt-3 text-taupe leading-relaxed max-w-2xl">
            Coming home for Carnival, Christmas, or vacation? Start a consultation before you land so we can plan around your event dates and availability.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/visiting" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium hover:opacity-90 lift-on-hover soft-shadow">
              <Plane className="w-4 h-4" /> Plan My Visit
            </Link>
            <a href={CONCIERGE_WA} onClick={waClick(CONCIERGE_MESSAGE)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-fresh text-fresh-foreground px-6 py-3 font-medium hover:opacity-90 lift-on-hover">
              <MessageCircle className="w-4 h-4" /> Concierge
            </a>
          </div>
        </div>
        <div className="relative min-h-[260px] lg:min-h-full bg-cream">
          <img src={maVisiting.url} alt="Travel planning setup for visiting Melt Aways clients" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background via-background/70 to-transparent lg:hidden" aria-hidden />
          <div className="absolute inset-y-0 left-0 hidden lg:block w-28 bg-gradient-to-r from-background via-background/72 to-transparent" aria-hidden />
        </div>
      </div>
    </Section>
  );
}


