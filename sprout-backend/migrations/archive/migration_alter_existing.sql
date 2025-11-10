-- Migration: Update existing tables for category-based Sprouts system
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Update Sprouts table
-- ============================================

-- Add new columns to sprouts
ALTER TABLE sprouts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE sprouts ADD COLUMN IF NOT EXISTS equippedAccessories TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Remove old columns that are no longer needed
ALTER TABLE sprouts DROP COLUMN IF EXISTS hungerLevel;
ALTER TABLE sprouts DROP COLUMN IF EXISTS happinessLevel;
ALTER TABLE sprouts DROP COLUMN IF EXISTS lastFed;
ALTER TABLE sprouts DROP COLUMN IF EXISTS strength;
ALTER TABLE sprouts DROP COLUMN IF EXISTS intelligence;
ALTER TABLE sprouts DROP COLUMN IF EXISTS speed;
ALTER TABLE sprouts DROP COLUMN IF EXISTS vitality;
ALTER TABLE sprouts DROP COLUMN IF EXISTS isDead;
ALTER TABLE sprouts DROP COLUMN IF EXISTS goalId;

-- Add unique constraint for category per user (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'sprouts_userId_category_key'
    ) THEN
        ALTER TABLE sprouts ADD CONSTRAINT sprouts_userId_category_key UNIQUE (userId, category);
    END IF;
END $$;

-- Create index on category
CREATE INDEX IF NOT EXISTS sprouts_category_idx ON sprouts(category);

-- ============================================
-- 2. Update Goals table
-- ============================================

-- Add new columns to goals
ALTER TABLE goals ADD COLUMN IF NOT EXISTS sproutId TEXT;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS subcategory TEXT;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS accessoryReward TEXT;

-- Rename type to category if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'goals' AND column_name = 'type') THEN
        ALTER TABLE goals RENAME COLUMN type TO category;
    END IF;
END $$;

-- Add foreign key to sprout
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'goals_sproutId_fkey'
    ) THEN
        ALTER TABLE goals ADD CONSTRAINT goals_sproutId_fkey
        FOREIGN KEY (sproutId) REFERENCES sprouts(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create index on sproutId
CREATE INDEX IF NOT EXISTS goals_sproutId_idx ON goals(sproutId);

-- ============================================
-- 3. Create Accessories table
-- ============================================

CREATE TABLE IF NOT EXISTS accessories (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    rarity TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    modelUrl TEXT,
    requirementType TEXT NOT NULL,
    requirementValue DOUBLE PRECISION NOT NULL DEFAULT 1,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS accessories_category_idx ON accessories(category);
CREATE INDEX IF NOT EXISTS accessories_rarity_idx ON accessories(rarity);

-- ============================================
-- 4. Create UserAccessory table
-- ============================================

CREATE TABLE IF NOT EXISTS user_accessories (
    id TEXT NOT NULL PRIMARY KEY,
    userId TEXT NOT NULL,
    accessoryId TEXT NOT NULL,
    sproutId TEXT NOT NULL,
    isEquipped BOOLEAN NOT NULL DEFAULT false,
    unlockedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT user_accessories_userId_accessoryId_key UNIQUE (userId, accessoryId)
);

-- Add foreign keys if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_accessories_userId_fkey') THEN
        ALTER TABLE user_accessories ADD CONSTRAINT user_accessories_userId_fkey
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_accessories_accessoryId_fkey') THEN
        ALTER TABLE user_accessories ADD CONSTRAINT user_accessories_accessoryId_fkey
        FOREIGN KEY (accessoryId) REFERENCES accessories(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_accessories_sproutId_fkey') THEN
        ALTER TABLE user_accessories ADD CONSTRAINT user_accessories_sproutId_fkey
        FOREIGN KEY (sproutId) REFERENCES sprouts(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS user_accessories_userId_idx ON user_accessories(userId);
CREATE INDEX IF NOT EXISTS user_accessories_sproutId_idx ON user_accessories(sproutId);
CREATE INDEX IF NOT EXISTS user_accessories_accessoryId_idx ON user_accessories(accessoryId);

-- ============================================
-- 5. Seed initial accessories
-- ============================================

-- Fitness accessories
INSERT INTO accessories (id, name, description, category, rarity, imageUrl, requirementType, requirementValue)
VALUES
    ('acc_fitness_shoes', 'Running Shoes', 'First steps on your fitness journey', 'fitness', 'Common', '/accessories/running_shoes.png', 'first_goal', 1),
    ('acc_fitness_headband', 'Fitness Headband', 'Earned after 7-day workout streak', 'fitness', 'Rare', '/accessories/headband.png', 'streak', 7),
    ('acc_fitness_medal', 'Gold Medal', 'Completed a major fitness milestone', 'fitness', 'Epic', '/accessories/gold_medal.png', 'goal_count', 5),
    ('acc_fitness_trophy', 'Champion Trophy', 'Fitness legend status', 'fitness', 'Legendary', '/accessories/trophy.png', 'goal_count', 20)
ON CONFLICT (id) DO NOTHING;

-- Finance accessories
INSERT INTO accessories (id, name, description, category, rarity, imageUrl, requirementType, requirementValue)
VALUES
    ('acc_finance_piggy', 'Piggy Bank', 'Your first savings goal completed', 'finance', 'Common', '/accessories/piggy_bank.png', 'first_goal', 1),
    ('acc_finance_coins', 'Gold Coins', 'Saved your first $5,000', 'finance', 'Rare', '/accessories/gold_coins.png', 'total_value', 5000),
    ('acc_finance_ticker', 'Stock Ticker', 'Invested in your future', 'finance', 'Epic', '/accessories/ticker.png', 'goal_count', 5),
    ('acc_finance_crown', 'Diamond Crown', 'Wealthy sprout - $50K saved', 'finance', 'Legendary', '/accessories/crown.png', 'total_value', 50000)
ON CONFLICT (id) DO NOTHING;

-- Education accessories
INSERT INTO accessories (id, name, description, category, rarity, imageUrl, requirementType, requirementValue)
VALUES
    ('acc_edu_cap', 'Graduation Cap', 'Completed first course', 'education', 'Common', '/accessories/grad_cap.png', 'first_goal', 1),
    ('acc_edu_books', 'Book Stack', 'Read 10 books', 'education', 'Rare', '/accessories/books.png', 'goal_count', 10),
    ('acc_edu_diploma', 'Diploma', 'Earned a certification', 'education', 'Epic', '/accessories/diploma.png', 'goal_count', 5),
    ('acc_edu_glasses', 'Wise Glasses', '100 hours of learning', 'education', 'Legendary', '/accessories/glasses.png', 'total_value', 100)
ON CONFLICT (id) DO NOTHING;

-- Faith accessories
INSERT INTO accessories (id, name, description, category, rarity, imageUrl, requirementType, requirementValue)
VALUES
    ('acc_faith_beads', 'Prayer Beads', '30-day prayer streak', 'faith', 'Common', '/accessories/beads.png', 'streak', 30),
    ('acc_faith_halo', 'Halo', 'Completed devotional journey', 'faith', 'Rare', '/accessories/halo.png', 'goal_count', 3),
    ('acc_faith_bible', 'Holy Book', '100 days of reading', 'faith', 'Epic', '/accessories/bible.png', 'streak', 100),
    ('acc_faith_candle', 'Divine Candle', 'Year-long faith journey', 'faith', 'Legendary', '/accessories/candle.png', 'streak', 365)
ON CONFLICT (id) DO NOTHING;

-- Screen time accessories
INSERT INTO accessories (id, name, description, category, rarity, imageUrl, requirementType, requirementValue)
VALUES
    ('acc_screen_mask', 'Eye Mask', 'First week of reduced screen time', 'screentime', 'Common', '/accessories/eye_mask.png', 'streak', 7),
    ('acc_screen_stone', 'Zen Stone', '30 days of digital wellness', 'screentime', 'Rare', '/accessories/zen_stone.png', 'streak', 30),
    ('acc_screen_cushion', 'Meditation Cushion', '90 days of balance', 'screentime', 'Epic', '/accessories/cushion.png', 'streak', 90),
    ('acc_screen_badge', 'Freedom Badge', 'Cut screen time by 50%', 'screentime', 'Legendary', '/accessories/freedom.png', 'total_value', 50)
ON CONFLICT (id) DO NOTHING;

-- Work accessories
INSERT INTO accessories (id, name, description, category, rarity, imageUrl, requirementType, requirementValue)
VALUES
    ('acc_work_briefcase', 'Briefcase', 'Completed first work goal', 'work', 'Common', '/accessories/briefcase.png', 'first_goal', 1),
    ('acc_work_coffee', 'Coffee Mug', '100 tasks completed', 'work', 'Rare', '/accessories/coffee.png', 'goal_count', 100),
    ('acc_work_trophy', 'Project Trophy', 'Shipped major project', 'work', 'Epic', '/accessories/work_trophy.png', 'goal_count', 10),
    ('acc_work_suit', 'Power Suit', 'Year-long productivity streak', 'work', 'Legendary', '/accessories/suit.png', 'streak', 365)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Migration Complete
-- ============================================

SELECT 'Migration completed successfully!' as status;
