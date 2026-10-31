
-- Revoke public/anon/authenticated EXECUTE on SECURITY DEFINER functions that should not be callable via the API.
-- Trigger functions never need EXECUTE for anyone (fired by the trigger owner).
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_appointment_completed() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_appointment_create_invoice() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_audit_row_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_invoice_items_recompute() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_payments_recompute() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_services_recompute() FROM PUBLIC, anon, authenticated;

-- Internal helpers — called from other SECURITY DEFINER functions, not directly by the API.
REVOKE EXECUTE ON FUNCTION public.recompute_invoice(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.upsert_customer_by_contact(text, text, text, text) FROM PUBLIC, anon, authenticated;

-- has_role: keep EXECUTE for authenticated (used by RLS policies), revoke from anon/PUBLIC.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

-- public_submit_consultation: intentionally exposed to the public consultation form.
-- Keep EXECUTE for anon and authenticated; revoke default PUBLIC to be explicit.
REVOKE EXECUTE ON FUNCTION public.public_submit_consultation(text, text, text, text, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_submit_consultation(text, text, text, text, text, text, text, text, text, text) TO anon, authenticated;
