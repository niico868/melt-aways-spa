import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2, Shield, Mail, User } from "lucide-react";
import { DashboardPage, PrimaryButton } from "@/components/dashboard/DashboardPage";
import { DataTable, fmtDate, type Column } from "@/components/dashboard/DataTable";
import { Modal, Field, inputCls } from "@/components/dashboard/Modal";
import { listAccounts, inviteAccount, setAccountRole, deleteAccount } from "@/lib/admin-users.functions";
import { useIsAdmin } from "@/lib/use-my-roles";

export const Route = createFileRoute("/dashboard/employees")({ component: AccountsPage });

type AccountRow = {
  id: string; email: string; full_name: string; roles: string[];
  created_at: string; last_sign_in_at: string | null; invited: boolean;
};

const ROLES = ["admin", "manager", "staff", "receptionist"] as const;
const roleTone: Record<string, string> = {
  admin: "bg-[#FDF2F7] text-[#E8246A]",
  manager: "bg-amber-50 text-amber-700",
  staff: "bg-blue-50 text-blue-700",
  receptionist: "bg-emerald-50 text-emerald-700",
};

function AccountsPage() {
  const isAdmin = useIsAdmin();
  const qc = useQueryClient();
  const listFn = useServerFn(listAccounts);
  const inviteFn = useServerFn(inviteAccount);
  const roleFn = useServerFn(setAccountRole);
  const delFn = useServerFn(deleteAccount);

  const { data, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => listFn({}),
  });

  const invite = useMutation({
    mutationFn: (d: { email: string; full_name: string; role: any }) => inviteFn({ data: d }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accounts"] }),
  });
  const setRole = useMutation({
    mutationFn: (d: { user_id: string; role: any }) => roleFn({ data: d }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accounts"] }),
  });
  const del = useMutation({
    mutationFn: (user_id: string) => delFn({ data: { user_id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accounts"] }),
  });

  const [inviteOpen, setInviteOpen] = useState(false);

  const columns: Column<AccountRow>[] = [
    { key: "user", header: "User", sortType: "text", accessor: r => r.full_name || r.email, render: r => (
      <div className="flex items-center gap-2">
        <span className="inline-flex w-7 h-7 rounded-full items-center justify-center text-[10px] font-bold text-[#E8246A] bg-[#FDF2F7]">
          <User size={13} />
        </span>
        <div className="min-w-0">
          <div className="font-medium text-gray-800 truncate">{r.full_name || "—"}</div>
          <div className="text-[10px] text-gray-500 truncate">{r.email}</div>
        </div>
      </div>
    )},
    { key: "roles", header: "Role", sortType: "text", accessor: r => r.roles[0] ?? "", render: r => (
      isAdmin ? (
        <select
          value={r.roles[0] ?? ""}
          onChange={e => setRole.mutate({ user_id: r.id, role: e.target.value })}
          className="text-[11px] border border-gray-200 rounded px-1.5 py-0.5 bg-white"
        >
          <option value="">— none —</option>
          {ROLES.map(x => <option key={x} value={x}>{x}</option>)}
        </select>
      ) : (
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${roleTone[r.roles[0]] ?? "bg-gray-100 text-gray-600"}`}>
          {r.roles[0] ?? "—"}
        </span>
      )
    )},
    { key: "status", header: "Status", sortType: "status", statusOrder: ["Active", "Invited"], accessor: r => r.invited ? "Invited" : "Active", render: r => (
      <span className={`text-[10px] px-1.5 py-0.5 rounded ${r.invited ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
        {r.invited ? "Invited" : "Active"}
      </span>
    )},
    { key: "last", header: "Last sign in", sortType: "date", accessor: r => r.last_sign_in_at ?? "", render: r => r.last_sign_in_at ? fmtDate(r.last_sign_in_at) : "—" },
    { key: "created_at", header: "Created", sortType: "date", accessor: r => r.created_at, render: r => fmtDate(r.created_at) },
  ];

  return (
    <DashboardPage
      title="Accounts"
      subtitle={isAdmin ? "Invite team members and assign access" : "Team roster (admin-only edits)"}
      actions={isAdmin ? <PrimaryButton onClick={() => setInviteOpen(true)}><Plus size={14} className="inline mr-1" />Invite user</PrimaryButton> : null}
    >
      <DataTable
        rows={data as any} columns={columns} loading={isLoading} error={error}
        searchPlaceholder="Search accounts…" empty="No accounts yet."
        selectable={false}
        rowActions={r => isAdmin ? (
          <div className="flex gap-1 justify-end">
            <button onClick={() => { if (confirm(`Delete ${r.email}? This cannot be undone.`)) del.mutate(r.id); }}
              className="p-1 text-gray-400 hover:text-red-500" title="Delete account"><Trash2 size={13} /></button>
          </div>
        ) : null}
      />
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite team member">
        <form onSubmit={e => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          invite.mutate({
            email: String(f.get("email") || "").trim(),
            full_name: String(f.get("full_name") || "").trim(),
            role: String(f.get("role") || "staff") as any,
          }, { onSuccess: () => setInviteOpen(false) });
        }}>
          <p className="text-[11px] text-gray-500 mb-3 flex gap-1 items-start"><Mail size={12} className="mt-0.5" /> An email invite will be sent. They set their password on first sign in.</p>
          <Field label="Full name"><input name="full_name" required className={inputCls} /></Field>
          <Field label="Email"><input name="email" type="email" required className={inputCls} /></Field>
          <Field label="Role"><select name="role" defaultValue="staff" className={inputCls}>{ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select></Field>
          {invite.error && <p className="text-[11px] text-red-500 mb-2">{(invite.error as any).message}</p>}
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setInviteOpen(false)} className="px-3 py-1.5 text-xs text-gray-600">Cancel</button>
            <PrimaryButton type="submit">{invite.isPending ? "Sending…" : (<><Shield size={12} className="inline mr-1" />Send invite</>) as any}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </DashboardPage>
  );
}