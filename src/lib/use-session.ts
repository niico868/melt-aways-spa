import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type ProfileRow = { id: string; full_name: string | null; role: string };

async function logAuthEvent(action: "sign_in" | "sign_out", userId?: string, email?: string | null) {
  try {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : null;
    await supabase.from("audit_log").insert({
      user_id: userId ?? null,
      actor_email: email ?? null,
      action,
      entity: "auth",
      summary: action === "sign_in" ? "Signed in" : "Signed out",
      user_agent: ua,
    });
  } catch { /* best-effort */ }
}

export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (s?.user) loadProfile(s.user);
      else setProfile(null);
      if (event === "SIGNED_IN" && s?.user) {
        void logAuthEvent("sign_in", s.user.id, s.user.email);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadProfile(data.session.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadProfile(user: User) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", user.id)
      .maybeSingle();
    setProfile(data ?? null);
  }

  return { session, user: session?.user ?? null, profile, loading: session === undefined };
}

export async function signOutAndRedirect() {
  const { data } = await supabase.auth.getUser();
  if (data.user) await logAuthEvent("sign_out", data.user.id, data.user.email);
  await supabase.auth.signOut();
  if (typeof window !== "undefined") window.location.href = "/auth";
}