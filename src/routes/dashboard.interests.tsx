import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { DataTable, fmtDateTime, type Column } from "@/components/dashboard/DataTable";
import { useUpdateConsultationStatus, CONSULT_STATUSES } from "@/lib/dashboard-tables";
import { Heart, Phone, Mail } from "lucide-react";

export const Route = createFileRoute("/dashboard/interests")({ component: InterestsPage });

type Row = {
  id: string;
  client_name: string;
  service_name: string | null;
  status: string;
  submitted_at: string;
  customer_id: string | null;
  customers?: { id: string; full_name: string; phone: string | null; email: string | null } | null;
  services?: { id: string; name: string } | null;
};

function useInterestRows() {
  return useQuery({
    queryKey: ["interests-page"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultations")
        .select("id, client_name, service_name, status, submitted_at, customer_id, customers(id, full_name, phone, email), services(id, name)")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });
}

function statusTone(s: string) {
  if (s === "Paid" || s === "Completed") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "Lost Lead" || s === "Not Suitable") return "bg-gray-100 text-gray-500 border-gray-200";
  if (s === "Follow-Up Needed") return "bg-amber-50 text-amber-700 border-amber-200";
  if (s === "Consultation Booked" || s === "Package Offered") return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-pink-50 text-[#E8246A] border-pink-200";
}

function InterestsPage() {
  const { data, isLoading, error } = useInterestRows();
  const updateStatus = useUpdateConsultationStatus();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [specificDate, setSpecificDate] = useState<string>("");

  const rows = useMemo(() => {
    return (data ?? []).filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (specificDate) {
        const d = new Date(r.submitted_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (key !== specificDate) return false;
      }
      return true;
    });
  }, [data, statusFilter, specificDate]);

  const kpis = useMemo(() => {
    const all = data ?? [];
    const total = all.length;
    const newLeads = all.filter((r) => r.status === "New Lead").length;
    const followUps = all.filter((r) => r.status === "Follow-Up Needed").length;
    const won = all.filter((r) => r.status === "Paid" || r.status === "Completed").length;
    const conversion = total ? Math.round((won / total) * 100) : 0;
    return { total, newLeads, followUps, won, conversion };
  }, [data]);

  const columns: Column<Row>[] = [
    {
      key: "client_name", header: "Client", sortType: "text", accessor: (r) => r.client_name,
      render: (r) => r.customers?.id ? (
        <Link to="/dashboard/customers/$id" params={{ id: r.customers.id }} onClick={(e) => e.stopPropagation()} className="font-medium text-blue-600 hover:underline">
          {r.client_name}
        </Link>
      ) : <span className="font-medium text-gray-800">{r.client_name}</span>,
    },
    {
      key: "contact", header: "Contact", sortType: "text", accessor: (r) => r.customers?.phone || r.customers?.email || "",
      render: (r) => {
        const email = r.customers?.email;
        const phone = r.customers?.phone;
        if (!email && !phone) return <span className="text-gray-300">—</span>;
        return (
          <div className="flex flex-col gap-0.5 text-[11px]">
            {phone && <a href={`tel:${phone}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 hover:text-[#E8246A]"><Phone size={11}/>{phone}</a>}
            {email && <a href={`mailto:${email}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 hover:text-[#E8246A]"><Mail size={11}/>{email}</a>}
          </div>
        );
      },
    },
    { key: "service_name", header: "Interested in", sortType: "text", accessor: (r) => r.services?.name ?? r.service_name ?? "", render: (r) => r.services?.name ?? r.service_name ?? "—" },
    { key: "submitted_at", header: "Submitted", sortType: "date", accessor: (r) => r.submitted_at, render: (r) => fmtDateTime(r.submitted_at) },
    {
      key: "status", header: "Status", sortType: "status", statusOrder: [...CONSULT_STATUSES], accessor: (r) => r.status,
      render: (r) => (
        <select
          value={r.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => updateStatus.mutate({ id: r.id, status: e.target.value })}
          className={`text-[11px] border rounded px-2 py-1 font-medium ${statusTone(r.status)}`}
        >
          {CONSULT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ),
    },
  ];

  return (
    <DashboardPage title="Interest Tracking" subtitle={`${rows.length} of ${data?.length ?? 0} leads`}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3 border-b border-gray-100">
        <Kpi label="Total leads" value={kpis.total} icon={<Heart size={14} />} />
        <Kpi label="New" value={kpis.newLeads} tone="pink" />
        <Kpi label="Follow-up" value={kpis.followUps} tone="amber" />
        <Kpi label="Converted" value={kpis.won} tone="green" />
        <Kpi label="Conversion" value={`${kpis.conversion}%`} tone="blue" />
      </div>
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-gray-100 text-[11px]">
        <span className="text-gray-500">Status:</span>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded px-2 py-1 bg-white">
          <option value="">All</option>
          {CONSULT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-gray-500 ml-2">Date:</span>
        <input type="date" value={specificDate} onChange={(e) => setSpecificDate(e.target.value)} className="border border-gray-200 rounded px-2 py-1 bg-white" />
        {(statusFilter || specificDate) && (
          <button onClick={() => { setStatusFilter(""); setSpecificDate(""); }} className="text-[#E8246A] hover:underline">Clear</button>
        )}
      </div>
      <DataTable rows={rows} columns={columns} loading={isLoading} error={error} searchPlaceholder="Search leads by name or service…" empty="No consultation requests yet." />
    </DashboardPage>
  );
}

function Kpi({ label, value, tone, icon }: { label: string; value: string | number; tone?: "pink" | "green" | "amber" | "blue"; icon?: React.ReactNode }) {
  const toneCls =
    tone === "green" ? "text-emerald-700" :
    tone === "amber" ? "text-amber-700" :
    tone === "blue" ? "text-blue-700" :
    tone === "pink" ? "text-[#E8246A]" :
    "text-[#1A1A2E]";
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between">
      <div>
        <div className="text-[10px] uppercase tracking-wide text-gray-500">{label}</div>
        <div className={`text-lg font-bold mt-0.5 ${toneCls}`}>{value}</div>
      </div>
      {icon && <div className="text-[#E8246A]/70">{icon}</div>}
    </div>
  );
}