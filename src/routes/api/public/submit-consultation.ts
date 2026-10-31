import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/submit-consultation")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: any;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "content-type": "application/json" } });
        }
        const s = (v: unknown) => (typeof v === "string" ? v.slice(0, 2000) : undefined);
        const full_name = s(body.full_name);
        if (!full_name || full_name.trim().length < 2) {
          return new Response(JSON.stringify({ error: "Name is required" }), { status: 400, headers: { "content-type": "application/json" } });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await (supabaseAdmin.rpc as any)("public_submit_consultation", {
          p_full_name: full_name,
          p_phone: s(body.phone),
          p_email: s(body.email),
          p_concern: s(body.concern),
          p_areas: s(body.areas),
          p_notes: s(body.notes),
          p_preferred_date: s(body.preferred_date),
          p_preferred_time: s(body.preferred_time),
          p_location: s(body.location),
          p_suggested_package: s(body.suggested_package),
        });
        if (error) {
          console.error("submit-consultation failed", error);
          return new Response(JSON.stringify({ error: "Submission failed" }), { status: 500, headers: { "content-type": "application/json" } });
        }
        // Send the consultation confirmation email (never block the submission on it)
        const email = s(body.email);
        if (email && email.includes("@")) {
          try {
            const { sendAppEmail } = await import("@/lib/email/send.server");
            await sendAppEmail({
              templateName: "consultation-booked",
              recipientEmail: email,
              idempotencyKey: `consultation-${data ?? email}-${new Date().toISOString().slice(0, 10)}`,
              templateData: { firstName: full_name.trim().split(/\s+/)[0] },
            });
          } catch (e) {
            console.error("consultation email failed", e);
          }
        }
        // Internal alert to the business inbox
        try {
          const { sendAppEmail } = await import("@/lib/email/send.server");
          await sendAppEmail({
            templateName: "internal-new-booking",
            recipientEmail: "meltawaystt@gmail.com",
            idempotencyKey: `internal-booking-${data ?? Date.now()}`,
            templateData: {
              clientName: full_name.trim(),
              clientPhone: s(body.phone),
              clientEmail: email,
              bookingType: "Consultation request",
              service: s(body.suggested_package) || s(body.concern),
              preferredDate: s(body.preferred_date),
              preferredTime: s(body.preferred_time),
              location: s(body.location),
              notes: s(body.notes),
              submittedAt: new Date().toISOString(),
            },
          });
        } catch (e) {
          console.error("internal booking alert failed", e);
        }

        // WhatsApp alert to the business number
        try {
          const { sendWhatsAppBookingAlert } = await import("@/lib/notify/whatsapp.server");
          await sendWhatsAppBookingAlert({
            bookingType: "Consultation request",
            clientName: full_name.trim(),
            clientPhone: s(body.phone),
            clientEmail: email,
            service: s(body.suggested_package) || s(body.concern),
            preferredDate: s(body.preferred_date),
            preferredTime: s(body.preferred_time),
            location: s(body.location),
            notes: s(body.notes),
          });
        } catch (e) {
          console.error("whatsapp booking alert failed", e);
        }


        return new Response(JSON.stringify({ ok: true, id: data }), { headers: { "content-type": "application/json" } });
      },
    },
  },
});