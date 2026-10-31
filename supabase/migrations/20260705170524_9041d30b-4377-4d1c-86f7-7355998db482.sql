
REVOKE EXECUTE ON FUNCTION public.tg_audit_row_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_appointment_completed() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
