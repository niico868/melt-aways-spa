import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Clock, Phone, Mail, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { SITE, waLink, waClick } from "@/lib/site";
import { postEnquiry } from "@/lib/booking-api";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — Melt Aways" },
    { name: "description", content: "Visit Melt Aways in Woodbrook or St Augustine. Call, WhatsApp, or send us a message." },
  ]}),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = [
      "Hi Melt Aways, I just sent a message from the contact form.",
      `Name: ${f.get("name") || ""}`,
      `Email: ${f.get("email") || ""}`,
      `Phone: ${f.get("phone") || ""}`,
      `Message: ${f.get("message") || ""}`,
    ].join("\n");
    window.open(waLink(msg), "_blank", "noopener,noreferrer");
    setSent(true);
    // Also forward the enquiry to the salon booking API (non-blocking, silent on failure)
    void postEnquiry({
      source: "contact",
      name: String(f.get("name") || ""),
      phone: String(f.get("phone") || ""),
      email: String(f.get("email") || ""),
      message: String(f.get("message") || ""),
      mk_hp: String(f.get("mk_hp") || ""),
    });
  }
  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-14">
        <Eyebrow>Get In Touch</Eyebrow>
        <h1 className="text-4xl lg:text-6xl font-light text-ink">We'd love to hear from you.</h1>
      </div>
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          {SITE.locations.map(l => (
            <div key={l.name} className="bg-background rounded-3xl p-7 border border-border/60 card-shadow">
              <h3 className="text-xl text-ink">{l.name}</h3>
              <p className="mt-2 flex gap-2 text-taupe text-sm"><MapPin className="w-4 h-4 mt-0.5 text-primary" />{l.address}</p>
              <p className="mt-1 flex gap-2 text-taupe text-sm"><Clock className="w-4 h-4 mt-0.5 text-primary" />{SITE.hours}</p>
              <div className="mt-4 aspect-[16/10] rounded-2xl overflow-hidden bg-cream w-full">
                <iframe
                  src={l.embed}
                  title={`Map of Melt Aways ${l.name}`}
                  width="100%" height="100%"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a href={l.mapsUrl} target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm text-primary font-medium hover:underline">
                Open in Google Maps
              </a>
            </div>
          ))}
          <div className="bg-blush/60 rounded-3xl p-7">
            <h3 className="text-lg text-ink">Reach us directly</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 text-primary" /><a href={`tel:+${SITE.phoneDigits}`} className="hover:text-primary">{SITE.phone}</a></li>
              <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 text-primary" /><a href={`mailto:${SITE.email}`} className="hover:text-primary">{SITE.email}</a></li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-background hover:bg-background/70" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-background hover:bg-background/70" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
              <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-background text-xs font-bold w-9 h-9 flex items-center justify-center" aria-label="TikTok">TT</a>
            </div>
            <div className="flex gap-3 mt-6">
              <a href={SITE.whatsapp} onClick={waClick()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] text-white px-5 py-3 text-sm font-medium inline-flex items-center gap-2"><MessageCircle className="w-4 h-4" />WhatsApp</a>
              <Link to="/booking" className="rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium">Book Consultation</Link>
            </div>
          </div>
        </div>
        <form
          onSubmit={onSubmit}
          className="bg-background rounded-3xl border border-border/60 card-shadow p-7 lg:p-10 space-y-5 h-fit"
        >
          <h3 className="text-2xl font-light text-ink">Send us a message</h3>
          {sent ? (
            <p className="text-ink">Thank you. We've received your message and will be in touch soon.</p>
          ) : (
            <>
              <input required name="name" placeholder="Full name" className="w-full rounded-2xl border border-input bg-cream/40 px-4 py-3 outline-none focus:border-primary" />
              <input required type="email" name="email" placeholder="Email" className="w-full rounded-2xl border border-input bg-cream/40 px-4 py-3 outline-none focus:border-primary" />
              <input required type="tel" name="phone" placeholder="Phone" className="w-full rounded-2xl border border-input bg-cream/40 px-4 py-3 outline-none focus:border-primary" />
              <textarea required name="message" rows={5} placeholder="How can we help?" className="w-full rounded-2xl border border-input bg-cream/40 px-4 py-3 outline-none focus:border-primary" />
              <input type="text" name="mk_hp" tabIndex={-1} autoComplete="off" aria-hidden="true"
                defaultValue="" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }} />
              <button className="w-full rounded-full bg-primary text-primary-foreground px-6 py-4 font-medium soft-shadow inline-flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" /> Submit and Message Us
              </button>
            </>
          )}
        </form>
      </div>
    </Section>
  );
}