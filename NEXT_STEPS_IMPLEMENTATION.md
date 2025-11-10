# Sprouts - Next Steps Implementation Plan

## ✅ What's Working Now
1. **Web3Auth Authentication** - Users can sign in with Google/Apple
2. **Wallet Creation** - Each user gets an Aptos wallet automatically
3. **Backend Registration** - User data saved to Supabase PostgreSQL
4. **Deployed Smart Contract** - `0x52503f9537f9c995b1883cc5967b6cc104842954aee3c009dcd08022aa2cee1e` on Aptos testnet

## 🎯 Implementation Priority

### Phase 1: Connect Real Data (HIGH PRIORITY)
**Goal:** Replace demo data with real user data from backend

#### 1.1 Fix Collection Screen to Load Real Data
- **File:** `sprouts_flutter/lib/presentation/screens/collection_screen.dart`
- **Changes:**
  - Remove hardcoded `demoCollection`
  - Uncomment API calls in `_loadUserCollection()`
  - Connect to backend `/api/sprouts/user/:userId` endpoint
  - Show empty state for new users (already built at line 417)

#### 1.2 Add Wallet Display
- **File:** `sprouts_flutter/lib/presentation/screens/settings_screen.dart`
- **Changes:**
  - Add wallet address display in user profile card
  - Show shortened address with copy button: `0x5f35...0aff`
  - Add "View on Explorer" link to Aptos testnet explorer

#### 1.3 Update Empty State Message
- **File:** `sprouts_flutter/lib/presentation/screens/collection_screen.dart` (line 417-475)
- **Current:** "No Sprouts Yet" → "Check Your Eggs"
- **New:** Show instructions to get first Sprout:
  ```
  "Get Your First Sprout FREE!"
  "Set a goal in any category to mint your first Sprout NFT"
  [Button: "Set My First Goal"]
  ```

### Phase 2: Goal Creation Flow (HIGH PRIORITY)
**Goal:** Allow users to create goals and automatically mint Sprouts

#### 2.1 Create Goal Selection Screen
- **New File:** `sprouts_flutter/lib/presentation/screens/goal_selection_screen.dart`
- **Features:**
  - Show 6 categories (Fitness, Finance, Education, Faith, Screentime, Work)
  - Each category shows icon + description
  - Tap to create goal in that category

#### 2.2 Create Goal Details Screen
- **New File:** `sprouts_flutter/lib/presentation/screens/goal_create_screen.dart`
- **Features:**
  - Category-specific goal templates
  - Input: Goal name, target value, unit, frequency
  - Examples for each category type

#### 2.3 Backend Goal Creation + Sprout Minting
- **Backend is already set up** ✅
- When goal created → automatically mint Sprout for that category
- API endpoint exists: `POST /api/goals`
- Minting logic exists: `walletAuth.ts` lines 57-97

### Phase 3: Display Minted Sprouts (MEDIUM PRIORITY)
**Goal:** Show user's real Sprouts from blockchain

#### 3.1 Fetch Sprouts from Backend
- **File:** `sprouts_flutter/lib/data/repositories/user_collection_repository.dart`
- Connect to: `GET /api/sprouts/user/:userId`
- Map backend data to UI models

#### 3.2 Show Sprout Stats
- Display level, health, category
- Show which goals are linked to each Sprout
- Health bar based on goal progress

#### 3.3 View on Blockchain
- Add button: "View on Aptos Explorer"
- Link to: `https://explorer.aptoslabs.com/account/{nftAddress}?network=testnet`

### Phase 4: Goal Tracking & Progress (MEDIUM PRIORITY)
**Goal:** Track goal progress and update Sprout health

#### 4.1 Goal Progress Screen
- **New File:** `sprouts_flutter/lib/presentation/screens/goals_screen.dart`
- Show active goals with progress bars
- Manual check-in button for goals
- Automatic tracking via Strava/Plaid (already partially implemented)

#### 4.2 Update Sprout Health
- When goal progressed → increase Sprout health
- When goal neglected → decrease health (withering)
- Backend cron job exists: `jobs/sproutHealthDecay.ts`

#### 4.3 Rewards System
- Complete goal → earn accessories for Sprout
- Level up Sprout with consistent progress
- Backend logic exists: `routes/goals.ts`

### Phase 5: Strava Integration (LOW PRIORITY)
**Goal:** Auto-track fitness goals via Strava

- Strava OAuth already implemented in backend
- Frontend needs Strava connection flow
- Auto-sync activities → update fitness goals
- Backend endpoint: `POST /api/strava/sync-activities`

---

## 🚀 Quick Win: Minimum Viable Flow

To get end-to-end working FAST, implement in this order:

1. **Remove demo data** from collection screen (5 min)
2. **Show empty state** for new users (already built)
3. **Add "Create Goal" button** that calls backend (30 min)
4. **Backend mints Sprout** when goal created (already works)
5. **Fetch and display** real Sprouts (30 min)

**Total Time: ~1-2 hours for working prototype**

---

## 📊 Database Status

**Supabase PostgreSQL** is already configured and working:
- Users table: ✅ Working (user ID: `cmgpemkal0000ovzg3hmr0dza`)
- Sprouts table: ✅ Schema ready
- Goals table: ✅ Schema ready
- Wallet addresses: ✅ Stored

**To verify data in Supabase:**
```sql
-- Check if user was created
SELECT * FROM users WHERE id = 'cmgpemkal0000ovzg3hmr0dza';

-- Check sprouts
SELECT * FROM sprouts WHERE "userId" = 'cmgpemkal0000ovzg3hmr0dza';

-- Check goals
SELECT * FROM goals WHERE "userId" = 'cmgpemkal0000ovzg3hmr0dza';
```

---

## 🧪 Testing Plan

### Test 1: Account Creation Flow
1. ✅ Sign in with Google/Apple
2. ✅ Wallet created
3. ✅ User saved to database
4. ⏳ Empty collection shown
5. ⏳ Prompted to create first goal

### Test 2: First Goal → First Sprout
1. ⏳ Click "Set My First Goal"
2. ⏳ Choose category (e.g., Fitness)
3. ⏳ Enter goal details
4. ⏳ Backend mints Sprout NFT
5. ⏳ Sprout appears in collection
6. ⏳ View on Aptos explorer

### Test 3: Goal Progress
1. ⏳ Mark goal as progressed
2. ⏳ Sprout health increases
3. ⏳ Stats updated on-chain
4. ⏳ Level up when threshold reached

---

## 📝 Notes

- **Smart Contract:** Already deployed and initialized
- **Backend:** Running and connected to ngrok
- **Frontend:** Authentication complete, needs real data connection
- **Next Blocker:** Replace demo collection with real API calls

**Recommendation:** Start with Phase 1.1 - connecting the collection screen to real backend data. This will immediately show the empty state and prepare for goal creation.
