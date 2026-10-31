import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateAppointments, invalidateInvoices } from "@/lib/query-keys";
import { supabase } from "@/integrations/supabase/client";

export type ApptDetail = Awaited<ReturnType<typeof fetchAppointmentDetail>>;

async function fetchAppointmentDetail(id: string) {
  const { data: appt, error } = await supabase
    .from("appointments")
    .select("id, scheduled_at, status, quick_note, room, duration_min, customer_id, employee_id, service_id, customers(id, full_name, phone, email, date_of_birth), employees(id, full_name)")
    .eq("id", id).single();
  if (error) throw error;

  const [services, notes, medical, invoice] = await Promise.all([
    supabase.from("appointment_services").select("id, service_id, price_snapshot, duration_min_snapshot, services(id, name)").eq("appointment_id", id),
    supabase.from("appointment_notes").select("*").eq("appointment_id", id).order("created_at", { ascending: false }),
    supabase.from("appointment_medical").select("*").eq("appointment_id", id).maybeSingle(),
    supabase.from("invoices").select("*, payments(*)").eq("appointment_id", id).maybeSingle(),
  ]);

  const paid = ((invoice.data as any)?.payments ?? []).reduce((s: number, p: any) => s + (p.kind === "refund" ? -Number(p.amount) : Number(p.amount)), 0);
  const remaining = Math.max(0, Number((invoice.data as any)?.total ?? 0) - paid);

  return {
    appt,
    services: services.data ?? [],
    notes: notes.data ?? [],
    medical: medical.data ?? null,
    invoice: invoice.data ?? null,
    paid,
    remaining,
  };
}

export function useApptDetail(id: string) {
  return useQuery({ queryKey: ["appt-detail", id], queryFn: () => fetchAppointmentDetail(id), enabled: !!id });
}

export function useAllServices() {
  return useQuery({
    queryKey: ["all-services-simple"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("id, name, base_price").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllEmployees() {
  return useQuery({
    queryKey: ["all-employees-simple"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employees").select("id, full_name").order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });
}

function inv(qc: ReturnType<typeof useQueryClient>, id: string) {
  invalidateAppointments(qc, { id });
  invalidateInvoices(qc);
}

export function useUpdateAppointment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Record<string, any>) => {
      const { error } = await (supabase.from("appointments") as any).update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => inv(qc, id),
  });
}

export function useSetServices(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (services: { service_id: string; price: number; duration: number }[]) => {
      await supabase.from("appointment_services").delete().eq("appointment_id", id);
      if (services.length) {
        const { error } = await supabase.from("appointment_services").insert(
          services.map(s => ({ appointment_id: id, service_id: s.service_id, price_snapshot: s.price, duration_min_snapshot: s.duration })),
        );
        if (error) throw error;
        const totalDur = services.reduce((s, x) => s + x.duration, 0);
        await supabase.from("appointments").update({ duration_min: totalDur, service_id: services[0].service_id }).eq("id", id);
      }
    },
    onSuccess: () => inv(qc, id),
  });
}

export function useUpsertMedical(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fields: { allergies?: string; medications?: string; contraindications?: string; additional_notes?: string }) => {
      const { error } = await supabase.from("appointment_medical").upsert({ appointment_id: id, ...fields });
      if (error) throw error;
    },
    onSuccess: () => inv(qc, id),
  });
}

export function useAddNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (n: { kind: "internal" | "treatment"; body: string; author_name?: string; author_id?: string }) => {
      const { error } = await supabase.from("appointment_notes").insert({ appointment_id: id, ...n });
      if (error) throw error;
    },
    onSuccess: () => inv(qc, id),
  });
}

export function useDeleteNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase.from("appointment_notes").delete().eq("id", noteId);
      if (error) throw error;
    },
    onSuccess: () => inv(qc, id),
  });
}

export function useAddPayment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { invoice_id: string; amount: number; method: string; kind: "payment" | "refund" | "deposit"; note?: string }) => {
      const { error } = await supabase.from("payments").insert(p);
      if (error) throw error;
    },
    onSuccess: () => inv(qc, id),
  });
}

export function useUpdateInvoice(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ invoice_id, patch }: { invoice_id: string; patch: Record<string, any> }) => {
      const { error } = await (supabase.from("invoices") as any).update(patch).eq("id", invoice_id);
      if (error) throw error;
    },
    onSuccess: () => inv(qc, id),
  });
}

export function buildWhatsAppUrl(phone: string | null | undefined, dt: string, services: string[]) {
  const cleanPhone = (phone ?? "").replace(/\D/g, "");
  const when = new Date(dt).toLocaleString("en-TT", { dateStyle: "full", timeStyle: "short" });
  const svc = services.length ? services.join(", ") : "your appointment";
  const msg = `Hi! This is a reminder from Melt Elite Aesthetics.\n\nYour appointment: ${when}\nServices: ${svc}\n\nPlease reply to confirm. Thank you!`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
}
