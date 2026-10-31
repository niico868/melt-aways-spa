-- Roles infrastructure
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Restrict SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Backfill: all existing auth users become staff (this is a staff-only management app)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'staff'::public.app_role FROM auth.users
ON CONFLICT DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
ON CONFLICT DO NOTHING;

-- Auto-assign staff role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'staff') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Replace permissive policies with staff-scoped ones
DROP POLICY IF EXISTS "staff manage alerts" ON public.alerts;
DROP POLICY IF EXISTS "staff manage appointments" ON public.appointments;
DROP POLICY IF EXISTS "staff manage consultations" ON public.consultations;
DROP POLICY IF EXISTS "staff manage customers" ON public.customers;
DROP POLICY IF EXISTS "staff manage employees" ON public.employees;
DROP POLICY IF EXISTS "staff manage products" ON public.products;
DROP POLICY IF EXISTS "staff manage sales" ON public.sales;
DROP POLICY IF EXISTS "staff manage services" ON public.services;

CREATE POLICY "staff manage alerts" ON public.alerts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "staff manage appointments" ON public.appointments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "staff manage consultations" ON public.consultations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "staff manage customers" ON public.customers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "staff manage employees" ON public.employees FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "staff manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "staff manage sales" ON public.sales FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "staff manage services" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'staff') OR public.has_role(auth.uid(),'admin'));