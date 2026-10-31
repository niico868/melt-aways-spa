import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateConsultations, invalidateCustomers, invalidateServices, invalidateStaff } from "@/lib/query-keys";
import { supabase } from "@/integrations/supabase/client";

// ---------- Customers ----------
export type Customer = {
  id: string; full_name: string; email: string | null; phone: string | null; notes: string | null; created_at: string;
  date_of_birth?: string | null; address?: string | null; city?: string | null;
  preferred_contact?: string | null; tags?: string[] | null; marketing_opt_in?: boolean | null;
  allergies?: string | null; medications?: string | null; medical_conditions?: string | null;
  skin_type?: string | null; medical_notes?: string | null;
};
export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Customer[];
    },
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ["customers", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data as Customer | null;
    },
  });
}

export function useUpsertCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<Customer> & { full_name: string }) => {
      const payload: any = {
        full_name: row.full_name,
        email: row.email || null,
        phone: row.phone || null,
        notes: row.notes || null,
        date_of_birth: row.date_of_birth || null,
        address: row.address || null,
        city: row.city || null,
        preferred_contact: row.preferred_contact || "whatsapp",
        tags: row.tags ?? [],
        marketing_opt_in: row.marketing_opt_in ?? false,
      };
      if (row.allergies !== undefined) payload.allergies = row.allergies || null;
      if (row.medications !== undefined) payload.medications = row.medications || null;
      if (row.medical_conditions !== undefined) payload.medical_conditions = row.medical_conditions || null;
      if (row.skin_type !== undefined) payload.skin_type = row.skin_type || null;
      if (row.medical_notes !== undefined) payload.medical_notes = row.medical_notes || null;
      if (row.id) {
        const { error } = await supabase.from("customers").update(payload).eq("id", row.id);
        if (error) throw error;
        return row.id;
      }
      const { data, error } = await (supabase.rpc as any)("upsert_customer_by_contact", {
        p_full_name: row.full_name,
        p_phone: row.phone ?? null,
        p_email: row.email ?? null,
        p_notes: row.notes ?? null,
      });
      if (error) throw error;
      // apply any extra fields to the resolved id
      if (data) {
        await supabase.from("customers").update(payload).eq("id", data);
      }
      return data as string;
    },
    onSuccess: (_d: any, v: any) => invalidateCustomers(qc, v?.id),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d: any, v: any) => invalidateCustomers(qc, v?.id),
  });
}

// ---------- Customer Notes ----------
export type CustomerNote = { id: string; customer_id: string; body: string; pinned: boolean; author_id: string | null; created_at: string };
export function useCustomerNotes(customerId: string | undefined) {
  return useQuery({
    queryKey: ["customer_notes", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data, error } = await (supabase.from as any)("customer_notes").select("*").eq("customer_id", customerId).order("pinned", { ascending: false }).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CustomerNote[];
    },
  });
}
export function useAddCustomerNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { customer_id: string; body: string; pinned?: boolean }) => {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await (supabase.from as any)("customer_notes").insert({ ...row, author_id: userData.user?.id ?? null });
      if (error) throw error;
    },
    onSuccess: (_d, v) => invalidateCustomers(qc, v.customer_id),
  });
}
export function useDeleteCustomerNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; customer_id: string }) => {
      const { error } = await (supabase.from as any)("customer_notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => invalidateCustomers(qc, v.customer_id),
  });
}

// ---------- Customer Treatments ----------
export type CustomerTreatment = {
  id: string; customer_id: string; service_name: string; employee_name: string | null;
  performed_at: string; session_number: number | null; price: number | null; outcome_notes: string | null;
  before_photo_url: string | null; after_photo_url: string | null;
};
export function useCustomerTreatments(customerId: string | undefined) {
  return useQuery({
    queryKey: ["customer_treatments", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data, error } = await (supabase.from as any)("customer_treatments").select("*").eq("customer_id", customerId).order("performed_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CustomerTreatment[];
    },
  });
}
export function useAddCustomerTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CustomerTreatment> & { customer_id: string; service_name: string }) => {
      const { error } = await (supabase.from as any)("customer_treatments").insert(row);
      if (error) throw error;
    },
    onSuccess: (_d, v) => invalidateCustomers(qc, v.customer_id),
  });
}

// ---------- Customer-scoped history helpers ----------
export function useCustomerAppointments(customerId: string | undefined) {
  return useQuery({
    queryKey: ["customer_appointments", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data, error } = await supabase.from("appointments")
        .select("id, scheduled_at, status, service_id, employee_id, services(name), employees(full_name)")
        .eq("customer_id", customerId!).order("scheduled_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });
}
export function useCustomerSales(customerId: string | undefined) {
  return useQuery({
    queryKey: ["customer_sales", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      // Real revenue lives on invoices/payments; the legacy `sales` table is unused.
      const { data, error } = await (supabase.from("invoices") as any)
        .select("id, invoice_number, total, status, created_at, voided_at, payments(amount, kind)")
        .eq("customer_id", customerId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((inv: any) => {
        const paid = (inv.payments ?? []).reduce((s: number, p: any) => {
          const sign = p.kind === "refund" ? -1 : 1;
          return s + sign * Number(p.amount);
        }, 0);
        return {
          id: inv.id,
          description: `Invoice ${inv.invoice_number}`,
          amount: inv.status === "Void" ? 0 : Number(inv.total),
          sold_at: inv.created_at,
          paid,
          status: inv.status,
          invoice_number: inv.invoice_number,
        };
      });
    },
  });
}
export function useCustomerConsultations(customerId: string | undefined) {
  return useQuery({
    queryKey: ["customer_consultations", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data, error } = await supabase.from("consultations")
        .select("id, client_name, service_name, status, submitted_at")
        .eq("customer_id", customerId!).order("submitted_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });
}

// ---------- Services ----------
export type Service = { id: string; name: string; base_price: number; fill_color: string; created_at: string };
export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as Service[];
    },
  });
}
export function useUpsertService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { id?: string; name: string; base_price: number; fill_color?: string }) => {
      if (row.id) {
        const { error } = await supabase.from("services").update({ name: row.name, base_price: row.base_price, fill_color: row.fill_color ?? "#FDF2F7" }).eq("id", row.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert({ name: row.name, base_price: row.base_price, fill_color: row.fill_color ?? "#FDF2F7" });
        if (error) throw error;
      }
    },
    onSuccess: () => invalidateServices(qc),
  });
}
export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidateServices(qc),
  });
}

// ---------- Employees ----------
export type Employee = { id: string; full_name: string; role: string; avatar_tone: string; slots_total: number; created_at: string };
export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employees").select("*").order("full_name");
      if (error) throw error;
      return (data ?? []) as Employee[];
    },
  });
}
export function useUpsertEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { id?: string; full_name: string; role: string; slots_total: number; avatar_tone?: string }) => {
      const payload = { full_name: row.full_name, role: row.role, slots_total: row.slots_total, avatar_tone: row.avatar_tone ?? "#FDF2F7" };
      if (row.id) {
        const { error } = await supabase.from("employees").update(payload).eq("id", row.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("employees").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => invalidateStaff(qc),
  });
}
export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("employees").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidateStaff(qc),
  });
}

// ---------- Consultations (Interest Tracking) ----------
export type Consultation = { id: string; client_name: string; service_name: string | null; status: string; submitted_at: string };
export function useConsultations() {
  return useQuery({
    queryKey: ["consultations", "all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("consultations")
        .select("id, client_name, service_name, status, submitted_at")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Consultation[];
    },
  });
}
export function useUpdateConsultationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("consultations").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateConsultations(qc);
    },
  });
}

export const CONSULT_STATUSES = [
  "Not Started", "Contacted", "Booked", "Completed",
  "Follow-Up Required", "Not Suitable", "Lost",
  // VIP Transformation Program flow
  "Review Required", "Consultation Scheduled", "Consultation Completed",
  "VIP Plan Proposed", "Enrolled", "Not Enrolled", "Follow Up Later",
] as const;

export const APPT_STATUSES = [
  "Pending", "Confirmed", "Checked In", "In Progress",
  "Completed", "No Show", "Cancelled", "Rescheduled",
] as const;

// ---------- Simple modal dialog helper ----------