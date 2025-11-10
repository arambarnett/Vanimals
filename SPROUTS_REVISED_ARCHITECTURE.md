# Sprouts - Revised Architecture (Category-Based System)

## Core Concept

**One Sprout = One Goal Category**
- Users can have up to 6 Sprouts (one per category)
- Each Sprout tracks ALL goals within that category
- Sprout health tied to cumulative progress across category goals
- Complete goals = earn accessories for your Sprout

---

## Goal Categories & Platform Integrations

### 1. 🏃 Fitness
**Platforms:**
- Strava (primary) - runs, rides, swims
- Apple HealthKit - steps, workouts, heart rate
- Whoop - recovery, strain, sleep

**Example Goals:**
- Run 20 miles this week
- Hit 10,000 steps daily for 30 days
- Complete 12 workouts this month
- Burn 3,000 calories per week

**Accessories Earned:**
- Running Shoes (complete first running goal)
- Fitness Headband (7-day streak)
- Gold Medal (complete marathon)
- Gym Towel (100 workouts logged)

---

### 2. 💰 Finance
**Platforms:**
- Plaid - bank accounts, transactions, savings
- Coinbase - crypto portfolio tracking
- Robinhood - stock portfolio tracking

**Example Goals:**
- Save $1,000 this month
- Keep dining expenses under $200/week
- Invest $500 this month
- Grow net worth by 5% this quarter

**Accessories Earned:**
- Piggy Bank (first savings goal)
- Gold Coins (save $5,000 total)
- Stock Ticker (first investment goal)
- Diamond Crown ($50,000 saved)

---

### 3. 📚 Education
**Platforms:**
- Coursera API - course completion
- Udemy API - course progress
- Khan Academy - learning progress
- Manual logging - study hours, books read

**Example Goals:**
- Complete 2 online courses this quarter
- Study 10 hours per week
- Read 2 books per month
- Finish Python certification

**Accessories Earned:**
- Graduation Cap (first course completed)
- Book Stack (10 books read)
- Diploma (certification earned)
- Glasses (100 hours studied)

---

### 4. 🙏 Faith
**Platforms:**
- YouVersion Bible App - daily reading
- GPS/Location - church/temple visits
- Manual logging - prayer time, devotionals

**Example Goals:**
- Read Bible 15 minutes daily
- Attend service weekly for 12 weeks
- Complete 30-day devotional
- Pray/meditate 10 minutes daily

**Accessories Earned:**
- Prayer Beads (30-day streak)
- Halo (complete devotional)
- Bible (100 days reading)
- Candle (365-day streak)

---

### 5. ⏱️ Screen Time (Reduction)
**Platforms:**
- iOS Screen Time API
- Android Digital Wellbeing
- Manual logging

**Example Goals:**
- Keep total screen time under 3 hours/day
- Limit social media to 30 minutes/day
- No phone after 10pm for 30 days
- Reduce screen time by 25%

**Accessories Earned:**
- Eye Mask (first week success)
- Zen Stone (30-day success)
- Meditation Cushion (90-day success)
- Freedom Badge (50% reduction)

---

### 6. 💼 Work/Productivity
**Platforms:**
- Trello - cards completed, boards managed
- Jira - tickets closed, sprint progress
- Asana - tasks completed, projects finished
- GitHub - commits, PRs merged

**Example Goals:**
- Close 20 tickets this sprint
- Complete 5 projects this quarter
- Maintain 100 commits/month streak
- Finish 3 major features

**Accessories Earned:**
- Briefcase (first goal completed)
- Coffee Mug (100 tasks done)
- Trophy (major project shipped)
- Suit & Tie (1-year work streak)

---

## System Architecture

### Database Schema Updates

```prisma
model Sprout {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id])

  // One Sprout per category
  category String @unique // 'fitness', 'finance', 'education', 'faith', 'screentime', 'work'

  // NFT data
  nftAddress          String @unique
  tokenId             String @unique
  mintTransactionHash String

  // Sprout attributes
  name    String
  species String  // Dragon, Elephant, Bird, etc.
  rarity  String

  // Stats (managed off-chain)
  level              Int      @default(1)
  experience         Int      @default(0)
  healthPoints       Int      @default(100) // 0-100
  lastInteraction    DateTime @default(now())

  // Growth
  growthStage    String  @default("Sprout")
  sizeMultiplier Float   @default(1.0)
  isWithering    Boolean @default(false)

  // NEW: Accessories earned
  accessories String[] @default([]) // Array of accessory IDs

  // Relations
  goals Goal[] // All goals in this category

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, category]) // One Sprout per category per user
  @@index([userId])
  @@index([category])
}

model Goal {
  id       String @id @default(cuid())
  userId   String
  user     User   @relation(fields: [userId], references: [id])

  sproutId String
  sprout   Sprout @relation(fields: [sproutId], references: [id])

  // Goal details
  title       String
  description String?
  category    String // Must match sprout category

  // Specific target
  targetValue  Float
  currentValue Float  @default(0)
  unit         String // 'miles', 'USD', 'hours', 'count'

  // Time frame
  frequency String    // 'daily', 'weekly', 'monthly', 'one-time'
  startDate DateTime  @default(now())
  endDate   DateTime?

  // Status
  isActive    Boolean   @default(true)
  isCompleted Boolean   @default(false)
  isFailed    Boolean   @default(false)
  completedAt DateTime?
  failedAt    DateTime?

  // Rewards
  experienceReward Int      @default(10)
  pointsReward     Int      @default(5)
  accessoryReward  String?  // Accessory unlocked on completion

  // Integration
  integrationId String?
  integration   Integration? @relation(fields: [integrationId], references: [id])

  activities Activity[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([sproutId])
  @@index([category])
}

model Accessory {
  id String @id @default(cuid())

  name        String
  description String
  category    String // Which Sprout category
  rarity      String // 'Common', 'Rare', 'Epic', 'Legendary'
  imageUrl    String
  modelUrl    String? // 3D model for AR

  // Unlock criteria
  requirementType  String // 'goal_count', 'streak', 'total_value', 'specific_goal'
  requirementValue Float  // e.g., 10 goals, 30 days, $10000

  createdAt DateTime @default(now())

  @@index([category])
}

model UserAccessory {
  id String @id @default(cuid())

  userId      String
  user        User   @relation(fields: [userId], references: [id])

  accessoryId String

  sproutId    String // Which Sprout earned this

  unlockedAt  DateTime @default(now())
  isEquipped  Boolean  @default(false) // Currently worn by Sprout?

  @@unique([userId, accessoryId])
  @@index([userId])
  @@index([sproutId])
}
```

---

## Health & Progress System

### Sprout Health Calculation

```typescript
// Health is based on active goals progress in category
function calculateSproutHealth(sprout: Sprout): number {
  const activeGoals = sprout.goals.filter(g => g.isActive);

  if (activeGoals.length === 0) {
    // No active goals = slowly decay
    return Math.max(0, sprout.healthPoints - 5);
  }

  let totalProgress = 0;
  for (const goal of activeGoals) {
    const progress = goal.currentValue / goal.targetValue;
    totalProgress += progress;
  }

  const avgProgress = totalProgress / activeGoals.length;

  // Health based on average progress
  if (avgProgress >= 0.8) return 100; // Excellent
  if (avgProgress >= 0.6) return 85;  // Good
  if (avgProgress >= 0.4) return 65;  // Okay
  if (avgProgress >= 0.2) return 40;  // Warning
  return 20; // Critical
}
```

### Daily Health Update (Cron Job)

```typescript
// Run daily at midnight
async function updateAllSproutHealth() {
  const sprouts = await prisma.sprout.findMany({
    include: { goals: true }
  });

  for (const sprout of sprouts) {
    const newHealth = calculateSproutHealth(sprout);

    await prisma.sprout.update({
      where: { id: sprout.id },
      data: {
        healthPoints: newHealth,
        isWithering: newHealth < 30
      }
    });

    // Notify user if critical
    if (newHealth < 30) {
      await sendNotification(sprout.userId, {
        title: `Your ${sprout.name} needs attention!`,
        body: `Health is at ${newHealth}%. Check your ${sprout.category} goals.`
      });
    }
  }
}
```

---

## User Experience Flow

### New User Journey

**Step 1: Choose Category**
```
What area do you want to improve?

[🏃 Fitness]    [💰 Finance]
[📚 Education]  [🙏 Faith]
[⏱️ Screen Time] [💼 Work]
```

**Step 2: Pick Species for Category**
```
Choose your Fitness companion:

[🐉 Dragon]  - Fast & Fierce
[🐱 Cat]     - Agile & Quick
[🐘 Elephant] - Strong & Steady
[🐦 Bird]    - Light & Swift
```

**Step 3: Mint Sprout**
```
Mint your Dragon? $2.99

This Dragon will track ALL your
fitness goals and grow as you
achieve them.

[Mint Now]
```

**Step 4: Create First Goal**
```
Set your first Fitness goal:

Goal: [Run 20 miles this week]
Target: [20] miles
Per: [Week ▼]

Connect Strava? [Yes] [Manual]

[Create Goal]
```

**Step 5: Dashboard**
```
🐉 Fitness Dragon (Lv 1)
Health: ████████░░ 80%

Active Goals:
├─ 🏃 Run 20 miles/week
│  ████████░░ 14/20 miles (70%)
│  3 days left
│
└─ [+ Add Fitness Goal]

[View in AR]
```

---

## Existing User Flow

### Adding Second Category

**User has Fitness Dragon, wants to add Finance:**

```
Home Screen:

🐉 Fitness Dragon (Lv 3)
Health: ████████ 90%
2 active goals

[+ Add New Category]

↓ Tap +

Choose Category:
[💰 Finance] ← Select this
[📚 Education]
[🙏 Faith]
...

↓

Choose Finance companion:
[🐘 Elephant] - Wise & Wealthy
[🐱 Cat]      - Smart & Sneaky
...

↓

Mint Elephant? $2.99
[Mint Now]

↓

Create your first Finance goal:
[Save $1,000 this month]
...
```

**Now user has 2 Sprouts:**
```
Home Screen:

🐉 Fitness Dragon (Lv 3) - 90% ❤️
├─ Run 20 miles/week (14/20)
└─ 10k steps daily (8/30 days)

🐘 Finance Elephant (Lv 1) - 100% ❤️
└─ Save $1,000/month ($320/$1000)

[+ Add New Category]
```

---

## Accessory System

### Earning Accessories

**Trigger:** User completes a goal
```typescript
async function onGoalCompleted(goal: Goal) {
  // Award XP to Sprout
  await prisma.sprout.update({
    where: { id: goal.sproutId },
    data: {
      experience: { increment: goal.experienceReward }
    }
  });

  // Check for accessory unlock
  const accessory = await checkAccessoryUnlock(goal);

  if (accessory) {
    await prisma.userAccessory.create({
      data: {
        userId: goal.userId,
        accessoryId: accessory.id,
        sproutId: goal.sproutId
      }
    });

    // Show celebration
    return {
      success: true,
      accessoryUnlocked: accessory
    };
  }
}
```

### Viewing Accessories

**Sprout Detail Screen:**
```
🐉 Fitness Dragon (Lv 3)

Accessories (3/12):
┌────────┐ ┌────────┐ ┌────────┐
│   👟   │ │   🏅   │ │   🎽   │
│ Shoes  │ │ Medal  │ │Jersey │
│Equipped│ │        │ │        │
└────────┘ └────────┘ └────────┘

Locked:
┌────────┐ ┌────────┐
│   🏆   │ │   👑   │
│Trophy  │ │ Crown  │
│Run 100 │ │Run 500 │
│ miles  │ │ miles  │
└────────┘ └────────┘

[View in AR with Accessories]
```

---

## Platform Integration Details

### Fitness: Strava + HealthKit + Whoop

```typescript
// Sync fitness data and update goals
async function syncFitnessData(userId: string) {
  const integration = await prisma.integration.findFirst({
    where: { userId, provider: { in: ['strava', 'healthkit', 'whoop'] } }
  });

  // Get fitness Sprout
  const sprout = await prisma.sprout.findFirst({
    where: { userId, category: 'fitness' },
    include: { goals: { where: { isActive: true } } }
  });

  if (!sprout) return;

  // Fetch activities from platform
  const activities = await fetchStravaActivities(integration.accessToken);

  for (const activity of activities) {
    // Match activity to goals
    for (const goal of sprout.goals) {
      if (matchesGoal(activity, goal)) {
        await updateGoalProgress(goal.id, activity.distance);
      }
    }
  }

  // Recalculate Sprout health
  await updateSproutHealth(sprout.id);
}
```

### Finance: Plaid + Coinbase + Robinhood

```typescript
async function syncFinanceData(userId: string) {
  const financeSprout = await prisma.sprout.findFirst({
    where: { userId, category: 'finance' },
    include: { goals: true }
  });

  // Plaid: Bank accounts
  const plaidData = await fetchPlaidTransactions(userId);

  // Coinbase: Crypto portfolio
  const cryptoBalance = await fetchCoinbaseBalance(userId);

  // Robinhood: Stock portfolio
  const stockBalance = await fetchRobinhoodBalance(userId);

  // Update savings goals
  const savingsGoals = financeSprout.goals.filter(g =>
    g.category === 'savings' && g.isActive
  );

  for (const goal of savingsGoals) {
    const currentBalance = plaidData.totalBalance;
    await updateGoalProgress(goal.id, currentBalance);
  }

  await updateSproutHealth(financeSprout.id);
}
```

---

## Business Model

### Pricing
- **$2.99 per Sprout** (one-time purchase per category)
- **$0.99 to revive** a withering Sprout
- **$4.99 for premium accessories** (optional cosmetics)
- **Free:** Goal tracking, progress monitoring, basic accessories

### Revenue Potential
- User wants 3 categories: $8.97
- Premium accessories: +$5-15
- Revivals: ~$1-2/month
- **Average: $15-20 per user**

---

## Implementation Priority

### Phase 1 (This Week)
1. ✅ Update database schema (category-based)
2. ✅ Deploy to Supabase
3. Create Sprout selection by category screen
4. Build goals dashboard (home screen)

### Phase 2 (Next Week)
5. Implement health calculation system
6. Add Plaid integration (finance goals)
7. Build accessory system
8. Create goal detail screen with AR

### Phase 3 (Week 3)
9. Add more platform integrations
10. Polish UI/UX
11. Add notifications
12. Beta testing

---

Ready to implement? Should we start with updating the database schema?
