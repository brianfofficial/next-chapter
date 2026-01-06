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
