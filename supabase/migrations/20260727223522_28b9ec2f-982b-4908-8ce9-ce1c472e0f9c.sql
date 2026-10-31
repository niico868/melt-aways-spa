-- Re-revoke on both signatures to catch any default PUBLIC grant
REVOKE ALL ON FUNCTION public.set_client_status(uuid, public.client_status, text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.customer_has_active_treatment(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sweep_client_activity() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tg_appt_client_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tg_consult_client_status() FROM PUBLIC, anon, authenticated;

-- Tighten permissive INSERT policies: require staff/admin role
DROP POLICY IF EXISTS "staff insert client events" ON public.client_events;
CREATE POLICY "staff insert client events" ON public.client_events
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'staff'::app_role)
    OR public.has_role(auth.uid(), 'manager'::app_role)
    OR public.has_role(auth.uid(), 'receptionist'::app_role)
  );

DROP POLICY IF EXISTS "staff manage treatment plans" ON public.treatment_plans;
CREATE POLICY "staff read treatment plans" ON public.treatment_plans
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff write treatment plans" ON public.treatment_plans
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'staff'::app_role)
    OR public.has_role(auth.uid(), 'manager'::app_role)
  );
CREATE POLICY "staff update treatment plans" ON public.treatment_plans
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'staff'::app_role)
    OR public.has_role(auth.uid(), 'manager'::app_role)
  ) WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'staff'::app_role)
    OR public.has_role(auth.uid(), 'manager'::app_role)
  );
CREATE POLICY "staff delete treatment plans" ON public.treatment_plans
  FOR DELETE TO authenticated USING (
    public.has_role(auth.uid(), 'admin'::app_role)
  );