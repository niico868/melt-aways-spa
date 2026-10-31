import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/sales")({ component: () => <Outlet /> });

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PartiallyPaid: "bg-amber-50 text-amber-700 border-amber-200",
    Sent: "bg-sky-50 text-sky-700 border-sky-200",
    Draft: "bg-gray-50 text-gray-600 border-gray-200",
    Void: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const cls = map[status] ?? "bg-gray-50 text-gray-600 border-gray-200";
  const label = status === "PartiallyPaid" ? "Partial" : status;
  return <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] ${cls}`}>{label}</span>;
}