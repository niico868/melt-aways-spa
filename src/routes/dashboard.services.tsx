import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DashboardPage, PrimaryButton } from "@/components/dashboard/DashboardPage";
import { DataTable, fmtMoney, type Column } from "@/components/dashboard/DataTable";
import { Modal, Field, inputCls } from "@/components/dashboard/Modal";
import { useServices, useUpsertService, useDeleteService, type Service } from "@/lib/dashboard-tables";

export const Route = createFileRoute("/dashboard/services")({ component: ServicesPage });

function ServicesPage() {
  const { data, isLoading, error } = useServices();
  const upsert = useUpsertService();
  const del = useDeleteService();
  const [editing, setEditing] = useState<Partial<Service> | null>(null);

  const columns: Column<Service>[] = [
    { key: "swatch", header: "", sortType: "none", render: r => <span className="inline-block w-3 h-3 rounded" style={{ background: r.fill_color }} /> },
    { key: "name", header: "Service", sortType: "text", accessor: r => r.name, render: r => <span className="font-medium text-gray-800">{r.name}</span> },
    { key: "base_price", header: "Base price", className: "text-right", sortType: "currency", accessor: r => r.base_price, render: r => fmtMoney(r.base_price) },
  ];

  return (
    <DashboardPage
      title="Services"
      subtitle={`${data?.length ?? 0} services`}
      actions={<PrimaryButton onClick={() => setEditing({})}><Plus size={14} className="inline mr-1" />Add service</PrimaryButton>}
    >
      <DataTable
        rows={data} columns={columns} loading={isLoading} error={error}
        searchPlaceholder="Search services…" empty="No services yet."
        rowActions={r => (
          <div className="flex gap-1 justify-end">
            <button onClick={() => setEditing(r)} className="p-1 text-gray-400 hover:text-[#E8246A]"><Pencil size={13} /></button>
            <button onClick={() => { if (confirm(`Delete ${r.name}?`)) del.mutate(r.id); }} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
          </div>
        )}
      />
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? "Edit service" : "Add service"}>
        <form
          onSubmit={e => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            upsert.mutate({
              id: editing?.id,
              name: String(f.get("name") || "").trim(),
              base_price: Number(f.get("base_price") || 0),
              fill_color: String(f.get("fill_color") || "#FDF2F7"),
            }, { onSuccess: () => setEditing(null) });
          }}
        >
          <Field label="Name"><input name="name" defaultValue={editing?.name ?? ""} required className={inputCls} /></Field>
          <Field label="Base price (TT$)"><input name="base_price" type="number" step="0.01" defaultValue={editing?.base_price ?? 0} required className={inputCls} /></Field>
          <Field label="Color"><input name="fill_color" type="color" defaultValue={editing?.fill_color ?? "#FDF2F7"} className="w-16 h-8 border border-gray-200 rounded" /></Field>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setEditing(null)} className="px-3 py-1.5 text-xs text-gray-600">Cancel</button>
            <PrimaryButton type="submit">{upsert.isPending ? "Saving…" : "Save"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </DashboardPage>
  );
}