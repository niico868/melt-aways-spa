import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DashboardPage, PrimaryButton } from "@/components/dashboard/DashboardPage";
import { DataTable, fmtDate, type Column } from "@/components/dashboard/DataTable";
import { Modal, Field, inputCls } from "@/components/dashboard/Modal";
import { useCustomers, useUpsertCustomer, useDeleteCustomer, type Customer } from "@/lib/dashboard-tables";
import { useCanWrite } from "@/lib/use-my-roles";

export const Route = createFileRoute("/dashboard/customers/")({
  validateSearch: (s: Record<string, unknown>): { new?: "1" } => (s.new === "1" || s.new === 1 ? { new: "1" } : {}),
  component: CustomersPage,
});

function CustomersPage() {
  const { data, isLoading, error } = useCustomers();
  const upsert = useUpsertCustomer();
  const del = useDeleteCustomer();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [editing, setEditing] = useState<Partial<Customer> | null>(null);
  const canWrite = useCanWrite();
  const [tagFilter, setTagFilter] = useState<string>("");
  const [contactFilter, setContactFilter] = useState<string>("");
  const [marketingFilter, setMarketingFilter] = useState<string>("");
  const [medicalFilter, setMedicalFilter] = useState<string>("");

  const allTags = useMemo(() => {
    const s = new Set<string>();
    (data ?? []).forEach(c => c.tags?.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [data]);

  const filtered = useMemo(() => {
    return (data ?? []).filter(c => {
      if (tagFilter && !c.tags?.includes(tagFilter)) return false;
      if (contactFilter && (c.preferred_contact ?? "") !== contactFilter) return false;
      if (marketingFilter === "in" && !c.marketing_opt_in) return false;
      if (marketingFilter === "out" && c.marketing_opt_in) return false;
      const hasMed = !!(c.allergies || c.medications || c.medical_conditions || c.medical_notes);
      if (medicalFilter === "has" && !hasMed) return false;
      if (medicalFilter === "none" && hasMed) return false;
      return true;
    });
  }, [data, tagFilter, contactFilter, marketingFilter, medicalFilter]);
  const anyFilter = tagFilter || contactFilter || marketingFilter || medicalFilter;

  useEffect(() => {
    if (search.new === "1") {
      setEditing({});
      navigate({ to: "/dashboard/customers", search: {}, replace: true });
    }
  }, [search.new, navigate]);

  const columns: Column<Customer>[] = [
    { key: "full_name", header: "Name", sortType: "text", accessor: r => r.full_name, render: r => (
      <Link
        to="/dashboard/customers/$id"
        params={{ id: r.id }}
        onClick={(e) => e.stopPropagation()}
        className="font-medium text-[#E8246A] hover:underline"
      >
        {r.full_name}
      </Link>
    ) },
    { key: "phone", header: "Phone", sortType: "text", accessor: r => r.phone ?? "", render: r => r.phone ?? "—" },
    { key: "email", header: "Email", sortType: "text", accessor: r => r.email ?? "", render: r => r.email ?? "—" },
    { key: "tags", header: "Tags", sortType: "text", accessor: r => r.tags?.join(", ") ?? "", render: r => (r.tags?.length ? (
      <span className="flex flex-wrap gap-1">{r.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded bg-[#FDF2F7] text-[#E8246A] text-[10px]">{t}</span>)}</span>
    ) : "—") },
    { key: "medical", header: "Medical", sortType: "number", sortValue: r => (r.allergies ? 1 : 0) + (r.medications ? 1 : 0) + (r.medical_conditions ? 1 : 0), render: r => {
      const flags: string[] = [];
      if (r.allergies) flags.push("Allergies");
      if (r.medications) flags.push("Meds");
      if (r.medical_conditions) flags.push("Conditions");
      return flags.length ? <span className="text-[10px] text-amber-700">{flags.join(" · ")}</span> : <span className="text-gray-300">—</span>;
    } },
    { key: "created_at", header: "Joined", sortType: "date", accessor: r => r.created_at, render: r => fmtDate(r.created_at) },
  ];
  return (
    <DashboardPage
      title="Customers"
      subtitle={`${filtered.length} of ${data?.length ?? 0}`}
      actions={canWrite ? <PrimaryButton onClick={() => setEditing({})}><Plus size={14} className="inline mr-1" />Add customer</PrimaryButton> : null}
    >
      <div className="px-3 pt-3 flex flex-wrap gap-2 items-center text-xs">
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="border border-gray-200 rounded px-2 py-1 text-xs">
          <option value="">All tags</option>
          {allTags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={contactFilter} onChange={e => setContactFilter(e.target.value)} className="border border-gray-200 rounded px-2 py-1 text-xs">
          <option value="">Any contact</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
        <select value={marketingFilter} onChange={e => setMarketingFilter(e.target.value)} className="border border-gray-200 rounded px-2 py-1 text-xs">
          <option value="">Marketing: any</option>
          <option value="in">Opted in</option>
          <option value="out">Not opted in</option>
        </select>
        <select value={medicalFilter} onChange={e => setMedicalFilter(e.target.value)} className="border border-gray-200 rounded px-2 py-1 text-xs">
          <option value="">Medical: any</option>
          <option value="has">Has medical info</option>
          <option value="none">No medical info</option>
        </select>
        {anyFilter && (
          <button onClick={() => { setTagFilter(""); setContactFilter(""); setMarketingFilter(""); setMedicalFilter(""); }} className="text-[#E8246A] hover:underline">Clear</button>
        )}
      </div>
      <DataTable
        rows={filtered} columns={columns} loading={isLoading} error={error}
        searchPlaceholder="Search customers…" empty="No customers yet."
        onRowClick={r => navigate({ to: "/dashboard/customers/$id", params: { id: r.id } })}
        rowActions={r => canWrite ? (
          <div className="flex gap-1 justify-end">
            <button onClick={() => setEditing(r)} className="p-1 text-gray-400 hover:text-[#E8246A]"><Pencil size={13} /></button>
            <button onClick={() => { if (confirm(`Delete ${r.full_name}? This removes all their history.`)) del.mutate(r.id); }} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
          </div>
        ) : null}
      />
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? "Edit customer" : "Add customer"}>
        <form
          onSubmit={e => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const tags = String(f.get("tags") || "").split(",").map(s => s.trim()).filter(Boolean);
            upsert.mutate({
              id: editing?.id,
              full_name: String(f.get("full_name") || "").trim(),
              phone: String(f.get("phone") || "").trim() || null,
              email: String(f.get("email") || "").trim() || null,
              city: String(f.get("city") || "").trim() || null,
              address: String(f.get("address") || "").trim() || null,
              date_of_birth: String(f.get("date_of_birth") || "") || null,
              preferred_contact: String(f.get("preferred_contact") || "whatsapp"),
              tags,
              marketing_opt_in: f.get("marketing_opt_in") === "on",
              notes: String(f.get("notes") || "").trim() || null,
            }, { onSuccess: () => setEditing(null) });
          }}
        >
          <Field label="Full name"><input name="full_name" defaultValue={editing?.full_name ?? ""} required className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Phone"><input name="phone" defaultValue={editing?.phone ?? ""} className={inputCls} /></Field>
            <Field label="Email"><input name="email" type="email" defaultValue={editing?.email ?? ""} className={inputCls} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Date of birth"><input name="date_of_birth" type="date" defaultValue={editing?.date_of_birth ?? ""} className={inputCls} /></Field>
            <Field label="Preferred contact">
              <select name="preferred_contact" defaultValue={editing?.preferred_contact ?? "whatsapp"} className={inputCls}>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </Field>
          </div>
          <Field label="Address"><input name="address" defaultValue={editing?.address ?? ""} className={inputCls} /></Field>
          <Field label="City"><input name="city" defaultValue={editing?.city ?? ""} className={inputCls} /></Field>
          <Field label="Tags (comma separated)"><input name="tags" defaultValue={editing?.tags?.join(", ") ?? ""} placeholder="VIP, Package Client, Sensitive Skin" className={inputCls} /></Field>
          <Field label="Notes"><textarea name="notes" defaultValue={editing?.notes ?? ""} rows={3} className={inputCls} /></Field>
          <label className="flex items-center gap-2 text-[11px] text-gray-600 mb-3">
            <input type="checkbox" name="marketing_opt_in" defaultChecked={editing?.marketing_opt_in ?? false} /> Opted in to marketing
          </label>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setEditing(null)} className="px-3 py-1.5 text-xs text-gray-600">Cancel</button>
            <PrimaryButton type="submit">{upsert.isPending ? "Saving…" : "Save"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </DashboardPage>
  );
}