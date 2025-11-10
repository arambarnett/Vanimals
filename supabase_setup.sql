-- Sprouts Database Setup for Supabase
-- Run this in Supabase SQL Editor

-- Create Animals table
CREATE TABLE IF NOT EXISTS animals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    privy_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    experience INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    animal_id UUID REFERENCES animals(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Habits table
CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Milestones table
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    achieved BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_frequency VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- Enable Row Level Security
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Animals: Public read access (all users can see available animals)
CREATE POLICY "Animals are viewable by everyone" ON animals
    FOR SELECT USING (true);

-- Users: Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = privy_id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = privy_id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = privy_id);

-- Habits: Users can only see and modify their own habits
CREATE POLICY "Users can view own habits" ON habits
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = habits.user_id 
            AND users.privy_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert own habits" ON habits
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = habits.user_id 
            AND users.privy_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own habits" ON habits
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = habits.user_id 
            AND users.privy_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete own habits" ON habits
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = habits.user_id 
            AND users.privy_id = auth.uid()::text
        )
    );

-- Milestones: Users can only see and modify their own milestones
CREATE POLICY "Users can view own milestones" ON milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = milestones.user_id 
            AND users.privy_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert own milestones" ON milestones
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = milestones.user_id 
            AND users.privy_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own milestones" ON milestones
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = milestones.user_id 
            AND users.privy_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete own milestones" ON milestones
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = milestones.user_id 
            AND users.privy_id = auth.uid()::text
        )
    );

-- Integrations: Users can only see and modify their own integrations
CREATE POLICY "Users can view own integrations" ON integrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = integrations.user_id 
            AND users.privy_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert own integrations" ON integrations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = integrations.user_id 
            AND users.privy_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own integrations" ON integrations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = integrations.user_id 
            AND users.privy_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete own integrations" ON integrations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = integrations.user_id 
            AND users.privy_id = auth.uid()::text
        )
    );

-- Create updated_at trigger for integrations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed initial animals data
INSERT INTO animals (id, name, image_url, created_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Pigeon', 'https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public/animals/pigeon.png', NOW()),
    ('550e8400-e29b-41d4-a716-446655440002', 'Elephant', 'https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public/animals/elephant.png', NOW()),
    ('550e8400-e29b-41d4-a716-446655440003', 'Tiger', 'https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public/animals/tiger.png', NOW()),
    ('550e8400-e29b-41d4-a716-446655440004', 'Penguin', 'https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public/animals/penguin.png', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create test user for development
INSERT INTO users (id, privy_id, email, name, experience, level, animal_id, created_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440010', 'test-user-id', 'test@sprouts.com', 'Sprout Trainer', 1250, 5, '550e8400-e29b-41d4-a716-446655440001', NOW())
ON CONFLICT (privy_id) DO NOTHING;

-- Create test habits (representing user's animal collection)
INSERT INTO habits (id, title, frequency, user_id, created_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440020', 'Cosmic Pigeon (Pigeon) - Level 5 - Common', 'Common', '550e8400-e29b-41d4-a716-446655440010', NOW()),
    ('550e8400-e29b-41d4-a716-446655440021', 'Space Elephant (Elephant) - Level 8 - Rare', 'Rare', '550e8400-e29b-41d4-a716-446655440010', NOW()),
    ('550e8400-e29b-41d4-a716-446655440022', 'Stellar Tiger (Tiger) - Level 12 - Epic', 'Epic', '550e8400-e29b-41d4-a716-446655440010', NOW()),
    ('550e8400-e29b-41d4-a716-446655440023', 'Arctic Penguin (Penguin) - Level 3 - Common', 'Common', '550e8400-e29b-41d4-a716-446655440010', NOW())
ON CONFLICT (id) DO NOTHING;