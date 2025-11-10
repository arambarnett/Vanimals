# Sprouts Complete Implementation Plan
## Blockchain NFTs + Social Wallets + Goal Tracking (Strava & Banking)

## Executive Summary

This plan transforms Sprouts into a gamified goal-tracking application inspired by **Neopets** (pet care mechanics) and **Solo Leveling** (growth/evolution systems). Users will:

1. **Create wallets via social login** (Google, Apple, Facebook) using Aptos Keyless accounts
2. **Receive Sprout NFTs** as blockchain-based digital pets on Aptos
3. **Connect Strava** for fitness goal tracking
4. **Connect bank accounts** via Plaid for financial goal tracking
5. **Watch their Sprouts grow** when achieving goals or **wither** when failing

## Current State Analysis

### ✅ What's Working
- Flutter app with AR pet viewing
- Basic Privy authentication (to be replaced)
- Strava OAuth integration (backend partially complete)
- Backend API with Express + Prisma
- PostgreSQL database with users, habits, milestones, integrations
- Demo collection screen with hardcoded Sprouts

### 🔄 What Needs Work
- Replace Privy → Aptos Keyless social wallet creation
- Implement Aptos smart contracts for NFTs
- Complete Plaid banking integration
- Build goal tracking logic (fitness + financial)
- Create Sprout growth/decay algorithm
- Real-time state management for Sprout health

## Inspiration from Neopets & Solo Leveling

### From Neopets
- **Hunger/Health System**: Sprouts have health bars that decay over time
- **Feeding Mechanics**: Users "feed" Sprouts by completing goals
- **Status Levels**: Bloated → Content → Hungry → Starving → Dying
- **Mood System**: Happy Sprouts when goals are met, sad when neglected
- **Daily Check-ins**: Encourage users to log in daily to maintain Sprout health

### From Solo Leveling
- **Level Up System**: Sprouts gain experience and level up based on goal completion
- **Evolution Tiers**: Normal → Elite → Knight → Commander → Marshal grades
- **Stat Growth**: Sprouts increase strength, intelligence, speed through activities
- **Achievement Milestones**: Unlock special abilities/appearances at certain levels
- **Shadow Army Concept**: Users can collect multiple Sprouts that grow independently

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Flutter App                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Aptos Wallet │  │ Goal Manager │  │  Sprout Visualizer   │  │
│  │   Service    │  │   (UI)       │  │   (AR + Growth)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API (Node.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Aptos Service│  │ Goal Tracker │  │  Integration Hub     │  │
│  │ (NFT Minting)│  │  (Logic)     │  │  (Strava + Plaid)    │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         ▼                    ▼                      ▼
┌──────────────┐    ┌──────────────┐      ┌──────────────────┐
│Aptos Network │    │  PostgreSQL  │      │  External APIs   │
│ (Smart       │    │  (User Data, │      │  • Strava API    │
│  Contracts)  │    │   Goals)     │      │  • Plaid API     │
└──────────────┘    └──────────────┘      └──────────────────┘
```

## Phase 1: Database Schema Updates (Week 1)

### Update Prisma Schema

```prisma
model User {
  id                  String   @id @default(cuid())
  // Aptos blockchain integration
  walletAddress       String   @unique
  aptosPublicKey      String?
  socialProvider      String?  // 'google', 'apple', 'facebook'
  socialProviderId    String?  @unique

  // User profile
  name                String?
  email               String?
  profileImage        String?

  // Game stats
  experience          Int      @default(0)
  level               Int      @default(1)
  totalPoints         Int      @default(0)
  streak              Int      @default(0)
  lastActiveAt        DateTime @default(now())

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  // Relations
  sprouts             Sprout[]
  goals               Goal[]
  achievements        Achievement[]
  integrations        Integration[]
  activities          Activity[]

  @@index([walletAddress])
  @@index([socialProviderId])
}

// Sprout NFTs - on-chain + off-chain data
model Sprout {
  id                  String   @id @default(cuid())
  userId              String
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // NFT/Blockchain data
  nftAddress          String   @unique  // On-chain NFT address
  tokenId             String   @unique
  mintTransactionHash String

  // Sprout attributes
  name                String
  species             String   // 'Pigeon', 'Elephant', 'Tiger', etc.
  rarity              String   // 'Common', 'Rare', 'Epic', 'Legendary'
  grade               String   @default("Normal")  // Normal, Elite, Knight, Commander, Marshal

  // Stats (Solo Leveling inspired)
  level               Int      @default(1)
  experience          Int      @default(0)
  strength            Int      @default(1)
  intelligence        Int      @default(1)
  speed               Int      @default(1)
  vitality            Int      @default(100)

  // Health/Care (Neopets inspired)
  healthPoints        Int      @default(100)  // 0-100
  hungerLevel         Int      @default(50)   // 0-100 (0=starving, 100=bloated)
  happinessLevel      Int      @default(75)   // 0-100
  lastFed             DateTime @default(now())
  lastInteraction     DateTime @default(now())

  // Growth state
  growthStage         String   @default("Sprout")  // Sprout, Seedling, Plant, Tree
  sizeMultiplier      Float    @default(1.0)
  isWithering         Boolean  @default(false)

  // Visuals
  imagePath           String?
  modelPath           String?
  colorScheme         String?

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([userId])
  @@index([nftAddress])
}

// Goals (Financial + Fitness)
model Goal {
  id                  String   @id @default(cuid())
  userId              String
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Goal basics
  title               String
  description         String?
  type                String   // 'financial', 'fitness', 'habit'
  category            String   // 'savings', 'spending', 'running', 'cycling', etc.

  // Target metrics
  targetValue         Float    // e.g., 1000 (dollars), 50 (miles), 10 (workouts)
  currentValue        Float    @default(0)
  unit                String   // 'USD', 'miles', 'count', 'minutes'

  // Time frame
  frequency           String   // 'daily', 'weekly', 'monthly', 'one-time'
  startDate           DateTime @default(now())
  endDate             DateTime?

  // Status
  isActive            Boolean  @default(true)
  isCompleted         Boolean  @default(false)
  completedAt         DateTime?

  // Rewards
  experienceReward    Int      @default(10)
  pointsReward        Int      @default(5)

  // Data source
  integrationId       String?
  integration         Integration? @relation(fields: [integrationId], references: [id])

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  // Relations
  activities          Activity[]

  @@index([userId])
  @@index([type])
  @@index([isActive])
}

// Integration with external services
model Integration {
  id                  String   @id @default(cuid())
  userId              String
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Provider info
  provider            String   // 'strava', 'plaid', 'apple_health'
  providerId          String   // External user ID
  providerAccountId   String?  // For Plaid: account_id, item_id

  // Tokens
  accessToken         String?  // Encrypted
  refreshToken        String?  // Encrypted
  expiresAt           DateTime?

  // Metadata
  isActive            Boolean  @default(true)
  lastSync            DateTime?
  syncFrequency       String?  @default("daily")
  metadata            Json?    // Provider-specific data

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  // Relations
  goals               Goal[]
  activities          Activity[]

  @@unique([userId, provider])
  @@index([provider])
}

// Activity log (fitness + financial events)
model Activity {
  id                  String   @id @default(cuid())
  userId              String
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  goalId              String?
  goal                Goal?    @relation(fields: [goalId], references: [id], onDelete: SetNull)

  integrationId       String?
  integration         Integration? @relation(fields: [integrationId], references: [id], onDelete: SetNull)

  // Activity details
  type                String   // 'workout', 'transaction', 'milestone'
  category            String?  // 'run', 'ride', 'purchase', 'deposit'

  // Metrics
  value               Float?   // Distance, amount, duration
  unit                String?  // 'miles', 'USD', 'minutes'

  // Impact on goals
  contributesToGoal   Boolean  @default(false)
  impactType          String?  // 'positive', 'negative'
  pointsEarned        Int      @default(0)
  experienceEarned    Int      @default(0)

  // Metadata
  externalId          String?  // ID from Strava/Plaid
  metadata            Json?    // Raw data from provider

  activityDate        DateTime @default(now())
  createdAt           DateTime @default(now())

  @@index([userId])
  @@index([goalId])
  @@index([type])
  @@index([activityDate])
}

// Achievements/Badges
model Achievement {
  id                  String   @id @default(cuid())
  userId              String
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  title               String
  description         String
  type                String   // 'streak', 'level', 'goal_completion', 'special'
  tier                String   // 'bronze', 'silver', 'gold', 'platinum'

  imageUrl            String?
  nftAddress          String?  // If minted as NFT

  unlockedAt          DateTime @default(now())
  createdAt           DateTime @default(now())

  @@index([userId])
  @@index([type])
}
```

## Phase 2: Aptos Smart Contracts (Week 2-3)

### Contract 1: Sprout NFT Collection

```move
// contracts/sources/sprout_nft.move
module sprout_addr::sprout_nft {
    use std::string::{Self, String};
    use std::signer;
    use aptos_framework::object::{Self, Object};
    use aptos_token_objects::collection;
    use aptos_token_objects::token;

    // Sprout NFT structure
    struct SproutToken has key {
        // Core attributes
        species: String,
        rarity: String,
        grade: String,

        // Stats (can be updated)
        level: u64,
        experience: u64,
        strength: u64,
        intelligence: u64,
        speed: u64,
        vitality: u64,

        // Health metrics
        health_points: u64,
        hunger_level: u64,
        happiness_level: u64,

        // Growth state
        growth_stage: String,
        size_multiplier: u64,  // Fixed point: 100 = 1.0x
        is_withering: bool,

        // Timestamps
        last_fed: u64,
        last_interaction: u64,
        minted_at: u64,
    }

    // Initialize collection
    public entry fun create_collection(creator: &signer) {
        collection::create_unlimited_collection(
            creator,
            string::utf8(b"Sprouts grow with you as you achieve your goals"),
            string::utf8(b"Sprouts Collection"),
            option::none(),
            string::utf8(b"https://sprouts.app/metadata"),
        );
    }

    // Mint new Sprout NFT
    public entry fun mint_sprout(
        admin: &signer,
        to: address,
        name: String,
        species: String,
        rarity: String,
        uri: String,
    ) acquires SproutToken {
        let constructor_ref = token::create_named_token(
            admin,
            string::utf8(b"Sprouts Collection"),
            string::utf8(b""),
            name,
            option::none(),
            uri,
        );

        let token_signer = object::generate_signer(&constructor_ref);
        let token_address = object::address_from_constructor_ref(&constructor_ref);

        // Create Sprout data
        let sprout = SproutToken {
            species,
            rarity,
            grade: string::utf8(b"Normal"),
            level: 1,
            experience: 0,
            strength: 1,
            intelligence: 1,
            speed: 1,
            vitality: 100,
            health_points: 100,
            hunger_level: 50,
            happiness_level: 75,
            growth_stage: string::utf8(b"Sprout"),
            size_multiplier: 100,  // 1.0x
            is_withering: false,
            last_fed: aptos_framework::timestamp::now_seconds(),
            last_interaction: aptos_framework::timestamp::now_seconds(),
            minted_at: aptos_framework::timestamp::now_seconds(),
        };

        move_to(&token_signer, sprout);

        // Transfer to user
        object::transfer(admin, object::object_from_constructor_ref<Token>(&constructor_ref), to);
    }

    // Update Sprout stats (called by admin account when goals completed)
    public entry fun update_sprout_stats(
        admin: &signer,
        token_address: address,
        experience_gain: u64,
        health_change: i64,  // Can be negative
        hunger_change: i64,
    ) acquires SproutToken {
        // Verify admin
        assert!(signer::address_of(admin) == @sprout_addr, 1);

        let sprout = borrow_global_mut<SproutToken>(token_address);

        // Update experience and level
        sprout.experience = sprout.experience + experience_gain;
        if (sprout.experience >= sprout.level * 100) {
            sprout.level = sprout.level + 1;
            // Level up increases stats
            sprout.strength = sprout.strength + 1;
            sprout.intelligence = sprout.intelligence + 1;
            sprout.speed = sprout.speed + 1;
        };

        // Update health (clamped 0-100)
        if (health_change > 0) {
            sprout.health_points = min(sprout.health_points + (health_change as u64), 100);
        } else {
            let decrease = (-health_change as u64);
            if (sprout.health_points > decrease) {
                sprout.health_points = sprout.health_points - decrease;
            } else {
                sprout.health_points = 0;
            };
        };

        // Update hunger similarly
        // ... (similar logic for hunger)

        // Update withering state
        if (sprout.health_points < 30 || sprout.hunger_level < 20) {
            sprout.is_withering = true;
        } else {
            sprout.is_withering = false;
        };

        // Update size based on growth
        if (sprout.level >= 20 && sprout.health_points > 80) {
            sprout.growth_stage = string::utf8(b"Tree");
            sprout.size_multiplier = 200;  // 2.0x
        } else if (sprout.level >= 10 && sprout.health_points > 60) {
            sprout.growth_stage = string::utf8(b"Plant");
            sprout.size_multiplier = 150;  // 1.5x
        } else if (sprout.level >= 5) {
            sprout.growth_stage = string::utf8(b"Seedling");
            sprout.size_multiplier = 120;  // 1.2x
        };

        sprout.last_interaction = aptos_framework::timestamp::now_seconds();
    }

    // Feed Sprout (called when user completes a goal)
    public entry fun feed_sprout(
        admin: &signer,
        token_address: address,
        nutrition_value: u64,  // 1-100
    ) acquires SproutToken {
        assert!(signer::address_of(admin) == @sprout_addr, 1);

        let sprout = borrow_global_mut<SproutToken>(token_address);
        sprout.hunger_level = min(sprout.hunger_level + nutrition_value, 100);
        sprout.happiness_level = min(sprout.happiness_level + 5, 100);
        sprout.last_fed = aptos_framework::timestamp::now_seconds();
        sprout.last_interaction = aptos_framework::timestamp::now_seconds();
    }

    // View functions
    #[view]
    public fun get_sprout_stats(token_address: address): (u64, u64, u64, bool) acquires SproutToken {
        let sprout = borrow_global<SproutToken>(token_address);
        (sprout.level, sprout.health_points, sprout.hunger_level, sprout.is_withering)
    }

    // Helper
    fun min(a: u64, b: u64): u64 {
        if (a < b) { a } else { b }
    }
}
```

### Contract 2: Activity Tracking

```move
// contracts/sources/activity_tracker.move
module sprout_addr::activity_tracker {
    use std::string::String;
    use std::signer;
    use aptos_framework::timestamp;

    struct UserActivityRecord has key {
        total_activities: u64,
        total_points: u64,
        streak_count: u64,
        last_activity_timestamp: u64,
    }

    public entry fun record_activity(
        admin: &signer,
        user_address: address,
        activity_type: String,
        points_earned: u64,
    ) acquires UserActivityRecord {
        assert!(signer::address_of(admin) == @sprout_addr, 1);

        if (!exists<UserActivityRecord>(user_address)) {
            move_to(admin, UserActivityRecord {
                total_activities: 0,
                total_points: 0,
                streak_count: 0,
                last_activity_timestamp: 0,
            });
        };

        let record = borrow_global_mut<UserActivityRecord>(user_address);
        record.total_activities = record.total_activities + 1;
        record.total_points = record.total_points + points_earned;

        // Update streak
        let current_time = timestamp::now_seconds();
        let one_day = 86400;  // seconds
        if (current_time - record.last_activity_timestamp <= one_day) {
            record.streak_count = record.streak_count + 1;
        } else {
            record.streak_count = 1;
        };

        record.last_activity_timestamp = current_time;
    }
}
```

## Phase 3: Backend Implementation (Week 3-4)

### 1. Install Dependencies

```bash
cd sprout-backend
npm install @aptos-labs/ts-sdk plaid
npm uninstall jsonwebtoken jwks-rsa  # Remove Privy
```

### 2. Aptos Service (`src/services/aptosService.ts`)

```typescript
import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

export class AptosService {
  private aptos: Aptos;
  private adminAccount: Account;
  private moduleAddress: string;

  constructor() {
    const config = new AptosConfig({ network: Network.TESTNET });
    this.aptos = new Aptos(config);
    this.moduleAddress = process.env.APTOS_MODULE_ADDRESS!;

    // Admin account for minting
    this.adminAccount = Account.fromPrivateKey({
      privateKey: new Ed25519PrivateKey(process.env.APTOS_ADMIN_PRIVATE_KEY!)
    });
  }

  async mintSproutNFT(userAddress: string, sproutData: {
    name: string;
    species: string;
    rarity: string;
    uri: string;
  }): Promise<string> {
    const transaction = await this.aptos.transaction.build.simple({
      sender: this.adminAccount.accountAddress,
      data: {
        function: `${this.moduleAddress}::sprout_nft::mint_sprout`,
        functionArguments: [
          userAddress,
          sproutData.name,
          sproutData.species,
          sproutData.rarity,
          sproutData.uri,
        ],
      },
    });

    const committedTxn = await this.aptos.signAndSubmitTransaction({
      signer: this.adminAccount,
      transaction,
    });

    await this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    return committedTxn.hash;
  }

  async updateSproutStats(tokenAddress: string, updates: {
    experienceGain: number;
    healthChange: number;
    hungerChange: number;
  }): Promise<string> {
    const transaction = await this.aptos.transaction.build.simple({
      sender: this.adminAccount.accountAddress,
      data: {
        function: `${this.moduleAddress}::sprout_nft::update_sprout_stats`,
        functionArguments: [
          tokenAddress,
          updates.experienceGain,
          updates.healthChange,
          updates.hungerChange,
        ],
      },
    });

    const committedTxn = await this.aptos.signAndSubmitTransaction({
      signer: this.adminAccount,
      transaction,
    });

    return committedTxn.hash;
  }

  async feedSprout(tokenAddress: string, nutritionValue: number): Promise<string> {
    const transaction = await this.aptos.transaction.build.simple({
      sender: this.adminAccount.accountAddress,
      data: {
        function: `${this.moduleAddress}::sprout_nft::feed_sprout`,
        functionArguments: [tokenAddress, nutritionValue],
      },
    });

    const committedTxn = await this.aptos.signAndSubmitTransaction({
      signer: this.adminAccount,
      transaction,
    });

    return committedTxn.hash;
  }

  async getSproutStats(tokenAddress: string) {
    const stats = await this.aptos.view({
      payload: {
        function: `${this.moduleAddress}::sprout_nft::get_sprout_stats`,
        functionArguments: [tokenAddress],
      },
    });

    return {
      level: Number(stats[0]),
      healthPoints: Number(stats[1]),
      hungerLevel: Number(stats[2]),
      isWithering: Boolean(stats[3]),
    };
  }
}
```

### 3. Plaid Service (`src/services/plaidService.ts`)

```typescript
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

export class PlaidService {
  private client: PlaidApi;

  constructor() {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
          'PLAID-SECRET': process.env.PLAID_SECRET!,
        },
      },
    });

    this.client = new PlaidApi(configuration);
  }

  async createLinkToken(userId: string): Promise<string> {
    const response = await this.client.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'Sprouts',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    });

    return response.data.link_token;
  }

  async exchangePublicToken(publicToken: string): Promise<{ accessToken: string; itemId: string }> {
    const response = await this.client.itemPublicTokenExchange({
      public_token: publicToken,
    });

    return {
      accessToken: response.data.access_token,
      itemId: response.data.item_id,
    };
  }

  async getTransactions(accessToken: string, startDate: string, endDate: string) {
    const response = await this.client.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
    });

    return response.data.transactions;
  }

  async getBalance(accessToken: string) {
    const response = await this.client.accountsBalanceGet({
      access_token: accessToken,
    });

    return response.data.accounts;
  }
}
```

### 4. Goal Tracking Service (`src/services/goalTrackingService.ts`)

```typescript
import { PrismaClient } from '@prisma/client';
import { AptosService } from './aptosService';

const prisma = new PrismaClient();

export class GoalTrackingService {
  private aptosService: AptosService;

  constructor() {
    this.aptosService = new AptosService();
  }

  async processActivity(userId: string, activityData: {
    type: string;
    value: number;
    unit: string;
    externalId?: string;
    metadata?: any;
  }) {
    // Find relevant active goals
    const relevantGoals = await prisma.goal.findMany({
      where: {
        userId,
        isActive: true,
        type: activityData.type,
      },
    });

    let totalPoints = 0;
    let totalExperience = 0;

    for (const goal of relevantGoals) {
      // Update goal progress
      const newValue = goal.currentValue + activityData.value;
      const isCompleted = newValue >= goal.targetValue;

      await prisma.goal.update({
        where: { id: goal.id },
        data: {
          currentValue: newValue,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
      });

      // Award points
      if (isCompleted && !goal.isCompleted) {
        totalPoints += goal.pointsReward;
        totalExperience += goal.experienceReward;
      } else {
        // Partial progress rewards
        const progress = newValue / goal.targetValue;
        totalPoints += Math.floor(goal.pointsReward * progress * 0.1);
        totalExperience += Math.floor(goal.experienceReward * progress * 0.1);
      }
    }

    // Log activity
    await prisma.activity.create({
      data: {
        userId,
        type: activityData.type,
        value: activityData.value,
        unit: activityData.unit,
        externalId: activityData.externalId,
        metadata: activityData.metadata,
        pointsEarned: totalPoints,
        experienceEarned: totalExperience,
        contributesToGoal: relevantGoals.length > 0,
        impactType: 'positive',
      },
    });

    // Update user stats
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints: { increment: totalPoints },
        experience: { increment: totalExperience },
        lastActiveAt: new Date(),
      },
    });

    // Update all user's Sprouts
    await this.updateUserSprouts(userId, totalExperience);

    return { totalPoints, totalExperience };
  }

  async updateUserSprouts(userId: string, experienceGain: number) {
    const sprouts = await prisma.sprout.findMany({
      where: { userId },
    });

    for (const sprout of sprouts) {
      // Feed sprout (restore hunger)
      const nutritionValue = Math.min(20, experienceGain);

      await this.aptosService.feedSprout(sprout.nftAddress, nutritionValue);

      // Update on-chain stats
      await this.aptosService.updateSproutStats(sprout.nftAddress, {
        experienceGain,
        healthChange: 10,
        hungerChange: nutritionValue,
      });

      // Update local database
      await prisma.sprout.update({
        where: { id: sprout.id },
        data: {
          experience: { increment: experienceGain },
          hungerLevel: Math.min(100, sprout.hungerLevel + nutritionValue),
          healthPoints: Math.min(100, sprout.healthPoints + 10),
          happinessLevel: Math.min(100, sprout.happinessLevel + 5),
          lastInteraction: new Date(),
        },
      });
    }
  }

  async decaySproutHealth(sproutId: string) {
    const sprout = await prisma.sprout.findUnique({ where: { id: sproutId } });
    if (!sprout) return;

    const hoursSinceLastFed = (Date.now() - sprout.lastFed.getTime()) / (1000 * 60 * 60);

    // Decay hunger by 2 points per hour
    const hungerDecay = Math.floor(hoursSinceLastFed * 2);
    const newHunger = Math.max(0, sprout.hungerLevel - hungerDecay);

    // If very hungry, health decays too
    let healthDecay = 0;
    if (newHunger < 20) {
      healthDecay = Math.floor((20 - newHunger) / 2);
    }
    const newHealth = Math.max(0, sprout.healthPoints - healthDecay);

    // Update on-chain
    await this.aptosService.updateSproutStats(sprout.nftAddress, {
      experienceGain: 0,
      healthChange: -healthDecay,
      hungerChange: -hungerDecay,
    });

    // Update database
    await prisma.sprout.update({
      where: { id: sproutId },
      data: {
        hungerLevel: newHunger,
        healthPoints: newHealth,
        isWithering: newHealth < 30 || newHunger < 20,
      },
    });
  }
}
```

## Phase 4: Backend Routes (Week 4)

### Auth Routes (`src/routes/auth.ts`)

```typescript
// Replace Privy authentication with Aptos Keyless
router.post('/auth/wallet', async (req: Request, res: Response) => {
  const { walletAddress, socialProvider, socialProviderId, name, email } = req.body;

  // Find or create user
  let user = await prisma.user.findUnique({ where: { walletAddress } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress,
        socialProvider,
        socialProviderId,
        name,
        email,
      },
    });

    // Mint first Sprout NFT
    const aptosService = new AptosService();
    const txHash = await aptosService.mintSproutNFT(walletAddress, {
      name: `${name}'s First Sprout`,
      species: 'Seedling',
      rarity: 'Common',
      uri: `https://sprouts.app/nft/${user.id}`,
    });

    // Create Sprout record
    await prisma.sprout.create({
      data: {
        userId: user.id,
        nftAddress: 'pending',  // Will be updated with actual address
        tokenId: txHash,
        mintTransactionHash: txHash,
        name: `${name}'s First Sprout`,
        species: 'Seedling',
        rarity: 'Common',
      },
    });
  }

  res.json({ success: true, user });
});
```

### Goal Routes (`src/routes/goals.ts`)

```typescript
router.post('/goals', async (req: Request, res: Response) => {
  const { userId, title, description, type, category, targetValue, unit, frequency, endDate } = req.body;

  const goal = await prisma.goal.create({
    data: {
      userId,
      title,
      description,
      type,
      category,
      targetValue,
      unit,
      frequency,
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  res.status(201).json(goal);
});

router.get('/users/:userId/goals', async (req: Request, res: Response) => {
  const { userId } = req.params;

  const goals = await prisma.goal.findMany({
    where: { userId },
    include: {
      activities: {
        orderBy: { activityDate: 'desc' },
        take: 5,
      },
    },
  });

  res.json(goals);
});
```

### Plaid Routes (`src/routes/plaid.ts`)

```typescript
import { PlaidService } from '../services/plaidService';

router.post('/plaid/create-link-token', async (req: Request, res: Response) => {
  const { userId } = req.body;
  const plaidService = new PlaidService();

  const linkToken = await plaidService.createLinkToken(userId);
  res.json({ linkToken });
});

router.post('/plaid/exchange-token', async (req: Request, res: Response) => {
  const { publicToken, userId } = req.body;
  const plaidService = new PlaidService();

  const { accessToken, itemId } = await plaidService.exchangePublicToken(publicToken);

  // Store integration
  await prisma.integration.create({
    data: {
      userId,
      provider: 'plaid',
      providerId: itemId,
      providerAccountId: itemId,
      accessToken,  // Should be encrypted
      isActive: true,
    },
  });

  res.json({ success: true });
});

router.post('/plaid/sync-transactions', async (req: Request, res: Response) => {
  const { userId } = req.body;
  const plaidService = new PlaidService();
  const goalService = new GoalTrackingService();

  const integration = await prisma.integration.findFirst({
    where: { userId, provider: 'plaid', isActive: true },
  });

  if (!integration || !integration.accessToken) {
    return res.status(404).json({ error: 'Plaid not connected' });
  }

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const transactions = await plaidService.getTransactions(integration.accessToken, startDate, endDate);

  // Process transactions for savings goals
  for (const txn of transactions) {
    if (txn.amount < 0) {  // Negative = money in (savings)
      await goalService.processActivity(userId, {
        type: 'financial',
        value: Math.abs(txn.amount),
        unit: 'USD',
        externalId: txn.transaction_id,
        metadata: txn,
      });
    }
  }

  res.json({ success: true, processedCount: transactions.length });
});
```

## Phase 5: Frontend Flutter Implementation (Week 5-6)

### 1. Update Dependencies

```yaml
# pubspec.yaml
dependencies:
  # Remove webview_flutter (used for Privy)
  # Add for Aptos
  http: ^1.1.0
  web3dart: ^2.7.3  # For wallet interactions
  # Add for Plaid
  plaid_flutter: ^3.0.0
```

### 2. Aptos Wallet Service (`lib/data/services/aptos_wallet_service.dart`)

```dart
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class AptosWalletService {
  static const String _walletAddressKey = 'aptos_wallet_address';
  static const String _socialProviderKey = 'social_provider';

  static Future<bool> isConnected() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_walletAddressKey) != null;
  }

  static Future<String?> getWalletAddress() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_walletAddressKey);
  }

  static Future<bool> connectWithSocial({
    required String provider,  // 'google', 'apple', 'facebook'
    required String providerId,
    required String name,
    String? email,
  }) async {
    // In production, integrate with Aptos Keyless SDK
    // For now, simulate wallet creation
    final walletAddress = '0x${DateTime.now().millisecondsSinceEpoch.toRadixString(16)}';

    // Register with backend
    final user = await ApiService.registerUser(
      walletAddress: walletAddress,
      socialProvider: provider,
      socialProviderId: providerId,
      name: name,
      email: email,
    );

    if (user != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_walletAddressKey, walletAddress);
      await prefs.setString(_socialProviderKey, provider);
      return true;
    }

    return false;
  }

  static Future<void> disconnect() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_walletAddressKey);
    await prefs.remove(_socialProviderKey);
  }
}
```

### 3. Goal Management Screen (`lib/presentation/screens/goals_screen.dart`)

```dart
class GoalsScreen extends StatefulWidget {
  const GoalsScreen({super.key});

  @override
  State<GoalsScreen> createState() => _GoalsScreenState();
}

class _GoalsScreenState extends State<GoalsScreen> {
  List<Goal> _goals = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadGoals();
  }

  Future<void> _loadGoals() async {
    final walletAddress = await AptosWalletService.getWalletAddress();
    if (walletAddress == null) return;

    final goals = await ApiService.getUserGoals(walletAddress);
    setState(() {
      _goals = goals;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Goals'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showCreateGoalDialog(),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _goals.length,
              itemBuilder: (context, index) {
                return GoalCard(goal: _goals[index]);
              },
            ),
    );
  }
}

class GoalCard extends StatelessWidget {
  final Goal goal;

  const GoalCard({required this.goal, super.key});

  @override
  Widget build(BuildContext context) {
    final progress = goal.currentValue / goal.targetValue;

    return Card(
      margin: const EdgeInsets.all(8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(_getGoalIcon(goal.type)),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    goal.title,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                if (goal.isCompleted)
                  const Icon(Icons.check_circle, color: Colors.green),
              ],
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: progress.clamp(0.0, 1.0),
              backgroundColor: Colors.grey[300],
              valueColor: AlwaysStoppedAnimation(_getGoalColor(goal.type)),
            ),
            const SizedBox(height: 8),
            Text(
              '${goal.currentValue.toStringAsFixed(1)} / ${goal.targetValue.toStringAsFixed(1)} ${goal.unit}',
              style: const TextStyle(fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getGoalIcon(String type) {
    switch (type) {
      case 'fitness':
        return Icons.directions_run;
      case 'financial':
        return Icons.attach_money;
      default:
        return Icons.flag;
    }
  }

  Color _getGoalColor(String type) {
    switch (type) {
      case 'fitness':
        return Colors.orange;
      case 'financial':
        return Colors.green;
      default:
        return Colors.blue;
    }
  }
}
```

### 4. Enhanced Collection Screen with Health

Update `collection_screen.dart` to show Sprout health:

```dart
Widget _buildSproutCard(BuildContext context, Sprout sprout) {
  return Card(
    child: Column(
      children: [
        // Existing sprout image
        Image.asset(sprout.imagePath),

        // Health bars
        _buildHealthBar('Health', sprout.healthPoints, Colors.red),
        _buildHealthBar('Hunger', sprout.hungerLevel, Colors.orange),
        _buildHealthBar('Happiness', sprout.happinessLevel, Colors.yellow),

        // Withering indicator
        if (sprout.isWithering)
          Container(
            padding: const EdgeInsets.all(8),
            color: Colors.red.withOpacity(0.2),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.warning, color: Colors.red, size: 16),
                SizedBox(width: 4),
                Text('Withering!', style: TextStyle(color: Colors.red)),
              ],
            ),
          ),

        // Feed button
        ElevatedButton.icon(
          onPressed: () => _showFeedOptions(sprout),
          icon: const Icon(Icons.restaurant),
          label: const Text('Complete Goal to Feed'),
        ),
      ],
    ),
  );
}

Widget _buildHealthBar(String label, int value, Color color) {
  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
    child: Row(
      children: [
        SizedBox(
          width: 80,
          child: Text(label, style: const TextStyle(fontSize: 12)),
        ),
        Expanded(
          child: LinearProgressIndicator(
            value: value / 100,
            backgroundColor: Colors.grey[300],
            valueColor: AlwaysStoppedAnimation(color),
          ),
        ),
        SizedBox(
          width: 40,
          child: Text('$value%', style: const TextStyle(fontSize: 12)),
        ),
      ],
    ),
  );
}
```

## Phase 6: Cron Jobs & Automation (Week 6)

### Health Decay Scheduler

```typescript
// src/jobs/sproutHealthDecay.ts
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { GoalTrackingService } from '../services/goalTrackingService';

const prisma = new PrismaClient();
const goalService = new GoalTrackingService();

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running sprout health decay check...');

  const sprouts = await prisma.sprout.findMany();

  for (const sprout of sprouts) {
    await goalService.decaySproutHealth(sprout.id);
  }

  console.log(`Updated ${sprouts.length} sprouts`);
});

// Sync Strava activities every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Syncing Strava activities...');

  const stravaIntegrations = await prisma.integration.findMany({
    where: { provider: 'strava', isActive: true },
  });

  // Sync logic here...
});
```

## Testing Strategy

### Backend Tests

```typescript
describe('Goal Tracking', () => {
  it('should award points for goal completion', async () => {
    // Create test user and goal
    const user = await prisma.user.create({ /* ... */ });
    const goal = await prisma.goal.create({ /* ... */ });

    // Process activity
    const result = await goalService.processActivity(user.id, {
      type: 'fitness',
      value: 5,
      unit: 'miles',
    });

    expect(result.totalPoints).toBeGreaterThan(0);
  });

  it('should update sprout health on goal completion', async () => {
    // Test sprout feeding logic
  });
});
```

### Frontend Tests

```dart
void main() {
  group('Goal Management', () {
    test('should calculate goal progress correctly', () {
      final goal = Goal(
        currentValue: 75,
        targetValue: 100,
      );

      expect(goal.progress, 0.75);
    });
  });
}
```

## Deployment Checklist

### Environment Variables

```env
# Aptos
APTOS_NETWORK=testnet
APTOS_MODULE_ADDRESS=0x...
APTOS_ADMIN_PRIVATE_KEY=0x...

# Plaid
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox

# Strava
STRAVA_CLIENT_ID=...
STRAVA_CLIENT_SECRET=...

# Database
DATABASE_URL=postgresql://...
```

### Deployment Steps

1. Deploy smart contracts to Aptos testnet
2. Update backend with contract addresses
3. Deploy backend to Vercel/Railway
4. Build and release Flutter app (iOS + Android)
5. Test end-to-end flows
6. Monitor transaction fees and performance

## Success Metrics

1. **User Engagement**
   - Daily active users returning to check Sprouts
   - Average goals created per user
   - Goal completion rate

2. **Technical Performance**
   - Transaction success rate on Aptos
   - API response times < 2s
   - Sprout health update latency

3. **Business KPIs**
   - User retention (D1, D7, D30)
   - Integration connection rate (Strava + Plaid)
   - NFT mint success rate

## Timeline Summary

- **Week 1**: Database schema + migrations
- **Week 2-3**: Aptos smart contracts
- **Week 3-4**: Backend services (Aptos + Plaid + Goals)
- **Week 4**: Backend API routes
- **Week 5-6**: Flutter UI implementation
- **Week 6**: Testing + Cron jobs
- **Week 7**: Deployment + monitoring

Total: ~7 weeks to MVP
