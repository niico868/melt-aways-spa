import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";
const paths = [
  "/","/services","/packages","/products","/gallery","/reviews","/booking","/contact","/faq","/policies",
  "/visiting","/timeline","/journal",
  "/locations/body-contouring-trinidad",
  "/locations/fat-melting-treatments-trinidad",
  "/locations/skin-tightening-trinidad",
  "/locations/morpheus8-trinidad",
  "/locations/anti-aging-facial-trinidad",
  "/locations/body-sculpting-before-carnival",
  "/locations/beauty-clinic-woodbrook",
  "/locations/body-contouring-st-augustine",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = paths.map(p => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});