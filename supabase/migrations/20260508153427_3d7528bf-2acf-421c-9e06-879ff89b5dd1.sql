-- Add admin storage policies
CREATE POLICY "Admins can view any resource file" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update any resource file" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete any resource file" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'resources' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Tighten user update to only allow editing active resources
DROP POLICY IF EXISTS "Users can update own resources" ON public.resources;
CREATE POLICY "Users can update own resources" ON public.resources
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploader_id AND status = 'active'::resource_status)
  WITH CHECK (auth.uid() = uploader_id AND status = 'active'::resource_status);