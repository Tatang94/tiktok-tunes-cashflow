import { createClient } from '@supabase/supabase-js'

// Get config from server
export const getSupabaseClient = async () => {
  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    
    if (!config.VITE_SUPABASE_URL || !config.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase configuration not found');
    }
    
    return createClient(config.VITE_SUPABASE_URL, config.VITE_SUPABASE_ANON_KEY);
  } catch (error) {
    console.error('Error getting Supabase client:', error);
    throw error;
  }
};

// Initialize client with environment variables
let supabaseClient: any = null;

export const supabase = new Proxy({}, {
  get: (target, prop) => {
    if (!supabaseClient) {
      // Initialize client on first access
      fetch('/api/config')
        .then(res => res.json())
        .then(config => {
          if (config.VITE_SUPABASE_URL && config.VITE_SUPABASE_ANON_KEY) {
            supabaseClient = createClient(config.VITE_SUPABASE_URL, config.VITE_SUPABASE_ANON_KEY);
          }
        });
    }
    return supabaseClient?.[prop];
  }
});

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