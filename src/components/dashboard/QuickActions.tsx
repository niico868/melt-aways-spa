import {
  CalendarPlus, UserPlus, Receipt, ListPlus, Mail, BarChart2, Settings,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

const ACTIONS: { icon: LucideIcon; label: string; to: string; search?: Record<string, string> }[] = [
  { icon: CalendarPlus, label: "New appointment", to: "/dashboard/appointments", search: { new: "1" } },
  { icon: UserPlus, label: "Add customer", to: "/dashboard/customers", search: { new: "1" } },
  { icon: Receipt, label: "Record sale", to: "/dashboard/sales", search: { new: "1" } },
  { icon: ListPlus, label: "Add service", to: "/dashboard/services", search: { new: "1" } },
  { icon: Mail, label: "Send message", to: "/dashboard/marketing" },
  { icon: BarChart2, label: "View reports", to: "/dashboard/reports" },
  { icon: Settings, label: "Business settings", to: "/dashboard/settings" },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 lg:h-full flex flex-col lg:min-h-0">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 px-1 flex-shrink-0">Quick actions</h3>
      <div className="lg:flex-1 lg:min-h-0 grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-col lg:justify-between gap-1 lg:gap-0.5">
        {ACTIONS.map(({ icon: Icon, label, to, search }) => (
          <Link
            key={label}
            to={to}
            search={search as never}
            className="flex items-center gap-2 cursor-pointer group rounded-lg px-1.5 py-1 hover:bg-[#FBEAF0] transition-colors text-left"
          >
            <div className="w-6 h-6 rounded-full bg-[#FBEAF0] group-hover:bg-white flex items-center justify-center flex-shrink-0 transition-colors">
              <Icon className="text-[#E8246A] size-3" />
            </div>
            <span className="text-[11px] text-gray-700 leading-tight">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}