# Sprouts Implementation Complete - Goal Creation & Sprout Minting

## Overview
Successfully implemented end-to-end goal creation and automatic Sprout NFT minting functionality.

## What Was Implemented

### 1. Backend Updates (`sprout-backend/`)

#### Updated Files:
- **`src/routes/goals.ts`**
  - Added automatic Sprout NFT minting when a goal is created
  - One Sprout per category (fitness, finance, education, faith, screentime, work)
  - Category-specific Sprout species and rarity
  - Minting logic integrated with Aptos blockchain via `AptosService`

#### Minting Logic:
```typescript
// When a goal is created, check if user has a Sprout for this category
// If not, mint a new Sprout NFT with category-specific attributes
const categoryMapping = {
  fitness: { species: 'Athletic Sprout', rarity: 'Rare' },
  finance: { species: 'Wealthy Sprout', rarity: 'Rare' },
  education: { species: 'Wise Sprout', rarity: 'Rare' },
  faith: { species: 'Spiritual Sprout', rarity: 'Rare' },
  screentime: { species: 'Mindful Sprout', rarity: 'Rare' },
  work: { species: 'Productive Sprout', rarity: 'Rare' },
};
```

### 2. Flutter App Updates (`sprouts_flutter/`)

#### Updated Files:

**API Service (`lib/data/services/api_service.dart`)**
- ✅ Updated to use `AppConstants.baseUrl` (ngrok URL)
- ✅ Added `getUserSprouts()` - Fetch user's Sprouts from backend
- ✅ Added `getSproutById()` - Get single Sprout details
- ✅ Added `getSproutHealth()` - Get Sprout health status
- ✅ Added `createGoal()` - Create new goal
- ✅ Added `getUserGoals()` - Get user's goals with filters
- ✅ Added `getGoalById()` - Get single goal details
- ✅ Added `updateGoal()` - Update goal progress
- ✅ Added `logGoalProgress()` - Manually log progress toward goal

**Collection Screen (`lib/presentation/screens/collection_screen.dart`)**
- ✅ Removed hardcoded demo data
- ✅ Connected to real backend API via `UserCollectionRepository`
- ✅ Added loading/error states
- ✅ Updated empty state with "Get Your First Sprout FREE!" message
- ✅ Added "Create My First Goal" button that navigates to goal selection
- ✅ Added "Goals" button to action bar (replaces "Shop")
- ✅ Auto-refreshes collection when returning from goals screen

**User Collection Repository (`lib/data/repositories/user_collection_repository.dart`)**
- ✅ Updated to use `Web3AuthService` instead of deprecated auth
- ✅ Fetches real Sprouts from backend API endpoint: `GET /api/sprouts/user/:userId`
- ✅ Maps backend data to `UserCollectionItem` model

#### New Files:

**Goal Selection Screen (`lib/presentation/screens/goal_selection_screen.dart`)**
- Beautiful grid layout with 6 goal categories
- Each category has:
  - Custom icon
  - Category-specific color
  - Description
  - Navigation to goal creation screen
- Categories:
  - 🏃 Fitness (Red) - Track workouts, runs, & activities
  - 💰 Finance (Green) - Save money & manage spending
  - 📚 Education (Blue) - Learn new skills & read books
  - ❤️ Faith (Pink) - Meditation & spiritual practices
  - 📱 Screentime (Orange) - Reduce phone & social media use
  - 💼 Work (Purple) - Productivity & career goals

**Goal Create Screen (`lib/presentation/screens/goal_create_screen.dart`)**
- Category-specific goal templates
- Form fields:
  - Goal title (with category-specific placeholder)
  - Description (optional)
  - Target value (numeric)
  - Unit selector (category-specific options)
  - Frequency selector (daily, weekly, monthly)
- Creates goal via backend API
- Automatically triggers Sprout NFT minting
- Shows success message and navigates back to collection

**Goals Tracking Screen (`lib/presentation/screens/goals_screen.dart`)**
- Two tabs: Active Goals and Completed Goals
- Goal cards showing:
  - Category badge
  - Goal title and description
  - Progress bar with percentage
  - Current value / target value
  - "Log Progress" button for manual updates
- Manual progress logging with dialog:
  - Enter progress value
  - Add optional notes
  - Updates goal progress via API
- "Add Goal" button in header
- Empty state with "Create Goal" CTA
- Auto-refreshes after logging progress

### 3. Flow Diagram

```
┌─────────────────────────────────────────────────┐
│ User Signs In (Google/Apple via Web3Auth)      │
│ → Wallet Created → Registered in Backend       │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│ Collection Screen (Empty State)                 │
│ → "Get Your First Sprout FREE!"                 │
│ → "Create My First Goal" button                 │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│ Goal Selection Screen                           │
│ → Choose category (Fitness, Finance, etc.)     │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│ Goal Create Screen                              │
│ → Fill out goal details                         │
│ → Submit to backend API                         │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│ Backend: POST /api/goals                        │
│ 1. Create goal in database                      │
│ 2. Check if Sprout exists for category          │
│ 3. If not, mint Sprout NFT on Aptos blockchain │
│ 4. Save Sprout to database                      │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│ Collection Screen (With Sprout!)                │
│ → Shows newly minted Sprout                     │
│ → Displays category-specific species            │
│ → "Goals" button to track progress              │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│ Goals Screen                                     │
│ → View active & completed goals                 │
│ → Log progress manually                         │
│ → Create additional goals                       │
└─────────────────────────────────────────────────┘
```

## Testing Checklist

### ✅ Phase 1: Connection
- [x] Collection screen loads without demo data
- [x] Empty state shows for new users
- [x] Backend API connection works

### ⏳ Phase 2: Goal Creation (Ready to Test)
- [ ] Tap "Create My First Goal" button
- [ ] Select a category (e.g., Fitness)
- [ ] Fill out goal form
- [ ] Submit goal
- [ ] Backend creates goal
- [ ] Backend mints Sprout NFT
- [ ] Success message appears
- [ ] Navigate back to collection

### ⏳ Phase 3: Display Sprouts (Ready to Test)
- [ ] Collection screen refreshes
- [ ] Newly minted Sprout appears
- [ ] Sprout has correct species for category
- [ ] Can tap Sprout to view details

### ⏳ Phase 4: Goal Tracking (Ready to Test)
- [ ] Tap "Goals" button
- [ ] See active goal in list
- [ ] Tap "Log Progress"
- [ ] Enter progress value
- [ ] Submit progress
- [ ] Goal progress updates
- [ ] Sprout health increases (backend logic)

## API Endpoints Used

### Sprouts
- `GET /api/sprouts/user/:userId` - Get user's Sprouts
- `GET /api/sprouts/:sproutId` - Get Sprout details
- `GET /api/sprouts/:sproutId/health` - Get Sprout health

### Goals
- `POST /api/goals` - Create goal (triggers Sprout minting)
- `GET /api/goals/user/:userId` - Get user's goals
- `GET /api/goals/:goalId` - Get goal details
- `PUT /api/goals/:goalId` - Update goal
- `POST /api/goals/:goalId/progress` - Log progress

### Auth
- `POST /api/auth/connect-wallet` - Register/login user

## Database Schema

### Sprouts Table
```prisma
model Sprout {
  id                String   @id @default(cuid())
  userId            String
  nftAddress        String
  tokenId           String
  mintTransactionHash String
  name              String
  species           String
  rarity            String
  category          String?  // NEW: links Sprout to goal category
  grade             String
  level             Int
  experience        Int
  healthPoints      Int
  hungerLevel       Int
  happinessLevel    Int
  growthStage       String
  isWithering       Boolean
  createdAt         DateTime @default(now())
  // ... more fields
}
```

### Goals Table
```prisma
model Goal {
  id              String    @id @default(cuid())
  userId          String
  title           String
  description     String?
  type            String    // category: fitness, finance, etc.
  category        String
  targetValue     Float
  currentValue    Float     @default(0)
  unit            String
  frequency       String    // daily, weekly, monthly
  isActive        Boolean   @default(true)
  isCompleted     Boolean   @default(false)
  startDate       DateTime  @default(now())
  endDate         DateTime?
  completedAt     DateTime?
  experienceReward Int      @default(100)
  pointsReward    Int       @default(50)
  // ... more fields
}
```

## Key Features

### 1. Category-Based Sprout System
- Each goal category gets its own unique Sprout
- Users can have up to 6 Sprouts (one per category)
- Each Sprout has category-specific species name and appearance

### 2. Automatic NFT Minting
- No manual minting required
- Happens automatically when first goal in category is created
- Minted on Aptos testnet blockchain
- Transaction hash stored in database

### 3. Progress Tracking
- Manual progress logging via UI
- Progress stored on-chain and off-chain
- Sprout health tied to goal completion
- Experience and points awarded for progress

### 4. Empty State UX
- Clear call-to-action for new users
- Explains benefit: "Get Your First Sprout FREE!"
- Step-by-step guidance to first Sprout

## Next Steps (Future Enhancements)

### High Priority
- [ ] Auto-sync Strava activities to fitness goals
- [ ] Auto-sync Plaid transactions to finance goals
- [ ] Add Sprout detail view with on-chain stats
- [ ] Display wallet address in settings
- [ ] Add "View on Aptos Explorer" link

### Medium Priority
- [ ] Implement health decay for inactive Sprouts
- [ ] Add level-up animations
- [ ] Show Sprout evolution stages (Sprout → Seedling → Plant → Tree)
- [ ] Add rewards/accessories for completed goals

### Low Priority
- [ ] Breeding mechanics (combine two Sprouts)
- [ ] Egg hatching system
- [ ] Social features (view friends' Sprouts)
- [ ] Marketplace for trading Sprouts

## Environment Setup

### Backend Environment Variables
```bash
# Aptos Configuration
APTOS_NETWORK=testnet
APTOS_CONTRACT_ADDRESS=0x52503f9537f9c995b1883cc5967b6cc104842954aee3c009dcd08022aa2cee1e
APTOS_MODULE_ADDRESS=0x52503f9537f9c995b1883cc5967b6cc104842954aee3c009dcd08022aa2cee1e
APTOS_ADMIN_PRIVATE_KEY=0xa05c8e49b12394f276c29198092db27ae82ed122650035e106d667d710fa44d5
APTOS_RPC_URL=https://fullnode.testnet.aptoslabs.com/v1

# Supabase Database
DATABASE_URL=postgresql://...
```

### Flutter Environment
```dart
// lib/core/constants/app_constants.dart
static const String baseUrl = 'https://3bfa84c20c6c.ngrok-free.app';
```

### Web3Auth Configuration
- Product: Plug and Play
- Network: Sapphire DevNet
- Blockchain: Aptos
- iOS Bundle ID: `com.sprouts.app`
- Redirect URL: `com.sprouts.app://auth`

## Testing the Complete Flow

### Prerequisites
1. Backend running: `cd sprout-backend && npm run dev`
2. ngrok running: `ngrok http 3000`
3. Flutter app constants updated with ngrok URL
4. iOS simulator or device ready

### Test Steps
```bash
# 1. Start backend
cd sprout-backend
npm run dev

# 2. Start ngrok (in another terminal)
ngrok http 3000

# 3. Update Flutter app constants with ngrok URL
# Edit: sprouts_flutter/lib/core/constants/app_constants.dart

# 4. Run Flutter app
cd sprouts_flutter
flutter run -d iPhone

# 5. Test the flow:
# - Sign in with Google/Apple
# - See empty collection screen
# - Tap "Create My First Goal"
# - Select "Fitness"
# - Fill out goal: "Run 10 miles this week"
# - Submit
# - Watch for success message
# - See Sprout appear in collection!
# - Tap "Goals" to see active goal
# - Log progress: "5 miles"
# - Watch progress bar update
```

## Known Issues
- None currently - all features implemented and ready for testing

## Success Criteria Met ✅
- [x] Removed demo data from collection screen
- [x] Connected to real backend API
- [x] Created goal selection UI
- [x] Created goal creation UI
- [x] Backend mints Sprout on goal creation
- [x] Created goals tracking UI
- [x] End-to-end flow implemented

## Time Estimate for Testing
- Initial setup: 5 minutes
- Full flow test: 5 minutes
- Goal creation test: 2 minutes
- Progress logging test: 2 minutes
- **Total: ~15 minutes for complete testing**

---

**Status**: Implementation complete, ready for testing
**Last Updated**: January 2025
**Next Action**: Test the complete flow on iOS device/simulator
