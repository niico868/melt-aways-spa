import { Link } from "@tanstack/react-router";
import { useRecentConsultations } from "@/lib/dashboard-queries";

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    New: "bg-blue-50 text-blue-700 border-blue-200",
    Contacted: "bg-amber-50 text-amber-700 border-amber-200",
    Booked: "bg-green-50 text-green-700 border-green-200",
  };
  return <span className={`${map[status] ?? "bg-gray-50 text-gray-700 border-gray-200"} border rounded-full px-1.5 py-0 text-[10px] font-medium`}>{status}</span>;
}

export function RecentConsultations() {
  const { data, isLoading } = useRecentConsultations();
  const rows = (data ?? []).slice(0, 4);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 h-full flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-1 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900">Consultation submissions</h3>
        <Link to="/dashboard/consultations" className="text-[10px] text-[#E8246A] hover:underline">View all</Link>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        {isLoading && <div className="text-xs text-gray-400 py-2">Loading…</div>}
        <table className="w-full">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <th className="text-left font-medium py-1">Client</th>
              <th className="text-left font-medium py-1">Service</th>
              <th className="text-left font-medium py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c: any) => (
              <tr key={c.id} className="text-xs border-b border-gray-50 last:border-0">
                <td className="text-gray-900 font-medium py-1.5">
                  {c.customers?.id ? (
                    <Link to="/dashboard/customers/$id" params={{ id: c.customers.id }} className="hover:text-[#E8246A] hover:underline">
                      {c.client_name}
                    </Link>
                  ) : c.client_name}
                </td>
                <td className="text-gray-700 py-1.5 truncate">{c.services?.name ?? c.service_name ?? "—"}</td>
                <td className="py-1.5"><Badge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}