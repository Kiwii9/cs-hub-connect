-- Properly restrict trigger-only functions by revoking from PUBLIC first, then granting only to necessary roles
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC;

-- has_role must be executable by authenticated for RLS policies, but not by anon
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Also revoke from anon specifically (redundant but explicit)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

-- Ensure trigger functions are only executable by the roles that need them (postgres/supabase_admin for triggers)
-- No grants needed; triggers run with the trigger owner's privileges

-- For GraphQL exposure, revoke SELECT from PUBLIC on sensitive tables
REVOKE ALL ON public.profiles FROM PUBLIC;
REVOKE ALL ON public.reports FROM PUBLIC;
REVOKE ALL ON public.user_roles FROM PUBLIC;

-- Re-grant necessary base permissions for authenticated users on tables they need to query directly
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.reports TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

-- Keep public tables accessible
GRANT SELECT ON public.courses TO PUBLIC;
GRANT SELECT ON public.lecturers TO PUBLIC;
GRANT SELECT ON public.resources TO PUBLIC;