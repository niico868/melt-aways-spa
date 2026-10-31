import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { DashboardPage, PrimaryButton } from "@/components/dashboard/DashboardPage";
import { DataTable, type Column } from "@/components/dashboard/DataTable";
import { Modal, Field, inputCls } from "@/components/dashboard/Modal";
import { useEmployees, useUpsertEmployee, useDeleteEmployee, type Employee } from "@/lib/dashboard-tables";

export const Route = createFileRoute("/dashboard/therapists")({ component: TherapistsPage });

function TherapistsPage() {
  const { data, isLoading, error } = useEmployees();
  const upsert = useUpsertEmployee();
  const del = useDeleteEmployee();
  const [editing, setEditing] = useState<Partial<Employee> | null>(null);

  const columns: Column<Employee>[] = [
    { key: "name", header: "Therapist", sortType: "text", accessor: r => r.full_name, render: r => (
      <div className="flex items-center gap-2">
        <span className="inline-flex w-7 h-7 rounded-full items-center justify-center text-[#E8246A] bg-[#FDF2F7]"><User size={13} /></span>
        <span className="font-medium text-gray-800">{r.full_name}</span>
      </div>
    )},
    { key: "role", header: "Role", sortType: "text", accessor: r => r.role, render: r => <span className="text-[11px] text-gray-600">{r.role}</span> },
    { key: "slots", header: "Daily slots", className: "text-right", sortType: "number", accessor: r => r.slots_total, render: r => r.slots_total },
  ];

  return (
    <DashboardPage
      title="Therapists"
      subtitle={`${data?.length ?? 0} team members available for appointments`}
      actions={<PrimaryButton onClick={() => setEditing({})}><Plus size={14} className="inline mr-1" />Add therapist</PrimaryButton>}
    >
      <DataTable
        rows={data} columns={columns} loading={isLoading} error={error}
        searchPlaceholder="Search therapists…" empty="No therapists yet."
        rowActions={r => (
          <div className="flex gap-1 justify-end">
            <button onClick={() => setEditing(r)} className="p-1 text-gray-400 hover:text-[#E8246A]"><Pencil size={13} /></button>
            <button onClick={() => { if (confirm(`Remove ${r.full_name}?`)) del.mutate(r.id); }} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
          </div>
        )}
      />
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? "Edit therapist" : "Add therapist"}>
        <form
          onSubmit={e => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            upsert.mutate({
              id: editing?.id,
              full_name: String(f.get("full_name") || "").trim(),
              role: String(f.get("role") || "Therapist").trim() || "Therapist",
              slots_total: Number(f.get("slots_total") || 8),
              avatar_tone: String(f.get("avatar_tone") || "#FDF2F7"),
            }, { onSuccess: () => setEditing(null) });
          }}
        >
          <Field label="Full name"><input name="full_name" defaultValue={editing?.full_name ?? ""} required className={inputCls} /></Field>
          <Field label="Role"><input name="role" defaultValue={editing?.role ?? "Therapist"} className={inputCls} placeholder="Therapist / Aesthetician / Nurse" /></Field>
          <Field label="Daily slots"><input name="slots_total" type="number" min={1} max={24} defaultValue={editing?.slots_total ?? 8} className={inputCls} /></Field>
          <Field label="Accent color"><input name="avatar_tone" type="color" defaultValue={editing?.avatar_tone ?? "#FDF2F7"} className="w-16 h-8 border border-gray-200 rounded" /></Field>
          {upsert.error && <p className="text-[11px] text-red-500 mb-2">{(upsert.error as any).message}</p>}
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setEditing(null)} className="px-3 py-1.5 text-xs text-gray-600">Cancel</button>
            <PrimaryButton type="submit">{upsert.isPending ? "Saving…" : "Save"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </DashboardPage>
  );
}