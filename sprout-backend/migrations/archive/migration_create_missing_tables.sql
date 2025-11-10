-- Create only missing tables (users already exists)

-- CreateTable: sprouts
CREATE TABLE IF NOT EXISTS "sprouts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "nftAddress" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "mintTransactionHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "grade" TEXT NOT NULL DEFAULT 'Normal',
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sprouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable: goals
CREATE TABLE IF NOT EXISTS "goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sproutId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable: integrations
CREATE TABLE IF NOT EXISTS "integrations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerAccountId" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSync" TIMESTAMP(3),
    "syncFrequency" TEXT DEFAULT 'daily',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: activities
CREATE TABLE IF NOT EXISTS "activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT,
    "integrationId" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "value" DOUBLE PRECISION,
    "unit" TEXT,
    "contributesToGoal" BOOLEAN NOT NULL DEFAULT false,
    "impactType" TEXT,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "experienceEarned" INTEGER NOT NULL DEFAULT 0,
    "externalId" TEXT,
    "metadata" JSONB,
    "activityDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable: achievements
CREATE TABLE IF NOT EXISTS "achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "imageUrl" TEXT,
    "nftAddress" TEXT,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable: accessories
CREATE TABLE IF NOT EXISTS "accessories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "modelUrl" TEXT,
    "requirementType" TEXT NOT NULL,
    "requirementValue" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accessories_pkey" PRIMARY KEY ("id")
);

-- CreateTable: user_accessories
CREATE TABLE IF NOT EXISTS "user_accessories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessoryId" TEXT NOT NULL,
    "sproutId" TEXT NOT NULL,
    "isEquipped" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_accessories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "sprouts_nftAddress_key" ON "sprouts"("nftAddress");
CREATE UNIQUE INDEX IF NOT EXISTS "sprouts_tokenId_key" ON "sprouts"("tokenId");
CREATE UNIQUE INDEX IF NOT EXISTS "sprouts_userId_category_key" ON "sprouts"("userId", "category");
CREATE INDEX IF NOT EXISTS "sprouts_userId_idx" ON "sprouts"("userId");
CREATE INDEX IF NOT EXISTS "sprouts_category_idx" ON "sprouts"("category");
CREATE INDEX IF NOT EXISTS "sprouts_nftAddress_idx" ON "sprouts"("nftAddress");

CREATE INDEX IF NOT EXISTS "goals_userId_idx" ON "goals"("userId");
CREATE INDEX IF NOT EXISTS "goals_sproutId_idx" ON "goals"("sproutId");
CREATE INDEX IF NOT EXISTS "goals_category_idx" ON "goals"("category");
CREATE INDEX IF NOT EXISTS "goals_isActive_idx" ON "goals"("isActive");

CREATE INDEX IF NOT EXISTS "integrations_provider_idx" ON "integrations"("provider");
CREATE UNIQUE INDEX IF NOT EXISTS "integrations_userId_provider_key" ON "integrations"("userId", "provider");

CREATE INDEX IF NOT EXISTS "activities_userId_idx" ON "activities"("userId");
CREATE INDEX IF NOT EXISTS "activities_goalId_idx" ON "activities"("goalId");
CREATE INDEX IF NOT EXISTS "activities_type_idx" ON "activities"("type");
CREATE INDEX IF NOT EXISTS "activities_activityDate_idx" ON "activities"("activityDate");

CREATE INDEX IF NOT EXISTS "achievements_userId_idx" ON "achievements"("userId");
CREATE INDEX IF NOT EXISTS "achievements_type_idx" ON "achievements"("type");

CREATE INDEX IF NOT EXISTS "accessories_category_idx" ON "accessories"("category");
CREATE INDEX IF NOT EXISTS "accessories_rarity_idx" ON "accessories"("rarity");

CREATE UNIQUE INDEX IF NOT EXISTS "user_accessories_userId_accessoryId_key" ON "user_accessories"("userId", "accessoryId");
CREATE INDEX IF NOT EXISTS "user_accessories_userId_idx" ON "user_accessories"("userId");
CREATE INDEX IF NOT EXISTS "user_accessories_sproutId_idx" ON "user_accessories"("sproutId");
CREATE INDEX IF NOT EXISTS "user_accessories_accessoryId_idx" ON "user_accessories"("accessoryId");

-- AddForeignKey (only if tables exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sprouts') THEN
        ALTER TABLE "sprouts" DROP CONSTRAINT IF EXISTS "sprouts_userId_fkey";
        ALTER TABLE "sprouts" ADD CONSTRAINT "sprouts_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'goals') THEN
        ALTER TABLE "goals" DROP CONSTRAINT IF EXISTS "goals_userId_fkey";
        ALTER TABLE "goals" DROP CONSTRAINT IF EXISTS "goals_sproutId_fkey";
        ALTER TABLE "goals" DROP CONSTRAINT IF EXISTS "goals_integrationId_fkey";

        ALTER TABLE "goals" ADD CONSTRAINT "goals_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        ALTER TABLE "goals" ADD CONSTRAINT "goals_sproutId_fkey"
            FOREIGN KEY ("sproutId") REFERENCES "sprouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        ALTER TABLE "goals" ADD CONSTRAINT "goals_integrationId_fkey"
            FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'integrations') THEN
        ALTER TABLE "integrations" DROP CONSTRAINT IF EXISTS "integrations_userId_fkey";
        ALTER TABLE "integrations" ADD CONSTRAINT "integrations_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'activities') THEN
        ALTER TABLE "activities" DROP CONSTRAINT IF EXISTS "activities_userId_fkey";
        ALTER TABLE "activities" DROP CONSTRAINT IF EXISTS "activities_goalId_fkey";
        ALTER TABLE "activities" DROP CONSTRAINT IF EXISTS "activities_integrationId_fkey";

        ALTER TABLE "activities" ADD CONSTRAINT "activities_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        ALTER TABLE "activities" ADD CONSTRAINT "activities_goalId_fkey"
            FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        ALTER TABLE "activities" ADD CONSTRAINT "activities_integrationId_fkey"
            FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'achievements') THEN
        ALTER TABLE "achievements" DROP CONSTRAINT IF EXISTS "achievements_userId_fkey";
        ALTER TABLE "achievements" ADD CONSTRAINT "achievements_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_accessories') THEN
        ALTER TABLE "user_accessories" DROP CONSTRAINT IF EXISTS "user_accessories_userId_fkey";
        ALTER TABLE "user_accessories" DROP CONSTRAINT IF EXISTS "user_accessories_accessoryId_fkey";
        ALTER TABLE "user_accessories" DROP CONSTRAINT IF EXISTS "user_accessories_sproutId_fkey";

        ALTER TABLE "user_accessories" ADD CONSTRAINT "user_accessories_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        ALTER TABLE "user_accessories" ADD CONSTRAINT "user_accessories_accessoryId_fkey"
            FOREIGN KEY ("accessoryId") REFERENCES "accessories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        ALTER TABLE "user_accessories" ADD CONSTRAINT "user_accessories_sproutId_fkey"
            FOREIGN KEY ("sproutId") REFERENCES "sprouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Seed initial accessories
INSERT INTO accessories (id, name, description, category, rarity, imageUrl, requirementType, requirementValue)
VALUES
    ('acc_fitness_shoes', 'Running Shoes', 'First steps on your fitness journey', 'fitness', 'Common', '/accessories/running_shoes.png', 'first_goal', 1),
    ('acc_fitness_headband', 'Fitness Headband', '7-day workout streak', 'fitness', 'Rare', '/accessories/headband.png', 'streak', 7),
    ('acc_fitness_medal', 'Gold Medal', 'Major fitness milestone', 'fitness', 'Epic', '/accessories/gold_medal.png', 'goal_count', 5),
    ('acc_fitness_trophy', 'Champion Trophy', 'Fitness legend', 'fitness', 'Legendary', '/accessories/trophy.png', 'goal_count', 20),

    ('acc_finance_piggy', 'Piggy Bank', 'First savings goal', 'finance', 'Common', '/accessories/piggy_bank.png', 'first_goal', 1),
    ('acc_finance_coins', 'Gold Coins', 'Saved $5,000', 'finance', 'Rare', '/accessories/gold_coins.png', 'total_value', 5000),
    ('acc_finance_ticker', 'Stock Ticker', 'Investment goal', 'finance', 'Epic', '/accessories/ticker.png', 'goal_count', 5),
    ('acc_finance_crown', 'Diamond Crown', '$50K saved', 'finance', 'Legendary', '/accessories/crown.png', 'total_value', 50000),

    ('acc_edu_cap', 'Graduation Cap', 'First course completed', 'education', 'Common', '/accessories/grad_cap.png', 'first_goal', 1),
    ('acc_edu_books', 'Book Stack', '10 books read', 'education', 'Rare', '/accessories/books.png', 'goal_count', 10),
    ('acc_edu_diploma', 'Diploma', 'Certification earned', 'education', 'Epic', '/accessories/diploma.png', 'goal_count', 5),
    ('acc_edu_glasses', 'Wise Glasses', '100 hours learning', 'education', 'Legendary', '/accessories/glasses.png', 'total_value', 100),

    ('acc_faith_beads', 'Prayer Beads', '30-day prayer streak', 'faith', 'Common', '/accessories/beads.png', 'streak', 30),
    ('acc_faith_halo', 'Halo', 'Devotional completed', 'faith', 'Rare', '/accessories/halo.png', 'goal_count', 3),
    ('acc_faith_bible', 'Holy Book', '100 days reading', 'faith', 'Epic', '/accessories/bible.png', 'streak', 100),
    ('acc_faith_candle', 'Divine Candle', 'Year-long journey', 'faith', 'Legendary', '/accessories/candle.png', 'streak', 365),

    ('acc_screen_mask', 'Eye Mask', 'First week reduced screen time', 'screentime', 'Common', '/accessories/eye_mask.png', 'streak', 7),
    ('acc_screen_stone', 'Zen Stone', '30 days digital wellness', 'screentime', 'Rare', '/accessories/zen_stone.png', 'streak', 30),
    ('acc_screen_cushion', 'Meditation Cushion', '90 days balance', 'screentime', 'Epic', '/accessories/cushion.png', 'streak', 90),
    ('acc_screen_badge', 'Freedom Badge', '50% screen time reduction', 'screentime', 'Legendary', '/accessories/freedom.png', 'total_value', 50),

    ('acc_work_briefcase', 'Briefcase', 'First work goal', 'work', 'Common', '/accessories/briefcase.png', 'first_goal', 1),
    ('acc_work_coffee', 'Coffee Mug', '100 tasks done', 'work', 'Rare', '/accessories/coffee.png', 'goal_count', 100),
    ('acc_work_trophy', 'Project Trophy', 'Major project shipped', 'work', 'Epic', '/accessories/work_trophy.png', 'goal_count', 10),
    ('acc_work_suit', 'Power Suit', 'Year productivity streak', 'work', 'Legendary', '/accessories/suit.png', 'streak', 365)
ON CONFLICT (id) DO NOTHING;

SELECT 'Migration completed successfully! All tables created.' as status;
