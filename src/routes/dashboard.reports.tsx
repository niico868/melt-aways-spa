import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { fmtMoney } from "@/components/dashboard/DataTable";
import { ConsultationChart } from "@/components/dashboard/ConsultationChart";
import { TopServicesChart } from "@/components/dashboard/TopServicesChart";
import { useCustomers } from "@/lib/dashboard-tables";
import { useDashboardKpis } from "@/lib/dashboard-queries";

export const Route = createFileRoute("/dashboard/reports")({ component: ReportsPage });

function useEmployeePerformance() {
  return useQuery({
    queryKey: ["reports", "employee-perf"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 90);
      const { data: appts } = await supabase
        .from("appointments")
        .select("id, status, employee_id, employees(id, full_name)")
        .gte("scheduled_at", since.toISOString());
      const { data: invs } = await (supabase.from("invoices") as any)
        .select("total, status, voided_at, appointments(employee_id)")
        .gte("created_at", since.toISOString());
      const map = new Map<string, { name: string; completed: number; total: number; noShow: number; revenue: number }>();
      for (const a of (appts ?? []) as any[]) {
        const key = a.employee_id ?? "unassigned";
        const name = a.employees?.full_name ?? "Unassigned";
        const cur = map.get(key) ?? { name, completed: 0, total: 0, noShow: 0, revenue: 0 };
        cur.total += 1;
        if (a.status === "Completed") cur.completed += 1;
        if (a.status === "No Show" || a.status === "Cancelled") cur.noShow += 1;
        map.set(key, cur);
      }
      for (const i of (invs ?? []) as any[]) {
        if (i.status === "Void" || i.voided_at) continue;
        const key = i.appointments?.employee_id ?? "unassigned";
        const cur = map.get(key);
        if (cur) { cur.revenue += Number(i.total); map.set(key, cur); }
      }
      return Array.from(map.entries())
        .map(([id, v]) => ({ id, ...v }))
        .sort((a, b) => b.revenue - a.revenue);
    },
  });
}

function useConversionMetrics() {
  return useQuery({
    queryKey: ["reports", "conversion"],
    queryFn: async () => {
      const [{ data: consults }, { data: appts }, { data: invs }] = await Promise.all([
        supabase.from("consultations").select("id, status"),
        supabase.from("appointments").select("id, status"),
        (supabase.from("invoices") as any).select("total, status, voided_at"),
      ]);
      const totalConsults = consults?.length ?? 0;
      const converted = (consults ?? []).filter(c => c.status === "Booked" || c.status === "Completed").length;
      const consultRate = totalConsults ? Math.round((converted / totalConsults) * 100) : 0;
      const totalAppts = appts?.length ?? 0;
      const missed = (appts ?? []).filter(a => a.status === "No Show" || a.status === "Cancelled").length;
      const noShowRate = totalAppts ? Math.round((missed / totalAppts) * 100) : 0;
      const nonVoid = (invs ?? []).filter((i: any) => i.status !== "Void");
      const avgTicket = nonVoid.length
        ? nonVoid.reduce((s: number, i: any) => s + Number(i.total), 0) / nonVoid.length
        : 0;
      return {
        totalConsults, converted, consultRate,
        totalAppts, missed, noShowRate,
        avgTicket,
      };
    },
  });
}

function ReportsPage() {
  const { data: kpis } = useDashboardKpis();
  const { data: customers } = useCustomers();
  const { data: m } = useConversionMetrics();
  const { data: perf } = useEmployeePerformance();

  return (
    <DashboardPage title="Reports" subtitle="Business performance at a glance">
      <div className="p-3 space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Tile label="Sales (month)" value={fmtMoney(kpis?.salesMonth ?? 0)} />
          <Tile label="Appointments today" value={String(kpis?.appointmentsToday ?? 0)} />
          <Tile label="Total customers" value={String(customers?.length ?? 0)} />
          <Tile label="Avg ticket" value={fmtMoney(m?.avgTicket ?? 0)} />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-2">Decision insights</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Tile
              label="Consult → Appt rate"
              value={`${m?.consultRate ?? 0}%`}
              hint={`${m?.converted ?? 0} of ${m?.totalConsults ?? 0} consultations booked`}
            />
            <Tile
              label="No-show / cancel rate"
              value={`${m?.noShowRate ?? 0}%`}
              hint={`${m?.missed ?? 0} of ${m?.totalAppts ?? 0} appointments`}
            />
            <Tile label="Cost per lead" value="—" hint="Add ad spend to track" />
            <LeadSourceTile />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-[280px]">
          <ConsultationChart />
          <TopServicesChart />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-2">Employee performance · last 90 days</div>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left font-medium py-2 px-3">Therapist</th>
                  <th className="text-right font-medium py-2 px-3">Booked</th>
                  <th className="text-right font-medium py-2 px-3">Completed</th>
                  <th className="text-right font-medium py-2 px-3">No-show / cancel</th>
                  <th className="text-right font-medium py-2 px-3">Completion</th>
                  <th className="text-right font-medium py-2 px-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {(perf ?? []).length === 0 && (
                  <tr><td colSpan={6} className="text-center text-gray-400 py-4">No appointments yet in this window.</td></tr>
                )}
                {(perf ?? []).map((p) => {
                  const rate = p.total ? Math.round((p.completed / p.total) * 100) : 0;
                  return (
                    <tr key={p.id} className="border-t border-gray-100">
                      <td className="py-2 px-3 font-medium text-gray-800">{p.name}</td>
                      <td className="py-2 px-3 text-right text-gray-700">{p.total}</td>
                      <td className="py-2 px-3 text-right text-emerald-700">{p.completed}</td>
                      <td className="py-2 px-3 text-right text-rose-600">{p.noShow}</td>
                      <td className="py-2 px-3 text-right text-gray-700">{rate}%</td>
                      <td className="py-2 px-3 text-right font-semibold text-[#1A1A2E]">{fmtMoney(p.revenue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}

function Tile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
      <div className="text-[10px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-lg font-bold text-[#1A1A2E] mt-1">{value}</div>
      {hint && <div className="text-[10px] text-gray-400 mt-0.5">{hint}</div>}
    </div>
  );
}

function LeadSourceTile() {
  const sources = [
    { name: "WhatsApp", count: 6, color: "bg-emerald-500" },
    { name: "Instagram", count: 5, color: "bg-pink-500" },
    { name: "Website", count: 4, color: "bg-sky-500" },
  ];
  const total = sources.reduce((s, x) => s + x.count, 0);
  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
      <div className="text-[10px] uppercase tracking-wide text-gray-500">Lead sources</div>
      <div className="mt-1 space-y-1">
        {sources.map((s) => (
          <div key={s.name} className="flex items-center gap-2 text-[11px]">
            <span className={`inline-block w-2 h-2 rounded-full ${s.color}`} />
            <span className="text-gray-700 flex-1">{s.name}</span>
            <span className="font-semibold text-[#1A1A2E]">{s.count}</span>
            <span className="text-gray-400">({Math.round((s.count / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}