import { createFileRoute } from "@tanstack/react-router";

/**
 * Sends the one-month "Checking In" follow-up to clients whose treatment plan
 * was marked complete ~30 days ago. Called daily by pg_cron.
 */
export const Route = createFileRoute("/api/public/hooks/treatment-followup")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendAppEmail } = await import("@/lib/email/send.server");

        const now = Date.now();
        const from = new Date(now - 45 * 864e5).toISOString();
        const to = new Date(now - 30 * 864e5).toISOString();

        const { data, error } = await supabaseAdmin
          .from("customers")
          .select("id, full_name, email, client_status, client_status_changed_at")
          .eq("client_status", "treatment_plan_completed")
          .gte("client_status_changed_at", from)
          .lte("client_status_changed_at", to)
          .not("email", "is", null);

        if (error) {
          console.error("treatment-followup query failed", error);
          return Response.json({ error: "Query failed" }, { status: 500 });
        }

        let sent = 0;
        for (const c of data ?? []) {
          if (!c.email) continue;
          const res = await sendAppEmail({
            templateName: "treatment-followup",
            recipientEmail: c.email,
            idempotencyKey: `followup-${c.id}`,
            templateData: { firstName: String(c.full_name || "").trim().split(/\s+/)[0] },
            onlyOnce: true,
          });
          if (res.success) sent++;
        }

        return Response.json({ ok: true, candidates: data?.length ?? 0, sent });
      },
    },
  },
});
