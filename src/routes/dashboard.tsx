import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Component, type ReactNode, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { MobileBottomNav } from "@/components/sidebar/MobileBottomNav";
import { useSession } from "@/lib/use-session";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  component: DashboardLayout,
});

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { session, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("dashboard-shell");
    return () => document.body.classList.remove("dashboard-shell");
  }, []);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!session) return;
    // Best-effort MFA check — never let a hung request block the dashboard
    // (iOS Safari/Chrome can stall pending network calls on tab restore).
    let cancelled = false;
    const timer = setTimeout(() => { cancelled = true; }, 4000);
    supabase.auth.mfa
      .getAuthenticatorAssuranceLevel()
      .then(({ data }) => {
        if (cancelled) return;
        if (data?.nextLevel === "aal2" && data.currentLevel !== "aal2") {
          navigate({ to: "/auth" });
        }
      })
      .catch(() => { /* ignore */ })
      .finally(() => clearTimeout(timer));
    return () => { cancelled = true; clearTimeout(timer); };
  }, [session, navigate]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <div className="text-sm text-gray-500">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="flex lg:h-screen min-h-screen lg:overflow-hidden bg-[#F4F5F7]" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile slide-out sidebar */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            <Sidebar />
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="relative z-10 self-start mt-3 ml-2 text-white bg-black/30 rounded-full p-1.5"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <main className="flex-1 min-w-0 lg:overflow-hidden flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between bg-[#E8246A] text-white px-3 py-2.5 shadow">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="p-1 rounded hover:bg-white/10"
          >
            <Menu size={20} />
          </button>
          <div className="font-extrabold tracking-tight text-sm truncate">Melt Away Spa Digital Hub</div>
          <div className="w-7" />
        </div>
        <div className="flex-1 min-h-0 lg:overflow-hidden pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0">
          <DashboardErrorBoundary>
            <Outlet />
          </DashboardErrorBoundary>
        </div>
      </main>
      <MobileBottomNav onMore={() => setOpen(true)} />
    </div>
  );
}

class DashboardErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error) { console.error("[dashboard] render error", error); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="p-5 h-full flex items-center justify-center">
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-xl p-5 text-center">
          <h2 className="text-base font-bold text-[#1A1A2E] mb-1">This page didn't load</h2>
          <p className="text-xs text-gray-500 mb-4">Something went wrong rendering the dashboard. Try again — your data is safe.</p>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => { this.setState({ error: null }); }}
              className="bg-[#E8246A] text-white rounded-lg px-3 py-1.5 text-xs font-medium"
            >Try again</button>
            <button
              type="button"
              onClick={() => { if (typeof window !== "undefined") window.location.reload(); }}
              className="bg-white text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium"
            >Reload</button>
          </div>
        </div>
      </div>
    );
  }
}