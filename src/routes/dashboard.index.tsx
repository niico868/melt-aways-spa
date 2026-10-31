import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { RecentConsultations } from "@/components/dashboard/RecentConsultations";
import { AlertsTray } from "@/components/dashboard/AlertsTray";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useDashboardKpis } from "@/lib/dashboard-queries";
import { useSession } from "@/lib/use-session";
import { useIsMobile } from "@/hooks/use-mobile";

// Recharts is heavy — split it out so mobile first paint stays light.
const ConsultationChart = lazy(() =>
  import("@/components/dashboard/ConsultationChart").then(m => ({ default: m.ConsultationChart })),
);
const TopServicesChart = lazy(() =>
  import("@/components/dashboard/TopServicesChart").then(m => ({ default: m.TopServicesChart })),
);

function ChartSkeleton() {
  return <div className="w-full h-full min-h-[200px] rounded-xl bg-white border border-gray-100 animate-pulse" />;
}

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  const { data } = useDashboardKpis();
  const { profile, user } = useSession();
  const isMobile = useIsMobile();
  const [showSecondaryMobileCards, setShowSecondaryMobileCards] = useState(false);
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "there";
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const fmt = (v: number) => `TT$${v.toLocaleString()}`;

  useEffect(() => {
    if (!isMobile) {
      setShowSecondaryMobileCards(true);
      return;
    }
    setShowSecondaryMobileCards(false);
    const timer = window.setTimeout(() => setShowSecondaryMobileCards(true), 900);
    return () => window.clearTimeout(timer);
  }, [isMobile]);

  const appointmentsKpi = { title: "Appointments", value: String(data?.appointmentsToday ?? "—"), label: "Today", iconKey: "calendar" as const };
  const consultationsKpi = { title: "New Consultations", value: String(data?.consultationsWeek ?? "—"), label: "This week", iconKey: "users" as const };
  const customersKpi = { title: "New Customers", value: String(data?.customersMonth ?? "—"), label: "This month", iconKey: "userplus" as const };
  const salesKpi = {
    title: "Sales this month",
    value: data ? fmt(data.salesMonth) : "—",
    label: "vs last month",
    trend: data?.salesTrend != null ? `${data.salesTrend >= 0 ? "+" : ""}${data.salesTrend}%` : undefined,
    goalProgress: true,
    iconKey: "bag" as const,
  };

  if (isMobile) {
    return (
      <div className="flex min-h-full flex-col gap-3 px-3 pb-4 pt-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight text-[#1A1A2E]">
              Welcome back, <span className="text-[#E8246A]">{displayName}</span>
            </h1>
            <p className="text-[11px] text-gray-500">{today}</p>
          </div>
          <Link
            to="/dashboard/appointments"
            search={{ new: "1" } as never}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#E8246A] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#C91D5C]"
          >
            <Plus size={14} />
            <span>New</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <KpiCard data={appointmentsKpi} />
          <KpiCard data={salesKpi} />
          <KpiCard data={consultationsKpi} />
          <KpiCard data={customersKpi} />
        </div>

        <div className="min-h-[210px]"><UpcomingAppointments /></div>
        <QuickActions />

        {showSecondaryMobileCards ? (
          <>
            <div className="min-h-[190px]"><RecentSales /></div>
            <div className="min-h-[190px]"><RecentConsultations /></div>
            <div className="min-h-[160px]"><AlertsTray /></div>
          </>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-white p-3 text-xs text-gray-400 shadow-sm">
            Loading remaining dashboard sections…
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="lg:h-full flex flex-col px-3 sm:px-4 pt-3 pb-4 gap-3 lg:overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 flex-shrink-0">
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-[#1A1A2E] leading-tight truncate">
            Welcome back, <span className="text-[#E8246A]">{displayName}</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Here's what's happening with your spa today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 bg-white flex items-center gap-1.5 whitespace-nowrap">
            <CalendarDays size={14} className="text-gray-400" />
            <span>{today}</span>
          </button>
          <Link
            to="/dashboard/appointments"
            search={{ new: "1" } as never}
            className="bg-[#E8246A] text-white rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:bg-[#C91D5C] transition-colors whitespace-nowrap"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New appointment</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>
      </div>

      {/* Main area: content grid + quick actions rail */}
      <div className="lg:flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_170px] gap-3">
        <div className="lg:min-h-0 grid lg:grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)] gap-3">
          {/* KPI strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard data={appointmentsKpi} />
            <KpiCard data={consultationsKpi} />
            <KpiCard data={customersKpi} />
            <KpiCard data={salesKpi} />
          </div>
          {/* Middle row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:min-h-0">
            <div className="min-h-[200px] lg:min-h-0"><RecentSales /></div>
            <div className="min-h-[200px] lg:min-h-0"><RecentConsultations /></div>
            <div className="min-h-[200px] lg:min-h-0">
              <Suspense fallback={<ChartSkeleton />}><TopServicesChart /></Suspense>
            </div>
          </div>
          {/* Bottom row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:min-h-0">
            <div className="lg:min-h-0"><AlertsTray /></div>
            <div className="lg:min-h-0"><UpcomingAppointments /></div>
            <div className="lg:min-h-0 min-h-[220px]">
              <Suspense fallback={<ChartSkeleton />}><ConsultationChart /></Suspense>
            </div>
          </div>
        </div>
        <div className="lg:min-h-0">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}