-- Create hatch_waitlist table for Hatch Day pre-launch feature
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS hatch_waitlist (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT UNIQUE NOT NULL,

  joined_at TIMESTAMPTZ DEFAULT NOW(),

  -- Pre-launch action tracking
  strava_connected BOOLEAN DEFAULT FALSE,
  strava_connected_at TIMESTAMPTZ,
  has_prism BOOLEAN DEFAULT FALSE,
  has_premium BOOLEAN DEFAULT FALSE,

  -- Rewards granted
  eggs_granted INTEGER DEFAULT 1,  -- Everyone gets 1 egg on signup
  feed_granted INTEGER DEFAULT 0,   -- Feed earned from actions

  -- Referral system
  referral_code TEXT UNIQUE NOT NULL,
  referral_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_hatch_waitlist_user_id ON hatch_waitlist(user_id);
CREATE INDEX IF NOT EXISTS idx_hatch_waitlist_referral_code ON hatch_waitlist(referral_code);

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

-- Test: Insert a sample record
-- Uncomment to test:
-- INSERT INTO hatch_waitlist (user_id, referral_code)
-- VALUES ('test-user-123', generate_referral_code());

-- Verify table was created
SELECT 'hatch_waitlist table created successfully!' AS status;
SELECT * FROM hatch_waitlist LIMIT 5;
