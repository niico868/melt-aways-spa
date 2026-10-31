
-- Audit log
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,               -- 'sign_in', 'sign_out', 'insert', 'update', 'delete'
  entity TEXT,                        -- table name for writes, 'auth' for sessions
  entity_id TEXT,
  summary TEXT,
  diff JSONB,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Any signed-in user can insert their own event (sign_in/out are client-reported)
CREATE POLICY "audit_insert_self" ON public.audit_log
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Only admins can read the log
CREATE POLICY "audit_read_admin" ON public.audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_audit_log_created_at ON public.audit_log (created_at DESC);
CREATE INDEX idx_audit_log_user ON public.audit_log (user_id, created_at DESC);
CREATE INDEX idx_audit_log_entity ON public.audit_log (entity, entity_id);

-- Generic trigger fn to log writes on dashboard tables
CREATE OR REPLACE FUNCTION public.tg_audit_row_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action TEXT;
  v_id TEXT;
  v_summary TEXT;
  v_diff JSONB;
  v_email TEXT;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    v_action := 'insert'; v_id := (NEW).id::text; v_diff := to_jsonb(NEW);
    v_summary := 'Created ' || TG_TABLE_NAME;
  ELSIF (TG_OP = 'UPDATE') THEN
    v_action := 'update'; v_id := (NEW).id::text;
    v_diff := jsonb_build_object('before', to_jsonb(OLD), 'after', to_jsonb(NEW));
    v_summary := 'Updated ' || TG_TABLE_NAME;
  ELSIF (TG_OP = 'DELETE') THEN
    v_action := 'delete'; v_id := (OLD).id::text; v_diff := to_jsonb(OLD);
    v_summary := 'Deleted ' || TG_TABLE_NAME;
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = auth.uid();

  INSERT INTO public.audit_log (user_id, actor_email, action, entity, entity_id, summary, diff)
  VALUES (auth.uid(), v_email, v_action, TG_TABLE_NAME, v_id, v_summary, v_diff);

  RETURN COALESCE(NEW, OLD);
END $$;

-- Attach to relevant tables
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'customers','appointments','consultations','sales','services','products',
    'employees','customer_notes','customer_treatments','user_roles'
  ])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_audit_%1$s ON public.%1$s;', t);
    EXECUTE format('CREATE TRIGGER trg_audit_%1$s
      AFTER INSERT OR UPDATE OR DELETE ON public.%1$s
      FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row_change();', t);
  END LOOP;
END $$;
