-- Create employers table
CREATE TABLE IF NOT EXISTS public.employers (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT,
  contact_email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT DEFAULT 'free_trial' CHECK (subscription_tier IN ('free_trial', 'basic', 'pro')),
  roles_hiring_for TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security for employers
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;

-- Create policies for employers (users can only access their own data)
CREATE POLICY "Employers can view own profile"
  ON public.employers FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Employers can insert own profile"
  ON public.employers FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Employers can update own profile"
  ON public.employers FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Employers can delete own profile"
  ON public.employers FOR DELETE USING (auth.uid() = id);

-- Create updated_at trigger for employers
CREATE TRIGGER set_employers_updated_at
  BEFORE UPDATE ON public.employers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index on contact_email
CREATE INDEX IF NOT EXISTS employers_contact_email_idx ON public.employers(contact_email);

-- Create saved_athletes table (employer's saved athlete list)
CREATE TABLE IF NOT EXISTS public.saved_athletes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES public.employers(id) ON DELETE CASCADE NOT NULL,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(employer_id, athlete_id)
);

-- Enable Row Level Security for saved_athletes
ALTER TABLE public.saved_athletes ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_athletes (employers can only access their own saved athletes)
CREATE POLICY "Employers can view own saved athletes"
  ON public.saved_athletes FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.employers WHERE id = saved_athletes.employer_id)
  );

CREATE POLICY "Employers can save athletes"
  ON public.saved_athletes FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.employers WHERE id = saved_athletes.employer_id)
  );

CREATE POLICY "Employers can unsave athletes"
  ON public.saved_athletes FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM public.employers WHERE id = saved_athletes.employer_id)
  );

-- Create composite index on employer_id and athlete_id for faster lookups
CREATE INDEX IF NOT EXISTS saved_athletes_employer_athlete_idx
  ON public.saved_athletes(employer_id, athlete_id);

-- Add is_public column to athletes table (allows athletes to hide their profile)
ALTER TABLE public.athletes
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Update athletes RLS policy to allow employers to view public profiles
CREATE POLICY "Employers can view public athlete profiles"
  ON public.athletes FOR SELECT
  USING (
    is_public = true AND
    auth.uid() IN (SELECT id FROM public.employers)
  );

-- Create index on is_public for faster filtering
CREATE INDEX IF NOT EXISTS athletes_is_public_idx ON public.athletes(is_public);
