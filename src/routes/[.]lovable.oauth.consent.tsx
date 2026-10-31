import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// The @supabase/supabase-js `auth.oauth` namespace is beta and may not appear
// on the exported types. Cast a thin local wrapper for the three methods used.
type AuthOAuth = {
  getAuthorizationDetails: (id: string) => Promise<{
    data: {
      client?: { name?: string; client_uri?: string; redirect_uris?: string[] } | null;
      redirect_url?: string;
      redirect_to?: string;
      scope?: string;
    } | null;
    error: { message: string } | null;
  }>;
  approveAuthorization: (id: string) => Promise<{
    data: { redirect_url?: string; redirect_to?: string } | null;
    error: { message: string } | null;
  }>;
  denyAuthorization: (id: string) => Promise<{
    data: { redirect_url?: string; redirect_to?: string } | null;
    error: { message: string } | null;
  }>;
};

function oauth(): AuthOAuth {
  return (supabase.auth as unknown as { oauth: AuthOAuth }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  // Browser-only: the Supabase client reads its session from localStorage.
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id:
      typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/login", search: { next } as any });
    }
  },
  loader: async ({ location }) => {
    const params = new URLSearchParams(location.search);
    const authorizationId = params.get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-light mb-3">Could not load this request</h1>
      <p className="text-taupe">{String((error as Error)?.message ?? error)}</p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "an app";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const res = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (res.error) {
      setBusy(false);
      setError(res.error.message);
      return;
    }
    const target = res.data?.redirect_url ?? res.data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-light text-ink mb-3">
        Connect {clientName} to your account
      </h1>
      <p className="text-taupe mb-2">
        This lets {clientName} use the Melt Away Spa Digital Hub as you.
        Your existing permissions and data policies still apply.
      </p>
      {details?.scope && (
        <p className="text-sm text-taupe mb-6">
          Requested access: <span className="font-mono">{details.scope}</span>
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 mb-4">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <button
          disabled={busy}
          onClick={() => decide(true)}
          className="flex-1 rounded-full bg-primary text-primary-foreground py-3 font-medium soft-shadow disabled:opacity-60"
        >
          {busy ? "Please wait…" : "Approve"}
        </button>
        <button
          disabled={busy}
          onClick={() => decide(false)}
          className="flex-1 rounded-full border border-input bg-background py-3 font-medium text-ink hover:border-primary transition disabled:opacity-60"
        >
          Deny
        </button>
      </div>
    </main>
  );
}