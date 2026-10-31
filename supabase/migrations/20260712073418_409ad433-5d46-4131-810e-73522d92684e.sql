-- Appointments Phase 1: multi-service, notes, medical, invoices, payments

-- 1) appointment_services
CREATE TABLE public.appointment_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id),
  price_snapshot numeric(10,2) NOT NULL DEFAULT 0,
  duration_min_snapshot int NOT NULL DEFAULT 60,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.appointment_services(appointment_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointment_services TO authenticated;
GRANT ALL ON public.appointment_services TO service_role;
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage appointment_services" ON public.appointment_services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'receptionist'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'receptionist'));

-- 2) appointment_notes
CREATE TABLE public.appointment_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('quick','internal','treatment')),
  body text NOT NULL,
  author_id uuid,
  author_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.appointment_notes(appointment_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointment_notes TO authenticated;
GRANT ALL ON public.appointment_notes TO service_role;
ALTER TABLE public.appointment_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage appointment_notes" ON public.appointment_notes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'receptionist'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'receptionist'));

-- 3) appointment_medical
CREATE TABLE public.appointment_medical (
  appointment_id uuid PRIMARY KEY REFERENCES public.appointments(id) ON DELETE CASCADE,
  allergies text,
  medications text,
  contraindications text,
  additional_notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointment_medical TO authenticated;
GRANT ALL ON public.appointment_medical TO service_role;
ALTER TABLE public.appointment_medical ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage appointment_medical" ON public.appointment_medical FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'receptionist'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'receptionist'));

-- 4) invoices
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1000;
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid UNIQUE REFERENCES public.appointments(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  invoice_number text NOT NULL UNIQUE DEFAULT ('MEA-' || lpad(nextval('public.invoice_number_seq')::text, 6, '0')),
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  tax numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Sent','Paid','PartiallyPaid','Void','Refunded')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.invoices(customer_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage invoices" ON public.invoices FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'receptionist'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'receptionist'));
CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- 5) payments
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  method text NOT NULL DEFAULT 'Cash',
  kind text NOT NULL DEFAULT 'payment' CHECK (kind IN ('payment','refund','deposit','discount')),
  note text,
  recorded_by uuid,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.payments(invoice_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage payments" ON public.payments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'receptionist'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'receptionist'));

-- 6) appointments new columns
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS quick_note text,
  ADD COLUMN IF NOT EXISTS room text,
  ADD COLUMN IF NOT EXISTS duration_min int;

-- 7) backfill appointment_services from legacy single service_id
INSERT INTO public.appointment_services (appointment_id, service_id, price_snapshot, duration_min_snapshot)
SELECT a.id, a.service_id, COALESCE(s.base_price,0), 60
FROM public.appointments a
JOIN public.services s ON s.id = a.service_id
WHERE NOT EXISTS (SELECT 1 FROM public.appointment_services x WHERE x.appointment_id = a.id);

-- 8) helper: recompute invoice totals from appointment_services + payments
CREATE OR REPLACE FUNCTION public.recompute_invoice(_invoice_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_appt uuid;
  v_subtotal numeric(10,2);
  v_discount numeric(10,2);
  v_tax numeric(10,2);
  v_total numeric(10,2);
  v_paid numeric(10,2);
  v_status text;
BEGIN
  SELECT appointment_id, discount INTO v_appt, v_discount FROM public.invoices WHERE id = _invoice_id;
  SELECT COALESCE(SUM(price_snapshot),0) INTO v_subtotal FROM public.appointment_services WHERE appointment_id = v_appt;
  v_discount := COALESCE(v_discount,0);
  v_tax := round((v_subtotal - v_discount) * 0.125, 2);
  v_total := (v_subtotal - v_discount) + v_tax;
  SELECT COALESCE(SUM(CASE WHEN kind IN ('payment','deposit') THEN amount WHEN kind='refund' THEN -amount ELSE 0 END),0)
    INTO v_paid FROM public.payments WHERE invoice_id = _invoice_id;
  v_status := CASE
    WHEN v_paid <= 0 THEN 'Sent'
    WHEN v_paid >= v_total THEN 'Paid'
    ELSE 'PartiallyPaid'
  END;
  UPDATE public.invoices SET subtotal=v_subtotal, tax=v_tax, total=v_total, status=v_status, updated_at=now() WHERE id=_invoice_id;
END $$;

-- 9) auto-create invoice on appointment insert
CREATE OR REPLACE FUNCTION public.tg_appointment_create_invoice()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_invoice uuid;
BEGIN
  INSERT INTO public.invoices (appointment_id, customer_id) VALUES (NEW.id, NEW.customer_id) RETURNING id INTO v_invoice;
  PERFORM public.recompute_invoice(v_invoice);
  RETURN NEW;
END $$;
CREATE TRIGGER trg_appt_create_invoice AFTER INSERT ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.tg_appointment_create_invoice();

-- backfill invoices for existing appointments
INSERT INTO public.invoices (appointment_id, customer_id)
SELECT a.id, a.customer_id FROM public.appointments a
WHERE NOT EXISTS (SELECT 1 FROM public.invoices i WHERE i.appointment_id = a.id);

DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT id FROM public.invoices LOOP PERFORM public.recompute_invoice(r.id); END LOOP;
END $$;

-- 10) recompute invoice when services or payments change
CREATE OR REPLACE FUNCTION public.tg_services_recompute()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_invoice uuid; v_appt uuid;
BEGIN
  v_appt := COALESCE(NEW.appointment_id, OLD.appointment_id);
  SELECT id INTO v_invoice FROM public.invoices WHERE appointment_id = v_appt;
  IF v_invoice IS NOT NULL THEN PERFORM public.recompute_invoice(v_invoice); END IF;
  RETURN COALESCE(NEW, OLD);
END $$;
CREATE TRIGGER trg_appt_services_recompute AFTER INSERT OR UPDATE OR DELETE ON public.appointment_services FOR EACH ROW EXECUTE FUNCTION public.tg_services_recompute();

CREATE OR REPLACE FUNCTION public.tg_payments_recompute()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.recompute_invoice(COALESCE(NEW.invoice_id, OLD.invoice_id));
  RETURN COALESCE(NEW, OLD);
END $$;
CREATE TRIGGER trg_payments_recompute AFTER INSERT OR UPDATE OR DELETE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.tg_payments_recompute();