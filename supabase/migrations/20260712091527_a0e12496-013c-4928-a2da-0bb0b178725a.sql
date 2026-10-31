
-- 1. Extend invoices with lifecycle columns
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS due_date date,
  ADD COLUMN IF NOT EXISTS staff_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS voided_at timestamptz,
  ADD COLUMN IF NOT EXISTS void_reason text;

-- 2. Line items table (products or manual services on any invoice)
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'service',
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  description text NOT NULL,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  line_discount numeric(10,2) NOT NULL DEFAULT 0,
  line_total numeric(10,2) GENERATED ALWAYS AS ((quantity * unit_price) - line_discount) STORED,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_items TO authenticated;
GRANT ALL ON public.invoice_items TO service_role;

ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage invoice items"
  ON public.invoice_items FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'staff'::app_role)
    OR public.has_role(auth.uid(), 'manager'::app_role)
    OR public.has_role(auth.uid(), 'receptionist'::app_role)
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'staff'::app_role)
    OR public.has_role(auth.uid(), 'manager'::app_role)
    OR public.has_role(auth.uid(), 'receptionist'::app_role)
  );

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON public.invoice_items(invoice_id);

-- 3. Update recompute_invoice to include invoice_items
CREATE OR REPLACE FUNCTION public.recompute_invoice(_invoice_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_appt uuid;
  v_svc_sub numeric(10,2);
  v_item_sub numeric(10,2);
  v_subtotal numeric(10,2);
  v_discount numeric(10,2);
  v_tax numeric(10,2);
  v_total numeric(10,2);
  v_paid numeric(10,2);
  v_status text;
  v_voided timestamptz;
BEGIN
  SELECT appointment_id, discount, voided_at INTO v_appt, v_discount, v_voided
    FROM public.invoices WHERE id = _invoice_id;
  SELECT COALESCE(SUM(price_snapshot),0) INTO v_svc_sub
    FROM public.appointment_services WHERE appointment_id = v_appt;
  SELECT COALESCE(SUM(line_total),0) INTO v_item_sub
    FROM public.invoice_items WHERE invoice_id = _invoice_id;
  v_subtotal := v_svc_sub + v_item_sub;
  v_discount := COALESCE(v_discount,0);
  v_tax := round((v_subtotal - v_discount) * 0.125, 2);
  v_total := (v_subtotal - v_discount) + v_tax;
  SELECT COALESCE(SUM(CASE WHEN kind IN ('payment','deposit') THEN amount WHEN kind='refund' THEN -amount ELSE 0 END),0)
    INTO v_paid FROM public.payments WHERE invoice_id = _invoice_id;
  v_status := CASE
    WHEN v_voided IS NOT NULL THEN 'Void'
    WHEN v_paid <= 0 THEN 'Sent'
    WHEN v_paid >= v_total AND v_total > 0 THEN 'Paid'
    ELSE 'PartiallyPaid'
  END;
  UPDATE public.invoices
    SET subtotal=v_subtotal, tax=v_tax, total=v_total, status=v_status, updated_at=now()
    WHERE id=_invoice_id;
END $function$;

-- 4. Trigger to recompute when invoice_items change
CREATE OR REPLACE FUNCTION public.tg_invoice_items_recompute()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM public.recompute_invoice(COALESCE(NEW.invoice_id, OLD.invoice_id));
  RETURN COALESCE(NEW, OLD);
END $function$;

DROP TRIGGER IF EXISTS tg_invoice_items_recompute ON public.invoice_items;
CREATE TRIGGER tg_invoice_items_recompute
  AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items
  FOR EACH ROW EXECUTE FUNCTION public.tg_invoice_items_recompute();
