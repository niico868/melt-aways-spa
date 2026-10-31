
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS allergies text,
  ADD COLUMN IF NOT EXISTS medications text,
  ADD COLUMN IF NOT EXISTS medical_conditions text,
  ADD COLUMN IF NOT EXISTS skin_type text,
  ADD COLUMN IF NOT EXISTS medical_notes text;
