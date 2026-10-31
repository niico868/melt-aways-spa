
-- Extend app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'receptionist';

-- Wipe transactional/customer data (order matters for FKs)
TRUNCATE TABLE public.appointments, public.sales, public.consultations, public.alerts, public.customers, public.employees RESTART IDENTITY CASCADE;

-- Seed the single 'test' employee
INSERT INTO public.employees (full_name, role, slots_total, avatar_tone)
VALUES ('test', 'Therapist', 8, '#FDF2F7');
