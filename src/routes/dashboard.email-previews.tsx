import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Send, RefreshCw } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { inputCls } from "@/components/dashboard/Modal";
import { listEmailTemplates, renderEmailTemplate, sendTestEmail } from "@/lib/email-preview.functions";
import { useIsAdmin } from "@/lib/use-my-roles";

export const Route = createFileRoute("/dashboard/email-previews")({
  component: EmailPreviewsPage,
  head: () => ({
    meta: [
      { title: "Email Template Preview | Melt Away Spa Digital Hub" },
      { name: "description", content: "Preview and test-send Meltaways Spa client emails before publishing." },
      { property: "og:title", content: "Email Template Preview" },
      { property: "og:description", content: "Preview and test-send Meltaways Spa client emails before publishing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function EmailPreviewsPage() {
  const isAdmin = useIsAdmin();
  const listFn = useServerFn(listEmailTemplates);
  const renderFn = useServerFn(renderEmailTemplate);
  const sendFn = useServerFn(sendTestEmail);

  const templatesQ = useQuery({ queryKey: ["email-templates"], queryFn: () => listFn({}) });
  const templates = templatesQ.data ?? [];

  const [selected, setSelected] = useState<string>("");
  const [vars, setVars] = useState<string>("{}");
  const [preview, setPreview] = useState<{ subject: string; html: string } | null>(null);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testTo, setTestTo] = useState("");
  const [sendState, setSendState] = useState<string | null>(null);

  const current = useMemo(() => templates.find((t: any) => t.name === selected), [templates, selected]);

  useEffect(() => {
    if (!selected && templates.length) setSelected(templates[0].name);
  }, [templates, selected]);

  useEffect(() => {
    if (!current) return;
    setVars(JSON.stringify(current.previewData ?? {}, null, 2));
    setSendState(null);
  }, [current?.name]);

  function parseVars(): Record<string, any> | null {
    try {
      const parsed = JSON.parse(vars || "{}");
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("bad");
      return parsed;
    } catch {
      setError("Variables must be a valid JSON object, e.g. { \"firstName\": \"Jane\" }");
      return null;
    }
  }

  async function doRender() {
    if (!selected) return;
    setError(null);
    const data = parseVars();
    if (!data) return;
    setRendering(true);
    try {
      const res = await renderFn({ data: { name: selected, data } });
      setPreview(res as any);
    } catch (e: any) {
      setError(e?.message || "Failed to render template");
    } finally {
      setRendering(false);
    }
  }

  useEffect(() => {
    if (selected) doRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  async function doSend() {
    setSendState(null);
    setError(null);
    const data = parseVars();
    if (!data) return;
    if (!testTo.includes("@")) { setSendState("Enter a valid email address."); return; }
    setSendState("Sending…");
    try {
      const res: any = await sendFn({ data: { name: selected, recipientEmail: testTo, data } });
      setSendState(res?.success ? `Queued to ${testTo} — check the inbox shortly.` : `Not sent: ${res?.reason || "unknown error"}`);
    } catch (e: any) {
      setSendState(e?.message || "Send failed");
    }
  }

  if (!isAdmin) {
    return (
      <DashboardPage title="Email Previews" subtitle="Admin only">
        <div className="p-6 text-sm text-gray-500">You need admin access to preview and test-send emails.</div>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage
      title="Email Previews"
      subtitle="Preview any client email with real variable values and send yourself a test before publishing"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0 h-full">
        <div className="border-b lg:border-b-0 lg:border-r border-gray-200 p-4 space-y-4 overflow-auto">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Template</label>
            <select className={inputCls} value={selected} onChange={(e) => setSelected(e.target.value)}>
              {templates.map((t: any) => (
                <option key={t.name} value={t.name}>{t.displayName}</option>
              ))}
            </select>
            {templatesQ.isLoading && <p className="text-[11px] text-gray-400 mt-1">Loading templates…</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Variables (JSON) — e.g. Client Name
            </label>
            <textarea
              className={`${inputCls} font-mono text-[11px] h-44`}
              value={vars}
              onChange={(e) => setVars(e.target.value)}
              spellCheck={false}
            />
            <button
              type="button"
              onClick={doRender}
              className="mt-2 inline-flex items-center gap-1.5 bg-[#E8246A] text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-[#C91D5C] transition-colors"
            >
              <RefreshCw size={13} /> {rendering ? "Rendering…" : "Update preview"}
            </button>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Send a test to</label>
            <input
              className={inputCls}
              type="email"
              placeholder="you@example.com"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
            />
            <button
              type="button"
              onClick={doSend}
              className="mt-2 inline-flex items-center gap-1.5 border border-[#E8246A] text-[#E8246A] rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-[#E8246A]/5 transition-colors"
            >
              <Send size={13} /> Send test email
            </button>
            {sendState && <p className="text-[11px] text-gray-600 mt-2">{sendState}</p>}
          </div>

          {error && <p className="text-[11px] text-red-600">{error}</p>}
        </div>

        <div className="p-4 flex flex-col min-h-[520px]">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <Mail size={14} className="text-[#E8246A]" />
            <span className="font-semibold">Subject:</span>
            <span className="truncate">{preview?.subject || "—"}</span>
          </div>
          <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            {preview ? (
              <iframe
                title="Email preview"
                srcDoc={preview.html}
                className="w-full h-full min-h-[480px] bg-white"
                sandbox=""
              />
            ) : (
              <div className="p-6 text-sm text-gray-500">Select a template to preview.</div>
            )}
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}