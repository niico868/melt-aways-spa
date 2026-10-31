import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Phone, Mail, MapPin, Clock } from "lucide-react";
import { SITE, NAV } from "@/lib/site";
import newMasLogo from "@/assets/melt-aways-logo-v4.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 bg-cream border-t border-border">
      <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex flex-col items-start gap-3">
            <img
              src={SITE.logoMEA}
              alt="Melt Elite Aesthetics"
              className="h-28 w-auto [filter:contrast(1.15)_saturate(1.35)]"
            />
            <span className="text-xs text-taupe italic tracking-wide">a subsidiary of</span>
            <img src={newMasLogo.url} alt="Melt Aways Spa" className="h-24 w-auto" />
          </div>
          <p className="mt-4 max-w-sm text-sm text-taupe leading-relaxed">
            A wellness, body-contouring, and aesthetic spa in Trinidad & Tobago. We guide women and men
            toward confidence through respectful, consultation-led care.
          </p>
          <p className="font-script text-2xl text-gold mt-4">{SITE.tagline}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium tracking-wider uppercase mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-taupe">
            {NAV.map(n => <li key={n.to}><Link to={n.to} className="hover:text-primary">{n.label}</Link></li>)}
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link to="/policies" className="hover:text-primary">Policies</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium tracking-wider uppercase mb-4">Visit & Contact</h4>
          <ul className="space-y-3 text-sm text-taupe">
            {SITE.locations.map(l => (
              <li key={l.name} className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary" />{l.address}</li>
            ))}
            <li className="flex gap-2"><Clock className="w-4 h-4 mt-0.5 text-primary" />{SITE.hours}</li>
            <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 text-primary" /><a href={`tel:+${SITE.phoneDigits}`}>{SITE.phone}</a></li>
            <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 text-primary" /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          </ul>
          <div className="flex gap-3 mt-5">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background hover:bg-blush transition" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
            <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background hover:bg-blush transition" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
            <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background hover:bg-blush transition text-xs font-bold w-8 h-8 flex items-center justify-center" aria-label="TikTok">TT</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-taupe">
        © {new Date().getFullYear()} Melt Aways. All rights reserved. Treatments require consultation. Results vary.
      </div>
    </footer>
  );
}