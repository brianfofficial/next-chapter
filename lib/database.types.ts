export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      athletes: {
        Row: {
          id: string
          email: string
          full_name: string | null
          sport: string | null
          position: string | null
          school: string | null
          graduation_year: number | null
          gpa: string | null
          major: string | null
          experiences: Json | null
          translated_summary: string | null
          translated_bullets: Json | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          sport?: string | null
          position?: string | null
          school?: string | null
          graduation_year?: number | null
          gpa?: string | null
          major?: string | null
          experiences?: Json | null
          translated_summary?: string | null
          translated_bullets?: Json | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          sport?: string | null
          position?: string | null
          school?: string | null
          graduation_year?: number | null
          gpa?: string | null
          major?: string | null
          experiences?: Json | null
          translated_summary?: string | null
          translated_bullets?: Json | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      employers: {
        Row: {
          id: string
          company_name: string
          industry: string | null
          company_size: string | null
          contact_email: string
          subscription_tier: 'free_trial' | 'basic' | 'pro'
          roles_hiring_for: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          subscription_start_date: string | null
          subscription_end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_name: string
          industry?: string | null
          company_size?: string | null
          contact_email: string
          subscription_tier?: 'free_trial' | 'basic' | 'pro'
          roles_hiring_for?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          industry?: string | null
          company_size?: string | null
          contact_email?: string
          subscription_tier?: 'free_trial' | 'basic' | 'pro'
          roles_hiring_for?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_athletes: {
        Row: {
          id: string
          employer_id: string
          athlete_id: string
          notes: string | null
          saved_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          athlete_id: string
          notes?: string | null
          saved_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          athlete_id?: string
          notes?: string | null
          saved_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          employer_id: string
          athlete_id: string
          last_message_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          athlete_id: string
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          athlete_id?: string
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          sender_type: 'employer' | 'athlete'
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          sender_type: 'employer' | 'athlete'
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          sender_type?: 'employer' | 'athlete'
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
      athletic_departments: {
        Row: {
          id: string
          name: string
          school_name: string
          division: string | null
          conference: string | null
          athletic_director_name: string | null
          contact_email: string
          contact_phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          website_url: string | null
          logo_url: string | null
          subscription_tier: 'trial' | 'standard' | 'enterprise'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          max_teams: number
          max_coaches: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          school_name: string
          division?: string | null
          conference?: string | null
          athletic_director_name?: string | null
          contact_email: string
          contact_phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          website_url?: string | null
          logo_url?: string | null
          subscription_tier?: 'trial' | 'standard' | 'enterprise'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          max_teams?: number
          max_coaches?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          school_name?: string
          division?: string | null
          conference?: string | null
          athletic_director_name?: string | null
          contact_email?: string
          contact_phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          website_url?: string | null
          logo_url?: string | null
          subscription_tier?: 'trial' | 'standard' | 'enterprise'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          max_teams?: number
          max_coaches?: number
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          department_id: string
          sport: string
          gender: 'mens' | 'womens' | 'coed' | null
          season: string | null
          head_coach_name: string | null
          coach_email: string | null
          coach_phone: string | null
          roster_size: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          department_id: string
          sport: string
          gender?: 'mens' | 'womens' | 'coed' | null
          season?: string | null
          head_coach_name?: string | null
          coach_email?: string | null
          coach_phone?: string | null
          roster_size?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          department_id?: string
          sport?: string
          gender?: 'mens' | 'womens' | 'coed' | null
          season?: string | null
          head_coach_name?: string | null
          coach_email?: string | null
          coach_phone?: string | null
          roster_size?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      department_admins: {
        Row: {
          id: string
          department_id: string
          user_id: string
          role: 'athletic_director' | 'head_coach' | 'assistant_coach' | 'admin'
          team_id: string | null
          full_name: string
          email: string
          permissions: Json
          active: boolean
          invited_at: string
          accepted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          department_id: string
          user_id: string
          role: 'athletic_director' | 'head_coach' | 'assistant_coach' | 'admin'
          team_id?: string | null
          full_name: string
          email: string
          permissions?: Json
          active?: boolean
          invited_at?: string
          accepted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          department_id?: string
          user_id?: string
          role?: 'athletic_director' | 'head_coach' | 'assistant_coach' | 'admin'
          team_id?: string | null
          full_name?: string
          email?: string
          permissions?: Json
          active?: boolean
          invited_at?: string
          accepted_at?: string | null
          created_at?: string
        }
      }
      team_rosters: {
        Row: {
          id: string
          team_id: string
          athlete_id: string
          jersey_number: string | null
          position: string | null
          year: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate' | null
          captain: boolean
          join_date: string | null
          departure_date: string | null
          status: 'active' | 'injured' | 'graduated' | 'transferred'
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          athlete_id: string
          jersey_number?: string | null
          position?: string | null
          year?: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate' | null
          captain?: boolean
          join_date?: string | null
          departure_date?: string | null
          status?: 'active' | 'injured' | 'graduated' | 'transferred'
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          athlete_id?: string
          jersey_number?: string | null
          position?: string | null
          year?: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate' | null
          captain?: boolean
          join_date?: string | null
          departure_date?: string | null
          status?: 'active' | 'injured' | 'graduated' | 'transferred'
          created_at?: string
        }
      }
      pipeline_stages: {
        Row: {
          id: string
          employer_id: string
          name: string
          description: string | null
          order_index: number
          color: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          name: string
          description?: string | null
          order_index?: number
          color?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          name?: string
          description?: string | null
          order_index?: number
          color?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pipeline_candidates: {
        Row: {
          id: string
          employer_id: string
          athlete_id: string
          stage_id: string
          position_title: string | null
          salary_range: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          rating: number | null
          notes: string | null
          added_by: string | null
          added_at: string
          last_stage_change: string
          expected_start_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          athlete_id: string
          stage_id: string
          position_title?: string | null
          salary_range?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          rating?: number | null
          notes?: string | null
          added_by?: string | null
          added_at?: string
          last_stage_change?: string
          expected_start_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          athlete_id?: string
          stage_id?: string
          position_title?: string | null
          salary_range?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          rating?: number | null
          notes?: string | null
          added_by?: string | null
          added_at?: string
          last_stage_change?: string
          expected_start_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pipeline_history: {
        Row: {
          id: string
          candidate_id: string
          from_stage_id: string | null
          to_stage_id: string
          changed_by: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          from_stage_id?: string | null
          to_stage_id: string
          changed_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          from_stage_id?: string | null
          to_stage_id?: string
          changed_by?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      interviews: {
        Row: {
          id: string
          candidate_id: string
          stage_id: string
          scheduled_at: string | null
          duration_minutes: number
          interview_type: 'phone_screen' | 'video' | 'in_person' | 'panel' | 'technical' | null
          interviewer_name: string | null
          interviewer_email: string | null
          location: string | null
          meeting_link: string | null
          status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          feedback: string | null
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          stage_id: string
          scheduled_at?: string | null
          duration_minutes?: number
          interview_type?: 'phone_screen' | 'video' | 'in_person' | 'panel' | 'technical' | null
          interviewer_name?: string | null
          interviewer_email?: string | null
          location?: string | null
          meeting_link?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          feedback?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          stage_id?: string
          scheduled_at?: string | null
          duration_minutes?: number
          interview_type?: 'phone_screen' | 'video' | 'in_person' | 'panel' | 'technical' | null
          interviewer_name?: string | null
          interviewer_email?: string | null
          location?: string | null
          meeting_link?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          feedback?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          user_type: 'employer' | 'athlete' | 'department_admin' | 'anonymous' | null
          event_type: string
          event_name: string
          properties: Json
          page_url: string | null
          referrer: string | null
          user_agent: string | null
          ip_address: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_type?: 'employer' | 'athlete' | 'department_admin' | 'anonymous' | null
          event_type: string
          event_name: string
          properties?: Json
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          user_type?: 'employer' | 'athlete' | 'department_admin' | 'anonymous' | null
          event_type?: string
          event_name?: string
          properties?: Json
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          session_id?: string | null
          created_at?: string
        }
      }
      analytics_daily_metrics: {
        Row: {
          id: string
          metric_date: string
          employer_id: string | null
          total_page_views: number
          total_profile_views: number
          total_messages_sent: number
          total_athletes_saved: number
          total_searches: number
          unique_visitors: number
          conversion_rate: number | null
          avg_session_duration: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          metric_date: string
          employer_id?: string | null
          total_page_views?: number
          total_profile_views?: number
          total_messages_sent?: number
          total_athletes_saved?: number
          total_searches?: number
          unique_visitors?: number
          conversion_rate?: number | null
          avg_session_duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          metric_date?: string
          employer_id?: string | null
          total_page_views?: number
          total_profile_views?: number
          total_messages_sent?: number
          total_athletes_saved?: number
          total_searches?: number
          unique_visitors?: number
          conversion_rate?: number | null
          avg_session_duration?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      conversion_funnels: {
        Row: {
          id: string
          funnel_name: string
          step_number: number
          step_name: string
          total_entries: number
          total_exits: number
          conversion_rate: number | null
          avg_time_in_step: number | null
          date_tracked: string
          created_at: string
        }
        Insert: {
          id?: string
          funnel_name: string
          step_number: number
          step_name: string
          total_entries?: number
          total_exits?: number
          conversion_rate?: number | null
          avg_time_in_step?: number | null
          date_tracked: string
          created_at?: string
        }
        Update: {
          id?: string
          funnel_name?: string
          step_number?: number
          step_name?: string
          total_entries?: number
          total_exits?: number
          conversion_rate?: number | null
          avg_time_in_step?: number | null
          date_tracked?: string
          created_at?: string
        }
      }
      message_attachments: {
        Row: {
          id: string
          message_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          file_name?: string
          file_type?: string
          file_size?: number
          storage_path?: string
          url?: string
          created_at?: string
        }
      }
      user_presence: {
        Row: {
          user_id: string
          user_type: 'employer' | 'athlete'
          status: 'online' | 'away' | 'offline'
          last_seen: string
          updated_at: string
        }
        Insert: {
          user_id: string
          user_type: 'employer' | 'athlete'
          status?: 'online' | 'away' | 'offline'
          last_seen?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          user_type?: 'employer' | 'athlete'
          status?: 'online' | 'away' | 'offline'
          last_seen?: string
          updated_at?: string
        }
      }
      typing_indicators: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          user_type: 'employer' | 'athlete'
          is_typing: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          user_type: 'employer' | 'athlete'
          is_typing?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          user_type?: 'employer' | 'athlete'
          is_typing?: boolean
          updated_at?: string
        }
      }
      message_reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          user_type: 'employer' | 'athlete'
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          user_type: 'employer' | 'athlete'
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          user_type?: 'employer' | 'athlete'
          emoji?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
