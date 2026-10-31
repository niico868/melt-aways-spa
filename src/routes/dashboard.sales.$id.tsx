import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Printer, Plus, Trash2, DollarSign, RotateCcw, Copy, Ban, ArrowLeft, Phone, Mail } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Modal, Field, inputCls } from "@/components/dashboard/Modal";
import { fmtDateTime, fmtDate, fmtMoney } from "@/components/dashboard/DataTable";
import {
  useInvoice, useUpdateInvoice, useAddInvoiceItem, useDeleteInvoiceItem, useUpdateInvoiceItem,
  useAddPayment, useDeletePayment, useVoidInvoice, useDuplicateInvoice, paidFrom, PAYMENT_METHODS,
  type InvoiceRow, type InvoiceItem,
} from "@/lib/sales";
import { useServices } from "@/lib/dashboard-tables";
import { StatusBadge } from "./dashboard.sales";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/sales/$id")({ component: InvoiceDetailPage });

function InvoiceDetailPage() {
  const { id } = Route.useParams();
  const { data: inv, isLoading } = useInvoice(id);

  if (isLoading || !inv) {
    return (
      <DashboardPage title="Loading…" backTo="/dashboard/sales">
        <div className="p-6 text-xs text-gray-400">Loading invoice…</div>
      </DashboardPage>
    );
  }

  const paid = paidFrom(inv.payments);
  const remaining = Math.max(0, Number(inv.total) - paid);

  return (
    <DashboardPage
      title={inv.invoice_number}
      subtitle={fmtDateTime(inv.created_at)}
      backTo="/dashboard/sales"
      actions={
        <div className="flex items-center gap-2">
          <StatusBadge status={inv.status} />
          <Link to="/dashboard/sales" className="text-xs text-gray-500 hover:text-[#E8246A] hidden sm:inline-flex items-center gap-1">
            <ArrowLeft size={12} /> All invoices
          </Link>
        </div>
      }
    >
      <div className="grid lg:grid-cols-2 gap-3 p-3">
        <CustomerCard inv={inv} />
        <InvoiceMetaCard inv={inv} />
        <ItemsCard inv={inv} />
        <PaymentsCard inv={inv} paid={paid} remaining={remaining} />
        <ActionsCard inv={inv} remaining={remaining} />
      </div>
    </DashboardPage>
  );
}

function Card({ title, action, children, className }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${className ?? ""}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <h2 className="text-xs font-semibold text-gray-800 uppercase tracking-wide">{title}</h2>
        {action}
      </div>
      <div className="p-3 text-xs">{children}</div>
    </section>
  );
}

function CustomerCard({ inv }: { inv: InvoiceRow }) {
  const c = inv.customers;
  return (
    <Card
      title="Customer"
      action={c ? (
        <Link to="/dashboard/customers/$id" params={{ id: c.id }} className="text-[11px] text-[#E8246A] hover:underline">Open profile →</Link>
      ) : null}
    >
      {c ? (
        <div className="space-y-1.5">
          <div className="font-semibold text-sm text-gray-900">{c.full_name}</div>
          {c.phone && <div className="flex items-center gap-2 text-gray-600"><Phone size={11} />{c.phone}</div>}
          {c.email && <div className="flex items-center gap-2 text-gray-600"><Mail size={11} />{c.email}</div>}
          {inv.appointments && (
            <Link
              to="/dashboard/appointments/$id"
              params={{ id: inv.appointments.id }}
              className="inline-block mt-2 text-[11px] text-[#E8246A] hover:underline"
            >
              Linked appointment · {fmtDateTime(inv.appointments.scheduled_at)}
            </Link>
          )}
        </div>
      ) : (
        <div className="text-gray-400">Walk-in customer</div>
      )}
    </Card>
  );
}

function InvoiceMetaCard({ inv }: { inv: InvoiceRow }) {
  const update = useUpdateInvoice(inv.id);
  const [dueDate, setDueDate] = useState(inv.due_date ?? "");
  const [notes, setNotes] = useState(inv.notes ?? "");
  const [discount, setDiscount] = useState(String(inv.discount ?? 0));

  async function save() {
    await update.mutateAsync({
      due_date: dueDate || null,
      notes: notes || null,
      discount: Number(discount) || 0,
    });
    toast.success("Invoice updated");
  }

  return (
    <Card title="Invoice details">
      <div className="grid grid-cols-2 gap-2">
        <Info label="Invoice #" value={inv.invoice_number} />
        <Info label="Issued" value={fmtDate(inv.created_at)} />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Field label="Due date">
          <input type="date" className={inputCls} value={dueDate ?? ""} onChange={(e) => setDueDate(e.target.value)} />
        </Field>
        <Field label="Discount (TT$)">
          <input type="number" step="0.01" min="0" className={inputCls} value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </Field>
      </div>
      <Field label="Notes">
        <textarea rows={2} className={inputCls} value={notes ?? ""} onChange={(e) => setNotes(e.target.value)} />
      </Field>
      <div className="flex justify-end">
        <button onClick={save} className="text-xs px-3 py-1.5 rounded-lg bg-[#E8246A] text-white hover:bg-[#C91D5C]">Save changes</button>
      </div>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-xs font-medium text-gray-800 mt-0.5">{value}</div>
    </div>
  );
}

function ItemsCard({ inv }: { inv: InvoiceRow }) {
  const [addOpen, setAddOpen] = useState(false);
  const appointmentServices = inv.appointments?.appointment_services ?? [];
  const items = inv.invoice_items ?? [];
  const voided = !!inv.voided_at;

  return (
    <Card
      title="Services & products"
      className="lg:col-span-2"
      action={!voided && (
        <button onClick={() => setAddOpen(true)} className="text-[11px] text-[#E8246A] hover:underline inline-flex items-center gap-1">
          <Plus size={11} /> Add item
        </button>
      )}
    >
      <table className="w-full text-xs">
        <thead className="text-gray-500">
          <tr className="border-b border-gray-100">
            <th className="text-left font-medium py-1.5">Description</th>
            <th className="text-right font-medium py-1.5 w-14">Qty</th>
            <th className="text-right font-medium py-1.5 w-24">Unit</th>
            <th className="text-right font-medium py-1.5 w-24">Total</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {appointmentServices.map((s: { id: string; price_snapshot: number; services: { name: string } | null }) => (
            <tr key={s.id} className="border-b border-gray-50">
              <td className="py-1.5 text-gray-700">
                {s.services?.name ?? "Service"}
                <span className="ml-1 text-[10px] text-gray-400">(from appointment)</span>
              </td>
              <td className="text-right text-gray-600">1</td>
              <td className="text-right text-gray-600">{fmtMoney(s.price_snapshot)}</td>
              <td className="text-right font-medium">{fmtMoney(s.price_snapshot)}</td>
              <td />
            </tr>
          ))}
          {items.map((it) => (
            <InvoiceItemRow key={it.id} invoiceId={inv.id} item={it} disabled={voided} />
          ))}
          {appointmentServices.length === 0 && items.length === 0 && (
            <tr><td colSpan={5} className="py-4 text-center text-gray-400">No items yet. Add a service or product.</td></tr>
          )}
        </tbody>
      </table>
      <div className="mt-3 flex justify-end">
        <div className="w-full sm:w-64 space-y-1 text-xs">
          <Row label="Subtotal" value={fmtMoney(inv.subtotal)} />
          {Number(inv.discount) > 0 && <Row label="Discount" value={`- ${fmtMoney(inv.discount)}`} />}
          <Row label="Tax (12.5% VAT)" value={fmtMoney(inv.tax)} />
          <div className="border-t border-gray-200 pt-1.5 mt-1.5">
            <Row label="Total" value={fmtMoney(inv.total)} bold />
          </div>
        </div>
      </div>
      {addOpen && <AddItemModal invoiceId={inv.id} onClose={() => setAddOpen(false)} />}
    </Card>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={bold ? "font-bold text-[#1A1A2E]" : "text-gray-800"}>{value}</span>
    </div>
  );
}

function InvoiceItemRow({ invoiceId, item, disabled }: { invoiceId: string; item: InvoiceItem; disabled: boolean }) {
  const del = useDeleteInvoiceItem(invoiceId);
  return (
    <tr className="border-b border-gray-50">
      <td className="py-1.5 text-gray-700">
        {item.description}
        <span className="ml-1 text-[10px] text-gray-400 capitalize">({item.kind})</span>
      </td>
      <td className="text-right text-gray-600">{Number(item.quantity)}</td>
      <td className="text-right text-gray-600">{fmtMoney(item.unit_price)}</td>
      <td className="text-right font-medium">{fmtMoney(item.line_total)}</td>
      <td>
        {!disabled && (
          <button
            onClick={() => { if (confirm("Remove this item?")) del.mutate(item.id); }}
            className="text-gray-400 hover:text-rose-600"
          >
            <Trash2 size={12} />
          </button>
        )}
      </td>
    </tr>
  );
}

function AddItemModal({ invoiceId, onClose }: { invoiceId: string; onClose: () => void }) {
  const { data: services = [] } = useServices();
  const add = useAddInvoiceItem(invoiceId);
  const [kind, setKind] = useState<"service" | "manual">("service");
  const [refId, setRefId] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("0");
  const [discount, setDiscount] = useState("0");

  function onPickRef(id: string) {
    setRefId(id);
    if (kind === "service") {
      const s = services.find((x) => x.id === id);
      if (s) { setDescription(s.name); setUnitPrice(String(s.base_price)); }
    }
  }

  async function submit() {
    if (!description.trim()) { toast.error("Description required"); return; }
    await add.mutateAsync({
      invoice_id: invoiceId,
      kind,
      service_id: kind === "service" ? refId || null : null,
      description: description.trim(),
      quantity: Number(quantity) || 1,
      unit_price: Number(unitPrice) || 0,
      line_discount: Number(discount) || 0,
    });
    toast.success("Item added");
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Add line item">
      <Field label="Type">
        <div className="flex gap-2">
          {(["service", "manual"] as const).map((k) => (
            <button
              key={k}
              onClick={() => { setKind(k); setRefId(""); setDescription(""); setUnitPrice("0"); }}
              className={`flex-1 text-xs py-1.5 rounded-lg border capitalize ${kind === k ? "bg-[#E8246A] text-white border-[#E8246A]" : "border-gray-200 text-gray-600"}`}
            >
              {k}
            </button>
          ))}
        </div>
      </Field>
      {kind === "service" && (
        <Field label="Service">
          <select className={inputCls} value={refId} onChange={(e) => onPickRef(e.target.value)}>
            <option value="">Select…</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name} — {fmtMoney(s.base_price)}</option>)}
          </select>
        </Field>
      )}
      <Field label="Description">
        <input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Qty"><input type="number" step="0.01" className={inputCls} value={quantity} onChange={(e) => setQuantity(e.target.value)} /></Field>
        <Field label="Unit price"><input type="number" step="0.01" className={inputCls} value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} /></Field>
        <Field label="Discount"><input type="number" step="0.01" className={inputCls} value={discount} onChange={(e) => setDiscount(e.target.value)} /></Field>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onClose} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600">Cancel</button>
        <button onClick={submit} className="text-xs px-3 py-1.5 rounded-lg bg-[#E8246A] text-white hover:bg-[#C91D5C]">Add item</button>
      </div>
    </Modal>
  );
}

function PaymentsCard({ inv, paid, remaining }: { inv: InvoiceRow; paid: number; remaining: number }) {
  const [payOpen, setPayOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const del = useDeletePayment(inv.id);
  const voided = !!inv.voided_at;

  const sorted = useMemo(
    () => [...(inv.payments ?? [])].sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()),
    [inv.payments],
  );

  return (
    <Card
      title="Payments"
      className="lg:col-span-2"
      action={
        !voided && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPayOpen(true)}
              className="text-[11px] px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 inline-flex items-center gap-1"
            >
              <DollarSign size={11} /> Record payment
            </button>
            <button
              onClick={() => setRefundOpen(true)}
              disabled={paid <= 0}
              className="text-[11px] px-2 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 inline-flex items-center gap-1 disabled:opacity-40"
            >
              <RotateCcw size={11} /> Issue refund
            </button>
          </div>
        )
      }
    >
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Info label="Amount paid" value={<span className="text-emerald-700">{fmtMoney(paid)}</span>} />
        <Info label="Remaining" value={<span className={remaining > 0 ? "text-amber-700" : "text-gray-500"}>{fmtMoney(remaining)}</span>} />
        <Info label="Total due" value={fmtMoney(inv.total)} />
      </div>
      {sorted.length === 0 ? (
        <div className="text-gray-400 text-center py-3">No payments recorded yet.</div>
      ) : (
        <table className="w-full text-xs">
          <thead className="text-gray-500 border-b border-gray-100">
            <tr>
              <th className="text-left font-medium py-1.5">Date</th>
              <th className="text-left font-medium py-1.5">Type</th>
              <th className="text-left font-medium py-1.5">Method</th>
              <th className="text-left font-medium py-1.5">Note</th>
              <th className="text-right font-medium py-1.5">Amount</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id} className="border-b border-gray-50">
                <td className="py-1.5 text-gray-700">{fmtDateTime(p.recorded_at)}</td>
                <td className="capitalize text-gray-700">{p.kind}</td>
                <td className="text-gray-700">{p.method}</td>
                <td className="text-gray-500">{p.note ?? "—"}</td>
                <td className={`text-right font-medium ${p.kind === "refund" ? "text-rose-700" : "text-emerald-700"}`}>
                  {p.kind === "refund" ? "- " : ""}{fmtMoney(p.amount)}
                </td>
                <td>
                  <button
                    onClick={() => { if (confirm("Delete this payment record?")) del.mutate(p.id); }}
                    className="text-gray-400 hover:text-rose-600"
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {payOpen && <PaymentModal invoiceId={inv.id} defaultAmount={remaining} mode="payment" onClose={() => setPayOpen(false)} />}
      {refundOpen && <PaymentModal invoiceId={inv.id} defaultAmount={paid} mode="refund" onClose={() => setRefundOpen(false)} />}
    </Card>
  );
}

function PaymentModal({ invoiceId, defaultAmount, mode, onClose }: { invoiceId: string; defaultAmount: number; mode: "payment" | "refund"; onClose: () => void }) {
  const add = useAddPayment(invoiceId);
  const [amount, setAmount] = useState(String(defaultAmount.toFixed(2)));
  const [method, setMethod] = useState<string>("Cash");
  const [note, setNote] = useState("");

  async function submit() {
    const n = Number(amount);
    if (!n || n <= 0) { toast.error("Enter a valid amount"); return; }
    await add.mutateAsync({ invoice_id: invoiceId, amount: n, method, kind: mode, note: note || null });
    toast.success(mode === "refund" ? "Refund issued" : "Payment recorded");
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={mode === "refund" ? "Issue refund" : "Record payment"}>
      <Field label="Amount (TT$)">
        <input type="number" step="0.01" min="0" className={inputCls} value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>
      <Field label="Method">
        <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)}>
          {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </Field>
      <Field label="Note (optional)">
        <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onClose} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600">Cancel</button>
        <button
          onClick={submit}
          className={`text-xs px-3 py-1.5 rounded-lg text-white ${mode === "refund" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
        >
          {mode === "refund" ? "Issue refund" : "Record payment"}
        </button>
      </div>
    </Modal>
  );
}

function ActionsCard({ inv, remaining }: { inv: InvoiceRow; remaining: number }) {
  const dup = useDuplicateInvoice();
  const voidIt = useVoidInvoice(inv.id);
  const navigate = useNavigate();
  const voided = !!inv.voided_at;

  async function onDuplicate() {
    const id = await dup.mutateAsync(inv);
    toast.success("Invoice duplicated");
    navigate({ to: "/dashboard/sales/$id", params: { id } });
  }

  async function onVoid() {
    const reason = prompt("Reason for voiding this invoice?");
    if (reason === null) return;
    await voidIt.mutateAsync(reason || "No reason provided");
    toast.success("Invoice voided");
  }

  return (
    <Card title="Actions" className="lg:col-span-2">
      <div className="flex flex-wrap gap-2">
        <ActionButton icon={<Printer size={12} />} label="Print invoice" onClick={() => window.print()} />
        <ActionButton icon={<Copy size={12} />} label="Duplicate" onClick={onDuplicate} />
        {!voided && (
          <ActionButton icon={<Ban size={12} />} label="Void invoice" onClick={onVoid} tone="danger" />
        )}
      </div>
      {voided && (
        <div className="mt-3 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-2 py-1.5">
          Voided on {fmtDateTime(inv.voided_at)} — {inv.void_reason ?? "no reason recorded"}
        </div>
      )}
      {!voided && remaining > 0 && (
        <div className="mt-3 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">
          Outstanding balance: {fmtMoney(remaining)}
        </div>
      )}
    </Card>
  );
}

function ActionButton({ icon, label, onClick, tone }: { icon: React.ReactNode; label: string; onClick: () => void; tone?: "danger" }) {
  const cls = tone === "danger"
    ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
  return (
    <button onClick={onClick} className={`text-xs px-3 py-1.5 rounded-lg border inline-flex items-center gap-1.5 ${cls}`}>
      {icon} {label}
    </button>
  );
}