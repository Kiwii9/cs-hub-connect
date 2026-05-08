-- Fix resources UPDATE policy to prevent users from bypassing admin moderation
DROP POLICY IF EXISTS "Users can update own resources" ON public.resources;
CREATE POLICY "Users can update own resources" ON public.resources
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploader_id)
  WITH CHECK (
    auth.uid() = uploader_id
    AND status != 'removed'::resource_status
  );

-- Add DELETE policy on profiles so users can remove their own PII
CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix storage upload policy to verify actual file ownership by path
DROP POLICY IF EXISTS "Authenticated users can upload resource files" ON storage.objects;
CREATE POLICY "Authenticated users can upload resource files" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'resources'
    AND (storage.extension(name) IN ('pdf', 'png', 'jpg', 'jpeg'))
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- Revoke direct execution of trigger-only functions (these should only run via triggers)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;

-- Revoke EXECUTE on has_role from anon (no public policies use it; authenticated RLS policies still need it)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

-- Reduce GraphQL schema exposure for sensitive tables by anon
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.reports FROM anon;
REVOKE SELECT ON public.user_roles FROM anon;