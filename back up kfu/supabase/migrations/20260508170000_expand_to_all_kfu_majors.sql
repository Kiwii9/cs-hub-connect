ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS college TEXT,
  ADD COLUMN IF NOT EXISTS major TEXT,
  ADD COLUMN IF NOT EXISTS program_type TEXT DEFAULT 'undergraduate';

UPDATE public.courses
SET
  college = COALESCE(college, 'Computer Science and Information Technology'),
  major = COALESCE(major, 'Computer Science'),
  program_type = COALESCE(program_type, 'undergraduate')
WHERE college IS NULL OR major IS NULL OR program_type IS NULL;

CREATE INDEX IF NOT EXISTS idx_courses_college ON public.courses(college);
CREATE INDEX IF NOT EXISTS idx_courses_major ON public.courses(major);

ALTER TABLE public.resources
  ALTER COLUMN lecturer_id DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF lower(NEW.email) !~ '^[a-z0-9._%+-]+@(student\.)?kfu\.edu\.sa$' THEN
    RAISE EXCEPTION 'Only official KFU emails ending with @student.kfu.edu.sa or @kfu.edu.sa are allowed';
  END IF;

  INSERT INTO public.profiles (user_id, email, display_name, student_id)
  VALUES (
    NEW.id,
    lower(NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(lower(NEW.email), '@', 1)),
    CASE WHEN lower(NEW.email) ~ '^\d{9}@student\.kfu\.edu\.sa$' THEN split_part(lower(NEW.email), '@', 1) ELSE NULL END
  );
  RETURN NEW;
END;
$function$;
