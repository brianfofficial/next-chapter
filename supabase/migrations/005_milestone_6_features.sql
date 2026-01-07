-- Milestone 6: Athletic Department Portal + Hiring Pipeline + Analytics + Enhanced Messaging
-- Migration 005: Comprehensive feature expansion

-- ============================================================================
-- ATHLETIC DEPARTMENT PORTAL
-- ============================================================================

-- Athletic departments (schools/universities that manage multiple teams)
CREATE TABLE IF NOT EXISTS athletic_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school_name TEXT NOT NULL,
  division TEXT, -- NCAA D1, D2, D3, NAIA, etc.
  conference TEXT,
  athletic_director_name TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  website_url TEXT,
  logo_url TEXT,
  subscription_tier TEXT DEFAULT 'trial' CHECK (subscription_tier IN ('trial', 'standard', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT,
  max_teams INTEGER DEFAULT 5,
  max_coaches INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams within athletic departments
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES athletic_departments(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('mens', 'womens', 'coed')),
  season TEXT, -- fall, winter, spring, year-round
  head_coach_name TEXT,
  coach_email TEXT,
  coach_phone TEXT,
  roster_size INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department administrators/coaches with access
CREATE TABLE IF NOT EXISTS department_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES athletic_departments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- references auth.users
  role TEXT NOT NULL CHECK (role IN ('athletic_director', 'head_coach', 'assistant_coach', 'admin')),
  team_id UUID REFERENCES teams(id), -- NULL for athletic director/admin, specific for coaches
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  permissions JSONB DEFAULT '{"can_view_athletes": true, "can_message": false, "can_manage_team": false}',
  active BOOLEAN DEFAULT true,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link athletes to teams (for current team members)
CREATE TABLE IF NOT EXISTS team_rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  jersey_number TEXT,
  position TEXT,
  year TEXT CHECK (year IN ('freshman', 'sophomore', 'junior', 'senior', 'graduate')),
  captain BOOLEAN DEFAULT false,
  join_date DATE,
  departure_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'injured', 'graduated', 'transferred')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, athlete_id)
);

-- ============================================================================
-- HIRING PIPELINE
-- ============================================================================

-- Pipeline stages for tracking candidates through hiring process
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#3b82f6', -- Tailwind blue-500
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athletes in employer's hiring pipeline
CREATE TABLE IF NOT EXISTS pipeline_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES pipeline_stages(id) ON DELETE CASCADE,
  position_title TEXT,
  salary_range TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  added_by UUID, -- user_id of who added to pipeline
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_stage_change TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employer_id, athlete_id)
);

-- Track stage transitions and history
CREATE TABLE IF NOT EXISTS pipeline_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES pipeline_candidates(id) ON DELETE CASCADE,
  from_stage_id UUID REFERENCES pipeline_stages(id),
  to_stage_id UUID NOT NULL REFERENCES pipeline_stages(id),
  changed_by UUID, -- user_id
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview scheduling and notes
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES pipeline_candidates(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES pipeline_stages(id),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 60,
  interview_type TEXT CHECK (interview_type IN ('phone_screen', 'video', 'in_person', 'panel', 'technical')),
  interviewer_name TEXT,
  interviewer_email TEXT,
  location TEXT,
  meeting_link TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ADVANCED ANALYTICS
-- ============================================================================

-- Track user events and actions for analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- NULL for anonymous events
  user_type TEXT CHECK (user_type IN ('employer', 'athlete', 'department_admin', 'anonymous')),
  event_type TEXT NOT NULL, -- page_view, profile_view, message_sent, save_athlete, etc.
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);

-- Aggregated metrics by day for faster reporting
CREATE TABLE IF NOT EXISTS analytics_daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
  total_page_views INTEGER DEFAULT 0,
  total_profile_views INTEGER DEFAULT 0,
  total_messages_sent INTEGER DEFAULT 0,
  total_athletes_saved INTEGER DEFAULT 0,
  total_searches INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2), -- percentage
  avg_session_duration INTEGER, -- seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(metric_date, employer_id)
);

-- Conversion funnel tracking
CREATE TABLE IF NOT EXISTS conversion_funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_name TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  step_name TEXT NOT NULL,
  total_entries INTEGER DEFAULT 0,
  total_exits INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2),
  avg_time_in_step INTEGER, -- seconds
  date_tracked DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(funnel_name, step_number, date_tracked)
);

-- ============================================================================
-- ENHANCED MESSAGING
-- ============================================================================

-- File attachments for messages
CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- mime type
  file_size INTEGER NOT NULL, -- bytes
  storage_path TEXT NOT NULL, -- Supabase storage path
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User presence/online status
CREATE TABLE IF NOT EXISTS user_presence (
  user_id UUID PRIMARY KEY,
  user_type TEXT NOT NULL CHECK (user_type IN ('employer', 'athlete')),
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'away', 'offline')),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Typing indicators (ephemeral, can use for real-time subscriptions)
CREATE TABLE IF NOT EXISTS typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('employer', 'athlete')),
  is_typing BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message reactions (emoji reactions to messages)
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('employer', 'athlete')),
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- ============================================================================
-- INDEXES for performance
-- ============================================================================

-- Athletic Department indexes
CREATE INDEX IF NOT EXISTS idx_teams_department_id ON teams(department_id);
CREATE INDEX IF NOT EXISTS idx_department_admins_department_id ON department_admins(department_id);
CREATE INDEX IF NOT EXISTS idx_department_admins_user_id ON department_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_team_rosters_team_id ON team_rosters(team_id);
CREATE INDEX IF NOT EXISTS idx_team_rosters_athlete_id ON team_rosters(athlete_id);

-- Pipeline indexes
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_employer_id ON pipeline_stages(employer_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_candidates_employer_id ON pipeline_candidates(employer_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_candidates_athlete_id ON pipeline_candidates(athlete_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_candidates_stage_id ON pipeline_candidates(stage_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_candidate_id ON pipeline_history(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_id ON interviews(candidate_id);

-- Messaging indexes
CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_conversation_id ON typing_indicators(conversation_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON message_reactions(message_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE athletic_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Athletic Department policies
CREATE POLICY "Department admins can view their department"
  ON athletic_departments FOR SELECT
  USING (
    id IN (
      SELECT department_id FROM department_admins
      WHERE user_id = auth.uid() AND active = true
    )
  );

CREATE POLICY "Teams visible to department admins"
  ON teams FOR SELECT
  USING (
    department_id IN (
      SELECT department_id FROM department_admins
      WHERE user_id = auth.uid() AND active = true
    )
  );

CREATE POLICY "Department admins can view team rosters"
  ON team_rosters FOR SELECT
  USING (
    team_id IN (
      SELECT t.id FROM teams t
      INNER JOIN department_admins da ON da.department_id = t.department_id
      WHERE da.user_id = auth.uid() AND da.active = true
    )
  );

-- Pipeline policies
CREATE POLICY "Employers can manage their own pipeline stages"
  ON pipeline_stages FOR ALL
  USING (employer_id IN (SELECT id FROM employers WHERE id = auth.uid()));

CREATE POLICY "Employers can manage their pipeline candidates"
  ON pipeline_candidates FOR ALL
  USING (employer_id IN (SELECT id FROM employers WHERE id = auth.uid()));

CREATE POLICY "Employers can view pipeline history"
  ON pipeline_history FOR SELECT
  USING (
    candidate_id IN (
      SELECT id FROM pipeline_candidates WHERE employer_id = auth.uid()
    )
  );

CREATE POLICY "Employers can manage interviews"
  ON interviews FOR ALL
  USING (
    candidate_id IN (
      SELECT id FROM pipeline_candidates WHERE employer_id = auth.uid()
    )
  );

-- Analytics policies (employers can only see their own analytics)
CREATE POLICY "Users can create their own events"
  ON analytics_events FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Employers can view their analytics"
  ON analytics_daily_metrics FOR SELECT
  USING (employer_id = auth.uid());

-- Enhanced messaging policies
CREATE POLICY "Message attachments visible to conversation participants"
  ON message_attachments FOR SELECT
  USING (
    message_id IN (
      SELECT m.id FROM messages m
      INNER JOIN conversations c ON c.id = m.conversation_id
      WHERE c.employer_id = auth.uid() OR c.athlete_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own presence"
  ON user_presence FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Typing indicators visible to conversation participants"
  ON typing_indicators FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE employer_id = auth.uid() OR athlete_id = auth.uid()
    )
  );

CREATE POLICY "Message reactions visible to conversation participants"
  ON message_reactions FOR ALL
  USING (
    message_id IN (
      SELECT m.id FROM messages m
      INNER JOIN conversations c ON c.id = m.conversation_id
      WHERE c.employer_id = auth.uid() OR c.athlete_id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGERS for updated_at timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_athletic_departments_updated_at BEFORE UPDATE ON athletic_departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_stages_updated_at BEFORE UPDATE ON pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_candidates_updated_at BEFORE UPDATE ON pipeline_candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_daily_metrics_updated_at BEFORE UPDATE ON analytics_daily_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_presence_updated_at BEFORE UPDATE ON user_presence
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DEFAULT PIPELINE STAGES for new employers
-- ============================================================================

CREATE OR REPLACE FUNCTION create_default_pipeline_stages()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO pipeline_stages (employer_id, name, description, order_index, color, is_default)
  VALUES
    (NEW.id, 'Discovery', 'Athletes we''re interested in exploring', 1, '#6366f1', true),
    (NEW.id, 'Screening', 'Initial review and phone screening', 2, '#3b82f6', true),
    (NEW.id, 'Interview', 'Scheduled for interview', 3, '#10b981', true),
    (NEW.id, 'Offer', 'Offer extended', 4, '#f59e0b', true),
    (NEW.id, 'Hired', 'Successfully hired', 5, '#22c55e', true),
    (NEW.id, 'Rejected', 'Not a fit at this time', 6, '#ef4444', true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_employer_default_pipeline_stages
  AFTER INSERT ON employers
  FOR EACH ROW
  EXECUTE FUNCTION create_default_pipeline_stages();
