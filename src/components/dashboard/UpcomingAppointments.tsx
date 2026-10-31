import { Check, Pencil } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateAppointments } from "@/lib/query-keys";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUpcomingAppointments } from "@/lib/dashboard-queries";

function StatusBadge({ status }: { status: string }) {
  const cls = status === "Confirmed"
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-amber-50 text-amber-700 border-amber-200";
  return <span className={`${cls} border rounded-full px-1.5 py-0 text-[10px] font-medium`}>{status}</span>;
}

export function UpcomingAppointments() {
  const { data, isLoading } = useUpcomingAppointments();
  const qc = useQueryClient();
  const confirmMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").update({ status: "Confirmed" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAppointments(qc);
      toast.success("Appointment confirmed");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });
  const rows = (data ?? []).slice(0, 4);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 h-full flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-1 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900">Upcoming appointments</h3>
        <Link to="/dashboard/appointments" className="text-[10px] text-[#E8246A] hover:underline">View all</Link>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        {isLoading && <div className="text-xs text-gray-400 py-2">Loading…</div>}
        <table className="w-full">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <th className="text-left font-medium py-1">Time</th>
              <th className="text-left font-medium py-1">Client</th>
              <th className="text-left font-medium py-1">Status</th>
              <th className="text-right font-medium py-1 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a: any) => (
              <tr key={a.id} className="group text-xs border-b border-gray-50 last:border-0 align-top">
                <td className="py-1.5 whitespace-nowrap">
                  <div className="text-gray-900 font-medium leading-tight">
                    {new Date(a.scheduled_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide leading-tight">
                    {new Date(a.scheduled_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }).replace(/ /g, "/")}
                  </div>
                </td>
                <td className="text-gray-900 font-medium py-1.5 truncate">
                  {a.customers?.id ? (
                    <Link to="/dashboard/customers/$id" params={{ id: a.customers.id }} className="hover:text-[#E8246A] hover:underline">
                      {a.customers.full_name}
                    </Link>
                  ) : (a.customers?.full_name ?? "—")}
                </td>
                <td className="py-1.5"><StatusBadge status={a.status} /></td>
                <td className="py-1.5">
                  <div className="flex gap-1 items-center justify-end">
                    {a.status !== "Confirmed" && (
                      <button title="Confirm" onClick={() => confirmMut.mutate(a.id)} className="cursor-pointer hover:bg-green-50 rounded p-0.5"><Check className="size-3 text-green-600" /></button>
                    )}
                    <Link to="/dashboard/appointments/$id" params={{ id: a.id }} title="Open details" className="cursor-pointer hover:bg-gray-100 rounded p-0.5"><Pencil className="size-3 text-gray-400" /></Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}