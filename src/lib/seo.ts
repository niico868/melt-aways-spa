import { SITE } from "./site";

/** The one address Google should index (no www). */
export const SITE_URL = "https://meltawaysspa.com";

/** Default 1200x630 link-preview image, hosted on this site. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/default.jpg`;

export const BUSINESS_ID = `${SITE_URL}/#business`;

/** Turn "/media/x.webp" or "/services" into a full https://meltawaysspa.com/... address. */
export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Canonical address for a pathname: no trailing slash (except the home page). */
export function canonicalUrl(pathname: string) {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
  return `${SITE_URL}${clean}`;
}

/** Preview-image meta tags (Open Graph + Twitter) for one image. */
export function ogImageMeta(image: string, alt: string) {
  const url = absoluteUrl(image);
  return [
    { property: "og:image", content: url },
    { property: "og:image:alt", content: alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: url },
  ];
}

/** Structured data describing the business, read by Google and AI search tools. */
export function businessJsonLd() {
  const loc = SITE.locations[0];
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": BUSINESS_ID,
    name: SITE.name,
    alternateName: ["Melt Elite Aesthetics", "MEA", "Melt Aways Spa"],
    description:
      "Consultation-led body contouring, fat melting, skin tightening, anti-aging and wellness treatments in El Dorado, Trinidad and Tobago.",
    url: `${SITE_URL}/`,
    logo: absoluteUrl(SITE.logoMEA),
    image: DEFAULT_OG_IMAGE,
    telephone: "+1-868-378-5630",
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "#240 Eastern Main Road",
      addressLocality: "El Dorado",
      addressRegion: "Trinidad",
      addressCountry: "TT",
    },
    hasMap: loc.mapsUrl,
    areaServed: [
      { "@type": "Country", name: "Trinidad and Tobago" },
      { "@type": "City", name: "Port of Spain" },
      { "@type": "City", name: "St Augustine" },
    ],
    sameAs: [SITE.instagram, SITE.facebook, SITE.tiktok],
  };
}

/** Home > Section > Page breadcrumb trail. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: canonicalUrl(it.path),
    })),
  };
}

export const jsonLdScript = (data: unknown) => ({
  type: "application/ld+json",
  children: JSON.stringify(data),
});
