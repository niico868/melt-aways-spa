
-- 1. Public submission RPC (upsert customer + insert consultation) — SECURITY DEFINER, callable by anon
CREATE OR REPLACE FUNCTION public.public_submit_consultation(
  p_full_name text,
  p_phone text,
  p_email text,
  p_concern text DEFAULT NULL,
  p_areas text DEFAULT NULL,
  p_notes text DEFAULT NULL,
  p_preferred_date text DEFAULT NULL,
  p_preferred_time text DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_suggested_package text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE cust_id uuid; combined_notes text;
BEGIN
  IF p_full_name IS NULL OR length(trim(p_full_name)) < 2 THEN
    RAISE EXCEPTION 'Name is required';
  END IF;
  combined_notes := trim(concat_ws(E'\n',
    NULLIF(p_notes,''),
    CASE WHEN p_areas IS NOT NULL AND p_areas<>'' THEN 'Target areas: '||p_areas END,
    CASE WHEN p_preferred_date IS NOT NULL AND p_preferred_date<>'' THEN 'Preferred: '||p_preferred_date||' '||COALESCE(p_preferred_time,'') END,
    CASE WHEN p_location IS NOT NULL AND p_location<>'' THEN 'Location: '||p_location END
  ));
  cust_id := public.upsert_customer_by_contact(p_full_name, p_phone, p_email, combined_notes);
  INSERT INTO public.consultations (customer_id, client_name, service_name, status)
    VALUES (cust_id, p_full_name, COALESCE(NULLIF(p_suggested_package,''), NULLIF(p_concern,'')), 'New Lead');
  RETURN cust_id;
END; $$;

GRANT EXECUTE ON FUNCTION public.public_submit_consultation(text,text,text,text,text,text,text,text,text,text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_customer_by_contact(text,text,text,text) TO anon, authenticated;

-- 2. Widen operational policies to include manager & receptionist (were staff/admin only)
DROP POLICY IF EXISTS "staff manage appointments" ON public.appointments;
CREATE POLICY "team manage appointments" ON public.appointments
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'staff') OR has_role(auth.uid(),'receptionist'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'staff') OR has_role(auth.uid(),'receptionist'));

DROP POLICY IF EXISTS "staff manage consultations" ON public.consultations;
CREATE POLICY "team manage consultations" ON public.consultations
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'staff') OR has_role(auth.uid(),'receptionist'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR has_role(auth.uid(),'staff') OR has_role(auth.uid(),'receptionist'));

-- 3. Admins can read all profiles and user_roles (for Accounts page)
CREATE POLICY "admins read all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager'));

CREATE POLICY "admins read all user_roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'manager') OR user_id = auth.uid());

CREATE POLICY "admins manage user_roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'))
  WITH CHECK (has_role(auth.uid(),'admin'));
