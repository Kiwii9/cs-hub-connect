-- KFU Resource Hub overhaul: college/major navigation, Theory/Lab resource types,
-- moderation queue, profile fields, comments, reactions, and bigger uploads.

ALTER TABLE public.resources
  ALTER COLUMN course_id DROP NOT NULL;

ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS college TEXT,
  ADD COLUMN IF NOT EXISTS major TEXT,
  ADD COLUMN IF NOT EXISTS course_label TEXT,
  ADD COLUMN IF NOT EXISTS file_type TEXT;

UPDATE public.resources r
SET
  college = COALESCE(r.college, c.college),
  major = COALESCE(r.major, c.major),
  course_label = COALESCE(r.course_label, concat_ws(' - ', c.code, c.name))
FROM public.courses c
WHERE r.course_id = c.id
  AND (r.college IS NULL OR r.major IS NULL OR r.course_label IS NULL);

CREATE INDEX IF NOT EXISTS idx_resources_college_major ON public.resources(college, major);
CREATE INDEX IF NOT EXISTS idx_resources_course_label ON public.resources(course_label);

ALTER TABLE public.resources
  DROP CONSTRAINT IF EXISTS resources_file_type_check;

ALTER TABLE public.resources
  ADD CONSTRAINT resources_file_type_check
  CHECK (
    file_type IS NULL OR file_type IN (
      'student_explanation',
      'student_notes',
      'summary',
      'doctor_revision',
      'past_exams_compilation',
      'recorded_lecture',
      'slides',
      'etc_other'
    )
  );

UPDATE public.resources
SET file_type = COALESCE(file_type, 'etc_other')
WHERE file_type IS NULL;

CREATE INDEX IF NOT EXISTS idx_resources_file_type ON public.resources(file_type);


ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS college TEXT,
  ADD COLUMN IF NOT EXISTS major TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS banner_url TEXT;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'theory' AND enumtypid = 'public.resource_type'::regtype) THEN
    ALTER TYPE public.resource_type ADD VALUE 'theory';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'lab_practical' AND enumtypid = 'public.resource_type'::regtype) THEN
    ALTER TYPE public.resource_type ADD VALUE 'lab_practical';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'pending' AND enumtypid = 'public.resource_status'::regtype) THEN
    ALTER TYPE public.resource_status ADD VALUE 'pending';
  END IF;
END $$;

-- Allow uploaders to see their own resources while they are pending approval.
DROP POLICY IF EXISTS "Users can read own resources" ON public.resources;
CREATE POLICY "Users can read own resources"
  ON public.resources
  FOR SELECT
  TO authenticated
  USING (auth.uid() = uploader_id);

-- Keep the public surface limited to approved resources only.
DROP POLICY IF EXISTS "Anyone can read active resources" ON public.resources;
CREATE POLICY "Anyone can read active resources"
  ON public.resources
  FOR SELECT
  USING (status::text = 'active');

-- Comments under approved resources.
CREATE TABLE IF NOT EXISTS public.resource_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(trim(body)) BETWEEN 1 AND 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.resource_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read comments" ON public.resource_comments;
CREATE POLICY "Anyone can read comments"
  ON public.resource_comments
  FOR SELECT
  USING (true);
DROP POLICY IF EXISTS "Authenticated users can comment" ON public.resource_comments;
CREATE POLICY "Authenticated users can comment"
  ON public.resource_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own comments" ON public.resource_comments;
CREATE POLICY "Users can update own comments"
  ON public.resource_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own comments" ON public.resource_comments;
CREATE POLICY "Users can delete own comments"
  ON public.resource_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_resource_comments_updated_at ON public.resource_comments;
CREATE TRIGGER update_resource_comments_updated_at
  BEFORE UPDATE ON public.resource_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Upvote and praise recognition system.
CREATE TABLE IF NOT EXISTS public.resource_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('upvote', 'praise')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (resource_id, user_id, reaction_type)
);

ALTER TABLE public.resource_reactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read reactions" ON public.resource_reactions;
CREATE POLICY "Anyone can read reactions"
  ON public.resource_reactions
  FOR SELECT
  USING (true);
DROP POLICY IF EXISTS "Authenticated users can react" ON public.resource_reactions;
CREATE POLICY "Authenticated users can react"
  ON public.resource_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can remove own reactions" ON public.resource_reactions;
CREATE POLICY "Users can remove own reactions"
  ON public.resource_reactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_resource_comments_resource ON public.resource_comments(resource_id, created_at);
CREATE INDEX IF NOT EXISTS idx_resource_reactions_resource ON public.resource_reactions(resource_id, reaction_type);

-- Increase bucket size limit to 50MB where the Storage schema supports file_size_limit.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'storage' AND table_name = 'buckets' AND column_name = 'file_size_limit'
  ) THEN
    UPDATE storage.buckets SET file_size_limit = 52428800 WHERE id = 'resources';
  END IF;
END $$;
