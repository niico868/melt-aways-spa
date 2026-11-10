import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [
    { title: "Treatment Journal — Melt Elite Aesthetics" },
    { name: "description", content: "Educational content, treatment guidance, seasonal preparation tips, and body sculpting education from Melt Elite Aesthetics." },
    { property: "og:title", content: "Treatment Journal — Melt Elite Aesthetics" },
    { property: "og:description", content: "Treatment guidance, preparation tips, and body sculpting education from the Melt Elite Aesthetics team." },
  ]}),
  component: JournalLayout,
});

function JournalLayout() {
  return <Outlet />;
}