
-- PROFILES (per-user, auto-created on signup)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CUSTOMERS
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage customers" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- EMPLOYEES
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Therapist',
  slots_total INT NOT NULL DEFAULT 8,
  avatar_tone TEXT NOT NULL DEFAULT 'pink',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage employees" ON public.employees FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SERVICES
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  fill_color TEXT NOT NULL DEFAULT '#E8246A',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- APPOINTMENTS
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage appointments" ON public.appointments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- CONSULTATIONS
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_name TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consultations TO authenticated;
GRANT ALL ON public.consultations TO service_role;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage consultations" ON public.consultations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SALES
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  sold_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage sales" ON public.sales FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ALERTS
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'dismiss',
  action_label TEXT,
  dismissed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage alerts" ON public.alerts FOR ALL TO authenticated USING (true) WITH CHECK (true);
