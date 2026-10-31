import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Calendar, Users, CreditCard, Menu } from "lucide-react";

const TABS = [
  { icon: LayoutDashboard, label: "Home", to: "/dashboard" },
  { icon: Calendar, label: "Appts", to: "/dashboard/appointments" },
  { icon: Users, label: "Clients", to: "/dashboard/customers" },
  { icon: CreditCard, label: "Sales", to: "/dashboard/sales" },
] as const;

export function MobileBottomNav({ onMore }: { onMore: () => void }) {
  const path = useRouterState({ select: s => s.location.pathname });
  return (
    <nav
      aria-label="Primary"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {TABS.map(t => {
          const active = path === t.to;
          const Icon = t.icon;
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={`flex flex-col items-center justify-center gap-0.5 min-h-[56px] text-[10px] font-medium transition ${
                  active ? "text-[#E8246A]" : "text-gray-500"
                }`}
              >
                <Icon size={20} />
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={onMore}
            className="w-full flex flex-col items-center justify-center gap-0.5 min-h-[56px] text-[10px] font-medium text-gray-500 hover:text-[#E8246A]"
          >
            <Menu size={20} />
            <span>More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}