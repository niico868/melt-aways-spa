import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateInvoices } from "@/lib/query-keys";
import { supabase } from "@/integrations/supabase/client";

export type InvoiceRow = {
  id: string;
  invoice_number: string;
  created_at: string;
  updated_at: string;
  status: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes: string | null;
  due_date: string | null;
  voided_at: string | null;
  void_reason: string | null;
  appointment_id: string | null;
  customer_id: string | null;
  staff_id: string | null;
  customers?: { id: string; full_name: string; phone: string | null; email: string | null } | null;
  appointments?: {
    id: string;
    scheduled_at: string;
    employees?: { full_name: string } | null;
    appointment_services?: { id: string; price_snapshot: number; duration_min_snapshot?: number; services: { id?: string; name: string } | null }[];
  } | null;
  employees?: { id: string; full_name: string } | null;
  payments?: { id: string; amount: number; kind: string; method: string; recorded_at: string; note: string | null }[];
  invoice_items?: InvoiceItem[];
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  kind: string;
  service_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  line_discount: number;
  line_total: number;
};

export function paidFrom(payments: { amount: number; kind: string }[] | undefined) {
  return (payments ?? []).reduce(
    (s, p) => s + (p.kind === "refund" ? -Number(p.amount) : Number(p.amount)),
    0,
  );
}

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices-list"],
    queryFn: async () => {
      const { data, error } = await (supabase.from("invoices") as any)
        .select(
          "*, customers(id, full_name, phone, email), employees(id, full_name), appointments(id, scheduled_at, employees(full_name), appointment_services(id, price_snapshot, services(name))), payments(id, amount, kind, method, recorded_at), invoice_items(id, description, line_total)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as InvoiceRow[];
    },
  });
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: ["invoice", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await (supabase.from("invoices") as any)
        .select(
          "*, customers(id, full_name, phone, email), employees(id, full_name), appointments(id, scheduled_at, employees(full_name), appointment_services(id, price_snapshot, duration_min_snapshot, services(id, name))), payments(id, amount, kind, method, recorded_at, note), invoice_items(*)",
        )
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as InvoiceRow | null;
    },
  });
}

function inv(qc: ReturnType<typeof useQueryClient>, id?: string) {
  invalidateInvoices(qc, { id });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { customer_id: string | null; staff_id?: string | null; due_date?: string | null; notes?: string | null }) => {
      const { data, error } = await (supabase.from("invoices") as any)
        .insert({
          customer_id: row.customer_id,
          staff_id: row.staff_id ?? null,
          due_date: row.due_date ?? null,
          notes: row.notes ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => inv(qc),
  });
}

export function useUpdateInvoice(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Record<string, any>) => {
      const { error } = await (supabase.from("invoices") as any).update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => inv(qc, id),
  });
}

export function useVoidInvoice(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reason: string) => {
      const { error } = await (supabase.from("invoices") as any)
        .update({ voided_at: new Date().toISOString(), void_reason: reason, status: "Void" })
        .eq("id", id);
      if (error) throw error;
      // trigger recompute via a no-op line-item touch not needed; status set directly
    },
    onSuccess: () => inv(qc, id),
  });
}

export function useDuplicateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (source: InvoiceRow) => {
      const { data: created, error } = await (supabase.from("invoices") as any)
        .insert({
          customer_id: source.customer_id,
          staff_id: source.staff_id,
          notes: source.notes,
          discount: source.discount,
        })
        .select("id")
        .single();
      if (error) throw error;
      const newId = created.id as string;
      const items = source.invoice_items ?? [];
      if (items.length) {
        const rows = items.map((it) => ({
          invoice_id: newId,
          kind: it.kind,
          service_id: it.service_id,
          description: it.description,
          quantity: it.quantity,
          unit_price: it.unit_price,
          line_discount: it.line_discount,
        }));
        const { error: ie } = await (supabase.from("invoice_items") as any).insert(rows);
        if (ie) throw ie;
      }
      return newId;
    },
    onSuccess: () => inv(qc),
  });
}

export function useAddInvoiceItem(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { invoice_id: string; kind?: string; service_id?: string | null; description: string; quantity: number; unit_price: number; line_discount?: number }) => {
      const { error } = await (supabase.from("invoice_items") as any).insert({
        invoice_id: row.invoice_id,
        kind: row.kind ?? "service",
        service_id: row.service_id ?? null,
        description: row.description,
        quantity: row.quantity,
        unit_price: row.unit_price,
        line_discount: row.line_discount ?? 0,
      });
      if (error) throw error;
    },
    onSuccess: () => inv(qc, id),
  });
}

export function useUpdateInvoiceItem(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, patch }: { itemId: string; patch: Partial<InvoiceItem> }) => {
      const { error } = await (supabase.from("invoice_items") as any).update(patch).eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => inv(qc, id),
  });
}

export function useDeleteInvoiceItem(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await (supabase.from("invoice_items") as any).delete().eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => inv(qc, id),
  });
}

export function useAddPayment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { invoice_id: string; amount: number; method: string; kind: "payment" | "refund" | "deposit"; note?: string | null }) => {
      const { error } = await (supabase.from("payments") as any).insert(p);
      if (error) throw error;
    },
    onSuccess: () => inv(qc, id),
  });
}

export function useDeletePayment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await (supabase.from("payments") as any).delete().eq("id", paymentId);
      if (error) throw error;
    },
    onSuccess: () => inv(qc, id),
  });
}

export const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "WiPay", "Other"] as const;