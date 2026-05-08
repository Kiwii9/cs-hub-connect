-- Modify handle_new_user to enforce KFU email domain server-side
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Enforce KFU student email pattern: 9 digits @student.kfu.edu.sa
  IF NEW.email !~ '^\d{9}@student\.kfu\.edu\.sa$' THEN
    RAISE EXCEPTION 'Only KFU student emails (9 digits @student.kfu.edu.sa) are allowed';
  END IF;

  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$function$;
