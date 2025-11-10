# Sprouts UX Improvement Plan

## Current Issues Identified

1. **Species not displaying**: Existing Sprouts have `species = 'Baby Sprout'` instead of actual animals (bear, deer, fox, owl, penguin, rabbit)
2. **No naming flow on hatch**: Users can't name their Sprout when it hatches from egg
3. **Food balance hidden**: Users can't see their food balance (currently 50, should be 100)
4. **No feed allocation UI**: Feed button just shows snackbar, doesn't let users allocate to rest/water/food
5. **Home screen cramped**: Grid layout doesn't showcase Sprouts well
6. **No stat preview on home**: Can't see Sprout health at a glance

---

## Implementation Plan

### **Phase 1: Fix Data & Species Display** ⚡ HIGH PRIORITY

#### 1.1 Update Existing Sprouts in Database
**Problem**: Existing Sprouts have `species = 'Baby Sprout'`
**Solution**: Run migration to assign random species to existing Sprouts

```sql
-- Update existing Sprouts with random species
UPDATE sprouts
SET species = (ARRAY['bear', 'deer', 'fox', 'owl', 'penguin', 'rabbit'])[floor(random() * 6 + 1)]
WHERE species = 'Baby Sprout' OR species IS NULL;
```

**Files to update**: None (database only)

---

#### 1.2 Set Default Food to 100
**Problem**: New users start with 50 food, should be 100
**Solution**: Update backend user creation

**File**: `sprout-backend/src/routes/walletAuth.ts` (line 103-108)
```typescript
// Change from:
await prisma.food.create({
  data: {
    userId: user.id,
    amount: 50, // ❌ OLD
  },
});

// To:
await prisma.food_inventory.create({
  data: {
    userId: user.id,
    amount: 100, // ✅ NEW - Start with 100 food
  },
});
```

**Also update**: Check if table name is `food` or `food_inventory` (appears to be `food_inventory`)

---

### **Phase 2: Hatching & Naming Flow** 🥚

#### 2.1 Add Naming Dialog on Hatch
**Problem**: Users can't name Sprout when hatching
**Solution**: Add name input dialog after egg hatching animation

**File**: `sprout-backend/src/routes/walletAuth.ts` (line 347-402)
- Remove the species assignment from hatch endpoint
- Let frontend send the name when hatching

**Updated Backend Endpoint**:
```typescript
router.post('/hatch-egg/:userId', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { name } = req.body; // ✅ Accept name from frontend

  const egg = await prisma.sprouts.findFirst({
    where: { userId, growthStage: 'Egg' },
  });

  if (!egg) {
    res.status(404).json({ error: 'No egg found to hatch' });
    return;
  }

  // Update to Sprout stage with user-provided name
  const hatchedSprout = await prisma.sprouts.update({
    where: { id: egg.id },
    data: {
      growthStage: 'Sprout',
      name: name || egg.name, // Use provided name or keep default
    },
  });

  // Award experience for hatching
  await prisma.users.update({
    where: { id: userId },
    data: { experience: { increment: 50 } },
  });

  res.json({
    success: true,
    message: 'Egg hatched successfully! 🎉',
    sprout: hatchedSprout,
  });
});
```

**Frontend Flow** (New file needed):
- Create `sprouts_flutter/lib/presentation/screens/hatch_egg_screen.dart`
- Show egg with tap animation
- After hatch, show naming dialog
- Call backend with chosen name
- Navigate to Sprout detail screen

**UI Flow**:
1. User taps egg → Egg cracks animation
2. Species revealed with character image
3. Dialog: "Give your [Bear/Deer/etc.] a name!"
4. Text input with suggestions (optional: "Brownie", "Bambi", etc.)
5. Confirm → Backend updates name → Show success

---

### **Phase 3: Feed System Overhaul** 🍎

#### 3.1 Show Food Balance on Home Screen
**Problem**: Food balance is hidden, users don't know how much they have
**Solution**: Add food balance card at top of home screen

**File**: `sprouts_flutter/lib/presentation/screens/collection_screen.dart`
- Add food balance query at top
- Display prominently: "🍎 Food: 100"

**UI Design**:
```dart
// Add at top of screen (after header, before grid)
Container(
  margin: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
  padding: EdgeInsets.all(16),
  decoration: BoxDecoration(
    gradient: LinearGradient(
      colors: [Color(0xFF4CAF50).withOpacity(0.3), Color(0xFF8BC34A).withOpacity(0.3)],
    ),
    borderRadius: BorderRadius.circular(16),
    border: Border.all(color: Color(0xFF4CAF50).withOpacity(0.5)),
  ),
  child: Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      Row(
        children: [
          Text('🍎', style: TextStyle(fontSize: 32)),
          SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Food Balance', style: TextStyle(color: Colors.white70, fontSize: 14)),
              Text('$foodBalance', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
      ElevatedButton.icon(
        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => StoreScreen())),
        icon: Icon(Icons.add, size: 18),
        label: Text('Buy More'),
        style: ElevatedButton.styleFrom(backgroundColor: Color(0xFF4CAF50)),
      ),
    ],
  ),
)
```

---

#### 3.2 Update Feed Button to Open Allocation Screen
**Problem**: Feed button just shows snackbar, doesn't allocate food
**Solution**: Navigate to feed allocation screen (feed_sprout_screen_v2.dart exists!)

**File**: `sprouts_flutter/lib/presentation/screens/sprout_detail_screen.dart` (line 685-692)
```typescript
// Change from:
void _feedSprout() {
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(
      content: Text('🍎 Fed your Sprout! Complete goals to feed it more!'),
      backgroundColor: Colors.orange,
    ),
  );
}

// To:
void _feedSprout() async {
  // Get current food balance
  final userId = await Web3AuthService.getUserId();
  final foodResponse = await http.get(
    Uri.parse('${AppConstants.baseUrl}/api/food/$userId'),
  );
  final foodData = jsonDecode(foodResponse.body);
  final foodBalance = foodData['foodBalance'] ?? 0;

  if (foodBalance <= 0) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('No food available! Complete goals or visit the store.'),
        backgroundColor: Colors.red,
      ),
    );
    return;
  }

  // Navigate to feed allocation screen
  final result = await Navigator.of(context).push(
    MaterialPageRoute(
      builder: (context) => FeedSproutScreenV2(
        sproutId: widget.sproutId,
        sproutName: sproutData?['name'] ?? widget.name,
        currentRest: sproutData?['restScore'] ?? 100,
        currentWater: sproutData?['waterScore'] ?? 100,
        currentFood: sproutData?['foodScore'] ?? 100,
        currentMood: sproutData?['mood'] ?? 'happy',
      ),
    ),
  );

  // Reload if sprout was fed
  if (result == true) {
    await _loadSproutData();
  }
}
```

**Import needed**: Add to imports at top
```dart
import 'feed_sprout_screen_v2.dart';
import '../../data/services/web3auth_service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
```

---

### **Phase 4: Store & Monetization** 💰

#### 4.1 Rename "Eggs" to "Store"
**Problem**: "Eggs" screen doesn't make sense for buying food
**Solution**: Rename everywhere

**Files to update**:
1. `sprouts_flutter/lib/presentation/screens/eggs_nursery_screen.dart` → Rename to `store_screen.dart`
2. `collection_screen.dart` (line 148-169): Change button text and icon
3. All navigation references

**New Store Screen Structure**:
```dart
class StoreScreen extends StatefulWidget {
  @override
  State<StoreScreen> createState() => _StoreScreenState();
}

class _StoreScreenState extends State<StoreScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Store'),
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(icon: Icon(Icons.restaurant), text: 'Food'),
            Tab(icon: Icon(Icons.egg), text: 'Eggs'),
            Tab(icon: Icon(Icons.style), text: 'Accessories'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildFoodShop(),
          _buildEggShop(),
          _buildAccessoriesShop(),
        ],
      ),
    );
  }
}
```

---

#### 4.2 Add Food Purchase Options
**Problem**: No way to buy food
**Solution**: Add food packages in Store

**Backend Endpoint** (new): `sprout-backend/src/routes/food.ts`
```typescript
/**
 * Purchase food with points/currency
 */
router.post('/purchase', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, packageType } = req.body;

    // Food packages
    const packages = {
      small: { amount: 50, cost: 100 },   // 100 points
      medium: { amount: 150, cost: 250 }, // 250 points
      large: { amount: 500, cost: 750 },  // 750 points
    };

    const pkg = packages[packageType];
    if (!pkg) {
      res.status(400).json({ error: 'Invalid package type' });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user || user.totalPoints < pkg.cost) {
      res.status(400).json({ error: 'Insufficient points' });
      return;
    }

    // Deduct points
    await prisma.users.update({
      where: { id: userId },
      data: { totalPoints: { decrement: pkg.cost } },
    });

    // Add food
    await prisma.food_inventory.upsert({
      where: { userId },
      update: { amount: { increment: pkg.amount } },
      create: { userId, amount: pkg.amount },
    });

    // Record transaction
    await prisma.food_transactions.create({
      data: {
        userId,
        amount: pkg.amount,
        type: 'purchase',
        source: `store_${packageType}`,
      },
    });

    res.json({
      success: true,
      message: `Purchased ${pkg.amount} food!`,
      newBalance: user.totalPoints - pkg.cost,
    });
  } catch (error) {
    console.error('Error purchasing food:', error);
    res.status(500).json({ error: 'Failed to purchase food' });
  }
});
```

**Frontend Food Shop UI**:
```dart
Widget _buildFoodShop() {
  return ListView(
    padding: EdgeInsets.all(20),
    children: [
      _buildFoodPackage(
        title: 'Small Bundle',
        amount: 50,
        cost: 100,
        icon: '🍎',
        color: Colors.green,
      ),
      SizedBox(height: 16),
      _buildFoodPackage(
        title: 'Medium Bundle',
        amount: 150,
        cost: 250,
        icon: '🍏',
        color: Colors.lightGreen,
        popular: true,
      ),
      SizedBox(height: 16),
      _buildFoodPackage(
        title: 'Large Bundle',
        amount: 500,
        cost: 750,
        icon: '🎁',
        color: Colors.amber,
      ),
    ],
  );
}
```

---

### **Phase 5: Home Screen Redesign** 📱 MAJOR UX CHANGE

#### 5.1 Vertical Stack Layout (Instagram-style)
**Problem**: Grid layout is cramped and doesn't showcase Sprouts
**Solution**: Vertical scrolling cards, one Sprout per viewport

**File**: `sprouts_flutter/lib/presentation/screens/collection_screen.dart`

**New Layout Design**:
```dart
Widget _buildCollectionList(BuildContext context) {
  return PageView.builder(
    scrollDirection: Axis.vertical, // ✅ Vertical Instagram-style
    itemCount: userCollection.length,
    itemBuilder: (context, index) {
      return _buildSproutCard(context, userCollection[index]);
    },
  );
}

Widget _buildSproutCard(BuildContext context, UserCollectionItem sprout) {
  final color = _getSpeciesColor(sprout.species);

  return Container(
    width: double.infinity,
    height: double.infinity,
    padding: EdgeInsets.symmetric(horizontal: 20, vertical: 40),
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Large character image (takes up 40% of screen)
        Expanded(
          flex: 5,
          child: Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.4),
                  blurRadius: 40,
                  spreadRadius: 10,
                ),
              ],
            ),
            child: ClipOval(
              child: Image.asset(
                'assets/sprouts/${sprout.species.toLowerCase()}.png',
                fit: BoxFit.cover,
              ),
            ),
          ),
        ),

        SizedBox(height: 30),

        // Name and level
        Expanded(
          flex: 1,
          child: Column(
            children: [
              Text(
                sprout.name,
                style: AppTheme.headlineMedium.copyWith(fontSize: 32),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 8),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Level ${sprout.level} • ${sprout.rarity}',
                  style: TextStyle(
                    color: color,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),

        // Stat preview (compact)
        Expanded(
          flex: 2,
          child: _buildStatPreview(sprout),
        ),

        // Action buttons
        Expanded(
          flex: 1,
          child: Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _feedSprout(sprout),
                  icon: Icon(Icons.restaurant),
                  label: Text('Feed'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    padding: EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _viewDetails(sprout),
                  icon: Icon(Icons.info_outline),
                  label: Text('Details'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: color,
                    padding: EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}
```

---

#### 5.2 Add Stat Preview to Home Cards
**Problem**: Can't see Sprout health at a glance
**Solution**: Add compact stat bars showing rest/water/food

**Widget**:
```dart
Widget _buildStatPreview(UserCollectionItem sprout) {
  return Container(
    padding: EdgeInsets.all(20),
    decoration: BoxDecoration(
      color: Colors.white.withOpacity(0.05),
      borderRadius: BorderRadius.circular(20),
      border: Border.all(
        color: Colors.white.withOpacity(0.1),
      ),
    ),
    child: Column(
      children: [
        _buildMiniStatBar('😴', 'Rest', sprout.restScore, Color(0xFF9C27B0)),
        SizedBox(height: 12),
        _buildMiniStatBar('💧', 'Water', sprout.waterScore, Color(0xFF03A9F4)),
        SizedBox(height: 12),
        _buildMiniStatBar('🍎', 'Food', sprout.foodScore, Color(0xFF4CAF50)),
      ],
    ),
  );
}

Widget _buildMiniStatBar(String icon, String label, int value, Color color) {
  return Row(
    children: [
      Text(icon, style: TextStyle(fontSize: 20)),
      SizedBox(width: 8),
      Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(label, style: TextStyle(color: Colors.white70, fontSize: 12)),
                Text('$value/100', style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
              ],
            ),
            SizedBox(height: 4),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: value / 100,
                backgroundColor: Colors.white.withOpacity(0.1),
                valueColor: AlwaysStoppedAnimation<Color>(color),
                minHeight: 6,
              ),
            ),
          ],
        ),
      ),
    ],
  );
}
```

**Update API Service** to include stats in collection:
- File: `sprouts_flutter/lib/data/repositories/user_collection_repository.dart`
- Ensure it fetches restScore, waterScore, foodScore, mood from backend

---

## Implementation Order (Priority)

### **Sprint 1: Critical Fixes** (Do First)
1. ✅ Update existing Sprouts species in database (SQL migration)
2. ✅ Set default food to 100 (backend: walletAuth.ts)
3. ✅ Show food balance on home screen (frontend: collection_screen.dart)
4. ✅ Connect feed button to allocation screen (frontend: sprout_detail_screen.dart)

### **Sprint 2: Hatching Experience** (High Priority)
5. ✅ Add naming flow when hatching (backend + frontend)
6. ✅ Create hatch screen with animation (new file: hatch_egg_screen.dart)

### **Sprint 3: Store & Monetization**
7. ✅ Rename Eggs screen to Store (refactor: eggs_nursery_screen.dart → store_screen.dart)
8. ✅ Add food purchase endpoint (backend: food.ts)
9. ✅ Build food shop UI (frontend: store_screen.dart)

### **Sprint 4: Home Screen Redesign** (Major UX)
10. ✅ Redesign home to vertical stack (frontend: collection_screen.dart - major refactor)
11. ✅ Add stat preview to cards (frontend: collection_screen.dart)
12. ✅ Update API to include stats in collection (backend: sprouts.ts)

---

## Files to Modify Summary

### Backend Files
1. `sprout-backend/src/routes/walletAuth.ts` - Default food amount, hatch naming
2. `sprout-backend/src/routes/food.ts` - Add purchase endpoint
3. Database migration - Update existing species

### Frontend Files
1. `sprouts_flutter/lib/presentation/screens/collection_screen.dart` - Food balance, vertical layout, stat preview
2. `sprouts_flutter/lib/presentation/screens/sprout_detail_screen.dart` - Connect feed button
3. `sprouts_flutter/lib/presentation/screens/eggs_nursery_screen.dart` - Rename to store_screen.dart
4. `sprouts_flutter/lib/presentation/screens/hatch_egg_screen.dart` - NEW FILE for hatching flow
5. `sprouts_flutter/lib/data/repositories/user_collection_repository.dart` - Include stats in API

### Database Changes
1. SQL migration to update existing Sprouts with random species
2. Verify food_inventory table structure

---

## Next Steps

Ready to start implementation! Recommended order:
1. First, fix the species issue (database + verify backend)
2. Then, update food defaults and show balance
3. Finally, tackle the home screen redesign

Which phase would you like to start with?
