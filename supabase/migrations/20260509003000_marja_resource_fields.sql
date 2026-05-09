-- Marja update: separate Section (Theory/Lab) from File Type labels.

ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS file_type TEXT;

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
SET file_type = CASE
  WHEN type::text = 'lecture_link' THEN 'recorded_lecture'
  WHEN type::text = 'summary' THEN 'summary'
  WHEN type::text = 'notes' THEN 'student_notes'
  WHEN type::text = 'practice' THEN 'past_exams_compilation'
  ELSE COALESCE(file_type, 'etc_other')
END
WHERE file_type IS NULL;

CREATE INDEX IF NOT EXISTS idx_resources_file_type ON public.resources(file_type);
