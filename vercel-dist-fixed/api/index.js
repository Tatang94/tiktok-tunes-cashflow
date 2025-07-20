import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method, body } = req;
  const pathParts = url.split('/').filter(Boolean);
  const endpoint = pathParts[1]; // api/[endpoint]

  try {
    // Config endpoint
    if (endpoint === 'config' && method === 'GET') {
      return res.json({
        VITE_SUPABASE_URL: process.env.SUPABASE_URL || '',
        VITE_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ''
      });
    }

    // Creators endpoints
    if (endpoint === 'creators') {
      if (method === 'GET') {
        if (!supabase) {
          return res.status(500).json({ error: "Database not configured" });
        }
        
        const { data: creators, error } = await supabase
          .from('creators')
          .select('*');
        
        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: "Failed to fetch creators" });
        }
        
        return res.json(creators);
      }

      if (method === 'POST') {
        if (!supabase) {
          return res.status(500).json({ error: "Database not configured" });
        }
        
        // Generate referral code
        const referralCode = `REF${Date.now().toString().slice(-6)}`;
        
        const { data: creator, error } = await supabase
          .from('creators')
          .insert([{
            ...body,
            referral_code: referralCode,
            total_earnings: 0,
            video_count: 0
          }])
          .select()
          .single();
        
        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: "Failed to create creator" });
        }
        
        return res.status(201).json(creator);
      }
    }

    // Songs endpoint
    if (endpoint === 'songs' && method === 'GET') {
      if (!supabase) {
        return res.status(500).json({ error: "Database not configured" });
      }
      
      const { data: songs, error } = await supabase
        .from('songs')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: "Failed to fetch songs" });
      }
      
      return res.json(songs);
    }

    // Route not found
    return res.status(404).json({ error: "Route not found" });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}