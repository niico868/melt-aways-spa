import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Megaphone, Trash2, Users } from "lucide-react";
import { DashboardPage, PrimaryButton } from "@/components/dashboard/DashboardPage";
import { Field, inputCls } from "@/components/dashboard/Modal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/marketing")({ component: MarketingPage });

type Draft = { id: string; subject: string; body: string; audience: string; created_at: string };
const KEY = "meltaways.marketing.drafts";

function loadDrafts(): Draft[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

type Segment = { key: string; label: string; description: string };
const SEGMENTS: Segment[] = [
  { key: "lead", label: "Leads", description: "Submitted a consultation, not booked yet" },
  { key: "consultation_booked", label: "Consultation booked", description: "Consult scheduled, awaiting visit" },
  { key: "consultation_completed", label: "Consult completed", description: "Ready for a treatment recommendation" },
  { key: "active_treatment", label: "Active in treatment", description: "Currently in a treatment cycle" },
  { key: "treatment_plan_completed", label: "Plan completed", description: "Finished a plan — great review candidates" },
  { key: "maintenance", label: "Maintenance", description: "90+ days idle — nudge for a top-up" },
  { key: "inactive", label: "Inactive", description: "12+ months idle — re-engagement" },
  { key: "all", label: "All customers", description: "Every customer with marketing opt-in" },
];

function useAudienceCounts() {
  return useQuery({
    queryKey: ["marketing-audiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("client_status, marketing_opt_in");
      if (error) throw error;
      const rows = (data ?? []) as { client_status: string; marketing_opt_in: boolean | null }[];
      const opted = rows.filter((r) => r.marketing_opt_in !== false);
      const counts: Record<string, number> = { all: opted.length };
      for (const r of opted) counts[r.client_status] = (counts[r.client_status] ?? 0) + 1;
      return counts;
    },
  });
}

function MarketingPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  const { data: counts } = useAudienceCounts();

  useEffect(() => { setDrafts(loadDrafts()); }, []);

  const save = () => {
    if (!subject.trim() || !body.trim()) return;
    const next: Draft = { id: crypto.randomUUID(), subject, body, audience, created_at: new Date().toISOString() };
    const all = [next, ...drafts];
    localStorage.setItem(KEY, JSON.stringify(all));
    setDrafts(all);
    setSubject(""); setBody("");
  };
  const remove = (id: string) => {
    const all = drafts.filter(d => d.id !== id);
    localStorage.setItem(KEY, JSON.stringify(all));
    setDrafts(all);
  };

  const audLabel = (k: string) => SEGMENTS.find((s) => s.key === k)?.label ?? k;

  return (
    <DashboardPage title="Marketing" subtitle="Compose campaigns and save drafts">
      <div className="p-3 space-y-4">
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-[#E8246A]" />
            <h3 className="text-sm font-semibold text-gray-800">Audience segments</h3>
            <span className="text-[10px] text-gray-400">Live from client status</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {SEGMENTS.map((s) => {
              const active = audience === s.key;
              const n = counts?.[s.key] ?? 0;
              return (
                <button
                  key={s.key}
                  onClick={() => setAudience(s.key)}
                  className={`text-left rounded-lg p-3 border transition ${active ? "bg-[#FBEAF0] border-[#E8246A]" : "bg-gray-50 border-gray-100 hover:border-gray-200"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-800">{s.label}</span>
                    <span className={`text-sm font-bold ${active ? "text-[#E8246A]" : "text-[#1A1A2E]"}`}>{n}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{s.description}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-3 text-[11px] text-gray-500">
            Preview recipients on the{" "}
            <Link to="/dashboard/customers" className="text-[#E8246A] hover:underline">Customers</Link>{" "}
            page — filter by status to see this segment.
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone size={16} className="text-[#E8246A]" />
            <h3 className="text-sm font-semibold text-gray-800">New broadcast</h3>
          </div>
          <Field label="Audience">
            <select value={audience} onChange={e => setAudience(e.target.value)} className={inputCls}>
              {SEGMENTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label} ({counts?.[s.key] ?? 0})</option>
              ))}
            </select>
          </Field>
          <Field label="Subject">
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Summer glow special" className={inputCls} />
          </Field>
          <Field label="Message">
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={6} placeholder="Write your message…" className={inputCls} />
          </Field>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-gray-400">Sending is coming soon. Drafts save locally.</span>
            <PrimaryButton onClick={save}>Save draft</PrimaryButton>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Saved drafts ({drafts.length})</h3>
          {drafts.length === 0 ? (
            <p className="text-xs text-gray-400">No drafts yet.</p>
          ) : (
            <ul className="space-y-2 max-h-[420px] overflow-auto">
              {drafts.map(d => (
                <li key={d.id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate">{d.subject}</div>
                      <div className="text-[10px] text-gray-500">{audLabel(d.audience)} · {new Date(d.created_at).toLocaleDateString()}</div>
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">{d.body}</p>
                    </div>
                    <button onClick={() => remove(d.id)} className="text-gray-400 hover:text-red-500 flex-shrink-0"><Trash2 size={13} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </div>
    </DashboardPage>
  );
}