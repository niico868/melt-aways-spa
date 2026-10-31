import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [
    { title: "Treatment Journal — Melt Aways" },
    { name: "description", content: "Educational content, treatment guidance, seasonal preparation tips, and body sculpting education from Melt Aways." },
    { property: "og:title", content: "Treatment Journal — Melt Aways" },
    { property: "og:description", content: "Treatment guidance, preparation tips, and body sculpting education from the Melt Aways team." },
  ]}),
  component: JournalLayout,
});

function JournalLayout() {
  return <Outlet />;
}