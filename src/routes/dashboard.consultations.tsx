import { createFileRoute } from "@tanstack/react-router";
import { ConsultationsPage } from "@/pages/ConsultationsPage";
export const Route = createFileRoute("/dashboard/consultations")({
  component: ConsultationsPage,
});