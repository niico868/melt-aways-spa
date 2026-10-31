ALTER TABLE public.invoice_items DROP COLUMN IF EXISTS product_id;
DROP TABLE IF EXISTS public.sales CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;