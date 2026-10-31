import { type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export function DashboardPage({
  title,
  subtitle,
  actions,
  children,
  backTo,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  backTo?: string;
}) {
  const router = useRouter();
  const canBack = backTo || (typeof window !== "undefined" && window.history.length > 1);
  return (
    <div className="lg:h-full flex flex-col px-3 sm:px-4 pt-3 pb-4 gap-3 lg:overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 flex-shrink-0">
        <div className="min-w-0 flex items-center gap-2">
          {canBack && (
            <button
              type="button"
              onClick={() => backTo ? router.navigate({ to: backTo }) : window.history.back()}
              aria-label="Back"
              className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-[#E8246A] hover:border-[#E8246A]/40 transition"
            >
              <ArrowLeft size={15} />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#1A1A2E] leading-tight truncate">{title}</h1>
            {subtitle && <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="flex-1 min-h-0 lg:overflow-auto bg-white rounded-xl border border-gray-200">
        {children}
      </div>
    </div>
  );
}

export function PrimaryButton({ children, onClick, type = "button" }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-[#E8246A] text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-[#C91D5C] transition-colors whitespace-nowrap"
    >
      {children}
    </button>
  );
}