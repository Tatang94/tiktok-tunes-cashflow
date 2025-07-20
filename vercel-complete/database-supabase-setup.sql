-- TikTok Creator Platform Database Setup for Supabase
-- Updated schema with referral system and Rp 500 bonus

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS video_submissions CASCADE;
DROP TABLE IF EXISTS songs CASCADE;
DROP TABLE IF EXISTS creators CASCADE;

-- Create creators table with referral fields
CREATE TABLE creators (
    id SERIAL PRIMARY KEY,
    tiktok_username TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    ewallet_type TEXT NOT NULL,
    ewallet_number TEXT NOT NULL,
    total_earnings NUMERIC(10, 2) DEFAULT 0,
    video_count INTEGER DEFAULT 0,
    referral_code TEXT,
    referred_by INTEGER REFERENCES creators(id),
    referral_earnings NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create songs table
CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    earnings_per_video NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create video_submissions table
CREATE TABLE video_submissions (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES creators(id),
    song_id INTEGER REFERENCES songs(id),
    tiktok_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    earnings NUMERIC(10, 2) DEFAULT 0,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create referrals table with updated bonus amount
CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    referrer_id INTEGER REFERENCES creators(id) NOT NULL,
    referred_id INTEGER REFERENCES creators(id) NOT NULL,
    referral_code TEXT NOT NULL,
    bonus_amount NUMERIC(10, 2) DEFAULT 500,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample songs data
INSERT INTO songs (title, artist, earnings_per_video, is_active) VALUES
('Trending Beat #1', 'TikTok Artist', 150.00, true),
('Viral Sound #2', 'Creator Music', 200.00, true),
('Popular Track #3', 'Beat Maker', 100.00, true),
('Dance Remix #4', 'DJ Producer', 175.00, true),
('Catchy Tune #5', 'Sound Creator', 125.00, true);

-- Create indexes for better performance
CREATE INDEX idx_creators_tiktok_username ON creators(tiktok_username);
CREATE INDEX idx_creators_email ON creators(email);
CREATE INDEX idx_creators_referral_code ON creators(referral_code);
CREATE INDEX idx_video_submissions_creator_id ON video_submissions(creator_id);
CREATE INDEX idx_video_submissions_status ON video_submissions(status);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);

-- Enable Row Level Security (RLS) for Supabase
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security needs)
CREATE POLICY "Allow public read access to songs" ON songs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to creators" ON creators FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to creators" ON creators FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to video_submissions" ON video_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to video_submissions" ON video_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to referrals" ON referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to referrals" ON referrals FOR SELECT USING (true);

-- Create function to auto-generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.referral_code := UPPER(REPLACE(NEW.tiktok_username, '@', '')) || '-REF-' || NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate referral code
CREATE TRIGGER trigger_generate_referral_code
    BEFORE INSERT ON creators
    FOR EACH ROW
    EXECUTE FUNCTION generate_referral_code();

-- Create function to handle referral bonus
CREATE OR REPLACE FUNCTION handle_referral_bonus()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referred_by IS NOT NULL THEN
        -- Insert referral record
        INSERT INTO referrals (referrer_id, referred_id, referral_code, bonus_amount)
        SELECT NEW.referred_by, NEW.id, c.referral_code, 500
        FROM creators c WHERE c.id = NEW.referred_by;
        
        -- Update referrer's referral earnings
        UPDATE creators 
        SET referral_earnings = referral_earnings + 500
        WHERE id = NEW.referred_by;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for referral bonus
CREATE TRIGGER trigger_handle_referral_bonus
    AFTER INSERT ON creators
    FOR EACH ROW
    EXECUTE FUNCTION handle_referral_bonus();

-- Sample creator for testing (optional)
INSERT INTO creators (tiktok_username, email, phone, ewallet_type, ewallet_number, total_earnings, video_count) VALUES
('@testcreator', 'test@example.com', '081234567890', 'dana', '081234567890', 1500.00, 15);

COMMENT ON TABLE creators IS 'TikTok creators with referral system';
COMMENT ON TABLE songs IS 'Available songs for video creation';
COMMENT ON TABLE video_submissions IS 'Creator video submissions for approval';
COMMENT ON TABLE referrals IS 'Referral tracking with Rp 500 bonus per successful referral';