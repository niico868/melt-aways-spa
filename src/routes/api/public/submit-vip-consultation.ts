import { createFileRoute } from "@tanstack/react-router";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const s = (v: unknown, max = 2000) => (typeof v === "string" ? v.slice(0, max).trim() : "");
const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 40).map((x) => String(x).slice(0, 200)) : []);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export const Route = createFileRoute("/api/public/submit-vip-consultation")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: any;
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        // Honeypot — silently accept, store nothing.
        if (s(body.mk_hp)) return json({ ok: true, id: null });

        const full_name = s(body.full_name, 200);
        const phone = s(body.phone, 40);
        const email = s(body.email, 200);
        if (full_name.length < 2) return json({ error: "Name is required" }, 400);
        if (phone.replace(/\D/g, "").length < 7) return json({ error: "A valid phone number is required" }, 400);
        if (!EMAIL_RE.test(email)) return json({ error: "A valid email address is required" }, 400);

        const form_data = {
          contact: {
            preferred_contact: s(body.preferred_contact, 30),
            location: s(body.location, 120),
            preferred_date: s(body.preferred_date, 30),
            preferred_time: s(body.preferred_time, 30),
          },
          goals: {
            goals: arr(body.goals),
            goals_other: s(body.goals_other),
            primary_goal: s(body.primary_goal, 200),
            target_areas: arr(body.target_areas),
            target_areas_other: s(body.target_areas_other),
            worthwhile: s(body.worthwhile),
            prior_treatments: s(body.prior_treatments, 10),
            prior_treatments_detail: s(body.prior_treatments_detail),
            event_related: s(body.event_related),
            event_date: s(body.event_date, 30),
            current_weight: s(body.current_weight, 60),
            goal_weight: s(body.goal_weight, 60),
          },
          readiness: {
            start_period: s(body.start_period, 120),
            weekly_ok: s(body.weekly_ok, 10),
            biweekly_ok: s(body.biweekly_ok, 10),
            best_days: s(body.best_days),
            open_three_months: s(body.open_three_months, 10),
            open_six_months: s(body.open_six_months, 10),
            monthly_payment_ok: s(body.monthly_payment_ok, 10),
            wants_payment_info: s(body.wants_payment_info, 10),
            support_level: s(body.support_level),
            attendance_barriers: s(body.attendance_barriers),
          },
          health: (() => {
            const out: Record<string, { answer: string; details: string }> = {};
            const h = body.health && typeof body.health === "object" ? body.health : {};
            for (const [k, v] of Object.entries(h as Record<string, any>).slice(0, 30)) {
              out[String(k).slice(0, 60)] = { answer: s(v?.answer, 10), details: s(v?.details) };
            }
            return out;
          })(),
          health_other: s(body.health_other),
          consent: {
            confirm_accurate: body.confirm_accurate === true,
            confirm_not_guaranteed: body.confirm_not_guaranteed === true,
            confirm_consultation_required: body.confirm_consultation_required === true,
            consent_contact: body.consent_contact === true,
            confirm_privacy: body.confirm_privacy === true,
          },
          submitted_at: new Date().toISOString(),
        };

        const consent = form_data.consent;
        if (!consent.confirm_accurate || !consent.confirm_not_guaranteed || !consent.confirm_consultation_required || !consent.consent_contact || !consent.confirm_privacy) {
          return json({ error: "All confirmations are required" }, 400);
        }

        const isTest = /@example\.(com|org|net)$/i.test(email) || /vip integration test/i.test(full_name);

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Duplicate-submission protection: same email + VIP category within 10 minutes.
        const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const { data: recent } = await supabaseAdmin
          .from("consultations")
          .select("id, form_data, submitted_at")
          .eq("category", "vip_treatment")
          .gte("submitted_at", since)
          .limit(50);
        const dup = (recent ?? []).find((r: any) => (r.form_data?.contact_email ?? "").toLowerCase() === email.toLowerCase());
        if (dup) return json({ ok: true, id: dup.id, duplicate: true });

        const notes = [
          `VIP Transformation Program request`,
          form_data.goals.primary_goal ? `Primary goal: ${form_data.goals.primary_goal}` : "",
          form_data.goals.target_areas.length ? `Target areas: ${form_data.goals.target_areas.join(", ")}` : "",
          form_data.readiness.start_period ? `Preferred start: ${form_data.readiness.start_period}` : "",
        ].filter(Boolean).join("\n");

        const { data: customerId, error: custErr } = await (supabaseAdmin.rpc as any)("upsert_customer_by_contact", {
          p_full_name: full_name,
          p_phone: phone,
          p_email: email,
          p_notes: notes,
        });
        if (custErr) {
          console.error("vip customer upsert failed", custErr);
          return json({ error: "Submission failed" }, 500);
        }

        const { data: inserted, error } = await (supabaseAdmin.from("consultations") as any)
          .insert({
            customer_id: customerId,
            client_name: full_name,
            service_name: "VIP Transformation Program",
            status: "Not Started",
            source: "vip_consultation",
            category: "vip_treatment",
            consultation_type: "VIP Transformation Program",
            programme_interest: "vip",
            form_data: { ...form_data, contact_email: email, contact_phone: phone, is_test: isTest },
          })
          .select("id")
          .single();

        if (error) {
          console.error("vip consultation insert failed", error);
          return json({ error: "Submission failed" }, 500);
        }

        // Never send notifications for clearly-marked test submissions.
        if (!isTest) {
          try {
            const { sendAppEmail } = await import("@/lib/email/send.server");
            await sendAppEmail({
              templateName: "consultation-booked",
              recipientEmail: email,
              idempotencyKey: `vip-${inserted.id}`,
              templateData: { firstName: full_name.split(/\s+/)[0] },
            });
          } catch (e) {
            console.error("vip consultation email failed", e);
          }
          try {
            const { sendAppEmail } = await import("@/lib/email/send.server");
            await sendAppEmail({
              templateName: "internal-new-booking",
              recipientEmail: "meltawaystt@gmail.com",
              idempotencyKey: `internal-vip-${inserted.id}`,
              templateData: {
                clientName: full_name,
                clientPhone: phone,
                clientEmail: email,
                bookingType: "VIP Transformation Program request",
                service: "VIP Transformation Program",
                preferredDate: form_data.contact.preferred_date,
                preferredTime: form_data.contact.preferred_time,
                location: form_data.contact.location,
                notes,
                submittedAt: form_data.submitted_at,
              },
            });
          } catch (e) {
            console.error("vip internal alert failed", e);
          }
          try {
            const { sendWhatsAppBookingAlert } = await import("@/lib/notify/whatsapp.server");
            await sendWhatsAppBookingAlert({
              bookingType: "VIP Transformation Program request",
              clientName: full_name,
              clientPhone: phone,
              clientEmail: email,
              service: "VIP Transformation Program",
              preferredDate: form_data.contact.preferred_date,
              preferredTime: form_data.contact.preferred_time,
              location: form_data.contact.location,
              notes,
            });
          } catch (e) {
            console.error("vip whatsapp alert failed", e);
          }
        }


        return json({ ok: true, id: inserted.id });
      },
    },
  },
});
