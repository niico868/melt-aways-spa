import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Section, Eyebrow } from "@/components/Section";
import { LogOut, Save, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  ssr: false,
  head: () => ({ meta: [
    { title: "My Account — Melt Elite Aesthetics" },
    { name: "robots", content: "noindex" },
  ]}),
  component: Account,
});

type AccountUser = { id: string; email: string; fullName: string };

function Account() {
  const nav = useNavigate();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { nav({ to: "/login" }); return; }
      const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", data.user.id).maybeSingle();
      const name = prof?.full_name || (data.user.user_metadata as any)?.full_name || "";
      setUser({ id: data.user.id, email: data.user.email ?? "", fullName: name });
      setFullName(name);
      setLoading(false);
      // One-time welcome from ?welcome=1
      const params = new URLSearchParams(window.location.search);
      if (params.get("welcome") === "1") {
        setShowWelcome(true);
        window.history.replaceState({}, "", "/account");
        // One-time registration confirmation email
        try {
          const { sendWelcomeEmail } = await import("@/lib/email/app-emails.functions");
          void sendWelcomeEmail({
            data: { firstName: (name || data.user.email || "").split(/[ @]/)[0] },
          }).catch(() => {});
        } catch { /* non-blocking */ }
      }
    })();
  }, [nav]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setSavedMsg(null); setErrMsg(null);
    try {
      const { error } = await supabase.from("profiles").upsert({ id: user.id, full_name: fullName });
      if (error) throw error;
      setUser({ ...user, fullName });
      setSavedMsg("Profile updated.");
      setTimeout(() => setSavedMsg(null), 2200);
    } catch (err: any) {
      setErrMsg(err?.message || "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    nav({ to: "/" });
  }

  if (loading || !user) return <Section className="max-w-3xl"><p className="text-taupe text-sm">Loading your account…</p></Section>;

  const firstName = (user.fullName || user.email).split(/[ @]/)[0];

  return (
    <Section className="max-w-3xl">
      {showWelcome && (
        <div className="mb-6 rounded-2xl border border-primary/30 bg-blush/50 p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-ink font-medium">Welcome to Melt Elite Aesthetics, {firstName}!</p>
            <p className="text-sm text-taupe mt-1">Your account is set up. This is your personal portal — update your details anytime and we'll see you soon.</p>
          </div>
          <button onClick={() => setShowWelcome(false)} aria-label="Dismiss" className="p-1 text-taupe hover:text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <Eyebrow>My Account</Eyebrow>
          <h1 className="text-3xl lg:text-4xl font-light text-ink">Welcome back, {firstName}.</h1>
          <p className="text-sm text-taupe mt-1">{user.email}</p>
        </div>
        <button onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm hover:bg-blush transition">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <form onSubmit={save} className="bg-background border border-border/60 rounded-3xl p-7 lg:p-10 card-shadow space-y-5">
        <div>
          <label className="text-sm font-medium text-ink">Full name</label>
          <input value={fullName} onChange={e => setFullName(e.target.value)} required
            className="mt-1.5 w-full rounded-2xl border border-input bg-cream/50 px-4 py-3 outline-none focus:border-primary transition" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Email</label>
          <input value={user.email} disabled
            className="mt-1.5 w-full rounded-2xl border border-input bg-cream/30 px-4 py-3 text-taupe" />
        </div>
        {savedMsg && <p className="text-sm rounded-lg bg-green-50 border border-green-200 text-green-700 px-3 py-2">{savedMsg}</p>}
        {errMsg && <p className="text-sm rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2">{errMsg}</p>}
        <div className="flex items-center gap-3">
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium soft-shadow disabled:opacity-60">
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </Section>
  );
}