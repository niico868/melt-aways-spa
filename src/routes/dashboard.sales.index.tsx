import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DashboardPage, PrimaryButton } from "@/components/dashboard/DashboardPage";
import { DataTable, fmtDate, fmtDateTime, fmtMoney, type Column } from "@/components/dashboard/DataTable";
import { Modal, Field, inputCls } from "@/components/dashboard/Modal";
import { useInvoices, useCreateInvoice, paidFrom, type InvoiceRow } from "@/lib/sales";
import { useCustomers } from "@/lib/dashboard-tables";
import { StatusBadge } from "./dashboard.sales";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/sales/")({
  validateSearch: (s: Record<string, unknown>): { new?: "1" } => (s.new === "1" || s.new === 1 ? { new: "1" } : {}),
  component: SalesPage,
});

type StatusFilter = "all" | "Paid" | "PartiallyPaid" | "Sent" | "Void";
type DateFilter = "all" | "today" | "week" | "month";

function SalesPage() {
  const { data, isLoading, error } = useInvoices();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [dateRange, setDateRange] = useState<DateFilter>("all");
  const [newOpen, setNewOpen] = useState(false);

  useEffect(() => {
    if (search.new === "1") {
      setNewOpen(true);
      navigate({ to: "/dashboard/sales", search: {}, replace: true });
    }
  }, [search.new, navigate]);

  const rows = data ?? [];

  const filtered = useMemo(() => {
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startWeek = startToday - 6 * 864e5;
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      const t = new Date(r.created_at).getTime();
      if (dateRange === "today" && t < startToday) return false;
      if (dateRange === "week" && t < startWeek) return false;
      if (dateRange === "month" && t < startMonth) return false;
      return true;
    });
  }, [rows, status, dateRange]);

  const kpis = useMemo(() => {
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startWeek = startToday - 6 * 864e5;
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    let today = 0, week = 0, month = 0, outstanding = 0, refunds = 0;
    for (const r of rows) {
      const paid = paidFrom(r.payments);
      const t = new Date(r.created_at).getTime();
      if (r.status !== "Void") {
        const rev = Math.max(0, paid);
        if (t >= startToday) today += rev;
        if (t >= startWeek) week += rev;
        if (t >= startMonth) month += rev;
        outstanding += Math.max(0, Number(r.total) - paid);
      }
      const rfs = (r.payments ?? []).filter((p) => p.kind === "refund" && new Date(p.recorded_at).getTime() >= startMonth);
      refunds += rfs.reduce((s, p) => s + Number(p.amount), 0);
    }
    return { today, week, month, outstanding, refunds };
  }, [rows]);

  const columns: Column<InvoiceRow>[] = [
    {
      key: "invoice_number",
      header: "Invoice",
      sortType: "text",
      accessor: (r) => r.invoice_number,
      render: (r) => <span className="font-mono text-[11px] text-gray-800">{r.invoice_number}</span>,
    },
    { key: "date", header: "Date", sortType: "date", accessor: (r) => r.created_at, render: (r) => fmtDateTime(r.created_at) },
    {
      key: "appointment",
      header: "Appointment",
      sortType: "date",
      accessor: (r) => r.appointments?.scheduled_at ?? "",
      render: (r) => r.appointments?.scheduled_at
        ? <span className="text-gray-700">{fmtDate(r.appointments.scheduled_at)}</span>
        : <span className="text-gray-400">—</span>,
    },
    {
      key: "customer",
      header: "Customer",
      sortType: "text",
      accessor: (r) => r.customers?.full_name,
      render: (r) => r.customers?.id ? (
        <Link
          to="/dashboard/customers/$id"
          params={{ id: r.customers.id }}
          onClick={(e) => e.stopPropagation()}
          className="text-[#E8246A] hover:underline"
        >
          {r.customers.full_name}
        </Link>
      ) : <span className="text-gray-400">Walk-in</span>,
    },
    {
      key: "items",
      header: "Services / Products",
      sortType: "none",
      render: (r) => {
        const names = [
          ...((r.appointments?.appointment_services ?? []).map((s) => s.services?.name).filter(Boolean) as string[]),
          ...(r.invoice_items ?? []).map((i) => i.description),
        ];
        if (!names.length) return <span className="text-gray-400">—</span>;
        return (
          <span className="text-gray-700">
            {names.slice(0, 2).join(", ")}
            {names.length > 2 && <span className="text-gray-400"> +{names.length - 2}</span>}
          </span>
        );
      },
    },
    {
      key: "staff",
      header: "Staff",
      sortType: "text",
      accessor: (r) => r.employees?.full_name ?? r.appointments?.employees?.full_name ?? "",
      render: (r) => r.employees?.full_name ?? r.appointments?.employees?.full_name ?? <span className="text-gray-400">—</span>,
    },
    { key: "total", header: "Total", className: "text-right", sortType: "currency", accessor: (r) => Number(r.total), render: (r) => <span className="font-medium">{fmtMoney(r.total)}</span> },
    {
      key: "paid",
      header: "Paid",
      className: "text-right",
      sortType: "currency",
      sortValue: (r) => paidFrom(r.payments),
      render: (r) => <span className="text-emerald-700">{fmtMoney(paidFrom(r.payments))}</span>,
    },
    {
      key: "remaining",
      header: "Balance",
      className: "text-right",
      sortType: "currency",
      sortValue: (r) => Math.max(0, Number(r.total) - paidFrom(r.payments)),
      render: (r) => {
        const bal = Math.max(0, Number(r.total) - paidFrom(r.payments));
        return <span className={bal > 0 ? "text-amber-700 font-medium" : "text-gray-400"}>{fmtMoney(bal)}</span>;
      },
    },
    {
      key: "status",
      header: "Status",
      sortType: "status",
      statusOrder: ["Void", "Draft", "Sent", "PartiallyPaid", "Paid"],
      accessor: (r) => r.status,
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <DashboardPage
      title="Sales & Payments"
      subtitle="Invoices, payments, refunds and balances"
      actions={<PrimaryButton onClick={() => setNewOpen(true)}>+ New invoice</PrimaryButton>}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-3 border-b border-gray-100">
        <Stat label="Today" value={fmtMoney(kpis.today)} />
        <Stat label="This week" value={fmtMoney(kpis.week)} />
        <Stat label="This month" value={fmtMoney(kpis.month)} />
        <Stat label="Outstanding" value={fmtMoney(kpis.outstanding)} accent="amber" />
        <Stat label="Refunds (mo)" value={fmtMoney(kpis.refunds)} accent="rose" />
      </div>
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-gray-100 text-[11px]">
        <span className="text-gray-500">Status:</span>
        {(["all", "Paid", "PartiallyPaid", "Sent", "Void"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-2 py-1 rounded-full border ${status === s ? "bg-[#E8246A] text-white border-[#E8246A]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
          >
            {s === "all" ? "All" : s === "PartiallyPaid" ? "Partial" : s}
          </button>
        ))}
        <span className="text-gray-500 ml-3">Date:</span>
        {(["all", "today", "week", "month"] as DateFilter[]).map((d) => (
          <button
            key={d}
            onClick={() => setDateRange(d)}
            className={`px-2 py-1 rounded-full border ${dateRange === d ? "bg-[#E8246A] text-white border-[#E8246A]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
          >
            {d === "all" ? "All" : d[0].toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>
      <DataTable
        rows={filtered}
        columns={columns}
        loading={isLoading}
        error={error}
        searchPlaceholder="Search invoice, customer, phone…"
        empty="No invoices yet."
        onRowClick={(r) => navigate({ to: "/dashboard/sales/$id", params: { id: r.id } })}
        exportName="invoices"
      />
      {newOpen && <NewInvoiceModal onClose={() => setNewOpen(false)} />}
    </DashboardPage>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: "amber" | "rose" }) {
  const color =
    accent === "amber" ? "text-amber-700" : accent === "rose" ? "text-rose-700" : "text-[#1A1A2E]";
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
      <div className="text-[10px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`text-base font-bold mt-1 ${color}`}>{value}</div>
    </div>
  );
}

function NewInvoiceModal({ onClose }: { onClose: () => void }) {
  const { data: customers = [] } = useCustomers();
  const create = useCreateInvoice();
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      const id = await create.mutateAsync({
        customer_id: customerId || null,
        due_date: dueDate || null,
        notes: notes || null,
      });
      toast.success("Invoice created");
      onClose();
      navigate({ to: "/dashboard/sales/$id", params: { id } });
    } catch (e: any) {
      toast.error(e.message ?? "Could not create invoice");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="New invoice">
      <Field label="Customer (optional — leave blank for walk-in)">
        <select className={inputCls} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          <option value="">Walk-in</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.full_name}</option>
          ))}
        </select>
      </Field>
      <Field label="Due date">
        <input type="date" className={inputCls} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </Field>
      <Field label="Notes">
        <textarea className={inputCls} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onClose} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
        <PrimaryButton onClick={submit}>{busy ? "Creating…" : "Create invoice"}</PrimaryButton>
      </div>
    </Modal>
  );
}