
-- Fix 1: Restrict profiles to authenticated users only (remove public exposure of PII)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Authenticated users can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Fix 2: Allow reporters to read their own reports
CREATE POLICY "Users can read own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- Fix 3: Make resources storage bucket private
UPDATE storage.buckets SET public = false WHERE id = 'resources';

-- Fix 4: Update storage policy to authenticated only
DROP POLICY IF EXISTS "Anyone can view resource files" ON storage.objects;
CREATE POLICY "Authenticated users can view resource files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'resources');
