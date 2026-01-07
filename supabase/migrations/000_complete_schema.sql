-- Complete Database Schema for Next Chapter
-- Combines all migrations: 001 through 005
-- Safe to run on fresh database or existing database

-- ============================================================================
-- MIGRATION 001: Athletes Table
-- ============================================================================

-- Create athletes table
CREATE TABLE IF NOT EXISTS public.athletes (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  sport text,
  position text,
  school text,
  graduation_year integer,
  gpa numeric,
  athletic_experience jsonb,
  translated_bullets jsonb,
  contact_email text,
  full_name text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on athletes
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Athletes can view their own profile" ON public.athletes;
CREATE POLICY "Athletes can view their own profile" ON public.athletes
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Athletes can update their own profile" ON public.athletes;
CREATE POLICY "Athletes can update their own profile" ON public.athletes
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Athletes can insert their own profile" ON public.athletes;
CREATE POLICY "Athletes can insert their own profile" ON public.athletes
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- MIGRATION 002: Employers Tables
-- ============================================================================

-- Create employers table
CREATE TABLE IF NOT EXISTS public.employers (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  company_name text,
  industry text,
  company_size text,
  contact_email text,
  contact_name text,
  subscription_tier text DEFAULT 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  trial_ends_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on employers
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Employers can view their own profile" ON public.employers;
CREATE POLICY "Employers can view their own profile" ON public.employers
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Employers can update their own profile" ON public.employers;
CREATE POLICY "Employers can update their own profile" ON public.employers
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Employers can insert their own profile" ON public.employers;
CREATE POLICY "Employers can insert their own profile" ON public.employers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create saved_athletes table
CREATE TABLE IF NOT EXISTS public.saved_athletes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES public.employers(id) ON DELETE CASCADE,
  athlete_id uuid REFERENCES public.athletes(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(employer_id, athlete_id)
);

-- Enable RLS on saved_athletes
ALTER TABLE public.saved_athletes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Employers can view their saved athletes" ON public.saved_athletes;
CREATE POLICY "Employers can view their saved athletes" ON public.saved_athletes
  FOR SELECT USING (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Employers can save athletes" ON public.saved_athletes;
CREATE POLICY "Employers can save athletes" ON public.saved_athletes
  FOR INSERT WITH CHECK (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Employers can unsave athletes" ON public.saved_athletes;
CREATE POLICY "Employers can unsave athletes" ON public.saved_athletes
  FOR DELETE USING (auth.uid() = employer_id);

-- ============================================================================
-- MIGRATION 003: Stripe Fields (ensure they exist)
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'employers' AND column_name = 'stripe_customer_id') THEN
    ALTER TABLE public.employers ADD COLUMN stripe_customer_id text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'employers' AND column_name = 'stripe_subscription_id') THEN
    ALTER TABLE public.employers ADD COLUMN stripe_subscription_id text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'employers' AND column_name = 'subscription_status') THEN
    ALTER TABLE public.employers ADD COLUMN subscription_status text;
  END IF;
END $$;

-- ============================================================================
-- MIGRATION 004: Messaging System
-- ============================================================================

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES public.employers(id) ON DELETE CASCADE,
  athlete_id uuid REFERENCES public.athletes(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(employer_id, athlete_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('employer', 'athlete')),
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Employers can view their conversations" ON public.conversations;
CREATE POLICY "Employers can view their conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Athletes can view their conversations" ON public.conversations;
CREATE POLICY "Athletes can view their conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = athlete_id);

DROP POLICY IF EXISTS "Employers can create conversations" ON public.conversations;
CREATE POLICY "Employers can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Conversation participants can view messages" ON public.messages;
CREATE POLICY "Conversation participants can view messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.employer_id = auth.uid() OR conversations.athlete_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Conversation participants can send messages" ON public.messages;
CREATE POLICY "Conversation participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.employer_id = auth.uid() OR conversations.athlete_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Conversation participants can update messages" ON public.messages;
CREATE POLICY "Conversation participants can update messages" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.employer_id = auth.uid() OR conversations.athlete_id = auth.uid())
    )
  );

-- ============================================================================
-- MIGRATION 005: Milestone 6 Features (Enterprise)
-- ============================================================================

-- Athletic Department Portal Tables
CREATE TABLE IF NOT EXISTS public.athletic_departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_name text NOT NULL,
  contact_email text NOT NULL,
  contact_name text,
  subscription_tier text DEFAULT 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES public.athletic_departments(id) ON DELETE CASCADE,
  sport text NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.department_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES public.athletic_departments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('athletic_director', 'head_coach', 'assistant_coach')),
  team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.team_rosters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
  athlete_id uuid REFERENCES public.athletes(id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'alumni')),
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(team_id, athlete_id)
);

-- Hiring Pipeline Tables
CREATE TABLE IF NOT EXISTS public.pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES public.employers(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  order_index integer NOT NULL,
  color text,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(employer_id, name)
);

CREATE TABLE IF NOT EXISTS public.pipeline_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES public.employers(id) ON DELETE CASCADE,
  athlete_id uuid REFERENCES public.athletes(id) ON DELETE CASCADE,
  stage_id uuid REFERENCES public.pipeline_stages(id) ON DELETE CASCADE,
  position_title text,
  salary_range text,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  rating integer CHECK (rating BETWEEN 1 AND 5),
  notes text,
  added_by uuid,
  added_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_stage_change timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  expected_start_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(employer_id, athlete_id)
);

CREATE TABLE IF NOT EXISTS public.pipeline_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.pipeline_candidates(id) ON DELETE CASCADE,
  from_stage_id uuid REFERENCES public.pipeline_stages(id) ON DELETE SET NULL,
  to_stage_id uuid REFERENCES public.pipeline_stages(id) ON DELETE SET NULL,
  changed_by uuid,
  changed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  notes text
);

CREATE TABLE IF NOT EXISTS public.interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.pipeline_candidates(id) ON DELETE CASCADE,
  scheduled_at timestamp with time zone NOT NULL,
  duration_minutes integer,
  interview_type text CHECK (interview_type IN ('phone', 'video', 'in_person', 'technical')),
  interviewer_id uuid,
  notes text,
  feedback text,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Analytics Tables
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_type text CHECK (user_type IN ('employer', 'athlete', 'department_admin', 'anonymous')),
  event_type text NOT NULL,
  event_name text NOT NULL,
  properties jsonb,
  page_url text,
  referrer text,
  user_agent text,
  ip_address text,
  session_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.analytics_daily_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL,
  page_views integer DEFAULT 0,
  profile_views integer DEFAULT 0,
  messages_sent integer DEFAULT 0,
  athletes_saved integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS public.conversion_funnels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  funnel_name text NOT NULL,
  step_name text NOT NULL,
  step_order integer NOT NULL,
  completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enhanced Messaging Tables
CREATE TABLE IF NOT EXISTS public.message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.messages(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  storage_path text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_presence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('employer', 'athlete')),
  status text DEFAULT 'offline' CHECK (status IN ('online', 'away', 'offline')),
  last_seen timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.typing_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('employer', 'athlete')),
  is_typing boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reaction text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(message_id, user_id, reaction)
);

-- Enable RLS on all new tables
ALTER TABLE public.athletic_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Pipeline Tables
DROP POLICY IF EXISTS "Employers can manage their pipeline stages" ON public.pipeline_stages;
CREATE POLICY "Employers can manage their pipeline stages" ON public.pipeline_stages
  FOR ALL USING (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Employers can manage their pipeline candidates" ON public.pipeline_candidates;
CREATE POLICY "Employers can manage their pipeline candidates" ON public.pipeline_candidates
  FOR ALL USING (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Employers can view their pipeline history" ON public.pipeline_history;
CREATE POLICY "Employers can view their pipeline history" ON public.pipeline_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pipeline_candidates
      WHERE pipeline_candidates.id = pipeline_history.candidate_id
      AND pipeline_candidates.employer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Employers can manage interviews" ON public.interviews;
CREATE POLICY "Employers can manage interviews" ON public.interviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pipeline_candidates
      WHERE pipeline_candidates.id = interviews.candidate_id
      AND pipeline_candidates.employer_id = auth.uid()
    )
  );

-- RLS Policies for Analytics Tables
DROP POLICY IF EXISTS "Users can view their own analytics events" ON public.analytics_events;
CREATE POLICY "Users can view their own analytics events" ON public.analytics_events
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own analytics events" ON public.analytics_events;
CREATE POLICY "Users can insert their own analytics events" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can view their own daily metrics" ON public.analytics_daily_metrics;
CREATE POLICY "Users can view their own daily metrics" ON public.analytics_daily_metrics
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own conversion funnels" ON public.conversion_funnels;
CREATE POLICY "Users can view their own conversion funnels" ON public.conversion_funnels
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Enhanced Messaging
DROP POLICY IF EXISTS "Message participants can view attachments" ON public.message_attachments;
CREATE POLICY "Message participants can view attachments" ON public.message_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.messages
      JOIN public.conversations ON conversations.id = messages.conversation_id
      WHERE messages.id = message_attachments.message_id
      AND (conversations.employer_id = auth.uid() OR conversations.athlete_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "All users can view presence" ON public.user_presence;
CREATE POLICY "All users can view presence" ON public.user_presence
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own presence" ON public.user_presence;
CREATE POLICY "Users can update their own presence" ON public.user_presence
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Conversation participants can view typing indicators" ON public.typing_indicators;
CREATE POLICY "Conversation participants can view typing indicators" ON public.typing_indicators
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = typing_indicators.conversation_id
      AND (conversations.employer_id = auth.uid() OR conversations.athlete_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Conversation participants can manage typing indicators" ON public.typing_indicators;
CREATE POLICY "Conversation participants can manage typing indicators" ON public.typing_indicators
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Message participants can view reactions" ON public.message_reactions;
CREATE POLICY "Message participants can view reactions" ON public.message_reactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.messages
      JOIN public.conversations ON conversations.id = messages.conversation_id
      WHERE messages.id = message_reactions.message_id
      AND (conversations.employer_id = auth.uid() OR conversations.athlete_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can add their own reactions" ON public.message_reactions;
CREATE POLICY "Users can add their own reactions" ON public.message_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their own reactions" ON public.message_reactions;
CREATE POLICY "Users can remove their own reactions" ON public.message_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_athletes_employer ON public.saved_athletes(employer_id);
CREATE INDEX IF NOT EXISTS idx_saved_athletes_athlete ON public.saved_athletes(athlete_id);
CREATE INDEX IF NOT EXISTS idx_conversations_employer ON public.conversations(employer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_athlete ON public.conversations(athlete_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_employer ON public.pipeline_stages(employer_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_candidates_employer ON public.pipeline_candidates(employer_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_candidates_athlete ON public.pipeline_candidates(athlete_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_candidates_stage ON public.pipeline_candidates(stage_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_candidate ON public.pipeline_history(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate ON public.interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_metrics_user_date ON public.analytics_daily_metrics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_message_attachments_message ON public.message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_user ON public.user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_conversation ON public.typing_indicators(conversation_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON public.message_reactions(message_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_athletes_updated_at ON public.athletes;
CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON public.athletes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_employers_updated_at ON public.employers;
CREATE TRIGGER update_employers_updated_at BEFORE UPDATE ON public.employers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pipeline_stages_updated_at ON public.pipeline_stages;
CREATE TRIGGER update_pipeline_stages_updated_at BEFORE UPDATE ON public.pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pipeline_candidates_updated_at ON public.pipeline_candidates;
CREATE TRIGGER update_pipeline_candidates_updated_at BEFORE UPDATE ON public.pipeline_candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to auto-create default pipeline stages for new employers
CREATE OR REPLACE FUNCTION create_default_pipeline_stages()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.pipeline_stages (employer_id, name, description, order_index, color, is_default)
  VALUES
    (NEW.id, 'Discovery', 'Athletes we''re interested in exploring', 1, '#6366f1', true),
    (NEW.id, 'Screening', 'Initial review and phone screening', 2, '#3b82f6', true),
    (NEW.id, 'Interview', 'Scheduled for interview', 3, '#10b981', true),
    (NEW.id, 'Offer', 'Offer extended', 4, '#f59e0b', true),
    (NEW.id, 'Hired', 'Successfully hired', 5, '#10b981', true),
    (NEW.id, 'Rejected', 'Not a fit at this time', 6, '#ef4444', true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create pipeline stages
DROP TRIGGER IF EXISTS create_employer_default_pipeline_stages ON public.employers;
CREATE TRIGGER create_employer_default_pipeline_stages
  AFTER INSERT ON public.employers
  FOR EACH ROW
  EXECUTE FUNCTION create_default_pipeline_stages();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'All migrations applied successfully! 19 tables created with full RLS policies.';
END $$;
