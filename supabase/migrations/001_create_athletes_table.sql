-- Create athletes table
CREATE TABLE IF NOT EXISTS public.athletes (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  sport TEXT,
  position TEXT,
  school TEXT,
  graduation_year INTEGER,
  gpa TEXT,
  major TEXT,
  experiences JSONB DEFAULT '{"leadership": [], "achievements": [], "stats": null}'::jsonb,
  translated_summary TEXT,
  translated_bullets JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
CREATE POLICY "Users can view own athlete profile"
  ON public.athletes
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own data
CREATE POLICY "Users can insert own athlete profile"
  ON public.athletes
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own athlete profile"
  ON public.athletes
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own data
CREATE POLICY "Users can delete own athlete profile"
  ON public.athletes
  FOR DELETE
  USING (auth.uid() = id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.athletes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS athletes_email_idx ON public.athletes(email);
