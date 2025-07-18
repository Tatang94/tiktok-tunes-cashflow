-- Create the creators table
CREATE TABLE IF NOT EXISTS public.creators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tiktok_username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  ewallet_type VARCHAR(50) NOT NULL,
  ewallet_number VARCHAR(100) NOT NULL,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the songs table
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  earnings_per_video DECIMAL(8,2) DEFAULT 100,
  duration VARCHAR(20) DEFAULT '0:30',
  file_url TEXT,
  spotify_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the video_submissions table
CREATE TABLE IF NOT EXISTS public.video_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  tiktok_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  earnings DECIMAL(8,2) DEFAULT 0,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample songs data
INSERT INTO public.songs (title, artist, status, earnings_per_video, duration, file_url, spotify_url, is_active) VALUES
('Trending Beat #1', 'DJ TikTok', 'Active', 150, '0:30', 'https://example.com/song1.mp3', 'https://open.spotify.com/track/sample1', true),
('Viral Sound #2', 'Viral Artist', 'Active', 200, '0:45', 'https://example.com/song2.mp3', 'https://open.spotify.com/track/sample2', true),
('Popular Track #3', 'Hit Maker', 'Active', 100, '0:30', 'https://example.com/song3.mp3', 'https://open.spotify.com/track/sample3', true),
('Dance Remix #4', 'Beat Master', 'Active', 175, '0:35', 'https://example.com/song4.mp3', 'https://open.spotify.com/track/sample4', true),
('Catchy Tune #5', 'Melody King', 'Active', 125, '0:40', 'https://example.com/song5.mp3', 'https://open.spotify.com/track/sample5', true),
('Upbeat Mix #6', 'Sound Creator', 'Active', 150, '0:30', 'https://example.com/song6.mp3', 'https://open.spotify.com/track/sample6', true)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (optional but recommended)
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust based on your security needs)
CREATE POLICY "Enable read access for all users" ON public.songs FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.creators FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for creators" ON public.creators FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.video_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for video submissions" ON public.video_submissions FOR SELECT USING (true);