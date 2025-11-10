# Sprouts Implementation Summary

## Latest Update: NFT Metadata & Petra Wallet Fix (Oct 24, 2025) 🎉

### Critical Fixes Implemented:
1. ✅ **Fixed EOBJECT_EXISTS error** - Smart contract now appends unique counter to token names
2. ✅ **Fixed database uniqueness issue** - NFT addresses now properly unique
3. ✅ **Created dynamic metadata API** - NFTs display images and attributes in Petra wallet
4. ✅ **Set up Supabase storage structure** - Ready for NFT images and 3D models
5. ✅ **Architecture decision** - Keep breeding/colors simple and off-chain

**See `DEPLOYMENT_CHECKLIST.md` for step-by-step deployment instructions.**

---

## What Has Been Completed ✅

### 1. Comprehensive Planning Documents
- **SPROUTS_IMPLEMENTATION_PLAN.md**: Complete 7-week implementation roadmap
  - Aptos blockchain integration strategy
  - Neopets & Solo Leveling inspired mechanics
  - Database schema design
  - Smart contract specifications
  - Backend & frontend architecture

- **APTOS_BLOCKCHAIN_INTEGRATION_PLAN.md** (existing): Aptos Keyless integration guide

### 2. Database Schema (`prisma/schema_updated.prisma`)
Updated schema includes:
- **User model**: Wallet-based auth (replaces Privy)
  - `walletAddress` as primary identifier
  - `socialProvider` & `socialProviderId` for OAuth
  - Game stats: experience, level, points, streak

- **Sprout model**: On-chain + off-chain NFT data
  - Blockchain fields: `nftAddress`, `tokenId`, `mintTransactionHash`
  - Solo Leveling stats: level, experience, strength, intelligence, speed, vitality
  - Neopets health: healthPoints, hungerLevel, happinessLevel
  - Growth system: `growthStage`, `sizeMultiplier`, `isWithering`

- **Goal model**: Financial + fitness goal tracking
  - Type: financial, fitness, habit
  - Progress tracking: currentValue / targetValue
  - Rewards: experienceReward, pointsReward

- **Integration model**: External service connections (Strava, Plaid)

- **Activity model**: Log of user actions toward goals

- **Achievement model**: Unlockable badges/milestones

### 3. Aptos Smart Contracts (`sprout-contracts/`)

#### `sprout_nft.move`
- **Mint Sprout NFTs**: Create unique Sprouts with initial stats
- **Feed Sprouts**: Restore hunger when users complete goals
- **Update Stats**: Modify health, experience, level based on user activity
- **Level Up System**: Automatic stat increases and grade evolution
- **Growth Stages**: Sprout → Seedling → Plant → Tree (based on level & health)
- **Grade System**: Normal → Elite → Knight → Commander → Marshal
- **View Functions**: Query on-chain Sprout data

#### `activity_tracker.move`
- **Record Activities**: Log user actions on-chain
- **Streak Tracking**: Daily activity streaks with milestone events
- **View Stats**: Total activities, points, experience, streak count

### 4. Backend Services (`sprout-backend/src/services/`)

#### `aptosService.ts`
- Initialize Aptos SDK with testnet/mainnet support
- **Mint NFTs**: `mintSproutNFT(userAddress, sproutData)`
- **Update Sprouts**: `updateSproutStats(tokenAddress, {exp, health, hunger})`
- **Feed Sprouts**: `feedSprout(tokenAddress, nutritionValue)`
- **Query On-chain**: `getSproutStats()`, `getSproutInfo()`
- **Activity Recording**: `recordActivity(userAddress, activityData)`
- **Wallet Operations**: Balance queries, address validation

#### `plaidService.ts`
- **Link Token Creation**: Initialize Plaid Link for users
- **Token Exchange**: Convert public tokens to access tokens
- **Transaction Sync**: Fetch bank transactions
- **Balance Queries**: Get account balances
- **Analysis Functions**:
  - `analyzeSavingsFromTransactions()`: Track savings vs spending
  - `analyzeSpendingByCategory()`: Categorize expenses
  - `calculateSavingsProgress()`: Check if on-track for goals

#### `goalTrackingService.ts`
- **Process Activities**: Update goals when activities occur
- **Reward System**: Award points & experience for progress
- **Sprout Updates**: Feed and level up Sprouts based on achievements
- **Health Decay**: Reduce Sprout health over time if neglected
- **Progress Calculations**: Track goal completion rates
- **User Summary**: Overall progress dashboard data

## What Needs To Be Done Next 🚧

### Phase 1: Backend Routes (1-2 days)
Create new routes in `sprout-backend/src/routes/`:

1. **`authRoutes.ts`** - Wallet-based authentication
   - `POST /auth/connect-wallet` - Register/login with Aptos wallet
   - `GET /auth/user/:walletAddress` - Get user by wallet
   - Remove Privy routes

2. **`goalRoutes.ts`** - Goal management
   - `POST /goals` - Create new goal
   - `GET /users/:userId/goals` - List user's goals
   - `PUT /goals/:goalId` - Update goal
   - `DELETE /goals/:goalId` - Delete goal
   - `GET /goals/:goalId/progress` - Get detailed progress

3. **`plaidRoutes.ts`** - Banking integration
   - `POST /plaid/create-link-token` - Initialize Plaid Link
   - `POST /plaid/exchange-token` - Store bank connection
   - `POST /plaid/sync-transactions` - Sync and process transactions
   - `GET /plaid/balance` - Get account balances

4. **`sproutRoutes.ts`** - NFT management
   - `GET /sprouts/:userId` - List user's Sprouts
   - `GET /sprouts/nft/:nftAddress` - Get Sprout details
   - `POST /sprouts/:sproutId/feed` - Manually feed (via special items)
   - `GET /sprouts/:sproutId/stats` - Get current stats

5. **Update `stravaRoutes.ts`** - Enhance existing Strava integration
   - Connect to goal tracking service
   - Process activities automatically

### Phase 2: Cron Jobs & Automation (1 day)
Create `sprout-backend/src/jobs/`:

1. **`sproutHealthDecay.ts`**
   - Run hourly: Decay all Sprouts' hunger/health
   - Mark withering Sprouts

2. **`stravaSync.ts`**
   - Run every 6 hours: Sync Strava activities
   - Process fitness goals

3. **`plaidSync.ts`**
   - Run daily: Sync bank transactions
   - Process financial goals

### Phase 3: Flutter Services (2-3 days)
Create new services in `sprouts_flutter/lib/data/services/`:

1. **`aptos_wallet_service.dart`** - Replace `privy_auth_service.dart`
   - Social login with Aptos Keyless
   - Wallet creation and management
   - Sign transactions

2. **`goal_service.dart`**
   - Create, update, delete goals
   - Track progress
   - Get recommendations

3. **`sprout_service.dart`**
   - Fetch Sprout data (local + on-chain)
   - Real-time health monitoring
   - Level up notifications

4. **`plaid_service.dart`**
   - Initialize Plaid Link
   - Handle banking connections

### Phase 4: Flutter UI Screens (3-4 days)
Create new screens in `sprouts_flutter/lib/presentation/screens/`:

1. **`wallet_connect_screen.dart`** - Social login for wallet creation
2. **`goals_dashboard_screen.dart`** - Overview of all goals
3. **`goal_creation_screen.dart`** - Create new fitness/financial goals
4. **`goal_detail_screen.dart`** - Track individual goal progress
5. **`plaid_connection_screen.dart`** - Connect bank accounts
6. **`sprout_health_screen.dart`** - Detailed Sprout care UI
7. **Update `collection_screen.dart`** - Show health bars, withering status

### Phase 5: Testing & Deployment (1-2 weeks)

#### Smart Contract Testing
```bash
cd sprout-contracts
aptos move test
aptos move publish --named-addresses sprout_addr=<your-address>
```

#### Backend Testing
```bash
cd sprout-backend
npm install
npm run test
```

#### Frontend Testing
```dart
cd sprouts_flutter
flutter test
flutter run
```

#### Environment Setup
Create `.env` files:

**sprout-backend/.env**
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/sprouts

# Aptos
APTOS_NETWORK=testnet
APTOS_MODULE_ADDRESS=0x...
APTOS_ADMIN_PRIVATE_KEY=0x...

# Plaid
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox
PLAID_WEBHOOK_URL=https://your-api.com/webhooks/plaid

# Strava
STRAVA_CLIENT_ID=165294
STRAVA_CLIENT_SECRET=...
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Flutter Mobile App                        │
│  • Aptos Wallet (Social Login)                              │
│  • Goal Management UI                                        │
│  • Sprout Visualization (AR + Health Bars)                  │
│  • Plaid Link Integration                                   │
│  • Strava OAuth                                             │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Express Backend                         │
│  • Aptos Service → Mint NFTs, Update Stats                  │
│  • Plaid Service → Sync Transactions                        │
│  • Goal Tracking → Process Activities, Rewards              │
│  • Strava Integration → Sync Workouts                       │
└─────────────────────────────────────────────────────────────┘
         ▼                   ▼                    ▼
┌──────────────┐   ┌──────────────┐    ┌──────────────────┐
│Aptos Network │   │ PostgreSQL   │    │ External APIs    │
│• Sprout NFTs │   │• Users       │    │• Strava          │
│• Activities  │   │• Goals       │    │• Plaid           │
└──────────────┘   │• Activities  │    └──────────────────┘
                   └──────────────┘
```

## Key Features Summary

### Neopets-Inspired Mechanics
✅ **Hunger System**: Sprouts get hungry over time (0-100)
✅ **Health System**: Poor care causes health decay
✅ **Feeding**: Complete goals to "feed" your Sprout
✅ **Happiness**: Reflects overall Sprout well-being
✅ **Withering State**: Visual indication of neglect

### Solo Leveling-Inspired Mechanics
✅ **Level System**: Earn XP, level up for stat boosts
✅ **Grade Evolution**: Normal → Elite → Knight → Commander → Marshal
✅ **Stat Growth**: Strength, Intelligence, Speed increase with level
✅ **Growth Stages**: Physical size changes (Sprout → Tree)
✅ **Collection**: Multiple Sprouts can level independently

### Blockchain Integration (Aptos)
✅ **NFT Sprouts**: Each Sprout is a unique on-chain NFT
✅ **Dynamic Metadata**: Stats update on-chain as Sprouts grow
✅ **Activity Tracking**: User achievements recorded immutably
✅ **Social Wallet**: Sign up with Google/Apple/Facebook
✅ **No Gas Fees**: Admin account handles transactions

### Goal Tracking
✅ **Fitness Goals**: Strava integration for workout tracking
✅ **Financial Goals**: Plaid integration for savings tracking
✅ **Habit Goals**: Custom habits with frequency targets
✅ **Automatic Progress**: Activities auto-update goal progress
✅ **Rewards System**: XP and points for achievements

## Timeline Estimate

- **Week 1**: Backend routes + cron jobs (CURRENT PRIORITY)
- **Week 2-3**: Flutter services refactor
- **Week 3-4**: Flutter UI implementation
- **Week 5**: Integration testing
- **Week 6**: User acceptance testing
- **Week 7**: Deployment to production

**Total**: ~7 weeks to fully functional MVP

## Next Immediate Steps

1. **Install Backend Dependencies**
   ```bash
   cd sprout-backend
   npm install @aptos-labs/ts-sdk plaid node-cron
   npm uninstall jsonwebtoken jwks-rsa
   ```

2. **Apply Database Schema**
   ```bash
   cd sprout-backend
   # Backup current database first!
   npx prisma migrate dev --name add_blockchain_and_goals
   ```

3. **Deploy Smart Contracts**
   ```bash
   cd sprout-contracts
   aptos init --profile testnet
   aptos move compile
   aptos move publish --profile testnet
   ```

4. **Implement Backend Routes** (See Phase 1 above)

5. **Set up Cron Jobs** (See Phase 2 above)

6. **Begin Flutter Refactor** (See Phase 3 above)

## Resources

- **Aptos Docs**: https://aptos.dev
- **Plaid Docs**: https://plaid.com/docs
- **Strava API**: https://developers.strava.com
- **Prisma Docs**: https://www.prisma.io/docs
- **Flutter**: https://flutter.dev

## Questions?

Refer back to:
- `SPROUTS_IMPLEMENTATION_PLAN.md` for detailed implementation guide
- `APTOS_BLOCKCHAIN_INTEGRATION_PLAN.md` for Aptos-specific setup
- Individual service files for code examples

---

**Status**: Foundation complete, ready for route implementation and frontend refactor.

**Estimated Completion**: 7 weeks from start of route implementation.
