import type { QueryClient } from "@tanstack/react-query";

/**
 * Canonical dashboard cache keys.
 *
 * Historically the same entity was cached under several different key strings
 * (e.g. "appointments", "appointments-list-v2", "appointments-day"), so a save
 * refreshed one screen and left the others stale. The invalidate* helpers below
 * are the single place that knows every key touched by an entity — always use
 * them after a mutation instead of hand-rolling invalidateQueries calls.
 */
export const qk = {
  dashboard: ["dashboard"] as const,

  appointments: ["appointments"] as const,
  appointmentsList: ["appointments-list-v2"] as const,
  appointmentsDay: ["appointments-day"] as const,
  appointmentDetail: (id: string) => ["appt-detail", id] as const,

  consultations: ["consultations"] as const,
  consultationsPage: ["consultations-page"] as const,
  consultationLookups: ["cons-lookups"] as const,

  customers: ["customers"] as const,
  customer: (id: string) => ["customers", id] as const,
  customerNotes: (id: string) => ["customer_notes", id] as const,
  customerTreatments: (id: string) => ["customer_treatments", id] as const,
  customerAppointments: (id: string) => ["customer_appointments", id] as const,
  customerSales: (id: string) => ["customer_sales", id] as const,
  customerConsultations: (id: string) => ["customer_consultations", id] as const,

  invoices: ["invoices-list"] as const,
  invoice: (id: string) => ["invoice", id] as const,

  services: ["services"] as const,
  employees: ["employees"] as const,
  accounts: ["accounts"] as const,
  interests: ["interests-page"] as const,
  marketing: ["marketing-audiences"] as const,
  reports: ["reports"] as const,
} as const;

type QC = Pick<QueryClient, "invalidateQueries">;

function bump(qc: QC, keys: readonly unknown[][]) {
  for (const queryKey of keys) qc.invalidateQueries({ queryKey });
}

/** Anything that changes money, bookings or clients also moves homepage KPIs + reports. */
function rollups(): readonly unknown[][] {
  return [[...qk.dashboard], [...qk.reports], [...qk.marketing]];
}

export function invalidateAppointments(qc: QC, opts: { id?: string; customerId?: string } = {}) {
  bump(qc, [
    [...qk.appointments],
    [...qk.appointmentsList],
    [...qk.appointmentsDay],
    ...(opts.id ? [[...qk.appointmentDetail(opts.id)]] : []),
    ...(opts.customerId ? [[...qk.customerAppointments(opts.customerId)]] : [[ "customer_appointments" ]]),
    ...rollups(),
  ]);
}

export function invalidateConsultations(qc: QC, opts: { customerId?: string } = {}) {
  bump(qc, [
    [...qk.consultations],
    [...qk.consultationsPage],
    [...qk.consultationLookups],
    ...(opts.customerId ? [[...qk.customerConsultations(opts.customerId)]] : [["customer_consultations"]]),
    [...qk.interests],
    ...rollups(),
  ]);
}

export function invalidateCustomers(qc: QC, id?: string) {
  bump(qc, [
    [...qk.customers],
    ...(id ? [[...qk.customer(id)], [...qk.customerNotes(id)], [...qk.customerTreatments(id)]] : []),
    ...rollups(),
  ]);
}

export function invalidateInvoices(qc: QC, opts: { id?: string; customerId?: string } = {}) {
  bump(qc, [
    [...qk.invoices],
    ...(opts.id ? [[...qk.invoice(opts.id)]] : []),
    ...(opts.customerId ? [[...qk.customerSales(opts.customerId)]] : [["customer_sales"]]),
    [...qk.appointments],
    [...qk.appointmentsList],
    ["appt-detail"],
    ...rollups(),
  ]);
}

export function invalidateServices(qc: QC) {
  bump(qc, [[...qk.services], ["all-services-simple"], ...rollups()]);
}

export function invalidateStaff(qc: QC) {
  bump(qc, [[...qk.employees], [...qk.accounts], ["all-employees-simple"], ["employees-list"], ...rollups()]);
}
