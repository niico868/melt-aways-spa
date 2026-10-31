import { createFileRoute } from "@tanstack/react-router";
import { AppointmentsPage } from "@/pages/AppointmentsPage";

export const Route = createFileRoute("/dashboard/appointments/")({
  validateSearch: (s: Record<string, unknown>): { new?: "1" } => (s.new === "1" || s.new === 1 ? { new: "1" } : {}),
  component: AppointmentsPage,
});