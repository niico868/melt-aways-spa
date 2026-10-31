-- 1. has_role -> SECURITY INVOKER (still safe: RLS lets users read own roles)
ALTER FUNCTION public.has_role(uuid, public.app_role) SECURITY INVOKER;

-- 2. Lock down public_submit_consultation; we'll proxy via a server route using service_role
REVOKE EXECUTE ON FUNCTION public.public_submit_consultation(text,text,text,text,text,text,text,text,text,text) FROM PUBLIC, anon, authenticated;

-- 3. Consolidate duplicate user_roles admin policies
DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;
-- keep "admins manage user_roles" as the single ALL policy