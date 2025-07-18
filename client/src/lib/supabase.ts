import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ibjbxupcqdyfcnvlwblj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliamJ4dXBjcWR5ZmNudmx3YmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NDM5OTcsImV4cCI6MjA0NzQxOTk5N30.wQ0VuIGW9vgFz-cxcpM6KQP0kzGGj6NhJ0ZNPZEJZyQ'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      creators: {
        Row: {
          id: string
          tiktok_username: string
          email: string
          phone: string
          ewallet_type: string
          ewallet_number: string
          total_earnings: number
          video_count: number
          created_at: string
        }
        Insert: {
          id?: string
          tiktok_username: string
          email: string
          phone: string
          ewallet_type: string
          ewallet_number: string
          total_earnings?: number
          video_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          tiktok_username?: string
          email?: string
          phone?: string
          ewallet_type?: string
          ewallet_number?: string
          total_earnings?: number
          video_count?: number
          created_at?: string
        }
      }
      songs: {
        Row: {
          id: string
          title: string
          artist: string
          status: string
          earnings_per_video: number
          duration: string
          file_url: string | null
          spotify_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          artist: string
          status: string
          earnings_per_video?: number
          duration: string
          file_url?: string | null
          spotify_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist?: string
          status?: string
          earnings_per_video?: number
          duration?: string
          file_url?: string | null
          spotify_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      video_submissions: {
        Row: {
          id: string
          creator_id: string
          song_id: string
          tiktok_url: string
          status: 'pending' | 'approved' | 'rejected'
          earnings: number
          admin_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          song_id: string
          tiktok_url: string
          status?: 'pending' | 'approved' | 'rejected'
          earnings?: number
          admin_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          song_id?: string
          tiktok_url?: string
          status?: 'pending' | 'approved' | 'rejected'
          earnings?: number
          admin_notes?: string | null
          created_at?: string
        }
      }
    }
  }
}