import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): { next?: string } =>
    typeof s.next === "string" ? { next: s.next } : {},
  head: () => ({ meta: [
    { title: "Sign In — Melt Elite Aesthetics" },
    { name: "robots", content: "noindex" },
  ]}),
  component: Login,
});

type Tab = "client" | "staff";
const STAFF_ROLES = ["admin", "manager", "staff", "receptionist"] as const;

async function routeAfterLogin(userId: string): Promise<string> {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const isStaff = (data ?? []).some((r: any) => (STAFF_ROLES as readonly string[]).includes(r.role));
  return isStaff ? "/dashboard" : "/account";
}

function Login() {
  const nav = useNavigate();
  const { next } = useSearch({ from: "/login" });
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  const [tab, setTab] = useState<Tab>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        if (safeNext) { window.location.href = safeNext; return; }
        nav({ to: (await routeAfterLogin(data.user.id)) as any });
      }
    });
  }, [nav, safeNext]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setInfo("Signing you in…"); setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      if (!data.user) throw new Error("Sign in failed.");
      setInfo("Success. Redirecting…");
      if (safeNext) { window.location.href = safeNext; return; }
      const to = await routeAfterLogin(data.user.id);
      setTimeout(() => nav({ to: to as any }), 400);
    } catch (err: any) {
      setInfo(null);
      setError(err?.message || "Sign in failed.");
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    setError(null); setInfo("Redirecting to Google…"); setGoogleBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: safeNext
          ? `${window.location.origin}${safeNext}`
          : window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("Google sign in failed.");
      setInfo("Success. Redirecting…");
      if (safeNext) { window.location.href = safeNext; return; }
      const to = await routeAfterLogin(data.user.id);
      setTimeout(() => nav({ to: to as any }), 400);
    } catch (err: any) {
      setInfo(null);
      setError(err?.message || "Google sign in failed.");
      setGoogleBusy(false);
    }
  }

  return (
    <Section className="max-w-md">
      <div className="text-center mb-8">
        <Eyebrow>Welcome Back</Eyebrow>
        <h1 className="text-4xl font-light text-ink">Sign in to your account</h1>
      </div>
      <div className="bg-background border border-border/60 rounded-3xl p-7 card-shadow">
        <div className="flex gap-2 mb-6 bg-cream rounded-full p-1">
          {(["client", "staff"] as Tab[]).map(r => (
            <button key={r} type="button" onClick={() => setTab(r)}
              className={`flex-1 rounded-full py-2 text-sm font-medium capitalize transition ${tab === r ? "bg-primary text-primary-foreground" : "text-taupe"}`}>
              {r}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          <div>
            <label className="text-sm font-medium text-ink">Password</label>
            <div className="relative mt-1.5">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password"
                className="w-full rounded-2xl border border-input bg-cream/50 px-4 py-3 pr-11 outline-none focus:border-primary transition" />
              <button type="button" onClick={() => setShowPw(v => !v)} aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-taupe hover:text-primary">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {info && <p className="text-sm rounded-lg bg-blush/60 border border-primary/20 text-primary px-3 py-2">{info}</p>}
          {error && <p className="text-sm rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2">{error}</p>}
          <button disabled={busy} className="w-full rounded-full bg-primary text-primary-foreground py-3.5 font-medium soft-shadow disabled:opacity-60">
            {busy ? "Please wait…" : "Sign In"}
          </button>
        </form>
        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wider text-taupe">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={googleBusy || busy}
          className="mt-4 w-full rounded-full border border-input bg-background py-3 font-medium text-ink hover:border-primary transition inline-flex items-center justify-center gap-3 disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C41.1 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/>
          </svg>
          {googleBusy ? "Please wait…" : "Continue with Google"}
        </button>
        <p className="mt-5 text-xs text-center text-taupe">
          {tab === "client"
            ? "Client accounts are created by our team. Check your email for an invite to set your password."
            : "Staff accounts are created by an administrator."}
        </p>
      </div>
    </Section>
  );
}

function Input({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium text-ink">{label}</label>
      <input {...p} className="mt-1.5 w-full rounded-2xl border border-input bg-cream/50 px-4 py-3 outline-none focus:border-primary transition" />
    </div>
  );
}