import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/set-password")({
  ssr: false,
  head: () => ({ meta: [{ title: "Set your password — Melt Elite Aesthetics" }, { name: "robots", content: "noindex" }] }),
  component: SetPasswordPage,
});

function SetPasswordPage() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (window.location.hash.includes("access_token")) {
          const params = new URLSearchParams(window.location.hash.slice(1));
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) throw error;
          }
        }
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          setLinkError("This invite link is invalid or has expired. Ask an administrator to send a new invite.");
        } else {
          const meta = (data.user.user_metadata ?? {}) as { full_name?: string };
          if (meta.full_name) setFullName(meta.full_name);
          window.history.replaceState({}, "", "/set-password");
        }
      } catch (err: any) {
        setLinkError(err?.message || "We couldn't verify your invite link.");
      } finally {
        setReady(true);
      }
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSuccess(null);
    if (!fullName.trim()) { setError("Please enter your full name."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setBusy(true);
    setInfo("Saving your password…");
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Your session expired. Please open your invite link again.");
      const { error } = await supabase.auth.updateUser({ password, data: { full_name: fullName } });
      if (error) throw error;
      const { error: profErr } = await supabase.from("profiles").upsert({ id: userData.user.id, full_name: fullName });
      if (profErr) console.warn("profile upsert:", profErr.message);
      // Route by role: staff → dashboard, client → account with welcome flag
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id);
      const staffRoles = ["admin", "manager", "staff", "receptionist"];
      const isStaff = (roles ?? []).some((r: any) => staffRoles.includes(r.role));
      setInfo(null);
      setSuccess(isStaff
        ? "Password set successfully. Redirecting to your dashboard…"
        : "Password set successfully. Welcome — taking you to your profile…");
      setTimeout(() => {
        if (isStaff) nav({ to: "/dashboard" });
        else window.location.assign("/account?welcome=1");
      }, 1400);
    } catch (err: any) {
      setInfo(null);
      setError(err?.message || "Could not set your password. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FBEAF0] to-[#FDF2F7] px-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-6">
          <div className="text-[#E8246A] text-2xl font-extrabold tracking-tight">Melt Elite Aesthetics</div>
          <p className="text-sm text-gray-500 mt-1">Set up your admin account</p>
        </div>

        {!ready ? (
          <p className="text-sm text-gray-500 text-center py-6">Verifying your invite…</p>
        ) : linkError ? (
          <div className="space-y-3">
            <p className="text-sm rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2">{linkError}</p>
            <a href="/auth" className="block text-center text-sm text-[#E8246A] hover:underline">Go to sign in</a>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4" noValidate>
            <Field label="Full name" value={fullName} onChange={setFullName} required />
            <Field label="New password" type={showPw ? "text" : "password"} value={password} onChange={setPassword} required
              trailing={<PwToggle shown={showPw} onClick={() => setShowPw(v => !v)} />} />
            <Field label="Confirm password" type={showConfirm ? "text" : "password"} value={confirm} onChange={setConfirm} required
              trailing={<PwToggle shown={showConfirm} onClick={() => setShowConfirm(v => !v)} />} />
            <p className="text-xs text-gray-500">Minimum 8 characters. Tap the eye icon to check what you typed.</p>
            {info && <p className="text-sm rounded-md bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2">{info}</p>}
            {error && <p className="text-sm rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2">{error}</p>}
            {success && <p className="text-sm rounded-md bg-green-50 border border-green-200 text-green-700 px-3 py-2">{success}</p>}
            <button type="submit" disabled={busy || !!success} className="w-full rounded-lg bg-[#E8246A] text-white py-3 font-medium hover:bg-[#C91D5C] disabled:opacity-60 transition">
              {busy ? "Saving…" : success ? "Redirecting…" : "Set password & continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, trailing }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; trailing?: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">{label}</label>
      <div className="relative mt-1">
        <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
          className={`w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[#E8246A] focus:bg-white transition ${trailing ? "pr-10" : ""}`} />
        {trailing && <div className="absolute inset-y-0 right-0 flex items-center pr-2">{trailing}</div>}
      </div>
    </div>
  );
}

function PwToggle({ shown, onClick }: { shown: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={shown ? "Hide password" : "Show password"}
      className="p-1.5 rounded text-gray-500 hover:text-[#E8246A] hover:bg-gray-100 transition">
      {shown ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );
}