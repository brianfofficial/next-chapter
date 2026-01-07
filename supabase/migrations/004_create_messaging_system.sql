-- Milestone 5: In-App Messaging System
-- Creates conversations and messages tables with RLS policies

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employer_id, athlete_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('employer', 'athlete')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversations_employer ON conversations(employer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_athlete ON conversations(athlete_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(conversation_id, is_read) WHERE is_read = FALSE;

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
-- Employers can see conversations they're part of
CREATE POLICY "Employers can view their conversations"
  ON conversations
  FOR SELECT
  USING (employer_id = auth.uid());

-- Athletes can see conversations they're part of
CREATE POLICY "Athletes can view their conversations"
  ON conversations
  FOR SELECT
  USING (athlete_id = auth.uid());

-- Employers can create conversations with athletes
CREATE POLICY "Employers can create conversations"
  ON conversations
  FOR INSERT
  WITH CHECK (employer_id = auth.uid());

-- Update conversation timestamp (both participants can update)
CREATE POLICY "Participants can update conversation"
  ON conversations
  FOR UPDATE
  USING (employer_id = auth.uid() OR athlete_id = auth.uid());

-- RLS Policies for messages
-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
  ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.employer_id = auth.uid() OR conversations.athlete_id = auth.uid())
    )
  );

-- Users can send messages in their conversations
CREATE POLICY "Users can send messages in their conversations"
  ON messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND (
        (conversations.employer_id = auth.uid() AND sender_type = 'employer' AND sender_id = auth.uid())
        OR
        (conversations.athlete_id = auth.uid() AND sender_type = 'athlete' AND sender_id = auth.uid())
      )
    )
  );

-- Users can mark messages as read (only recipients)
CREATE POLICY "Users can mark messages as read"
  ON messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (
        (conversations.employer_id = auth.uid() AND sender_type = 'athlete')
        OR
        (conversations.athlete_id = auth.uid() AND sender_type = 'employer')
      )
    )
  );

-- Function to update conversation timestamp when new message is sent
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at,
      updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update conversation timestamp
CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();
