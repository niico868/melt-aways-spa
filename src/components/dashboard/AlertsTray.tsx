import { AlertTriangle, AlertCircle } from "lucide-react";
import { useAlerts } from "@/lib/dashboard-queries";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AlertsTray() {
  const { data } = useAlerts();
  const qc = useQueryClient();
  const rows = (data ?? []).slice(0, 3);
  async function dismiss(id: string) {
    await supabase.from("alerts").update({ dismissed: true }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["dashboard", "alerts"] });
  }
  return (
    <div className="bg-[#FFFBF0] rounded-xl border border-amber-200 p-3 h-full flex flex-col min-h-0">
      <div className="flex items-center gap-2 mb-1 flex-shrink-0">
        <AlertTriangle className="text-amber-600" size={14} />
        <h3 className="text-sm font-semibold text-gray-900">Alerts</h3>
        <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{(data ?? []).length}</span>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        {rows.length === 0 && <div className="text-[11px] text-gray-500 py-2">No active alerts.</div>}
        {rows.map((a) => (
          <div key={a.id} className="flex items-center gap-1.5 py-1 border-b border-amber-100 last:border-0">
            <AlertCircle className="size-3 text-amber-600 flex-shrink-0" />
            <div className="text-[11px] text-gray-700 flex-1 leading-snug line-clamp-2">{a.message}</div>
            {a.kind === "action" ? (
              <button onClick={() => dismiss(a.id)} className="text-[10px] text-white bg-[#E8246A] hover:bg-[#C91D5C] rounded px-1.5 py-0.5 flex-shrink-0">{a.action_label ?? "Action"}</button>
            ) : (
              <button onClick={() => dismiss(a.id)} className="text-[10px] text-gray-500 border border-gray-200 rounded px-1.5 py-0.5 bg-white flex-shrink-0">Dismiss</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}