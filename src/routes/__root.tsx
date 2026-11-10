import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { lazy, Suspense, type ReactNode } from "react";

import { MotionConfig } from "framer-motion";

import appCss from "../styles.css?url";
import { DEFAULT_OG_IMAGE, businessJsonLd, canonicalUrl, jsonLdScript, ogImageMeta } from "@/lib/seo";

const Header = lazy(() => import("../components/Header").then((m) => ({ default: m.Header })));
const Footer = lazy(() => import("../components/Footer").then((m) => ({ default: m.Footer })));
const WhatsAppFab = lazy(() => import("../components/WhatsAppFab").then((m) => ({ default: m.WhatsAppFab })));
const ScrollProgress = lazy(() => import("../components/ScrollProgress").then((m) => ({ default: m.ScrollProgress })));
const AmbientAudio = lazy(() => import("../components/AmbientAudio").then((m) => ({ default: m.AmbientAudio })));

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Melt Elite Aesthetics (MEA) | Body Contouring & Aesthetics in Trinidad & Tobago" },
      { name: "description", content: "Melt Elite Aesthetics (MEA) — body-contouring, fat melting, skin tightening & anti-aging in El Dorado, Trinidad & Tobago. Consultation-led, respectful, premium." },
      { name: "author", content: "Melt Elite Aesthetics" },
      { property: "og:title", content: "Melt Elite Aesthetics — Body Contouring & Aesthetics in Trinidad & Tobago" },
      { property: "og:description", content: "MEA — consultation-led body contouring, skin tightening & anti-aging in Trinidad & Tobago." },
      { property: "og:type", content: "website" },
      ...ogImageMeta(DEFAULT_OG_IMAGE, "Melt Elite Aesthetics: body contouring and skin treatments in El Dorado, Trinidad"),
      { property: "og:site_name", content: "Melt Elite Aesthetics" },
      { property: "og:locale", content: "en_TT" },
      { name: "twitter:title", content: "Melt Elite Aesthetics — Body Contouring & Aesthetics in Trinidad & Tobago" },
      { name: "twitter:description", content: "MEA — consultation-led body contouring, skin tightening & anti-aging in Trinidad & Tobago." },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/GreatVibes.woff2", crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/Inter.woff2", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Great+Vibes&family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [jsonLdScript(businessJsonLd())],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: (props) => <ErrorComponent error={props.error as Error} reset={props.reset} />,
});

function RootShell({ children }: { children: ReactNode }) {
  // One canonical address per page, so www/non-www and ?query variants count as one page.
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  const canonical = canonicalUrl(pathname);
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Honour the visitor's "reduce motion" setting for all Framer Motion reveals. */}
      <MotionConfig reducedMotion="user">
      <Suspense fallback={null}>
        <div data-public-chrome="site-progress"><ScrollProgress /></div>
        <div data-public-chrome="site-header"><Header /></div>
      </Suspense>
      <main data-public-chrome="site-main">
        <Outlet />
      </main>
      <Suspense fallback={null}>
        <div data-public-chrome="site-footer"><Footer /></div>
        <div data-public-chrome="site-whatsapp"><WhatsAppFab /></div>
        <div data-public-chrome="site-audio"><AmbientAudio /></div>
      </Suspense>
      </MotionConfig>
    </QueryClientProvider>
  );
}
