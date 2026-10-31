import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft, Plus, Trash2, Printer, DollarSign, RotateCcw, Phone, Mail, Cake } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Modal, Field, inputCls } from "@/components/dashboard/Modal";
import { fmtDateTime, fmtMoney, fmtDate } from "@/components/dashboard/DataTable";
import {
  useApptDetail, useAllServices, useAllEmployees, useUpdateAppointment,
  useSetServices, useUpsertMedical, useAddNote, useDeleteNote, useAddPayment,
  useUpdateInvoice, buildWhatsAppUrl,
} from "@/lib/appointments-detail";
import { APPT_STATUSES } from "@/lib/dashboard-tables";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/appointments/$id")({
  component: AppointmentDetailPage,
});

function AppointmentDetailPage() {
  const { id } = Route.useParams();
  const { data, isLoading } = useApptDetail(id);
  if (isLoading || !data) return <DashboardPage title="Loading…" backTo="/dashboard/appointments"><div className="p-6 text-xs text-gray-400">Loading…</div></DashboardPage>;
  if (!data.appt) return <DashboardPage title="Not found" backTo="/dashboard/appointments"><div className="p-6 text-xs">Appointment not found.</div></DashboardPage>;

  const a: any = data.appt;
  return (
    <DashboardPage
      title={a.customers?.full_name ?? "Appointment"}
      subtitle={fmtDateTime(a.scheduled_at)}
      backTo="/dashboard/appointments"
      actions={<Link to="/dashboard/appointments" className="text-xs text-gray-500 hover:text-[#E8246A] inline-flex items-center gap-1"><ArrowLeft size={12}/> All appointments</Link>}
    >
      <div className="grid lg:grid-cols-2 gap-3 p-3">
        <ClientCard appt={a} />
        <AppointmentCard id={id} appt={a} services={data.services} />
        <FinancialCard id={id} invoice={data.invoice} paid={data.paid} remaining={data.remaining} />
        <MedicalCard id={id} medical={data.medical} />
        <NotesCard id={id} kind="treatment" title="Treatment notes" notes={(data.notes ?? []).filter((n: any) => n.kind === "treatment")} />
        <NotesCard id={id} kind="internal" title="Internal staff notes" notes={(data.notes ?? []).filter((n: any) => n.kind === "internal")} />
      </div>
    </DashboardPage>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <h2 className="text-xs font-semibold text-gray-800 uppercase tracking-wide">{title}</h2>
        {action}
      </div>
      <div className="p-3 text-xs">{children}</div>
    </section>
  );
}

function ClientCard({ appt }: { appt: any }) {
  const c = appt.customers;
  if (!c) return <Card title="Client"><div className="text-gray-400">No client attached.</div></Card>;
  const age = c.date_of_birth ? Math.floor((Date.now() - new Date(c.date_of_birth).getTime()) / (365.25 * 864e5)) : null;
  return (
    <Card title="Client" action={<Link to="/dashboard/customers/$id" params={{ id: c.id }} className="text-[11px] text-[#E8246A] hover:underline">Open profile →</Link>}>
      <div className="space-y-1.5">
        <div className="font-semibold text-sm text-gray-900">{c.full_name}</div>
        {c.phone && <div className="flex items-center gap-2 text-gray-600"><Phone size={11}/>{c.phone}</div>}
        {c.email && <div className="flex items-center gap-2 text-gray-600"><Mail size={11}/>{c.email}</div>}
        {c.date_of_birth && <div className="flex items-center gap-2 text-gray-600"><Cake size={11}/>{fmtDate(c.date_of_birth)} {age && `(${age} yrs)`}</div>}
      </div>
    </Card>
  );
}

function AppointmentCard({ id, appt, services }: { id: string; appt: any; services: any[] }) {
  const update = useUpdateAppointment(id);
  const setSvc = useSetServices(id);
  const { data: allSvc = [] } = useAllServices();
  const { data: allEmp = [] } = useAllEmployees();
  const [when, setWhen] = useState(() => toLocalInput(appt.scheduled_at));
  const [emp, setEmp] = useState<string>(appt.employee_id ?? "");
  const [status, setStatus] = useState<string>(appt.status ?? "Pending");
  const [room, setRoom] = useState<string>(appt.room ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(services.map(s => s.service_id));

  const totalDur = services.reduce((s, x) => s + (x.duration_min_snapshot ?? 60), 0);
  const totalPrice = services.reduce((s, x) => s + Number(x.price_snapshot ?? 0), 0);

  async function saveTop() {
    await update.mutateAsync({
      scheduled_at: new Date(when).toISOString(),
      employee_id: emp || null,
      status,
      room: room || null,
    });
    toast.success("Appointment updated");
  }

  async function saveServices() {
    const picked = selectedIds.map(sid => {
      const s = allSvc.find((x: any) => x.id === sid);
      return { service_id: sid, price: Number(s?.base_price ?? 0), duration: 60 };
    });
    if (!picked.length) { toast.error("Pick at least one service"); return; }
    await setSvc.mutateAsync(picked);
    setPickerOpen(false);
    toast.success("Services updated");
  }

  return (
    <Card title="Appointment details" action={<button onClick={saveTop} className="text-[11px] px-2 py-1 rounded bg-[#E8246A] text-white">Save</button>}>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Date & time"><input type="datetime-local" value={when} onChange={e => setWhen(e.target.value)} className={inputCls} /></Field>
        <Field label="Status">
          <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}>
            {APPT_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Therapist">
          <select value={emp} onChange={e => setEmp(e.target.value)} className={inputCls}>
            <option value="">Unassigned</option>
            {allEmp.map((e: any) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
          </select>
        </Field>
        <Field label="Room"><input value={room} onChange={e => setRoom(e.target.value)} placeholder="e.g. Room 1" className={inputCls} /></Field>
      </div>
      <div className="mt-3 border-t border-gray-100 pt-2">
        <div className="flex items-center justify-between mb-1">
          <div className="font-medium text-gray-700">Services · {services.length} · {totalDur} min · {fmtMoney(totalPrice)}</div>
          <button onClick={() => { setSelectedIds(services.map(s => s.service_id)); setPickerOpen(true); }} className="text-[11px] text-[#E8246A]">Edit</button>
        </div>
        <ul className="space-y-1">
          {services.map((s: any) => (
            <li key={s.id} className="flex justify-between border border-gray-100 rounded px-2 py-1">
              <span>{s.services?.name ?? "Service"}</span>
              <span className="text-gray-500">{fmtMoney(s.price_snapshot)}</span>
            </li>
          ))}
          {!services.length && <li className="text-gray-400 italic">No services attached</li>}
        </ul>
      </div>
      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Choose services">
        <div className="max-h-[50vh] overflow-y-auto space-y-1">
          {allSvc.map((s: any) => (
            <label key={s.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer text-xs">
              <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={e => setSelectedIds(x => e.target.checked ? [...x, s.id] : x.filter(id => id !== s.id))} />
              <span className="flex-1">{s.name}</span>
              <span className="text-gray-500">{fmtMoney(s.base_price)}</span>
            </label>
          ))}
        </div>
        <div className="pt-3 flex justify-end gap-2">
          <button onClick={() => setPickerOpen(false)} className="px-3 py-1.5 text-xs border rounded">Cancel</button>
          <button onClick={saveServices} className="px-3 py-1.5 text-xs bg-[#E8246A] text-white rounded">Save services</button>
        </div>
      </Modal>
    </Card>
  );
}

function FinancialCard({ id, invoice, paid, remaining }: { id: string; invoice: any; paid: number; remaining: number }) {
  const addPay = useAddPayment(id);
  const updInv = useUpdateInvoice(id);
  const [payOpen, setPayOpen] = useState<null | "payment" | "refund">(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [note, setNote] = useState("");
  const [discount, setDiscount] = useState(String(invoice?.discount ?? 0));

  if (!invoice) return <Card title="Financial"><div className="text-gray-400">No invoice yet.</div></Card>;

  async function submit() {
    if (!payOpen) return;
    const amt = Number(amount);
    if (!amt || amt <= 0) { toast.error("Enter an amount"); return; }
    await addPay.mutateAsync({ invoice_id: invoice.id, amount: amt, method, kind: payOpen, note: note || undefined });
    setPayOpen(null); setAmount(""); setNote("");
    toast.success(payOpen === "refund" ? "Refund recorded" : "Payment recorded");
  }

  async function saveDiscount() {
    await updInv.mutateAsync({ invoice_id: invoice.id, patch: { discount: Number(discount) || 0 } });
    toast.success("Discount updated");
  }

  return (
    <Card title={`Financial · ${invoice.invoice_number}`} action={
      <div className="flex gap-1">
        <a href={`/dashboard/sales/${invoice.id}`} className="text-[11px] px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1">Open invoice</a>
        <button onClick={() => setPayOpen("payment")} className="text-[11px] px-2 py-1 rounded bg-green-600 text-white inline-flex items-center gap-1"><DollarSign size={11}/>Payment</button>
        <button onClick={() => setPayOpen("refund")} className="text-[11px] px-2 py-1 rounded border border-rose-300 text-rose-600 inline-flex items-center gap-1"><RotateCcw size={11}/>Refund</button>
        <button onClick={() => window.print()} className="text-[11px] px-2 py-1 rounded border inline-flex items-center gap-1"><Printer size={11}/>Print</button>
      </div>
    }>
      <div className="grid grid-cols-2 gap-2">
        <Row label="Subtotal" value={fmtMoney(invoice.subtotal)} />
        <Row label="Tax (12.5%)" value={fmtMoney(invoice.tax)} />
        <div>
          <div className="text-[10px] text-gray-500 mb-0.5">Discount (TTD)</div>
          <div className="flex gap-1">
            <input value={discount} onChange={e => setDiscount(e.target.value)} className={inputCls} />
            <button onClick={saveDiscount} className="text-[11px] px-2 rounded bg-gray-800 text-white">Save</button>
          </div>
        </div>
        <Row label="Total" value={fmtMoney(invoice.total)} bold />
        <Row label="Paid" value={fmtMoney(paid)} />
        <Row label="Remaining" value={fmtMoney(remaining)} bold tone={remaining > 0 ? "rose" : "green"} />
      </div>
      <div className="mt-3 border-t border-gray-100 pt-2">
        <div className="text-[10px] text-gray-500 mb-1 uppercase">Payments</div>
        <ul className="space-y-1">
          {(invoice.payments ?? []).sort((a: any, b: any) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()).map((p: any) => (
            <li key={p.id} className="flex justify-between border border-gray-100 rounded px-2 py-1">
              <span>{fmtDate(p.recorded_at)} · {p.method} · <em className="text-gray-500">{p.kind}</em></span>
              <span className={p.kind === "refund" ? "text-rose-600" : "text-green-700"}>{p.kind === "refund" ? "-" : ""}{fmtMoney(p.amount)}</span>
            </li>
          ))}
          {!(invoice.payments ?? []).length && <li className="text-gray-400 italic">No payments recorded</li>}
        </ul>
      </div>
      <Modal open={!!payOpen} onClose={() => setPayOpen(null)} title={payOpen === "refund" ? "Issue refund" : "Add payment"}>
        <Field label="Amount (TTD)"><input value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" className={inputCls} /></Field>
        <Field label="Method">
          <select value={method} onChange={e => setMethod(e.target.value)} className={inputCls}>
            {["Cash","Card","Bank Transfer","WiPay","Other"].map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Note (optional)"><input value={note} onChange={e => setNote(e.target.value)} className={inputCls} /></Field>
        <div className="pt-2 flex justify-end gap-2">
          <button onClick={() => setPayOpen(null)} className="px-3 py-1.5 text-xs border rounded">Cancel</button>
          <button onClick={submit} className="px-3 py-1.5 text-xs bg-[#E8246A] text-white rounded">Save</button>
        </div>
      </Modal>
    </Card>
  );
}

function Row({ label, value, bold, tone }: { label: string; value: string; bold?: boolean; tone?: "rose" | "green" }) {
  const color = tone === "rose" ? "text-rose-600" : tone === "green" ? "text-green-700" : "text-gray-900";
  return (
    <div>
      <div className="text-[10px] text-gray-500 mb-0.5">{label}</div>
      <div className={`${bold ? "font-semibold" : ""} ${color}`}>{value}</div>
    </div>
  );
}

function MedicalCard({ id, medical }: { id: string; medical: any }) {
  const up = useUpsertMedical(id);
  const [f, setF] = useState({
    allergies: medical?.allergies ?? "",
    medications: medical?.medications ?? "",
    contraindications: medical?.contraindications ?? "",
    additional_notes: medical?.additional_notes ?? "",
  });
  async function save() { await up.mutateAsync(f); toast.success("Medical info saved"); }
  return (
    <Card title="Medical" action={<button onClick={save} className="text-[11px] px-2 py-1 rounded bg-[#E8246A] text-white">Save</button>}>
      <Field label="Allergies"><textarea rows={2} value={f.allergies} onChange={e => setF({ ...f, allergies: e.target.value })} className={inputCls} /></Field>
      <Field label="Current medications"><textarea rows={2} value={f.medications} onChange={e => setF({ ...f, medications: e.target.value })} className={inputCls} /></Field>
      <Field label="Contraindications"><textarea rows={2} value={f.contraindications} onChange={e => setF({ ...f, contraindications: e.target.value })} className={inputCls} /></Field>
      <Field label="Additional notes"><textarea rows={2} value={f.additional_notes} onChange={e => setF({ ...f, additional_notes: e.target.value })} className={inputCls} /></Field>
    </Card>
  );
}

function NotesCard({ id, kind, title, notes }: { id: string; kind: "internal" | "treatment"; title: string; notes: any[] }) {
  const add = useAddNote(id);
  const del = useDeleteNote(id);
  const [body, setBody] = useState("");
  async function submit() {
    if (!body.trim()) return;
    const { data: userData } = await supabase.auth.getUser();
    const author = userData.user?.user_metadata?.full_name ?? userData.user?.email ?? "Staff";
    await add.mutateAsync({ kind, body: body.trim(), author_name: author, author_id: userData.user?.id });
    setBody("");
  }
  const tone = kind === "internal" ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200";
  return (
    <Card title={title}>
      <div className="flex gap-2">
        <textarea rows={2} value={body} onChange={e => setBody(e.target.value)} placeholder={kind === "internal" ? "Private staff-only note…" : "Treatment note…"} className={inputCls} />
        <button onClick={submit} className="px-2 rounded bg-[#E8246A] text-white text-[11px] inline-flex items-center gap-1"><Plus size={12}/>Add</button>
      </div>
      <ul className="mt-2 space-y-1.5">
        {notes.map((n: any) => (
          <li key={n.id} className={`border rounded px-2 py-1.5 ${tone} flex justify-between gap-2`}>
            <div className="min-w-0">
              <div className="whitespace-pre-wrap">{n.body}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{n.author_name ?? "Staff"} · {fmtDateTime(n.created_at)}</div>
            </div>
            <button onClick={() => del.mutate(n.id)} className="text-gray-400 hover:text-rose-600 shrink-0" title="Delete"><Trash2 size={12}/></button>
          </li>
        ))}
        {!notes.length && <li className="text-gray-400 italic text-[11px]">No notes yet.</li>}
      </ul>
    </Card>
  );
}

function toLocalInput(iso?: string | null) {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
