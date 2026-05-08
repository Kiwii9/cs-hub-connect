
-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  level INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read courses" ON public.courses FOR SELECT USING (true);

-- Lecturers table
CREATE TABLE public.lecturers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'CS',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.lecturers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read lecturers" ON public.lecturers FOR SELECT USING (true);

-- Resources table
CREATE TYPE public.resource_type AS ENUM ('notes', 'summary', 'lecture_link', 'practice');
CREATE TYPE public.resource_status AS ENUM ('active', 'reported', 'removed');

CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  type resource_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  academic_year TEXT NOT NULL,
  semester TEXT NOT NULL CHECK (semester IN ('1', '2', 'Summer')),
  batch_year INTEGER NOT NULL,
  lecturer_id UUID NOT NULL REFERENCES public.lecturers(id),
  section TEXT CHECK (section IN ('A', 'B', 'C', 'D')),
  tags TEXT[] DEFAULT '{}',
  week INTEGER CHECK (week >= 1 AND week <= 16),
  topic TEXT,
  file_url TEXT,
  link_url TEXT,
  text_content TEXT,
  uploader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status resource_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active resources" ON public.resources FOR SELECT USING (status = 'active');
CREATE POLICY "Authenticated users can create resources" ON public.resources FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "Users can update own resources" ON public.resources FOR UPDATE TO authenticated USING (auth.uid() = uploader_id);
CREATE POLICY "Users can delete own resources" ON public.resources FOR DELETE TO authenticated USING (auth.uid() = uploader_id);

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_resources_course ON public.resources(course_id);
CREATE INDEX idx_resources_type ON public.resources(type);
CREATE INDEX idx_resources_status ON public.resources(status);
CREATE INDEX idx_resources_tags ON public.resources USING GIN(tags);

-- Reports table
CREATE TYPE public.report_status AS ENUM ('open', 'reviewed', 'dismissed');

CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status report_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can create reports" ON public.reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  student_id TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles table (for admin access)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin can read all reports
CREATE POLICY "Admins can read all reports" ON public.reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
-- Admin can update reports
CREATE POLICY "Admins can update reports" ON public.reports FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
-- Admin can manage all resources
CREATE POLICY "Admins can update any resource" ON public.resources FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete any resource" ON public.resources FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
-- Admin can read all resources including non-active
CREATE POLICY "Admins can read all resources" ON public.resources FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for resource files
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);

CREATE POLICY "Anyone can view resource files" ON storage.objects FOR SELECT USING (bucket_id = 'resources');
CREATE POLICY "Authenticated users can upload resource files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'resources' AND
  (storage.extension(name) = 'pdf' OR storage.extension(name) = 'png' OR storage.extension(name) = 'jpg' OR storage.extension(name) = 'jpeg') AND
  (octet_length(owner::text) > 0)
);
CREATE POLICY "Users can delete own resource files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resources' AND auth.uid()::text = (storage.foldername(name))[1]);
