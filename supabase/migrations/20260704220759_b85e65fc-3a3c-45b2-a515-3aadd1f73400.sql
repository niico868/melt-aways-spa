
-- Expand customers
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS preferred_contact text DEFAULT 'whatsapp',
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS marketing_opt_in boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS customers_touch_updated_at ON public.customers;
CREATE TRIGGER customers_touch_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- customer_notes
CREATE TABLE IF NOT EXISTS public.customer_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  body text NOT NULL,
  pinned boolean NOT NULL DEFAULT false,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_notes TO authenticated;
GRANT ALL ON public.customer_notes TO service_role;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage customer_notes" ON public.customer_notes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'receptionist'))
  WITH CHECK (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'receptionist'));
CREATE INDEX IF NOT EXISTS customer_notes_customer_id_idx ON public.customer_notes(customer_id, created_at DESC);

-- customer_treatments
CREATE TABLE IF NOT EXISTS public.customer_treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  service_name text NOT NULL,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  employee_name text,
  performed_at timestamptz NOT NULL DEFAULT now(),
  session_number int,
  price numeric(10,2),
  outcome_notes text,
  before_photo_url text,
  after_photo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_treatments TO authenticated;
GRANT ALL ON public.customer_treatments TO service_role;
ALTER TABLE public.customer_treatments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage customer_treatments" ON public.customer_treatments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'receptionist'))
  WITH CHECK (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'receptionist'));
CREATE INDEX IF NOT EXISTS customer_treatments_customer_id_idx ON public.customer_treatments(customer_id, performed_at DESC);

-- Auto-create treatment record when appointment is Completed
CREATE OR REPLACE FUNCTION public.tg_appointment_completed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE svc_name text; emp_name text; svc_price numeric(10,2);
BEGIN
  IF NEW.status = 'Completed' AND (OLD.status IS DISTINCT FROM 'Completed') AND NEW.customer_id IS NOT NULL THEN
    SELECT name, base_price INTO svc_name, svc_price FROM public.services WHERE id = NEW.service_id;
    SELECT full_name INTO emp_name FROM public.employees WHERE id = NEW.employee_id;
    INSERT INTO public.customer_treatments (customer_id, appointment_id, service_id, service_name, employee_id, employee_name, performed_at, price)
    VALUES (NEW.customer_id, NEW.id, NEW.service_id, COALESCE(svc_name,'Service'), NEW.employee_id, emp_name, NEW.scheduled_at, svc_price);
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS appointments_completed_log ON public.appointments;
CREATE TRIGGER appointments_completed_log AFTER UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.tg_appointment_completed();

-- Dedup helper: find existing customer by phone/email or create one
CREATE OR REPLACE FUNCTION public.upsert_customer_by_contact(
  p_full_name text, p_phone text DEFAULT NULL, p_email text DEFAULT NULL, p_notes text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing_id uuid; norm_phone text;
BEGIN
  norm_phone := regexp_replace(COALESCE(p_phone,''), '\D', '', 'g');
  IF length(norm_phone) >= 7 THEN
    SELECT id INTO existing_id FROM public.customers
      WHERE regexp_replace(COALESCE(phone,''), '\D', '', 'g') = norm_phone LIMIT 1;
  END IF;
  IF existing_id IS NULL AND p_email IS NOT NULL AND p_email <> '' THEN
    SELECT id INTO existing_id FROM public.customers WHERE lower(email) = lower(p_email) LIMIT 1;
  END IF;
  IF existing_id IS NOT NULL THEN
    UPDATE public.customers SET
      full_name = COALESCE(NULLIF(p_full_name,''), full_name),
      phone = COALESCE(NULLIF(p_phone,''), phone),
      email = COALESCE(NULLIF(p_email,''), email)
    WHERE id = existing_id;
    RETURN existing_id;
  END IF;
  INSERT INTO public.customers (full_name, phone, email, notes)
    VALUES (p_full_name, NULLIF(p_phone,''), NULLIF(p_email,''), NULLIF(p_notes,''))
    RETURNING id INTO existing_id;
  RETURN existing_id;
END; $$;

GRANT EXECUTE ON FUNCTION public.upsert_customer_by_contact(text,text,text,text) TO authenticated, anon;
