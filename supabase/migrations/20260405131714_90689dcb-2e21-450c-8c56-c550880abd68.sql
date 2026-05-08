
-- Fix 1: Restrict profiles SELECT to own profile only
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix 2: Add admin-only INSERT/UPDATE/DELETE on user_roles (explicit deny for non-admins)
CREATE POLICY "Only admins can insert user roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update user roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete user roles"
  ON user_roles FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 3: Add UPDATE policy on storage.objects for resources bucket (owner only)
CREATE POLICY "Users can update own resource files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resources' AND (auth.uid())::text = (storage.foldername(name))[1]);
