-- Create tables for TikTok monetization platform

-- Creators table
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tiktok_username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  ewallet_type TEXT NOT NULL,
  ewallet_number TEXT NOT NULL,
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  status TEXT NOT NULL,
  earnings_per_video DECIMAL(10, 2) DEFAULT 100,
  duration TEXT NOT NULL,
  file_url TEXT,
  spotify_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video submissions table
CREATE TABLE IF NOT EXISTS video_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  tiktok_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  earnings DECIMAL(10, 2) DEFAULT 0,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample songs
INSERT INTO songs (title, artist, status, earnings_per_video, duration, file_url, spotify_url) VALUES 
('DJ TikTok Viral', 'BeatMaster', '🔥 Trending', 100, '0:30', 'https://example.com/song1.mp3', 'https://open.spotify.com/track/example1'),
('Chill Vibes Only', 'LofiKing', '✨ Popular', 100, '0:25', 'https://example.com/song2.mp3', 'https://open.spotify.com/track/example2'),
('Beat Drop 2025', 'EDMPro', '🚀 New Hit', 100, '0:20', 'https://example.com/song3.mp3', 'https://open.spotify.com/track/example3');

-- Enable Row Level Security (RLS)
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
-- In production, you would implement proper authentication and authorization

-- Allow public read access to songs
CREATE POLICY "Allow public read access to songs" ON songs
  FOR SELECT USING (true);

-- Allow public read access to creators (might want to restrict this in production)
CREATE POLICY "Allow public read access to creators" ON creators
  FOR SELECT USING (true);

-- Allow public insert to creators (for registration)
CREATE POLICY "Allow public insert to creators" ON creators
  FOR INSERT WITH CHECK (true);

-- Allow public read access to video submissions
CREATE POLICY "Allow public read access to video_submissions" ON video_submissions
  FOR SELECT USING (true);

-- Allow public insert to video submissions
CREATE POLICY "Allow public insert to video_submissions" ON video_submissions
  FOR INSERT WITH CHECK (true);

-- Allow public update to video submissions (for admin approval)
CREATE POLICY "Allow public update to video_submissions" ON video_submissions
  FOR UPDATE USING (true);

-- Allow public update to creators (for earnings updates)
CREATE POLICY "Allow public update to creators" ON creators
  FOR UPDATE USING (true);

-- Allow public insert to songs (for admin)
CREATE POLICY "Allow public insert to songs" ON songs
  FOR INSERT WITH CHECK (true);

-- Allow public update to songs (for admin)
CREATE POLICY "Allow public update to songs" ON songs
  FOR UPDATE USING (true);