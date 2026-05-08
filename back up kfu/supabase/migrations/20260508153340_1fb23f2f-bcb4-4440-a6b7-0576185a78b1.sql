-- Fix resources UPDATE policy: prevent users from targeting removed resources at all
DROP POLICY IF EXISTS "Users can update own resources" ON public.resources;
CREATE POLICY "Users can update own resources" ON public.resources
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploader_id AND status != 'removed'::resource_status)
  WITH CHECK (
    auth.uid() = uploader_id
    AND status != 'removed'::resource_status
  );

-- Fix storage SELECT policy: restrict file access to owners or active resources
DROP POLICY IF EXISTS "Authenticated users can view resource files" ON storage.objects;
CREATE POLICY "Authenticated users can view resource files" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'resources'
    AND (
      (auth.uid())::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM public.resources
        WHERE file_url = name AND status = 'active'::resource_status
      )
    )
  );