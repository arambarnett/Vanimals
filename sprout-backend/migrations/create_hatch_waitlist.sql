-- Migration: Create hatch_waitlist table
-- Created: 2025-11-10
-- Purpose: Support Hatch Day pre-launch waitlist feature

-- Create hatch_waitlist table
CREATE TABLE IF NOT EXISTS hatch_waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  -- Pre-launch action tracking
  strava_connected BOOLEAN DEFAULT FALSE,
  strava_connected_at TIMESTAMPTZ,
  has_prism BOOLEAN DEFAULT FALSE,
  has_premium BOOLEAN DEFAULT FALSE,

  -- Rewards granted
  eggs_granted INT DEFAULT 1,  -- Everyone gets 1 egg on signup
  feed_granted INT DEFAULT 0,   -- Feed earned from actions

  -- Referral system
  referral_code TEXT UNIQUE,
  referral_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_hatch_waitlist_user_id ON hatch_waitlist(user_id);

-- Create index on referral_code for faster referral lookups
CREATE INDEX IF NOT EXISTS idx_hatch_waitlist_referral_code ON hatch_waitlist(referral_code);

-- Enable Row Level Security
ALTER TABLE hatch_waitlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can view and edit their own waitlist entry
CREATE POLICY "Users can view and edit their own waitlist entry"
  ON hatch_waitlist
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can view referral counts of other users (for leaderboard)
CREATE POLICY "Users can view referral counts"
  ON hatch_waitlist
  FOR SELECT
  USING (TRUE);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM hatch_waitlist WHERE referral_code = code) INTO exists;

    -- Exit loop if code is unique
    EXIT WHEN NOT exists;
  END LOOP;

  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-populate waitlist entry on user signup
CREATE OR REPLACE FUNCTION auto_create_waitlist_entry()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO hatch_waitlist (user_id, referral_code, eggs_granted)
  VALUES (NEW.id, generate_referral_code(), 1)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create waitlist entry when user signs up
CREATE TRIGGER on_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_waitlist_entry();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hatch_waitlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update
CREATE TRIGGER update_hatch_waitlist_timestamp
  BEFORE UPDATE ON hatch_waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_hatch_waitlist_updated_at();

COMMENT ON TABLE hatch_waitlist IS 'Waitlist for Hatch Day pre-launch feature';
COMMENT ON COLUMN hatch_waitlist.user_id IS 'Reference to auth.users';
COMMENT ON COLUMN hatch_waitlist.joined_at IS 'When user joined waitlist';
COMMENT ON COLUMN hatch_waitlist.strava_connected IS 'Whether user connected Strava (earns feed)';
COMMENT ON COLUMN hatch_waitlist.strava_connected_at IS 'When user connected Strava';
COMMENT ON COLUMN hatch_waitlist.has_prism IS 'Whether user has purchased 4D Prism';
COMMENT ON COLUMN hatch_waitlist.has_premium IS 'Whether user has premium pass';
COMMENT ON COLUMN hatch_waitlist.eggs_granted IS 'Number of eggs granted (default 1 on signup)';
COMMENT ON COLUMN hatch_waitlist.feed_granted IS 'Amount of feed granted from pre-launch actions';
COMMENT ON COLUMN hatch_waitlist.referral_code IS 'Unique referral code for this user';
COMMENT ON COLUMN hatch_waitlist.referral_count IS 'Number of users who joined via this user''s referral';
