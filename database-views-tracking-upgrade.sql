-- Enhanced Schema untuk View Tracking
-- Tambahkan field baru ke video_submissions table

ALTER TABLE video_submissions 
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

ALTER TABLE video_submissions 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

ALTER TABLE video_submissions 
ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;

ALTER TABLE video_submissions 
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

ALTER TABLE video_submissions 
ADD COLUMN IF NOT EXISTS last_view_check TIMESTAMP WITH TIME ZONE;

ALTER TABLE video_submissions 
ADD COLUMN IF NOT EXISTS video_id TEXT; -- TikTok video ID untuk API calls

ALTER TABLE video_submissions 
ADD COLUMN IF NOT EXISTS tracking_status TEXT DEFAULT 'manual' CHECK (tracking_status IN ('manual', 'api_tracked', 'verified'));

-- Table baru untuk tracking views history
CREATE TABLE IF NOT EXISTS public.view_tracking_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_submission_id UUID REFERENCES public.video_submissions(id) ON DELETE CASCADE,
  views_count INTEGER NOT NULL,
  likes_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  earnings_calculated DECIMAL(8,2) DEFAULT 0,
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk performance
CREATE INDEX IF NOT EXISTS idx_view_history_video ON view_tracking_history(video_submission_id);
CREATE INDEX IF NOT EXISTS idx_view_history_tracked_at ON view_tracking_history(tracked_at);

-- Enable RLS untuk table baru
ALTER TABLE public.view_tracking_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for view tracking" ON public.view_tracking_history FOR SELECT USING (true);
CREATE POLICY "Enable insert for view tracking" ON public.view_tracking_history FOR INSERT WITH CHECK (true);