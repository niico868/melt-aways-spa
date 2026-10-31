-- Auto-grant admin role to owner emails when they sign up / are invited
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  is_owner boolean := lower(NEW.email) IN ('meltawaystt@gmail.com', 'smugglersparadisehq@gmail.com');
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN is_owner THEN 'admin'::app_role ELSE 'staff'::app_role END)
  ON CONFLICT DO NOTHING;

  IF is_owner THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Backfill: if these users already exist, promote them to admin
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE lower(u.email) IN ('meltawaystt@gmail.com', 'smugglersparadisehq@gmail.com')
ON CONFLICT DO NOTHING;