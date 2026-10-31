import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  to: string;
}

export function NavItem({ icon: Icon, label, to }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = to === "/dashboard" ? pathname === "/dashboard" : pathname === to || pathname.startsWith(to + "/");

  const base = "flex items-center gap-2 mx-2 rounded-lg px-3 py-1.5 text-xs transition-colors";
  const cls = active
    ? `${base} bg-white text-[#E8246A] font-semibold`
    : `${base} text-white/90 hover:bg-white/20`;

  return (
    <Link to={to} className={cls}>
      <Icon size={15} />
      <span>{label}</span>
    </Link>
  );
}