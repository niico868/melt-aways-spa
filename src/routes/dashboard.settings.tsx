import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardPage, PrimaryButton } from "@/components/dashboard/DashboardPage";
import { Field, inputCls } from "@/components/dashboard/Modal";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/dashboard/settings")({ component: SettingsPage });

type Biz = { name: string; phone: string; email: string; hours: string; address: string };
const KEY = "meltaways.business.settings";
const DEFAULT: Biz = { name: SITE.name, phone: SITE.phone, email: SITE.email, hours: SITE.hours, address: SITE.locations[0].address };

function SettingsPage() {
  const [tab, setTab] = useState<"business" | "team">("business");
  const [biz, setBiz] = useState<Biz>(DEFAULT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setBiz({ ...DEFAULT, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(KEY, JSON.stringify(biz));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardPage title="Settings" subtitle="Manage your spa's public info and team access">
      <div className="p-3">
        <div className="flex gap-2 border-b border-gray-100 mb-4">
          <TabBtn active={tab === "business"} onClick={() => setTab("business")}>Business info</TabBtn>
          <TabBtn active={tab === "team"} onClick={() => setTab("team")}>Team access</TabBtn>
        </div>

        {tab === "business" && (
          <form onSubmit={save} className="max-w-lg">
            <Field label="Business name"><input value={biz.name} onChange={e => setBiz({ ...biz, name: e.target.value })} className={inputCls} /></Field>
            <Field label="Phone"><input value={biz.phone} onChange={e => setBiz({ ...biz, phone: e.target.value })} className={inputCls} /></Field>
            <Field label="Email"><input value={biz.email} onChange={e => setBiz({ ...biz, email: e.target.value })} className={inputCls} /></Field>
            <Field label="Opening hours"><input value={biz.hours} onChange={e => setBiz({ ...biz, hours: e.target.value })} className={inputCls} /></Field>
            <Field label="Address"><textarea rows={3} value={biz.address} onChange={e => setBiz({ ...biz, address: e.target.value })} className={inputCls} /></Field>
            <div className="flex items-center gap-3 mt-2">
              <PrimaryButton type="submit">Save changes</PrimaryButton>
              {saved && <span className="text-xs text-green-600">Saved locally ✓</span>}
            </div>
            <p className="text-[11px] text-gray-400 mt-3">
              Changes save to this browser for now. Wire to the database when you're ready to make them live on the public site.
            </p>
          </form>
        )}

        {tab === "team" && (
          <div className="max-w-lg space-y-3">
            <p className="text-xs text-gray-600">
              Accounts are created by administrators only. Manage your team from the Employees page.
            </p>
            <Link to="/dashboard/employees" className="inline-block">
              <PrimaryButton>Go to Employees</PrimaryButton>
            </Link>
            <div className="border-t border-gray-100 pt-3 mt-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-1">Roles</h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li><b>admin</b> — full dashboard access, can manage staff.</li>
                <li><b>staff</b> — day-to-day access to bookings and clients.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </DashboardPage>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-xs font-medium border-b-2 -mb-px ${active ? "border-[#E8246A] text-[#E8246A]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
    >
      {children}
    </button>
  );
}