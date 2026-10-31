import logoAsset from "@/assets/logo.asset.json";
import meaLogoAsset from "@/assets/mea-logo.png.asset.json";

export const SITE = {
  name: "Melt Aways",
  tagline: "Where we melt fat and reveal the you inside.",
  phone: "1(868) 378-5630",
  phoneDigits: "18683785630",
  email: "meltawaystt@gmail.com",
  hours: "8:00 AM – 4:00 PM",
  whatsapp: "https://wa.me/18683785630?text=Hi%20Melt%20Aways%2C%20I%20would%20like%20to%20book%20a%20consultation.",
  whatsappBase: "https://wa.me/18683785630",
  instagram: "https://www.instagram.com/meltawaystt/",
  facebook: "https://www.facebook.com/p/Melt-Aways-100088384824763/",
  tiktok: "https://www.tiktok.com/@melt.aways.spa.tt",
  locations: [
    {
      name: "El Dorado",
      address: "#240 Eastern Main Road, El Dorado, Trinidad and Tobago, West Indies",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=240+Eastern+Main+Road+El+Dorado+Trinidad",
      embed: "https://www.google.com/maps?q=240+Eastern+Main+Road,+El+Dorado,+Trinidad+and+Tobago&output=embed",
    },
  ],
  logo: logoAsset.url,
  logoMEA: meaLogoAsset.url,
  logoMAS: logoAsset.url,
};

/** True for phones/tablets, where the wa.me deep link opens the native app. */
function isMobileDevice() {
  if (typeof navigator === "undefined") return true; // SSR: keep the universal wa.me link
  return /Android|iPhone|iPad|iPod|Mobile|Silk|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/**
 * WhatsApp link that works everywhere:
 * - phones/tablets -> wa.me (opens the app)
 * - desktop -> web.whatsapp.com (opens WhatsApp Web / login screen, never the api error page)
 */
export function waLink(message?: string) {
  const text = message ? encodeURIComponent(message) : encodeURIComponent(DEFAULT_WA_MESSAGE);
  return isMobileDevice()
    ? `https://wa.me/${SITE.phoneDigits}?text=${text}`
    : `https://web.whatsapp.com/send?phone=${SITE.phoneDigits}&text=${text}&type=phone_number&app_absent=0`;
}

const DEFAULT_WA_MESSAGE = "Hi Melt Aways, I would like to book a consultation.";

// Concierge prefilled message for visiting / foreign clients.
export const CONCIERGE_MESSAGE =
  "Hi Melt Aways, I’m interested in planning treatment before visiting Trinidad. My travel dates are ___ and I’d like help choosing the right service.";

/** Must be called at render/click time so device detection runs in the browser. */
export const conciergeWaLink = () => waLink(CONCIERGE_MESSAGE);

export const CONCIERGE_WA = waLink(CONCIERGE_MESSAGE);

/**
 * Click handler for any WhatsApp anchor: resolves the correct link in the browser
 * at click time (desktop -> WhatsApp Web login, mobile -> app).
 */
export function waClick(message?: string) {
  return (e: { preventDefault: () => void }) => {
    e.preventDefault();
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  };
}



export const NAV_LEFT = [
  { to: "/visiting", label: "Visiting", flag: true },
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/packages", label: "Packages" },
] as const;

export const NAV_RIGHT = [
  { to: "/journal", label: "Journal" },
  { to: "/gallery", label: "Gallery" },
  { to: "/booking", label: "Booking" },
] as const;

export const NAV = [...NAV_LEFT, ...NAV_RIGHT] as const;

export const SERVICES = [
  { slug: "fat-melting", name: "Fat Melting", desc: "Target stubborn areas with non-surgical body-contouring treatments designed to support a slimmer, more sculpted look." },
  { slug: "skin-tightening", name: "Skin Tightening", desc: "Support firmer-looking skin and smoother body definition through treatment plans created around your goals." },
  { slug: "anti-aging", name: "Anti-Aging", desc: "Refresh the appearance of your skin with treatments focused on glow, firmness, texture, and confidence." },
  { slug: "muscle-toning", name: "Muscle Toning", desc: "Help define and strengthen targeted areas with body-sculpting support designed to complement your lifestyle." },
  { slug: "breast-filler", name: "Breast Filler", desc: "A consultation-led enhancement service for clients seeking fuller, more balanced-looking results." },
  { slug: "butt-filler", name: "Butt Filler", desc: "A consultation-led contouring service designed for shape, volume, and body confidence." },
  { slug: "cavitation", name: "Cavitation", desc: "A non-surgical body-contouring treatment commonly used to support stubborn fat reduction." },
  { slug: "lymphatic-drainage", name: "Lymphatic Drainage", desc: "A gentle treatment designed to support circulation, reduce fluid retention, and assist post-treatment recovery." },
  { slug: "slimming-injections", name: "Slimming Injections", desc: "A wellness and weight-support service that requires proper consultation before recommendation." },
  { slug: "peptides", name: "Peptides", desc: "Support anti-aging, wellness, and body goals through guided peptide-based treatment options." },
  { slug: "body-contouring", name: "Body-Contouring", desc: "Personalised treatment paths designed to help sculpt, define, and support your ideal body goals." },
  { slug: "iv-therapy", name: "IV Therapy", desc: "Consultation-led intravenous infusions to support hydration, wellness, recovery and radiance." },
];

export const PACKAGES = [
  { name: "Sculpt & Smooth", desc: "A contouring-focused journey for clients targeting stubborn areas with a smoother finish.", bestFor: "First-time body-contouring clients", includes: ["Cavitation", "Lymphatic Drainage", "Skin Tightening"] },
  { name: "Melt & Tighten", desc: "A combined plan that pairs fat-melting treatments with skin tightening for a more defined silhouette.", bestFor: "Clients seeking definition + firmness", includes: ["Fat Melting", "Skin Tightening", "Body-Contouring"] },
  { name: "Glow & Firm", desc: "An anti-aging and skin-focused plan designed to restore glow and improve skin appearance.", bestFor: "Anti-aging and skin confidence", includes: ["Anti-Aging", "Skin Tightening", "Lymphatic Drainage"] },
  { name: "Full Body Confidence", desc: "A comprehensive premium plan covering multiple zones for a complete body confidence journey.", bestFor: "Clients ready for a full transformation", includes: ["Cavitation", "Body-Contouring", "Skin Tightening", "Lymphatic Drainage"] },
];

export const REVIEWS = [
  {
    initials: "K.B.",
    service: "Body Contouring",
    text: "Melt away spa, 10/10, It's the place to be. Mrs. Krystal comes highly trained and very professional in everything she does. Even though she has a busy schedule, she answers questions very promptly, putting her clients first always. Ladies, if you lack body self-esteem like myself, rest assured everything is private, heard and confidential with her. Her staff is just as warm and inviting, bursting with positive energy. I always leave the spa laughing hard. Some times I feel I am highly favored by Krystal, by the love, attention and care she gives me — but that's just her overall genuine character to everyone that crosses her path. I cannot speak highly enough of this exceptional service from the staff and management of Melt Away Spa.",
  },
  {
    initials: "D.S.",
    service: "Transformation Journey",
    text: "Good morning. I just want to let you know that I'm so happy I made the decision one day to get up and get started. At the beginning it felt like I wasn't getting anywhere, and then came this week where the changes and effort are really starting to show. The compliments are coming in, clothes are fitting differently. I owe it all to you and your skills, knowing how passionate you are about your work and bringing confidence back into people's lives. I'm so proud of you, from the day I stepped through your doors, and now coming into the beautiful ambiance you've created for your customers. Here's to a great flourishing business venture. Can't wait to continue my journey with you.",
  },
  {
    initials: "A.R.",
    service: "Slimming Injections",
    text: "Good evening! I'm so glad I made the decision to start these injections. At first I was skeptical and didn't think it would help my specific circumstances. In the first couple weeks I got a bit discouraged because I wasn't seeing the results I hoped for, but now I'm seeing changes. The change that shocked me the most was the change to my cycle — it was much lighter and the pain was much less. I kept waiting for it to get worse but it never did. My cravings are non-existent and I eat till I'm satisfied and no more. I feel overall so much better, not sluggish and sleepy after meals. I just feel like a new person. I can't wait for the rest of my journey.",
  },
  {
    initials: "M.J.",
    service: "Weight Loss Program",
    text: "Just want to send out a special thank you to Melt Away Spa. I have been on my weight loss journey for three weeks now, started at 188.6 lbs and I can proudly say I am currently at 170.4 lbs. I have tried all sorts of diets and weight loss programs, and nothing worked for me until I discovered Melt Away Spa. I am so happy to be on this journey with them — they are the most motivating people who encourage your success. Thank you.",
  },
  {
    initials: "C.P.",
    service: "Visceral Fat & Waist Training",
    text: "Good night. I just wanted to give this honest testimonial of Meltaways Spa because truly, this is the first time I've received positive results on my midsection from any weight loss regime. I'm peri-menopausal and suffered with visceral fat on my tummy for over 10 years that seemed like it wouldn't go away. I tried exercising and I would lose weight everywhere except my stomach. Krystal and her staff are very dedicated, knowledgeable and caring in what they do, and they are very keen on making sure you get positive results. I have to stress though, if you are not willing to put in the work with them, you will not see the desired outcome. This is not an easy fix — waist training, drinking water and good eating habits are key, and I have lost inches, my clothes fit much better and my confidence in my body has returned. I will definitely be recommending others to visit her facility.",
  },
  {
    initials: "N.G.",
    service: "GLP-1 (Tirzepatide)",
    text: "For anyone who's struggling with their weight loss I just want to give a quick update about my experience. I'm in my early 40s and I've been struggling to lose the stubborn pounds — nothing seemed to be working until I decided to try the GLP-1 medication with the assistance of Meltaways Spa. Initially I started with the lowest dose semaglutide which didn't work, until I switched to tirzepatide, which kick-started my metabolism. Within a month I've lost 13 pounds, and that's without rigorous exercise — but you still have to be in a calorie deficit and be mindful of what you eat. Anyone thinking about looking fabulous in your 40s, check out Krystal at Meltaway Spa. She's knowledgeable and friendly, and she'll guide you to jump-start your weight loss journey.",
  },
  {
    initials: "L.W.",
    service: "Weight Loss Program",
    text: "Good day Melt Away family. I want to just come on here to express my deepest gratitude to Melt Away Spa. I have been on my weight loss journey for one month now and I must say I am so impressed by the way I have been shedding those pounds. I am finally feeling comfortable in my own skin after years of trying all sorts of diets. I am successful today because of Melt Away Spa. From the bottom of my heart, thank you. I look forward to continuing this journey with you.",
  },
];

export const FAQS = [
  { q: "Do I need a consultation before booking?", a: "Yes. Every treatment journey begins with a consultation so we can understand your goals and recommend a suitable plan." },
  { q: "Which treatment is best for me?", a: "There is no single answer. Your consultation helps us match the right treatment path to your body and goals." },
  { q: "How many sessions will I need?", a: "Most clients benefit from a course of sessions. Your recommended plan will be discussed during consultation." },
  { q: "Are results immediate?", a: "Some clients notice early visible changes. Most results build gradually with a consistent treatment plan." },
  { q: "Is there downtime?", a: "Most of our treatments are non-surgical with minimal downtime, though this depends on the service." },
  { q: "Who may not be suitable for treatment?", a: "Pregnancy, certain medical conditions, and some medications may affect suitability. We will review this with you in consultation." },
  { q: "Do you offer packages?", a: "Yes. We offer curated treatment packages to support consistent results. Pricing is shared after consultation." },
  { q: "Where are you located?", a: "We are located at #240 Eastern Main Road, El Dorado, Trinidad and Tobago." },
  { q: "How do I book?", a: "Submit a consultation request online, message us on WhatsApp, or call us during opening hours." },
  { q: "What should I do before my appointment?", a: "We will share simple pre-treatment guidance once your consultation is confirmed." },
];

export const POLICIES = [
  { title: "Booking Policy", body: "All appointments are scheduled following a consultation. Booking confirmation will be shared once your plan is reviewed. [Final policy approval pending]" },
  { title: "Consultation Policy", body: "A consultation is required before any treatment. This ensures the recommended path is safe and suitable for you. [Final policy approval pending]" },
  { title: "Deposit Policy", body: "A deposit may be required to secure your appointment. Deposit details will be shared at the time of booking. [Final policy approval pending]" },
  { title: "Cancellation Policy", body: "We kindly ask for advance notice if you must cancel. Specific notice windows will be confirmed at booking. [Final policy approval pending]" },
  { title: "Late Arrival Policy", body: "If you arrive late, your appointment may be shortened or rescheduled to respect other clients' time. [Final policy approval pending]" },
  { title: "Refund Policy", body: "Refunds are reviewed case-by-case and may be subject to consultation outcomes. [Final policy approval pending]" },
  { title: "Health & Safety Disclaimer", body: "Melt Aways does not provide medical diagnosis. All recommendations are made within the scope of consultation-led aesthetic and wellness services." },
  { title: "Results Disclaimer", body: "Results vary by client. No specific outcome is guaranteed. Consistency, lifestyle, and personalised guidance influence results." },
  { title: "Privacy Policy", body: "Information collected through our forms is used solely to support your consultation and booking experience. We do not share your information with third parties." },
];

export type Lead = {
  id: string;
  createdAt: string;
  status: "New Lead" | "Contacted" | "Consultation Booked" | "Treatment Recommended" | "Package Offered" | "Paid" | "Completed" | "Follow-Up Needed" | "Not Suitable" | "Lost Lead";
  fullName: string;
  phone: string;
  email: string;
  location: string;
  concern: string;
  targetArea: string;
  targetAreas: string[];
  targetAreaOther: string;
  priorTreatments: string;
  medical: string;
  medication: string;
  pregnancy: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  suggestedPackage: string;
};

export const LEAD_STATUSES: Lead["status"][] = [
  "New Lead", "Contacted", "Consultation Booked", "Treatment Recommended",
  "Package Offered", "Paid", "Completed", "Follow-Up Needed", "Not Suitable", "Lost Lead",
];

const KEY = "meltaways.leads.v1";

export function getLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveLead(lead: Lead) {
  const all = getLeads();
  all.unshift(lead);
  localStorage.setItem(KEY, JSON.stringify(all));
}
export function updateLead(id: string, patch: Partial<Lead>) {
  const all = getLeads().map(l => l.id === id ? { ...l, ...patch } : l);
  localStorage.setItem(KEY, JSON.stringify(all));
}