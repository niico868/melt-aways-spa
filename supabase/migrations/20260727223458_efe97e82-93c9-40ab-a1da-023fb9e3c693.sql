-- 1. Client status enum + columns
DO $$ BEGIN
  CREATE TYPE public.client_status AS ENUM (
    'lead','registered','consultation_booked','consultation_completed',
    'active_treatment','treatment_plan_completed','maintenance','inactive','archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.treatment_status AS ENUM (
    'Planned','Scheduled','In Progress','Completed','Paused','Discontinued'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS client_status public.client_status NOT NULL DEFAULT 'lead',
  ADD COLUMN IF NOT EXISTS client_status_changed_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS last_activity_at timestamptz NOT NULL DEFAULT now();

-- 2. Client events audit trail
CREATE TABLE IF NOT EXISTS public.client_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  from_status public.client_status,
  to_status public.client_status,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.client_events TO authenticated;
GRANT ALL ON public.client_events TO service_role;
ALTER TABLE public.client_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "staff read client events" ON public.client_events;
CREATE POLICY "staff read client events" ON public.client_events
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "staff insert client events" ON public.client_events;
CREATE POLICY "staff insert client events" ON public.client_events
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_client_events_customer ON public.client_events(customer_id, created_at DESC);

-- 3. Unify consultation vocabularies (map old → new)
UPDATE public.consultations SET status = CASE
  WHEN status IN ('New','New Lead')                     THEN 'Not Started'
  WHEN status IN ('Contacted','Follow-Up Needed')       THEN 'Follow-Up Required'
  WHEN status IN ('Booked','Consultation Booked')       THEN 'Booked'
  WHEN status IN ('Completed')                          THEN 'Completed'
  WHEN status IN ('Package Offered','Paid')             THEN 'Converted to Treatment'
  WHEN status IN ('Closed','Lost Lead','Not Suitable')  THEN 'Not Started'
  ELSE status
END
WHERE status NOT IN ('Not Started','Booked','Completed','Follow-Up Required','Converted to Treatment');

-- 4. Treatment plans + treatment status
CREATE TABLE IF NOT EXISTS public.treatment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  name text NOT NULL,
  status public.treatment_status NOT NULL DEFAULT 'Planned',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.treatment_plans TO authenticated;
GRANT ALL ON public.treatment_plans TO service_role;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "staff manage treatment plans" ON public.treatment_plans;
CREATE POLICY "staff manage treatment plans" ON public.treatment_plans
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.customer_treatments
  ADD COLUMN IF NOT EXISTS status public.treatment_status NOT NULL DEFAULT 'Completed',
  ADD COLUMN IF NOT EXISTS treatment_plan_id uuid REFERENCES public.treatment_plans(id) ON DELETE SET NULL;

-- 5. Helper to set client_status + emit event
CREATE OR REPLACE FUNCTION public.set_client_status(_customer_id uuid, _new public.client_status, _event text, _metadata jsonb DEFAULT '{}'::jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_old public.client_status;
BEGIN
  SELECT client_status INTO v_old FROM public.customers WHERE id = _customer_id;
  IF v_old IS DISTINCT FROM _new THEN
    UPDATE public.customers
      SET client_status = _new,
          client_status_changed_at = now(),
          last_activity_at = now()
      WHERE id = _customer_id;
    INSERT INTO public.client_events (customer_id, event_type, from_status, to_status, metadata)
      VALUES (_customer_id, _event, v_old, _new, _metadata);
  ELSE
    UPDATE public.customers SET last_activity_at = now() WHERE id = _customer_id;
  END IF;
END $$;
REVOKE EXECUTE ON FUNCTION public.set_client_status(uuid, public.client_status, text, jsonb) FROM PUBLIC, anon, authenticated;

-- 6. Journey helper: does this customer already have any completed non-consultation treatment?
CREATE OR REPLACE FUNCTION public.customer_has_active_treatment(_customer_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.appointments a
    JOIN public.services s ON s.id = a.service_id
    WHERE a.customer_id = _customer_id
      AND lower(s.name) NOT LIKE '%consult%'
      AND a.status IN ('Confirmed','Checked In','In Progress','Completed')
  );
$$;
REVOKE EXECUTE ON FUNCTION public.customer_has_active_treatment(uuid) FROM PUBLIC, anon, authenticated;

-- 7. Trigger on appointments → drive client status
CREATE OR REPLACE FUNCTION public.tg_appt_client_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_svc text; v_is_consult boolean; v_cur public.client_status;
BEGIN
  IF NEW.customer_id IS NULL THEN RETURN NEW; END IF;
  SELECT name INTO v_svc FROM public.services WHERE id = NEW.service_id;
  v_is_consult := lower(coalesce(v_svc,'')) LIKE '%consult%';
  SELECT client_status INTO v_cur FROM public.customers WHERE id = NEW.customer_id;

  IF TG_OP = 'INSERT' THEN
    IF v_is_consult AND v_cur IN ('lead','registered') THEN
      PERFORM public.set_client_status(NEW.customer_id, 'consultation_booked', 'appointment_created', jsonb_build_object('appointment_id', NEW.id));
    ELSIF NOT v_is_consult AND v_cur IN ('lead','registered','consultation_booked','consultation_completed','maintenance','inactive') THEN
      PERFORM public.set_client_status(NEW.customer_id, 'active_treatment', 'appointment_created', jsonb_build_object('appointment_id', NEW.id));
    ELSE
      UPDATE public.customers SET last_activity_at = now() WHERE id = NEW.customer_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'Completed' THEN
      IF v_is_consult AND v_cur IN ('lead','registered','consultation_booked') THEN
        PERFORM public.set_client_status(NEW.customer_id, 'consultation_completed', 'consultation_completed', jsonb_build_object('appointment_id', NEW.id));
      ELSIF NOT v_is_consult THEN
        PERFORM public.set_client_status(NEW.customer_id, 'active_treatment', 'treatment_completed', jsonb_build_object('appointment_id', NEW.id));
      END IF;
    ELSE
      UPDATE public.customers SET last_activity_at = now() WHERE id = NEW.customer_id;
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_appt_client_status_ins ON public.appointments;
CREATE TRIGGER trg_appt_client_status_ins AFTER INSERT ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.tg_appt_client_status();
DROP TRIGGER IF EXISTS trg_appt_client_status_upd ON public.appointments;
CREATE TRIGGER trg_appt_client_status_upd AFTER UPDATE OF status ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.tg_appt_client_status();

-- 8. Trigger on consultations → drive client status when a lead consult is logged
CREATE OR REPLACE FUNCTION public.tg_consult_client_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_cur public.client_status;
BEGIN
  IF NEW.customer_id IS NULL THEN RETURN NEW; END IF;
  SELECT client_status INTO v_cur FROM public.customers WHERE id = NEW.customer_id;
  IF TG_OP = 'INSERT' AND v_cur = 'lead' THEN
    PERFORM public.set_client_status(NEW.customer_id, 'lead', 'consultation_submitted', jsonb_build_object('consultation_id', NEW.id));
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'Booked' AND v_cur IN ('lead','registered') THEN
      PERFORM public.set_client_status(NEW.customer_id, 'consultation_booked', 'consultation_booked', jsonb_build_object('consultation_id', NEW.id));
    ELSIF NEW.status = 'Completed' AND v_cur IN ('lead','registered','consultation_booked') THEN
      PERFORM public.set_client_status(NEW.customer_id, 'consultation_completed', 'consultation_completed', jsonb_build_object('consultation_id', NEW.id));
    ELSIF NEW.status = 'Converted to Treatment' THEN
      PERFORM public.set_client_status(NEW.customer_id, 'active_treatment', 'converted_to_treatment', jsonb_build_object('consultation_id', NEW.id));
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_consult_client_status_ins ON public.consultations;
CREATE TRIGGER trg_consult_client_status_ins AFTER INSERT ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.tg_consult_client_status();
DROP TRIGGER IF EXISTS trg_consult_client_status_upd ON public.consultations;
CREATE TRIGGER trg_consult_client_status_upd AFTER UPDATE OF status ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.tg_consult_client_status();

-- 9. Nightly maintenance/inactive sweep (idempotent)
CREATE OR REPLACE FUNCTION public.sweep_client_activity()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.customers
    SET client_status = 'inactive',
        client_status_changed_at = now()
    WHERE client_status IN ('active_treatment','treatment_plan_completed','maintenance')
      AND last_activity_at < now() - interval '12 months';
  UPDATE public.customers
    SET client_status = 'maintenance',
        client_status_changed_at = now()
    WHERE client_status IN ('active_treatment','treatment_plan_completed')
      AND last_activity_at < now() - interval '90 days'
      AND last_activity_at >= now() - interval '12 months';
END $$;
REVOKE EXECUTE ON FUNCTION public.sweep_client_activity() FROM PUBLIC, anon, authenticated;

-- 10. Backfill existing customers based on current history
UPDATE public.customers c SET
  client_status = CASE
    WHEN EXISTS (SELECT 1 FROM public.appointments a JOIN public.services s ON s.id=a.service_id
                 WHERE a.customer_id=c.id AND a.status='Completed' AND lower(s.name) NOT LIKE '%consult%')
      THEN 'active_treatment'::public.client_status
    WHEN EXISTS (SELECT 1 FROM public.appointments a JOIN public.services s ON s.id=a.service_id
                 WHERE a.customer_id=c.id AND lower(s.name) LIKE '%consult%' AND a.status='Completed')
      THEN 'consultation_completed'::public.client_status
    WHEN EXISTS (SELECT 1 FROM public.appointments a WHERE a.customer_id=c.id)
      THEN 'consultation_booked'::public.client_status
    WHEN EXISTS (SELECT 1 FROM auth.users u WHERE u.email = c.email)
      THEN 'registered'::public.client_status
    ELSE 'lead'::public.client_status
  END,
  last_activity_at = COALESCE(
    (SELECT max(a.scheduled_at) FROM public.appointments a WHERE a.customer_id=c.id),
    (SELECT max(x.submitted_at) FROM public.consultations x WHERE x.customer_id=c.id),
    c.created_at
  );