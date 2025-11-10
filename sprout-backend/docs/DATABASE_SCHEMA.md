# Sprouts Database Schema Documentation

## Overview

The Sprouts database uses PostgreSQL (hosted on Supabase) and follows a category-based system where each user can have up to 6 Sprouts (one per goal category). Each Sprout tracks multiple goals within that category and earns accessories as rewards.

---

## Core Concepts

### 1. Category-Based System
- **One Sprout = One Goal Category**
- Each user can have max 6 Sprouts (one per category)
- Categories: `fitness`, `finance`, `education`, `faith`, `screentime`, `work`

### 2. Goals & Progress
- Each Sprout tracks **multiple goals** within its category
- Sprout health is calculated from active goals progress
- Completing goals earns XP and unlocks accessories

### 3. Accessories as Rewards
- Cosmetic items earned by achieving goals
- Each category has unique accessories
- Can be equipped on Sprouts in AR view

---

## Table Reference

### Users Table
**Purpose:** Store user accounts and profile data

```sql
users (
  id TEXT PRIMARY KEY,                    -- Unique user ID (cuid)
  walletAddress TEXT UNIQUE NOT NULL,     -- Aptos wallet address
  aptosPublicKey TEXT,                    -- Public key for transactions
  socialProvider TEXT,                    -- 'google', 'apple', 'facebook'
  socialProviderId TEXT UNIQUE,           -- ID from social provider
  name TEXT,                              -- User's display name
  email TEXT UNIQUE,                      -- Email address
  profileImage TEXT,                      -- Avatar URL
  experience INT DEFAULT 0,               -- Total XP earned
  level INT DEFAULT 1,                    -- User level (1-100)
  totalPoints INT DEFAULT 0,              -- Lifetime points
  streak INT DEFAULT 0,                   -- Current daily streak
  lastActiveAt TIMESTAMP DEFAULT NOW,     -- Last app usage
  createdAt TIMESTAMP DEFAULT NOW,
  updatedAt TIMESTAMP DEFAULT NOW
)
```

**Relationships:**
- Has many: `sprouts`, `goals`, `integrations`, `activities`, `achievements`, `user_accessories`

**Business Logic:**
- Users authenticate with Aptos Keyless (Google/Apple social login)
- Wallet address is generated deterministically from social ID
- Level increases every 1000 XP

---

### Sprouts Table
**Purpose:** NFT companions representing goal categories

```sql
sprouts (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,                   -- Owner
  category TEXT NOT NULL,                 -- 'fitness', 'finance', etc.

  -- NFT Data (on-chain)
  nftAddress TEXT UNIQUE NOT NULL,        -- Token object address
  tokenId TEXT UNIQUE NOT NULL,           -- Unique token ID
  mintTransactionHash TEXT NOT NULL,      -- Minting transaction

  -- Sprout Attributes
  name TEXT NOT NULL,                     -- Custom name ("My Dragon")
  species TEXT NOT NULL,                  -- 'Dragon', 'Cat', 'Elephant'
  rarity TEXT NOT NULL,                   -- 'Common', 'Rare', 'Epic', 'Legendary'
  grade TEXT DEFAULT 'Normal',            -- Progression: Normal → Elite → Knight → Commander → Marshal

  -- Stats (off-chain)
  level INT DEFAULT 1,                    -- 1-100
  experience INT DEFAULT 0,               -- XP in current level
  healthPoints INT DEFAULT 100,           -- 0-100 (based on goal progress)
  lastInteraction TIMESTAMP DEFAULT NOW,

  -- Growth
  growthStage TEXT DEFAULT 'Sprout',      -- Sprout → Seedling → Plant → Tree
  sizeMultiplier FLOAT DEFAULT 1.0,       -- Visual size in AR (1.0 - 2.0)
  isWithering BOOLEAN DEFAULT false,      -- Health < 30

  -- Accessories
  equippedAccessories TEXT[],             -- Array of accessory IDs

  -- Visuals
  imagePath TEXT,                         -- 2D image URL
  modelPath TEXT,                         -- 3D model URL
  colorScheme TEXT,                       -- Hex color for customization

  createdAt TIMESTAMP DEFAULT NOW,
  updatedAt TIMESTAMP DEFAULT NOW,

  UNIQUE (userId, category),              -- One per category per user
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
)
```

**Relationships:**
- Belongs to: `users`
- Has many: `goals`, `user_accessories`

**Business Logic:**
- Minted on Aptos blockchain when user creates category
- Health calculated daily from active goals progress
- Levels up every 100 XP
- Grade evolves at levels: 10 (Elite), 20 (Knight), 30 (Commander), 50 (Marshal)
- Growth stage changes with level + health

**Health Calculation:**
```typescript
health = (sum of all active goals progress) / (number of active goals)
if (health >= 80) status = "Excellent"
if (health >= 60) status = "Good"
if (health >= 40) status = "Okay"
if (health >= 20) status = "Warning"
if (health < 20) status = "Critical" + isWithering = true
```

---

### Goals Table
**Purpose:** User's specific objectives within a category

```sql
goals (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  sproutId TEXT NOT NULL,                 -- Which Sprout tracks this

  title TEXT NOT NULL,                    -- "Run 20 miles this week"
  description TEXT,                       -- Optional details
  category TEXT NOT NULL,                 -- Must match sprout category
  subcategory TEXT,                       -- 'running', 'savings', etc.

  -- Metrics
  targetValue FLOAT NOT NULL,             -- 20 (miles), 1000 (dollars)
  currentValue FLOAT DEFAULT 0,           -- Progress so far
  unit TEXT NOT NULL,                     -- 'miles', 'USD', 'hours'

  -- Time
  frequency TEXT NOT NULL,                -- 'daily', 'weekly', 'monthly', 'one-time'
  startDate TIMESTAMP DEFAULT NOW,
  endDate TIMESTAMP,                      -- Deadline

  -- Status
  isActive BOOLEAN DEFAULT true,
  isCompleted BOOLEAN DEFAULT false,
  isFailed BOOLEAN DEFAULT false,
  completedAt TIMESTAMP,
  failedAt TIMESTAMP,

  -- Rewards
  experienceReward INT DEFAULT 10,        -- XP on completion
  pointsReward INT DEFAULT 5,             -- Points on completion
  accessoryReward TEXT,                   -- Accessory ID to unlock

  integrationId TEXT,                     -- Data source (Strava, Plaid, etc.)

  createdAt TIMESTAMP DEFAULT NOW,
  updatedAt TIMESTAMP DEFAULT NOW,

  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sproutId) REFERENCES sprouts(id) ON DELETE CASCADE,
  FOREIGN KEY (integrationId) REFERENCES integrations(id) ON DELETE SET NULL
)
```

**Relationships:**
- Belongs to: `users`, `sprouts`, `integrations` (optional)
- Has many: `activities`

**Business Logic:**
- Goals auto-update from integrations (Strava, Plaid, etc.)
- Manual logging also supported
- Completed goals grant XP to Sprout + unlock accessories
- Failed goals mark Sprout as withering
- One goal can have one accessory reward

**Goal Types by Category:**
```javascript
fitness: {
  units: ['miles', 'km', 'count', 'minutes', 'calories'],
  examples: ['Run 20 miles/week', '10k steps daily', '3 workouts/week']
}

finance: {
  units: ['USD', 'percentage'],
  examples: ['Save $1000/month', 'Reduce spending by 20%', 'Invest $500']
}

education: {
  units: ['hours', 'courses', 'count'],
  examples: ['Study 10 hours/week', 'Complete 2 courses', 'Read 2 books']
}

faith: {
  units: ['minutes', 'count', 'days'],
  examples: ['Pray 15 min daily', 'Attend service weekly', 'Read scripture daily']
}

screentime: {
  units: ['hours', 'minutes', 'percentage'],
  examples: ['< 3 hours daily', 'Reduce by 50%', '< 30 min social media']
}

work: {
  units: ['count', 'hours'],
  examples: ['Close 20 tickets', 'Complete 3 projects', '40 productive hours']
}
```

---

### Integrations Table
**Purpose:** Connected external services for goal tracking

```sql
integrations (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,

  provider TEXT NOT NULL,                 -- 'strava', 'plaid', 'trello', etc.
  providerId TEXT NOT NULL,               -- External user ID
  providerAccountId TEXT,                 -- Account/item ID

  -- OAuth Tokens
  accessToken TEXT,                       -- Encrypted
  refreshToken TEXT,                      -- Encrypted
  expiresAt TIMESTAMP,

  isActive BOOLEAN DEFAULT true,
  lastSync TIMESTAMP,                     -- Last successful sync
  syncFrequency TEXT DEFAULT 'daily',     -- How often to sync
  metadata JSONB,                         -- Provider-specific data

  createdAt TIMESTAMP DEFAULT NOW,
  updatedAt TIMESTAMP DEFAULT NOW,

  UNIQUE (userId, provider),              -- One integration per provider per user
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
)
```

**Relationships:**
- Belongs to: `users`
- Has many: `goals`, `activities`

**Supported Providers:**
```javascript
fitness: ['strava', 'healthkit', 'whoop']
finance: ['plaid', 'coinbase', 'robinhood']
education: ['coursera', 'udemy', 'manual']
faith: ['youversion', 'gps', 'manual']
screentime: ['ios_screentime', 'android_wellbeing', 'manual']
work: ['trello', 'jira', 'asana', 'github']
```

---

### Activities Table
**Purpose:** Log of user actions that contribute to goals

```sql
activities (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  goalId TEXT,                            -- Which goal this affects
  integrationId TEXT,                     -- Source of data

  type TEXT NOT NULL,                     -- 'workout', 'transaction', 'task'
  category TEXT,                          -- 'run', 'deposit', 'ticket_closed'

  value FLOAT,                            -- Distance, amount, duration
  unit TEXT,                              -- 'miles', 'USD', 'minutes'

  contributesToGoal BOOLEAN DEFAULT false,
  impactType TEXT,                        -- 'positive', 'negative'
  pointsEarned INT DEFAULT 0,
  experienceEarned INT DEFAULT 0,

  externalId TEXT,                        -- ID from Strava/Plaid/etc.
  metadata JSONB,                         -- Raw data from provider

  activityDate TIMESTAMP DEFAULT NOW,     -- When activity occurred
  createdAt TIMESTAMP DEFAULT NOW,

  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (goalId) REFERENCES goals(id) ON DELETE SET NULL,
  FOREIGN KEY (integrationId) REFERENCES integrations(id) ON DELETE SET NULL
)
```

**Relationships:**
- Belongs to: `users`, `goals` (optional), `integrations` (optional)

**Business Logic:**
- Activities auto-created from integration syncs
- Can be manually logged by user
- Updates goal progress when `contributesToGoal = true`
- Grants XP to user and Sprout

**Example Activity Types:**
```javascript
fitness: {
  type: 'workout',
  categories: ['run', 'ride', 'swim', 'walk', 'strength'],
  value: distance or duration,
  unit: 'miles' or 'minutes'
}

finance: {
  type: 'transaction',
  categories: ['deposit', 'withdrawal', 'purchase', 'investment'],
  value: amount,
  unit: 'USD'
}
```

---

### Accessories Table
**Purpose:** Catalog of unlockable cosmetic items

```sql
accessories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,                     -- "Running Shoes"
  description TEXT NOT NULL,              -- "First steps on your journey"
  category TEXT NOT NULL,                 -- Which Sprout category
  rarity TEXT NOT NULL,                   -- 'Common', 'Rare', 'Epic', 'Legendary'

  imageUrl TEXT NOT NULL,                 -- 2D icon
  modelUrl TEXT,                          -- 3D model for AR

  -- Unlock Requirements
  requirementType TEXT NOT NULL,          -- 'first_goal', 'goal_count', 'streak', 'total_value'
  requirementValue FLOAT DEFAULT 1,       -- How many goals/days/amount

  createdAt TIMESTAMP DEFAULT NOW,
  updatedAt TIMESTAMP DEFAULT NOW
)
```

**Relationships:**
- Has many: `user_accessories`

**Seeded Accessories (24 total):**
```javascript
fitness: [
  { name: 'Running Shoes', rarity: 'Common', requirement: 'first_goal' },
  { name: 'Fitness Headband', rarity: 'Rare', requirement: '7-day streak' },
  { name: 'Gold Medal', rarity: 'Epic', requirement: '5 goals' },
  { name: 'Champion Trophy', rarity: 'Legendary', requirement: '20 goals' }
]

// Similar structure for finance, education, faith, screentime, work
```

**Requirement Types:**
- `first_goal`: Complete first goal in category
- `goal_count`: Complete N goals
- `streak`: Achieve N-day streak
- `total_value`: Accumulate total value (e.g., $5000 saved, 100 hours studied)

---

### User Accessories Table
**Purpose:** Track which accessories each user has earned

```sql
user_accessories (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  accessoryId TEXT NOT NULL,
  sproutId TEXT NOT NULL,                 -- Which Sprout earned it

  isEquipped BOOLEAN DEFAULT false,       -- Currently visible on Sprout?
  unlockedAt TIMESTAMP DEFAULT NOW,

  UNIQUE (userId, accessoryId),           -- Can't earn same accessory twice
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (accessoryId) REFERENCES accessories(id) ON DELETE CASCADE,
  FOREIGN KEY (sproutId) REFERENCES sprouts(id) ON DELETE CASCADE
)
```

**Relationships:**
- Belongs to: `users`, `accessories`, `sprouts`

**Business Logic:**
- Unlocked automatically when goal with `accessoryReward` is completed
- User can equip/unequip in Sprout customization screen
- Multiple accessories can be equipped simultaneously
- Accessories persist even if Sprout is retired

---

### Achievements Table
**Purpose:** Badges and milestones for user accomplishments

```sql
achievements (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,

  title TEXT NOT NULL,                    -- "First Goal"
  description TEXT NOT NULL,              -- "Completed your first goal"
  type TEXT NOT NULL,                     -- 'streak', 'level', 'goal_completion'
  tier TEXT NOT NULL,                     -- 'bronze', 'silver', 'gold', 'platinum'

  imageUrl TEXT,
  nftAddress TEXT,                        -- If minted as NFT

  unlockedAt TIMESTAMP DEFAULT NOW,
  createdAt TIMESTAMP DEFAULT NOW,

  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
)
```

**Relationships:**
- Belongs to: `users`

**Business Logic:**
- System-wide achievements (not category-specific)
- Examples: "First Goal", "Week Warrior", "Level 10", "30-Day Streak"
- Can be minted as NFTs for special achievements

---

## Table Relationships Diagram

```
users (1) ──┬──< sprouts (6 max)
            │
            ├──< goals
            │
            ├──< integrations
            │
            ├──< activities
            │
            ├──< achievements
            │
            └──< user_accessories

sprouts (1) ──┬──< goals (many)
              │
              └──< user_accessories (many)

goals (1) ────< activities (many)

accessories (1) ──< user_accessories (many)

integrations (1) ──┬──< goals (optional)
                   │
                   └──< activities (optional)
```

---

## Data Flow Examples

### 1. User Creates First Sprout

```
1. User signs in with Google
   → walletAddress generated from Google ID
   → User record created

2. User selects "Fitness" category
   → Chooses "Dragon" species
   → Pays $2.99 to mint

3. Backend mints NFT on Aptos
   → Sprout record created with category='fitness'
   → nftAddress stored

4. User creates first goal: "Run 20 miles/week"
   → Goal record created linked to Sprout
   → accessoryReward = 'acc_fitness_shoes'

5. User connects Strava
   → Integration record created
   → Goal linked to integration
```

### 2. Goal Progress Update

```
1. Strava webhook notifies new activity
   → Activity record created
   → value = 5.2 miles

2. Backend finds matching goal
   → goal.currentValue += 5.2
   → goal.currentValue = 14.2 / 20 (71%)

3. Sprout health updated
   → health = average of all active goals
   → If 71% → healthPoints = 71

4. User gains XP
   → sprout.experience += 5
   → user.experience += 5
```

### 3. Goal Completion

```
1. Goal reaches 100%
   → goal.isCompleted = true
   → goal.completedAt = now()

2. Rewards granted
   → sprout.experience += goal.experienceReward (10)
   → user.totalPoints += goal.pointsReward (5)

3. Accessory unlocked
   → user_accessories record created
   → accessoryId = goal.accessoryReward
   → sproutId = goal.sproutId

4. Check level up
   → If sprout.experience >= 100:
     → sprout.level += 1
     → sprout.experience = 0
     → Check grade evolution

5. Notification sent
   → "Goal completed! Running Shoes unlocked!"
```

### 4. Daily Health Decay (Cron Job)

```
1. Runs at midnight daily
   → Fetches all Sprouts

2. For each Sprout:
   → Calculate health from active goals
   → Update healthPoints
   → Update isWithering (health < 30)

3. Send notifications
   → If isWithering:
     → "Your Dragon needs attention!"
     → Deep link to goals screen
```

---

## Indexes

Performance-critical indexes:

```sql
-- Users
users_walletAddress_idx (walletAddress)
users_socialProviderId_idx (socialProviderId)

-- Sprouts
sprouts_userId_idx (userId)
sprouts_category_idx (category)
sprouts_nftAddress_idx (nftAddress)

-- Goals
goals_userId_idx (userId)
goals_sproutId_idx (sproutId)
goals_category_idx (category)
goals_isActive_idx (isActive)

-- Activities
activities_userId_idx (userId)
activities_goalId_idx (goalId)
activities_activityDate_idx (activityDate)
activities_type_idx (type)

-- Integrations
integrations_provider_idx (provider)

-- Accessories
accessories_category_idx (category)
accessories_rarity_idx (rarity)

-- User Accessories
user_accessories_userId_idx (userId)
user_accessories_sproutId_idx (sproutId)
```

---

## Migrations

Current migration: `migrations/001_initial_schema.sql`

To reset database:
```bash
cd sprout-backend
PGPASSWORD="..." psql -h ... -U ... -d postgres -f migrations/001_initial_schema.sql
```

Archived migrations in: `migrations/archive/`

---

## Best Practices

### 1. ID Generation
- All IDs use `cuid` (Collision-resistant Unique IDs)
- Better than UUID for distributed systems
- Lexicographically sortable

### 2. Timestamps
- Always use `TIMESTAMP(3)` for millisecond precision
- Default to `CURRENT_TIMESTAMP`
- Update `updatedAt` on every change

### 3. Foreign Keys
- Always include `ON DELETE CASCADE` for dependent data
- Use `ON DELETE SET NULL` for optional relations

### 4. Indexes
- Index all foreign keys
- Index frequently queried columns
- Use composite indexes for common query patterns

### 5. Data Types
- TEXT for all string IDs (not VARCHAR)
- DOUBLE PRECISION for numeric values
- JSONB for flexible metadata

---

## Query Examples

### Get User's Dashboard
```sql
SELECT
  s.*,
  COUNT(g.id) FILTER (WHERE g.isActive = true) as active_goals_count,
  AVG(g.currentValue / g.targetValue * 100) as avg_progress
FROM sprouts s
LEFT JOIN goals g ON g.sproutId = s.id
WHERE s.userId = ?
GROUP BY s.id;
```

### Get Sprout with Goals
```sql
SELECT
  s.*,
  json_agg(
    json_build_object(
      'id', g.id,
      'title', g.title,
      'progress', g.currentValue / g.targetValue * 100,
      'isActive', g.isActive
    )
  ) as goals
FROM sprouts s
LEFT JOIN goals g ON g.sproutId = s.id
WHERE s.id = ?
GROUP BY s.id;
```

### Check Accessory Unlock
```sql
-- Check if user earned "Running Shoes" (first fitness goal)
SELECT
  CASE
    WHEN COUNT(g.id) FILTER (WHERE g.isCompleted = true) >= 1
    THEN true
    ELSE false
  END as should_unlock
FROM goals g
JOIN sprouts s ON s.id = g.sproutId
WHERE s.userId = ?
  AND s.category = 'fitness';
```

---

This documentation will be updated as the schema evolves.
