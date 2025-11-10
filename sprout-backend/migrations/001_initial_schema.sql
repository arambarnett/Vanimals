-- Fresh Start: Drop all old tables and create new schema
-- WARNING: This will delete ALL existing data

-- Drop all old tables
DROP TABLE IF EXISTS user_accessories CASCADE;
DROP TABLE IF EXISTS accessories CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS integrations CASCADE;
DROP TABLE IF EXISTS sprouts CASCADE;
DROP TABLE IF EXISTS animals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Now create fresh tables with correct structure
-- ============================================

-- Users table
CREATE TABLE users (
    id TEXT NOT NULL PRIMARY KEY,
    "walletAddress" TEXT NOT NULL UNIQUE,
    "aptosPublicKey" TEXT,
    "socialProvider" TEXT,
    "socialProviderId" TEXT UNIQUE,
    name TEXT,
    email TEXT UNIQUE,
    "profileImage" TEXT,
    experience INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX users_walletAddress_idx ON users("walletAddress");
CREATE INDEX users_socialProviderId_idx ON users("socialProviderId");

-- Sprouts table (one per category)
CREATE TABLE sprouts (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    category TEXT NOT NULL,
    "nftAddress" TEXT NOT NULL UNIQUE,
    "tokenId" TEXT NOT NULL UNIQUE,
    "mintTransactionHash" TEXT NOT NULL,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    rarity TEXT NOT NULL,
    grade TEXT NOT NULL DEFAULT 'Normal',
    level INTEGER NOT NULL DEFAULT 1,
    experience INTEGER NOT NULL DEFAULT 0,
    "healthPoints" INTEGER NOT NULL DEFAULT 100,
    "lastInteraction" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "growthStage" TEXT NOT NULL DEFAULT 'Sprout',
    "sizeMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "isWithering" BOOLEAN NOT NULL DEFAULT false,
    "equippedAccessories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imagePath" TEXT,
    "modelPath" TEXT,
    "colorScheme" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT sprouts_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT sprouts_userId_category_unique UNIQUE ("userId", category)
);

CREATE INDEX sprouts_userId_idx ON sprouts("userId");
CREATE INDEX sprouts_category_idx ON sprouts(category);
CREATE INDEX sprouts_nftAddress_idx ON sprouts("nftAddress");

-- Goals table
CREATE TABLE goals (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sproutId" TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    frequency TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isFailed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "experienceReward" INTEGER NOT NULL DEFAULT 10,
    "pointsReward" INTEGER NOT NULL DEFAULT 5,
    "accessoryReward" TEXT,
    "integrationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT goals_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT goals_sproutId_fkey FOREIGN KEY ("sproutId") REFERENCES sprouts(id) ON DELETE CASCADE
);

CREATE INDEX goals_userId_idx ON goals("userId");
CREATE INDEX goals_sproutId_idx ON goals("sproutId");
CREATE INDEX goals_category_idx ON goals(category);
CREATE INDEX goals_isActive_idx ON goals("isActive");

-- Integrations table
CREATE TABLE integrations (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerAccountId" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSync" TIMESTAMP(3),
    "syncFrequency" TEXT DEFAULT 'daily',
    metadata JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT integrations_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT integrations_userId_provider_unique UNIQUE ("userId", provider)
);

CREATE INDEX integrations_provider_idx ON integrations(provider);

-- Add foreign key to goals for integration
ALTER TABLE goals ADD CONSTRAINT goals_integrationId_fkey
    FOREIGN KEY ("integrationId") REFERENCES integrations(id) ON DELETE SET NULL;

-- Activities table
CREATE TABLE activities (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "goalId" TEXT,
    "integrationId" TEXT,
    type TEXT NOT NULL,
    category TEXT,
    value DOUBLE PRECISION,
    unit TEXT,
    "contributesToGoal" BOOLEAN NOT NULL DEFAULT false,
    "impactType" TEXT,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "experienceEarned" INTEGER NOT NULL DEFAULT 0,
    "externalId" TEXT,
    metadata JSONB,
    "activityDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT activities_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT activities_goalId_fkey FOREIGN KEY ("goalId") REFERENCES goals(id) ON DELETE SET NULL,
    CONSTRAINT activities_integrationId_fkey FOREIGN KEY ("integrationId") REFERENCES integrations(id) ON DELETE SET NULL
);

CREATE INDEX activities_userId_idx ON activities("userId");
CREATE INDEX activities_goalId_idx ON activities("goalId");
CREATE INDEX activities_type_idx ON activities(type);
CREATE INDEX activities_activityDate_idx ON activities("activityDate");

-- Achievements table
CREATE TABLE achievements (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    tier TEXT NOT NULL,
    "imageUrl" TEXT,
    "nftAddress" TEXT,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT achievements_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX achievements_userId_idx ON achievements("userId");
CREATE INDEX achievements_type_idx ON achievements(type);

-- Accessories table
CREATE TABLE accessories (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    rarity TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "modelUrl" TEXT,
    "requirementType" TEXT NOT NULL,
    "requirementValue" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX accessories_category_idx ON accessories(category);
CREATE INDEX accessories_rarity_idx ON accessories(rarity);

-- User Accessories table
CREATE TABLE user_accessories (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accessoryId" TEXT NOT NULL,
    "sproutId" TEXT NOT NULL,
    "isEquipped" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT user_accessories_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT user_accessories_accessoryId_fkey FOREIGN KEY ("accessoryId") REFERENCES accessories(id) ON DELETE CASCADE,
    CONSTRAINT user_accessories_sproutId_fkey FOREIGN KEY ("sproutId") REFERENCES sprouts(id) ON DELETE CASCADE,
    CONSTRAINT user_accessories_userId_accessoryId_unique UNIQUE ("userId", "accessoryId")
);

CREATE INDEX user_accessories_userId_idx ON user_accessories("userId");
CREATE INDEX user_accessories_sproutId_idx ON user_accessories("sproutId");
CREATE INDEX user_accessories_accessoryId_idx ON user_accessories("accessoryId");

-- Seed accessories (24 total: 4 per category)
INSERT INTO accessories (id, name, description, category, rarity, "imageUrl", "requirementType", "requirementValue") VALUES
-- Fitness (4)
('acc_fitness_shoes', 'Running Shoes', 'First steps on your fitness journey', 'fitness', 'Common', '/accessories/running_shoes.png', 'first_goal', 1),
('acc_fitness_headband', 'Fitness Headband', '7-day workout streak', 'fitness', 'Rare', '/accessories/headband.png', 'streak', 7),
('acc_fitness_medal', 'Gold Medal', 'Major fitness milestone', 'fitness', 'Epic', '/accessories/gold_medal.png', 'goal_count', 5),
('acc_fitness_trophy', 'Champion Trophy', 'Fitness legend', 'fitness', 'Legendary', '/accessories/trophy.png', 'goal_count', 20),

-- Finance (4)
('acc_finance_piggy', 'Piggy Bank', 'First savings goal', 'finance', 'Common', '/accessories/piggy_bank.png', 'first_goal', 1),
('acc_finance_coins', 'Gold Coins', 'Saved $5,000', 'finance', 'Rare', '/accessories/gold_coins.png', 'total_value', 5000),
('acc_finance_ticker', 'Stock Ticker', 'Investment goal', 'finance', 'Epic', '/accessories/ticker.png', 'goal_count', 5),
('acc_finance_crown', 'Diamond Crown', '$50K saved', 'finance', 'Legendary', '/accessories/crown.png', 'total_value', 50000),

-- Education (4)
('acc_edu_cap', 'Graduation Cap', 'First course completed', 'education', 'Common', '/accessories/grad_cap.png', 'first_goal', 1),
('acc_edu_books', 'Book Stack', '10 books read', 'education', 'Rare', '/accessories/books.png', 'goal_count', 10),
('acc_edu_diploma', 'Diploma', 'Certification earned', 'education', 'Epic', '/accessories/diploma.png', 'goal_count', 5),
('acc_edu_glasses', 'Wise Glasses', '100 hours learning', 'education', 'Legendary', '/accessories/glasses.png', 'total_value', 100),

-- Faith (4)
('acc_faith_beads', 'Prayer Beads', '30-day prayer streak', 'faith', 'Common', '/accessories/beads.png', 'streak', 30),
('acc_faith_halo', 'Halo', 'Devotional completed', 'faith', 'Rare', '/accessories/halo.png', 'goal_count', 3),
('acc_faith_bible', 'Holy Book', '100 days reading', 'faith', 'Epic', '/accessories/bible.png', 'streak', 100),
('acc_faith_candle', 'Divine Candle', 'Year-long journey', 'faith', 'Legendary', '/accessories/candle.png', 'streak', 365),

-- Screen Time (4)
('acc_screen_mask', 'Eye Mask', 'First week reduced screen time', 'screentime', 'Common', '/accessories/eye_mask.png', 'streak', 7),
('acc_screen_stone', 'Zen Stone', '30 days digital wellness', 'screentime', 'Rare', '/accessories/zen_stone.png', 'streak', 30),
('acc_screen_cushion', 'Meditation Cushion', '90 days balance', 'screentime', 'Epic', '/accessories/cushion.png', 'streak', 90),
('acc_screen_badge', 'Freedom Badge', '50% screen time reduction', 'screentime', 'Legendary', '/accessories/freedom.png', 'total_value', 50),

-- Work (4)
('acc_work_briefcase', 'Briefcase', 'First work goal', 'work', 'Common', '/accessories/briefcase.png', 'first_goal', 1),
('acc_work_coffee', 'Coffee Mug', '100 tasks done', 'work', 'Rare', '/accessories/coffee.png', 'goal_count', 100),
('acc_work_trophy', 'Project Trophy', 'Major project shipped', 'work', 'Epic', '/accessories/work_trophy.png', 'goal_count', 10),
('acc_work_suit', 'Power Suit', 'Year productivity streak', 'work', 'Legendary', '/accessories/suit.png', 'streak', 365);

SELECT 'Fresh database created successfully! 🎉' as status,
       (SELECT COUNT(*) FROM users) as users_count,
       (SELECT COUNT(*) FROM sprouts) as sprouts_count,
       (SELECT COUNT(*) FROM goals) as goals_count,
       (SELECT COUNT(*) FROM accessories) as accessories_count;
