import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SERVICES } from "@/lib/site";
import { JOURNAL_POSTS } from "@/lib/journal";
import { SITE_URL } from "@/lib/seo";

type Entry = { path: string; priority: string; changefreq: string; lastmod?: string };

// Public pages people should find in Google. Leave out noindex pages such as /vipconsult.
const PAGES: Entry[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/booking", priority: "0.9", changefreq: "monthly" },
  { path: "/packages", priority: "0.8", changefreq: "monthly" },
  { path: "/vip", priority: "0.8", changefreq: "monthly" },
  { path: "/treatment-finder", priority: "0.7", changefreq: "monthly" },
  { path: "/gallery", priority: "0.7", changefreq: "monthly" },
  { path: "/reviews", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/certifications", priority: "0.6", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/faq", priority: "0.6", changefreq: "monthly" },
  { path: "/visiting", priority: "0.6", changefreq: "monthly" },
  { path: "/timeline", priority: "0.5", changefreq: "monthly" },
  { path: "/journal", priority: "0.6", changefreq: "weekly" },
  { path: "/products", priority: "0.4", changefreq: "monthly" },
  { path: "/policies", priority: "0.3", changefreq: "yearly" },
];

// Keep in step with the PAGES map in src/routes/locations.$slug.tsx.
const LOCATION_SLUGS = [
  "body-contouring-trinidad",
  "fat-melting-treatments-trinidad",
  "skin-tightening-trinidad",
  "morpheus8-trinidad",
  "anti-aging-facial-trinidad",
  "body-sculpting-before-carnival",
  "beauty-clinic-woodbrook",
  "body-contouring-st-augustine",
];

export function sitemapEntries(): Entry[] {
  return [
    ...PAGES,
    ...SERVICES.map((s) => ({ path: `/services/${s.slug}`, priority: "0.8", changefreq: "monthly" })),
    ...LOCATION_SLUGS.map((slug) => ({ path: `/locations/${slug}`, priority: "0.7", changefreq: "monthly" })),
    ...JOURNAL_POSTS.map((p) => ({
      path: `/journal/${p.slug}`,
      priority: "0.6",
      changefreq: "yearly",
      lastmod: p.publishedAt.slice(0, 10),
    })),
  ];
}

export function buildSitemapXml() {
  const urls = sitemapEntries().map(
    (e) =>
      `  <url>\n    <loc>${SITE_URL}${e.path}</loc>\n${e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : ""}    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(buildSitemapXml(), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        }),
    },
  },
});
