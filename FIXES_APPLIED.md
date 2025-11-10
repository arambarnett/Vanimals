# Fixes Applied - Oct 24, 2025

## Issues Fixed:

### 1. ✅ Goal Creation Error - `sproutType is not defined`
**File**: `sprout-backend/src/routes/goals.ts`
**Problem**: Line 92 referenced `sproutType.species` which didn't exist
**Fix**: Changed to use `randomSpecies` variable that was already defined

**Before:**
```typescript
species: sproutType.species,  // ❌ undefined variable
rarity: sproutType.rarity,
```

**After:**
```typescript
species: randomSpecies,  // ✅ correctly defined
rarity: 'Rare',
```

Also added missing fields:
- `restScore: 100`
- `waterScore: 100`
- `foodScore: 100`
- `mood: 'happy'`
- `isDead: false`
- Generated unique `nftAddress` instead of using wallet address

---

### 2. ✅ Aptos Service Errors - Missing Functions
**File**: `sprout-backend/src/services/aptosService.ts`

**Problem**: Backend was calling `get_sprout_stats()` and expecting wrong return values from `get_sprout_info()`, but your simplified contract doesn't have these functions with those signatures.

**Fix**:
- `getSproutStats()` - Returns null with warning (stats stored in database)
- `getSproutInfo()` - Updated to only expect (species, rarity) not (species, rarity, grade)

**Before:**
```typescript
const stats = await this.aptos.view({ payload });  // Function doesn't exist
return {
  level: Number(stats[0]),
  experience: Number(stats[1]),
  // ...10 more fields
};
```

**After:**
```typescript
// Simplified contract doesn't have get_sprout_stats
// Stats are stored off-chain in database
console.warn('getSproutStats called - using database instead');
return null;
```

---

### 3. 🔄 Supabase Images Uploaded
**Status**: ✅ Complete
- All 12 images uploaded (6 species × 2 stages)
- Egg stage: bear, deer, fox, owl, penguin, rabbit
- Sprout stage: bear, deer, fox, owl, penguin, rabbit
- All publicly accessible at: `https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public/sprouts/`

---

## Remaining Issues:

### Issue A: No Hatch Animation Shown
**User Report**:
> "i think i created a new account but no hatch animations"

**Logs Show**:
```
flutter: ✅ Petra wallet address received: 0xb1986b9a9b10646fcd71db70d606b93fe1eb16f604573e28e0329b9eafebc1c3
flutter: 🎉 Wallet connected successfully!
flutter: 📝 Saved userId: cmh2os3h500002gmss2b5zjlw
```

**Diagnosis**:
- User connected successfully
- User ID saved
- BUT: Flutter app didn't navigate to egg hatching screen

**Likely Cause**:
The wallet connection flow in `wallet_selection_screen.dart` doesn't check if the user has a new egg and navigate to the hatch screen.

**Fix Needed**:
After successful wallet connection, check if user has an egg (`growthStage: 'Egg'`) and if so, navigate to `starter_egg_screen.dart`.

---

### Issue B: Goal Tracking Not Working
**User Report**:
> "we need to work on the goal setting flow and tracking"

**Logs Show**:
```
📊 Processing activity: { userId: 'cmh2os3h500002gmss2b5zjlw', type: 'fitness', category: 'running', value: 7.065256564802963, unit: 'miles' }
📝 Found 0 relevant goals
```

**Diagnosis**:
- Strava activities are being synced ✅
- BUT: No goals exist for this user
- Activities are processed but have nothing to track against

**Fix Needed**:
1. Create a better goal creation UI in Flutter
2. Show onboarding flow to create first goal after hatching
3. Make it easy to link Strava activities to goals

---

## Questions Answered:

### Q1: Are sprouts randomly assigned?
**A**: ✅ YES

Looking at the code:
```typescript
const availableSpecies = ['bear', 'deer', 'fox', 'owl', 'penguin', 'rabbit'];
const randomSpecies = availableSpecies[Math.floor(Math.random() * availableSpecies.length)];
```

When a user connects their wallet for the first time, they get:
- Random species from the 6 available
- Common rarity (for starter sprout)
- Egg growth stage (which they then hatch)

**For goal-based sprouts:**
- Also random species
- Rare rarity (slightly better than starter)
- Starts as Sprout (already hatched)

---

### Q2: Why no hatch animation?
**A**: Navigation issue in Flutter app

The wallet connection succeeds and creates an egg in the database, but the app doesn't automatically navigate to the hatch screen.

**Solution needed in `wallet_selection_screen.dart`:**

```dart
// After successful wallet connection
if (responseData['isNewUser'] == true) {
  // New user - check if they have an egg to hatch
  final sproutsCount = responseData['user']['sproutsCount'] ?? 0;
  if (sproutsCount > 0) {
    // Navigate to egg hatching screen
    Navigator.pushReplacementNamed(context, '/hatch-egg');
  } else {
    // Navigate to home
    Navigator.pushReplacementNamed(context, '/home');
  }
}
```

---

### Q3: Why aren't Strava activities tracking goals?
**A**: User has no goals created yet

The backend is correctly:
1. ✅ Syncing Strava activities
2. ✅ Processing each activity
3. ❌ But finding 0 goals to track against

**Solution**: Create a goal creation flow that:
1. Shows after user hatches their first egg
2. Suggests goals based on integrations (e.g., "Run 15 miles this week")
3. Makes it easy to create and track progress

---

## Next Steps (Priority Order):

### 1. Deploy Updated Smart Contract ⚠️ REQUIRED
```bash
cd sprout-contracts
aptos move compile
aptos move publish --assume-yes
```

This fixes the `EOBJECT_EXISTS` error that prevents multiple users from minting.

---

### 2. Restart Backend ✅ EASY
```bash
cd sprout-backend
npm run dev
```

This applies the fixes we just made to goals.ts and aptosService.ts.

---

### 3. Fix Hatch Navigation in Flutter 🎯 HIGH PRIORITY

**File**: `sprouts_flutter/lib/presentation/screens/wallet_selection_screen.dart`

After `_handleWalletCallback()` succeeds, check if new user has an egg and navigate appropriately.

---

### 4. Improve Goal Creation Flow 🎯 HIGH PRIORITY

**New Screen Needed**: `sprouts_flutter/lib/presentation/screens/create_goal_screen.dart`

Should allow users to:
- See suggested goals based on integrations
- Create custom goals
- Set target values and frequency
- Link to their Sprout

---

### 5. Test Full Flow 🧪

1. Connect new Petra wallet → Should mint NFT
2. Should auto-navigate to hatch screen → Hatch egg
3. Should show goal creation prompt → Create a goal
4. Do a Strava activity → Should update goal progress

---

## Summary

**Fixed Now:**
- ✅ Goal creation error (`sproutType` undefined)
- ✅ Aptos service errors (wrong function calls)
- ✅ Uploaded all sprout images to Supabase

**Still Need To Do:**
- ⚠️ Deploy smart contract (to fix EOBJECT_EXISTS)
- 🔧 Fix Flutter navigation (to show hatch screen)
- 🔧 Create goal creation UI (to track activities)

**Ready to deploy after smart contract is updated!**
