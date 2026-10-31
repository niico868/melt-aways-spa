import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LogIn, LogOut, Plus, Pencil, Trash2, ScrollText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { DataTable, fmtDateTime, type Column } from "@/components/dashboard/DataTable";
import { useIsAdmin } from "@/lib/use-my-roles";

export const Route = createFileRoute("/dashboard/audit")({ component: AuditPage });

type AuditRow = {
  id: string; created_at: string; actor_email: string | null;
  action: string; entity: string | null; entity_id: string | null;
  summary: string | null; diff: any; user_agent: string | null;
};

const actionIcon: Record<string, any> = {
  sign_in: LogIn, sign_out: LogOut, insert: Plus, update: Pencil, delete: Trash2,
};
const actionTone: Record<string, string> = {
  sign_in: "bg-emerald-50 text-emerald-700",
  sign_out: "bg-gray-100 text-gray-600",
  insert: "bg-blue-50 text-blue-700",
  update: "bg-amber-50 text-amber-700",
  delete: "bg-red-50 text-red-700",
};

function AuditPage() {
  const isAdmin = useIsAdmin();
  const [filter, setFilter] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["audit-log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_log" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as unknown as AuditRow[];
    },
    enabled: isAdmin,
  });

  const rows = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    if (filter === "auth") return data.filter(r => r.action === "sign_in" || r.action === "sign_out");
    if (filter === "writes") return data.filter(r => ["insert","update","delete"].includes(r.action));
    return data.filter(r => r.entity === filter);
  }, [data, filter]);

  if (!isAdmin) {
    return (
      <DashboardPage title="Audit Log">
        <div className="p-6 text-sm text-gray-500">Admin only.</div>
      </DashboardPage>
    );
  }

  const columns: Column<AuditRow>[] = [
    { key: "created_at", header: "When", sortType: "date", accessor: r => r.created_at, render: r => <span className="text-[11px] text-gray-500">{fmtDateTime(r.created_at)}</span> },
    { key: "actor_email", header: "Actor", sortType: "text", accessor: r => r.actor_email || "", render: r => <span className="font-medium text-gray-800">{r.actor_email || "—"}</span> },
    { key: "action", header: "Action", sortType: "text", accessor: r => r.action, render: r => {
      const Icon = actionIcon[r.action] ?? ScrollText;
      return <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${actionTone[r.action] ?? "bg-gray-100"}`}><Icon size={11} />{r.action}</span>;
    }},
    { key: "entity", header: "Where", sortType: "text", accessor: r => r.entity ?? "", render: r => (
      <span className="text-[11px]">
        <span className="text-gray-700">{r.entity ?? "—"}</span>
        {r.entity_id && <span className="text-gray-400"> · {r.entity_id.slice(0,8)}</span>}
      </span>
    )},
    { key: "summary", header: "Summary", sortType: "text", accessor: r => r.summary || "", render: r => <span className="text-[11px] text-gray-600">{r.summary || "—"}</span> },
    { key: "diff", header: "Details", sortType: "none", render: r => r.diff ? (
      <details className="text-[10px]">
        <summary className="cursor-pointer text-[#E8246A]">view</summary>
        <pre className="mt-1 p-2 bg-gray-50 rounded max-h-40 overflow-auto text-[10px] whitespace-pre-wrap">{JSON.stringify(r.diff, null, 2)}</pre>
      </details>
    ) : "—" },
  ];

  const chip = (v: string, label: string) => (
    <button onClick={() => setFilter(v)}
      className={`text-[11px] px-2 py-1 rounded-full border transition ${filter === v ? "bg-[#E8246A] text-white border-[#E8246A]" : "bg-white text-gray-600 border-gray-200 hover:border-[#E8246A]"}`}>
      {label}
    </button>
  );

  return (
    <DashboardPage
      title="Audit Log"
      subtitle={`${data?.length ?? 0} recent events`}
      actions={<div className="flex gap-1 flex-wrap">
        {chip("all","All")}{chip("auth","Sign in/out")}{chip("writes","Changes")}
        {chip("customers","Customers")}{chip("appointments","Appointments")}
        {chip("sales","Sales")}{chip("user_roles","Roles")}
      </div>}
    >
      <DataTable rows={rows as any} columns={columns} loading={isLoading} error={error}
        searchPlaceholder="Search actor / entity / summary…" empty="No activity recorded yet." />
    </DashboardPage>
  );
}