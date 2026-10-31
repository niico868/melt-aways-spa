export type AppointmentStatus = "Confirmed" | "Pending";
export type ConsultationStatus = "New" | "Contacted" | "Booked";

export interface KpiCardDatum {
  title: string;
  value: string;
  label: string;
  trend?: string;
  goalProgress?: boolean;
  iconKey: "calendar" | "users" | "bag" | "userplus";
}

export const kpiData: KpiCardDatum[] = [
  { title: "Appointments", value: "18", label: "Today", iconKey: "calendar" },
  { title: "New Consultations", value: "12", label: "This week", iconKey: "users" },
  { title: "Sales this month", value: "TT$8,450", label: "vs last month", trend: "+18%", goalProgress: true, iconKey: "bag" },
  { title: "New Customers", value: "23", label: "This month", iconKey: "userplus" },
];

export const consultationChartData = [
  { date: "May 18", count: 10 },
  { date: "May 19", count: 28 },
  { date: "May 20", count: 22 },
  { date: "May 21", count: 33 },
  { date: "May 22", count: 25 },
  { date: "May 23", count: 30 },
  { date: "May 24", count: 27 },
];

export const topServicesData = [
  { name: "Body Sculpting", percentage: 35, revenue: 2958, fill: "#E8246A" },
  { name: "Lipo Cavitation", percentage: 25, revenue: 2113, fill: "#ED93B1" },
  { name: "RF Skin Tightening", percentage: 20, revenue: 1690, fill: "#F4C0D1" },
  { name: "Wood Therapy", percentage: 10, revenue: 845, fill: "#FAE0EB" },
  { name: "Others", percentage: 10, revenue: 0, fill: "#FDF2F7" },
];

export const recentSalesData = [
  { service: "Body Sculpting Package", date: "May 24, 2025", amount: 1500 },
  { service: "Lipo Cavitation (3 Sessions)", date: "May 24, 2025", amount: 1050 },
  { service: "RF Skin Tightening", date: "May 24, 2025", amount: 850 },
  { service: "Wood Therapy", date: "May 23, 2025", amount: 600 },
  { service: "Product Purchase", date: "May 23, 2025", amount: 450 },
];

export const appointmentsData: { time: string; client: string; service: string; status: AppointmentStatus }[] = [
  { time: "10:00 AM", client: "Sarah J.", service: "Body Sculpting", status: "Confirmed" },
  { time: "11:30 AM", client: "Melissa K.", service: "Lipo Cavitation", status: "Confirmed" },
  { time: "1:00 PM", client: "Amanda L.", service: "RF Skin Tightening", status: "Pending" },
  { time: "2:30 PM", client: "Tiffany B.", service: "Wood Therapy", status: "Confirmed" },
  { time: "4:00 PM", client: "Natasha P.", service: "Consultation", status: "Pending" },
];

export const consultationSubmissionsData: { client: string; service: string; date: string; status: ConsultationStatus }[] = [
  { client: "Jasmine R.", service: "Body Sculpting", date: "May 24, 2025", status: "New" },
  { client: "Danielle T.", service: "Lipo Cavitation", date: "May 24, 2025", status: "Contacted" },
  { client: "Nicole A.", service: "RF Skin Tightening", date: "May 23, 2025", status: "New" },
  { client: "Keisha B.", service: "Wood Therapy", date: "May 23, 2025", status: "Booked" },
  { client: "Tara M.", service: "General Consultation", date: "May 23, 2025", status: "New" },
];

export const employeeData = [
  { initials: "JC", name: "Jerry C", role: "Therapist", slotsBooked: 6, slotsTotal: 8, avatarTone: "pink" as const },
  { initials: "JC", name: "Jeremiah C", role: "Therapist", slotsBooked: 4, slotsTotal: 8, avatarTone: "pink" as const },
  { initials: "LM", name: "Laura M", role: "Front Desk", slotsBooked: 2, slotsTotal: 4, avatarTone: "purple" as const },
];

export const alertsData: { message: string; type: "dismiss" | "action"; actionLabel?: string }[] = [
  { message: "3 consultation submissions have not been followed up in over 48 hours.", type: "dismiss" },
  { message: "2 appointments are still pending confirmation for today.", type: "action", actionLabel: "Confirm all" },
  { message: "Body Sculpting Package product stock is running low — reorder soon.", type: "dismiss" },
];