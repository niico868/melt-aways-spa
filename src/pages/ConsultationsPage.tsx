import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, Plus, Search, Check, Pencil, Trash2, Phone, Mail, CalendarPlus, Crown, Eye } from "lucide-react";
import { invalidateAppointments, invalidateConsultations, invalidateCustomers } from "@/lib/query-keys";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ColumnFilterButton, applyColumnFilters, type ColumnFilters, type FilterDef } from "@/components/dashboard/ColumnFilter";
import { Modal, Field, inputCls } from "@/components/dashboard/Modal";
import { PrimaryButton } from "@/components/dashboard/DashboardPage";
import { useTableSort, SortableTh, SortResetChip, type SortField } from "@/components/dashboard/useTableSort";
import { CONSULT_STATUSES } from "@/lib/dashboard-tables";

type Range = "today" | "week" | "month" | "all";
type Status = "all" | (typeof CONSULT_STATUSES)[number];
type Category = "all" | "vip_treatment" | "general";

export function categoryLabel(c?: string | null) {
  return c === "vip_treatment" ? "VIP Treatment" : "General";
}

function rangeBounds(r: Range, specificDate?: string) {
  if (specificDate) {
    const start = new Date(specificDate + "T00:00:00");
    const end = new Date(start); end.setDate(end.getDate() + 1);
    return { gte: start.toISOString(), lt: end.toISOString() };
  }
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (r === "today") {
    const end = new Date(start); end.setDate(end.getDate() + 1);
    return { gte: start.toISOString(), lt: end.toISOString() };
  }
  if (r === "week") {
    const s = new Date(start); s.setDate(s.getDate() - 7);
    return { gte: s.toISOString(), lt: null as string | null };
  }
  if (r === "month") {
    const s = new Date(now.getFullYear(), now.getMonth(), 1);
    return { gte: s.toISOString(), lt: null as string | null };
  }
  return { gte: null as string | null, lt: null as string | null };
}

function useConsultations(range: Range, status: Status, q: string, specificDate: string, category: Category) {
  return useQuery({
    queryKey: ["consultations-page", range, status, q, specificDate, category],
    queryFn: async () => {
      const { gte, lt } = rangeBounds(range, specificDate || undefined);
      let query = supabase
        .from("consultations")
        .select("id, client_name, service_name, status, submitted_at, customer_id, service_id, source, category, consultation_type, programme_interest, form_data, customers(id, full_name, email, phone), services(id, name, base_price)")
        .order("submitted_at", { ascending: false });
      if (gte) query = query.gte("submitted_at", gte);
      if (lt) query = query.lt("submitted_at", lt);
      if (status !== "all") query = query.eq("status", status);
      if (category !== "all") query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      const rows = data ?? [];
      const needle = q.trim().toLowerCase();
      if (!needle) return rows;
      return rows.filter((r: any) =>
        (r.client_name ?? "").toLowerCase().includes(needle) ||
        (r.services?.name ?? r.service_name ?? "").toLowerCase().includes(needle) ||
        (r.customers?.email ?? "").toLowerCase().includes(needle),
      );
    },
  });
}

function useLookups() {
  return useQuery({
    queryKey: ["cons-lookups"],
    queryFn: async () => {
      const [customers, services] = await Promise.all([
        supabase.from("customers").select("id, full_name, email, phone").order("full_name"),
        supabase.from("services").select("id, name, base_price").order("name"),
      ]);
      return { customers: customers.data ?? [], services: services.data ?? [] };
    },
  });
}

function statusClasses(s: string) {
  switch (s) {
    case "Completed":
    case "Booked": return "bg-green-50 text-green-700 border-green-200";
    case "Contacted":
    case "Follow-Up Required": return "bg-amber-50 text-amber-700 border-amber-200";
    case "Lost":
    case "Not Suitable": return "bg-gray-100 text-gray-600 border-gray-200";
    default: return "bg-blue-50 text-blue-700 border-blue-200";
  }
}

export function ConsultationsPage() {
  const qc = useQueryClient();
  const [range, setRange] = useState<Range>("month");
  const [status, setStatus] = useState<Status>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [bookFrom, setBookFrom] = useState<any | null>(null);
  const [specificDate, setSpecificDate] = useState<string>("");
  const [category, setCategory] = useState<Category>("all");
  const [viewing, setViewing] = useState<any | null>(null);

  const { data: rawRows = [], isLoading } = useConsultations(range, status, q, specificDate, category);
  const [colFilters, setColFilters] = useState<ColumnFilters>({});
  const filterDefs: FilterDef[] = [
    { key: "client", label: "Client", type: "text", get: (r: any) => r.client_name ?? "" },
    { key: "email", label: "Email", type: "text", get: (r: any) => r.customers?.email ?? "" },
    { key: "phone", label: "Phone", type: "text", get: (r: any) => r.customers?.phone ?? "" },
    { key: "service", label: "Service", get: (r: any) => r.services?.name ?? r.service_name ?? "" },
    { key: "category", label: "Category", get: (r: any) => categoryLabel(r.category) },
    { key: "status", label: "Status", get: (r: any) => r.status ?? "" },
    { key: "date", label: "Submitted", type: "text", get: (r: any) => new Date(r.submitted_at).toLocaleDateString() },
  ];
  const rows = applyColumnFilters(rawRows as any[], filterDefs, colFilters);
  const sortFields: SortField<any>[] = [
    { key: "submitted", type: "date", value: (r) => r.submitted_at },
    { key: "client", type: "text", value: (r) => r.client_name ?? "" },
    { key: "contact", type: "text", value: (r) => r.customers?.email || r.customers?.phone || "" },
    { key: "service", type: "text", value: (r) => r.services?.name ?? r.service_name ?? "" },
    { key: "status", type: "status", statusOrder: ["New", "Contacted", "Booked", "Closed"], value: (r) => r.status },
  ];
  const { sort, setSort, toggle: toggleSort, sorted } = useTableSort<any>(sortFields);
  const sortedRows = sorted(rows as any[]);

  const stats = useMemo(() => {
    const total = rows.length;
    const fresh = rows.filter((r: any) => r.status === "Not Started").length;
    const contacted = rows.filter((r: any) => r.status === "Contacted").length;
    const booked = rows.filter((r: any) => r.status === "Booked").length;
    return { total, fresh, contacted, booked };
  }, [rows]);

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("consultations").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateConsultations(qc);
      toast.success("Consultation updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("consultations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateConsultations(qc);
      toast.success("Consultation deleted");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete"),
  });

  return (
    <div className="h-full overflow-auto px-3 sm:px-4 pt-3 pb-6 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#1A1A2E] leading-tight">Consultations</h1>
          <p className="text-xs text-gray-500">Track inbound leads from consultation submissions through to booked appointments.</p>
        </div>
        <PrimaryButton onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus size={12} className="inline mr-1" />New consultation
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total in view" value={stats.total} tone="pink" />
        <StatCard label="New" value={stats.fresh} tone="blue" />
        <StatCard label="Contacted" value={stats.contacted} tone="amber" />
        <StatCard label="Booked" value={stats.booked} tone="green" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col md:flex-row md:items-center gap-2">
        <div className="flex gap-1 bg-gray-50 rounded-lg p-1">
          {(["today","week","month","all"] as Range[]).map(r => (
            <button key={r} onClick={() => { setRange(r); setSpecificDate(""); }}
              className={`px-3 py-1.5 text-xs rounded-md font-medium capitalize transition ${range === r ? "bg-white shadow text-[#E8246A]" : "text-gray-500 hover:text-gray-700"}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Input type="date" value={specificDate} onChange={e => setSpecificDate(e.target.value)}
            className="h-9 w-full md:w-[160px] text-xs" title="Pick a specific date" />
          {specificDate && (
            <button onClick={() => setSpecificDate("")} className="text-[11px] text-gray-500 hover:text-[#E8246A]">Clear</button>
          )}
        </div>
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by client, service, or email…" className="pl-8 h-9" />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
          <SelectTrigger className="w-full md:w-[160px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {CONSULT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
          <SelectTrigger className="w-full md:w-[160px] h-9 text-xs" aria-label="Filter by category"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="vip_treatment">VIP Treatment</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
        <ColumnFilterButton defs={filterDefs} rows={rawRows as any[]} filters={colFilters} onChange={setColFilters} />
        <SortResetChip sort={sort} onReset={() => setSort(null)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-auto max-h-[calc(100dvh-340px)] min-h-[240px]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 sticky top-0 z-10">
              <tr>
                <SortableTh sortKey="submitted" label="Submitted" type="date" currentSort={sort} onToggle={toggleSort} />
                <SortableTh sortKey="client" label="Client" type="text" currentSort={sort} onToggle={toggleSort} />
                <SortableTh sortKey="contact" label="Contact" type="text" currentSort={sort} onToggle={toggleSort} />
                <SortableTh sortKey="service" label="Service interest" type="text" currentSort={sort} onToggle={toggleSort} />
                <th className="text-left font-medium px-3 py-2">Category</th>
                <SortableTh sortKey="status" label="Status" type="status" currentSort={sort} onToggle={toggleSort} />
                <th className="text-right font-medium px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} className="px-3 py-6 text-center text-xs text-gray-400">Loading…</td></tr>
              )}
              {!isLoading && sortedRows.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-10 text-center text-xs text-gray-400">
                  <ClipboardList className="mx-auto mb-2" size={20} />
                  No consultations in this view.
                </td></tr>
              )}
              {sortedRows.map((c: any) => {
                const d = new Date(c.submitted_at);
                const email = c.customers?.email;
                const phone = c.customers?.phone;
                return (
                  <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                      <div className="text-[11px] text-gray-500">{d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div>
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {c.customers?.id ? (
                        <Link to="/dashboard/customers/$id" params={{ id: c.customers.id }} className="text-[#E8246A] hover:underline">
                          {c.client_name}
                        </Link>
                      ) : <span className="text-gray-900">{c.client_name}</span>}
                    </td>
                    <td className="px-3 py-2 text-gray-700">
                      <div className="flex flex-col gap-0.5 text-[11px]">
                        {email && <a href={`mailto:${email}`} className="flex items-center gap-1 hover:text-[#E8246A]"><Mail size={11} />{email}</a>}
                        {phone && <a href={`tel:${phone}`} className="flex items-center gap-1 hover:text-[#E8246A]"><Phone size={11} />{phone}</a>}
                        {!email && !phone && <span className="text-gray-400">No contact on file</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-700">
                      <div>{c.services?.name ?? c.service_name ?? "—"}</div>
                      {c.category === "vip_treatment" && (
                        <div className="text-[11px] text-gray-500 leading-snug">
                          {[c.form_data?.goals?.primary_goal, (c.form_data?.goals?.target_areas ?? []).join(", "), c.form_data?.readiness?.start_period,
                            [c.form_data?.readiness?.open_three_months === "yes" ? "3-mo" : "", c.form_data?.readiness?.open_six_months === "yes" ? "6-mo" : ""].filter(Boolean).join(" / "),
                          ].filter(Boolean).join(" · ")}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {c.category === "vip_treatment" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          <Crown size={11} /> VIP Treatment
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-500">General</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`border rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClasses(c.status)}`}>{c.status}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1 items-center justify-end">
                        <button title="View submission" onClick={() => setViewing(c)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Eye size={14} /></button>
                        {c.status === "Not Started" && (
                          <button title="Mark contacted" onClick={() => updateStatus.mutate({ id: c.id, status: "Contacted" })}
                            className="p-1.5 rounded hover:bg-amber-50 text-amber-600"><Check size={14} /></button>
                        )}
                        {c.status !== "Booked" && (
                          <button title="Mark booked" onClick={() => updateStatus.mutate({ id: c.id, status: "Booked" })}
                            className="p-1.5 rounded hover:bg-green-50 text-green-700 text-[11px] font-semibold">Booked</button>
                        )}
                        <button title="Create appointment" onClick={() => setBookFrom(c)}
                          className="p-1.5 rounded hover:bg-pink-50 text-[#E8246A]"><CalendarPlus size={14} /></button>
                        <button title="Edit" onClick={() => { setEditing(c); setOpen(true); }}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Pencil size={14} /></button>
                        <button title="Delete" onClick={() => { if (confirm("Delete this consultation?")) remove.mutate(c.id); }}
                          className="p-1.5 rounded hover:bg-rose-50 text-rose-500"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConsultationDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSaved={() => {
          invalidateConsultations(qc);
        }}
      />

      <BookFromConsultationDialog
        consultation={bookFrom}
        onOpenChange={(v) => { if (!v) setBookFrom(null); }}
        onBooked={() => {
          invalidateConsultations(qc);
          invalidateAppointments(qc);
        }}
      />

      <SubmissionDetailModal consultation={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

// ---------- Full submission viewer ----------

function humanize(k: string) {
  return k.replace(/_/g, " ").replace(/^./, (m) => m.toUpperCase());
}

function DetailRow({ label, value }: { label: string; value: any }) {
  let text: string;
  if (value === null || value === undefined || value === "") text = "—";
  else if (Array.isArray(value)) text = value.length ? value.join(", ") : "—";
  else if (typeof value === "boolean") text = value ? "Yes" : "No";
  else if (typeof value === "object") text = JSON.stringify(value);
  else text = String(value);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,220px)_1fr] gap-1 sm:gap-3 py-1.5 border-b border-gray-100 last:border-0">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-sm text-gray-900 break-words whitespace-pre-wrap">{text}</div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#E8246A]">{title}</h3>
      <div className="mt-1.5">{children}</div>
    </section>
  );
}

function SubmissionDetailModal({ consultation, onClose }: { consultation: any | null; onClose: () => void }) {
  const c = consultation;
  const fd = (c?.form_data ?? {}) as any;
  const isVip = c?.category === "vip_treatment";
  return (
    <Modal open={!!c} onClose={onClose} title={isVip ? "VIP consultation submission" : "Consultation submission"}>
      {!c ? null : (
        <div className="max-h-[70vh] overflow-auto pr-1">
          <DetailSection title="Submission">
            <DetailRow label="Client" value={c.client_name} />
            <DetailRow label="Category" value={categoryLabel(c.category)} />
            <DetailRow label="Consultation type" value={c.consultation_type ?? c.service_name} />
            <DetailRow label="Source" value={c.source} />
            <DetailRow label="Programme interest" value={c.programme_interest} />
            <DetailRow label="Status" value={c.status} />
            <DetailRow label="Submitted" value={new Date(c.submitted_at).toLocaleString()} />
            <DetailRow label="Email" value={c.customers?.email ?? fd.contact_email} />
            <DetailRow label="Phone" value={c.customers?.phone ?? fd.contact_phone} />
            {fd.is_test ? <DetailRow label="Test record" value="Yes — marked test data" /> : null}
          </DetailSection>

          {fd.contact && (
            <DetailSection title="Contact preferences">
              {Object.entries(fd.contact).map(([k, v]) => <DetailRow key={k} label={humanize(k)} value={v} />)}
            </DetailSection>
          )}
          {fd.goals && (
            <DetailSection title="Goals and areas of concern">
              {Object.entries(fd.goals).map(([k, v]) => <DetailRow key={k} label={humanize(k)} value={v} />)}
            </DetailSection>
          )}
          {fd.readiness && (
            <DetailSection title="Programme readiness and availability">
              {Object.entries(fd.readiness).map(([k, v]) => <DetailRow key={k} label={humanize(k)} value={v} />)}
            </DetailSection>
          )}
          {fd.health && (
            <DetailSection title="Health screening">
              {Object.entries(fd.health as Record<string, any>).map(([k, v]) => (
                <DetailRow key={k} label={humanize(k)} value={v?.answer === "yes" ? `Yes — ${v.details || "no detail given"}` : v?.answer === "no" ? "No" : "—"} />
              ))}
              <DetailRow label="Anything else" value={fd.health_other} />
            </DetailSection>
          )}
          {fd.consent && (
            <DetailSection title="Consent">
              {Object.entries(fd.consent).map(([k, v]) => <DetailRow key={k} label={humanize(k)} value={v} />)}
            </DetailSection>
          )}
          {!isVip && !fd.contact && (
            <p className="mt-4 text-xs text-gray-500">No structured questionnaire was captured for this submission.</p>
          )}
        </div>
      )}
    </Modal>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "pink" | "green" | "amber" | "blue" }) {
  const tones: Record<string, string> = {
    pink: "bg-[#FDF2F7] text-[#E8246A]",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center justify-between">
      <div>
        <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
        <div className="text-2xl font-bold text-gray-900 leading-tight">{value}</div>
      </div>
      <div className={`size-9 rounded-lg flex items-center justify-center ${tones[tone]}`}>
        <ClipboardList size={18} />
      </div>
    </div>
  );
}

function ConsultationDialog({
  open, onOpenChange, editing, onSaved,
}: { open: boolean; onOpenChange: (v: boolean) => void; editing: any | null; onSaved: () => void; }) {
  const { data: lookups } = useLookups();
  const [clientName, setClientName] = useState("");
  const [customerId, setCustomerId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [status, setStatus] = useState<string>("Not Started");
  const [notes, setNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useMemo(() => {
    if (!open) return;
    setClientName(editing?.client_name ?? "");
    setCustomerId(editing?.customers?.id ?? "");
    setServiceId(editing?.services?.id ?? "");
    setStatus(editing?.status ?? "Not Started");
    setNotes("");
  }, [open, editing]);

  async function save() {
    if (!clientName.trim()) {
      toast.error("Client name is required");
      return;
    }
    setSaving(true);
    const svc = (lookups?.services ?? []).find((s: any) => s.id === serviceId);
    const payload: any = {
      client_name: clientName.trim(),
      customer_id: customerId || null,
      service_id: serviceId || null,
      service_name: svc?.name ?? null,
      status,
    };
    const res = editing
      ? await supabase.from("consultations").update(payload).eq("id", editing.id)
      : await supabase.from("consultations").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(editing ? "Consultation updated" : "Consultation logged");
    onOpenChange(false);
    onSaved();
  }

  return (
    <Modal open={open} onClose={() => onOpenChange(false)} title={editing ? "Edit consultation" : "New consultation"}>
      <Field label="Client name">
        <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Full name" className={inputCls} />
      </Field>
      <Field label="Existing customer (optional)">
        <select value={customerId} onChange={(e) => {
          const id = e.target.value;
          setCustomerId(id);
          const c = (lookups?.customers ?? []).find((x: any) => x.id === id);
          if (c && !clientName.trim()) setClientName(c.full_name);
        }} className={inputCls}>
          <option value="">Not linked</option>
          {(lookups?.customers ?? []).map((c: any) => (
            <option key={c.id} value={c.id}>{c.full_name}</option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Service interest">
          <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={inputCls}>
            <option value="">—</option>
            {(lookups?.services ?? []).map((s: any) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
            {CONSULT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Notes (optional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes…" rows={3} className={inputCls} />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={() => onOpenChange(false)} className="px-3 py-1.5 text-xs text-gray-600">Cancel</button>
        <PrimaryButton onClick={save}>{saving ? "Saving…" : editing ? "Save changes" : "Create"}</PrimaryButton>
      </div>
    </Modal>
  );
}

function toLocalInput(iso?: string | null) {
  const d = iso ? new Date(iso) : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function BookFromConsultationDialog({
  consultation, onOpenChange, onBooked,
}: { consultation: any | null; onOpenChange: (v: boolean) => void; onBooked: () => void; }) {
  const open = !!consultation;
  const { data: lookups } = useLookups();
  const qc = useQueryClient();
  const [when, setWhen] = useState<string>(toLocalInput());
  const [employeeId, setEmployeeId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [customerId, setCustomerId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useMemo(() => {
    if (!open) return;
    setWhen(toLocalInput());
    setEmployeeId("");
    setCustomerId(consultation?.customers?.id ?? consultation?.customer_id ?? "");
    setServiceId(consultation?.services?.id ?? consultation?.service_id ?? "");
    const hasLinked = !!(consultation?.customers?.id ?? consultation?.customer_id);
    setCreatingCustomer(!hasLinked);
    setNewName(consultation?.client_name ?? "");
    setNewPhone(consultation?.customers?.phone ?? "");
    setNewEmail(consultation?.customers?.email ?? "");
  }, [open, consultation]);

  const { data: employees = [] } = useQuery({
    queryKey: ["employees-list"],
    queryFn: async () => (await supabase.from("employees").select("id, full_name").order("full_name")).data ?? [],
  });

  async function createCustomerInline(): Promise<string | null> {
    if (!newName.trim() || newName.trim().length < 2) { toast.error("Enter the customer's name"); return null; }
    const { data, error } = await (supabase.rpc as any)("upsert_customer_by_contact", {
      p_full_name: newName.trim(),
      p_phone: newPhone.trim() || null,
      p_email: newEmail.trim() || null,
      p_notes: null,
    });
    if (error) { toast.error(error.message); return null; }
    const newId = data as string;
    if (consultation?.id) {
      await supabase.from("consultations").update({ customer_id: newId }).eq("id", consultation.id);
    }
    invalidateConsultations(qc);
    invalidateCustomers(qc);
    return newId;
  }

  async function book() {
    let cid = customerId;
    if (creatingCustomer) {
      const created = await createCustomerInline();
      if (!created) return;
      cid = created;
      setCustomerId(created);
    }
    if (!cid) { toast.error("Pick a customer for this booking"); return; }
    if (!serviceId) { toast.error("Pick a service for this booking"); return; }
    if (!when) { toast.error("Pick a date & time"); return; }
    setSaving(true);
    const ins = await supabase.from("appointments").insert({
      customer_id: cid,
      service_id: serviceId,
      employee_id: employeeId || null,
      scheduled_at: new Date(when).toISOString(),
      status: "Confirmed",
    });
    if (ins.error) { setSaving(false); toast.error(ins.error.message); return; }
    if (consultation?.id) {
      await supabase.from("consultations").update({ status: "Booked" }).eq("id", consultation.id);
    }
    setSaving(false);
    toast.success("Appointment booked from consultation");
    onOpenChange(false);
    onBooked();
  }

  return (
    <Modal open={open} onClose={() => onOpenChange(false)} title="Book appointment">
      <div className="text-xs text-gray-500 mb-2">
        For <span className="font-medium text-gray-900">{consultation?.client_name}</span>
        {consultation?.services?.name && <> · {consultation.services.name}</>}
      </div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] text-gray-500">Customer</label>
        <button
          type="button"
          onClick={() => setCreatingCustomer((v) => !v)}
          className="text-[11px] text-[#E8246A] hover:underline"
        >
          {creatingCustomer ? "Pick existing instead" : "+ Create new customer"}
        </button>
      </div>
      {creatingCustomer ? (
        <div className="space-y-2 mb-3 border border-gray-100 rounded-lg p-2 bg-gray-50">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" className={inputCls} />
          <div className="grid grid-cols-2 gap-2">
            <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Phone" className={inputCls} />
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" className={inputCls} />
          </div>
          <div className="text-[10px] text-gray-500">A new customer profile will be created and linked to this consultation.</div>
        </div>
      ) : (
        <Field label="">
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className={inputCls}>
            <option value="">— pick a customer —</option>
            {(lookups?.customers ?? []).map((c: any) => (
              <option key={c.id} value={c.id}>{c.full_name}</option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Service">
        <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={inputCls}>
          <option value="">— pick a service —</option>
          {(lookups?.services ?? []).map((s: any) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </Field>
      <Field label="When">
        <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Therapist (optional)">
        <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className={inputCls}>
          <option value="">Unassigned</option>
          {employees.map((e: any) => (
            <option key={e.id} value={e.id}>{e.full_name}</option>
          ))}
        </select>
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={() => onOpenChange(false)} className="px-3 py-1.5 text-xs text-gray-600">Cancel</button>
        <PrimaryButton onClick={book}>{saving ? "Booking…" : "Book appointment"}</PrimaryButton>
      </div>
    </Modal>
  );
}