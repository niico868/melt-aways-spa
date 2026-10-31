
-- 1. Tighten SELECT policies to staff roles
DROP POLICY IF EXISTS "staff read client events" ON public.client_events;
CREATE POLICY "staff read client events" ON public.client_events
  FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'manager'::app_role)
    OR has_role(auth.uid(), 'staff'::app_role)
    OR has_role(auth.uid(), 'receptionist'::app_role)
  );

DROP POLICY IF EXISTS "staff read treatment plans" ON public.treatment_plans;
CREATE POLICY "staff read treatment plans" ON public.treatment_plans
  FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'manager'::app_role)
    OR has_role(auth.uid(), 'staff'::app_role)
    OR has_role(auth.uid(), 'receptionist'::app_role)
  );

-- 2. Fix mutable search_path on remaining SECURITY DEFINER functions
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public;
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public;

-- 3. Revoke EXECUTE on internal SECURITY DEFINER functions from PUBLIC/anon/authenticated.
-- These are only invoked by trusted server code (service_role) or as triggers.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
      AND p.proname IN (
        'customer_has_active_treatment',
        'delete_email',
        'email_queue_dispatch',
        'email_queue_wake',
        'enqueue_email',
        'handle_new_user',
        'handle_new_user_role',
        'move_to_dlq',
        'public_submit_consultation',
        'read_email_batch',
        'recompute_invoice',
        'set_client_status',
        'sweep_client_activity',
        'tg_appointment_completed',
        'tg_appointment_create_invoice',
        'tg_appt_client_status',
        'tg_audit_row_change',
        'tg_consult_client_status',
        'tg_invoice_items_recompute',
        'tg_payments_recompute',
        'tg_services_recompute',
        'upsert_customer_by_contact'
      )
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION public.%I(%s) FROM PUBLIC, anon, authenticated;', r.proname, r.args);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%I(%s) TO service_role;', r.proname, r.args);
  END LOOP;
END $$;
