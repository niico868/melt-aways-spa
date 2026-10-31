ALTER TABLE public.consultations
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS consultation_type text,
  ADD COLUMN IF NOT EXISTS programme_interest text,
  ADD COLUMN IF NOT EXISTS form_data jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS consultations_category_idx ON public.consultations (category);
CREATE INDEX IF NOT EXISTS consultations_source_idx ON public.consultations (source);