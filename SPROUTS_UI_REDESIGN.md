# Sprouts UI/UX Redesign - Goal-Centric Experience

## Core Philosophy
**Goals First, Sprouts Second** - Users come to achieve goals, Sprouts are the companion that helps them succeed.

---

## New User Flow

### 1. Onboarding (First Time Users)

**Screen 1: Welcome**
```
┌─────────────────────────┐
│     🌱 SPROUTS          │
│                         │
│  Digital companions     │
│  that grow with your    │
│  goals                  │
│                         │
│  [Get Started]          │
└─────────────────────────┘
```

**Screen 2: Pick Your First Goal Category**
```
┌─────────────────────────┐
│  What do you want to    │
│  achieve?               │
│                         │
│  🏃 Fitness             │
│  💰 Finance             │
│  📚 Education           │
│  🙏 Faith               │
│  ⏱️  Screen Time         │
│  💼 Work                │
│                         │
│  (Tap to select)        │
└─────────────────────────┘
```

**Screen 3: Goal Setup (e.g., Fitness)**
```
┌─────────────────────────┐
│  🏃 Fitness Goal        │
│                         │
│  What's your goal?      │
│  ┌─────────────────┐   │
│  │ Run 20 miles/wk │   │
│  └─────────────────┘   │
│                         │
│  Target: [20] miles     │
│  Per:    [Week ▼]       │
│  Duration: [4 weeks]    │
│                         │
│  Connect Strava?        │
│  [Yes] [Manual Logging] │
│                         │
│  [Create Goal]          │
└─────────────────────────┘
```

**Screen 4: Choose Your Sprout**
```
┌─────────────────────────┐
│  Pick a companion!      │
│                         │
│  Your Sprout will grow  │
│  as you hit your goals  │
│                         │
│  ┌─────┐ ┌─────┐       │
│  │  🐉 │ │  🐱 │       │
│  │Dragon│ │ Cat │       │
│  └─────┘ └─────┘       │
│  ┌─────┐ ┌─────┐       │
│  │  🐘 │ │  🐦 │       │
│  │Eleph.│ │Bird │       │
│  └─────┘ └─────┘       │
│                         │
│  [Mint My Sprout] $2.99 │
└─────────────────────────┘
```

**Screen 5: Payment & Minting**
```
┌─────────────────────────┐
│  🐉 Minting Dragon...   │
│                         │
│  [■■■■■■░░░░] 60%       │
│                         │
│  Creating your Sprout   │
│  on Aptos blockchain    │
│                         │
│  (This takes ~10 sec)   │
└─────────────────────────┘
```

**Screen 6: Success! AR Preview**
```
┌─────────────────────────┐
│  ✅ Meet Your Sprout!   │
│                         │
│   [AR Camera View]      │
│   🐉 (tiny dragon)      │
│                         │
│  Your Dragon is ready!  │
│  Complete your goals to │
│  help it grow!          │
│                         │
│  Health: ████████ 100%  │
│                         │
│  [Start Journey]        │
└─────────────────────────┘
```

---

## Main App Structure

### Home Screen (Goals Dashboard)

```
┌─────────────────────────────────┐
│ ☰  SPROUTS          [+] [👤]   │
├─────────────────────────────────┤
│                                 │
│ Active Goals (3)                │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🏃 Run 20 miles/week        │ │
│ │ 🐉 Dragon (Lv 3) ❤️ 85%     │ │
│ │ ██████████░░░░░░ 14/20 mi   │ │
│ │ 3 days left                 │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 💰 Save $500/month          │ │
│ │ 🐘 Elephant (Lv 2) ❤️ 92%   │ │
│ │ ████████████░░░░ $380/$500  │ │
│ │ 12 days left                │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📚 Complete 2 courses/mo    │ │
│ │ 🐦 Bird (Lv 1) ❤️ 65%       │ │
│ │ ████████░░░░░░░░ 1/2        │ │
│ │ Warning: Feed your Sprout!  │ │
│ └─────────────────────────────┘ │
│                                 │
│ [+ Add New Goal]                │
│                                 │
└─────────────────────────────────┘

Bottom Nav:
[Goals] [Sprouts] [Stats] [More]
```

### Goal Detail Screen

```
┌─────────────────────────────────┐
│ ← 🏃 Run 20 miles/week      ⚙️  │
├─────────────────────────────────┤
│                                 │
│  [AR View of Dragon]            │
│  🐉 Growing strong!             │
│                                 │
│  Dragon • Level 3 • Common      │
│  ❤️  Health: ████████ 85%       │
│  ⭐ XP: ██████░░░░ 230/300      │
│                                 │
├─────────────────────────────────┤
│ Goal Progress                   │
│                                 │
│  14.2 / 20 miles                │
│  ██████████░░░░░░ 71%           │
│                                 │
│  3 days remaining               │
│  Started: Jan 1, 2025           │
│                                 │
├─────────────────────────────────┤
│ This Week's Activity            │
│                                 │
│  Mon: 3.2 mi ✅                 │
│  Tue: 2.8 mi ✅                 │
│  Wed: 4.1 mi ✅ +15 XP          │
│  Thu: 4.1 mi ✅                 │
│  Fri: 0 mi                      │
│  Sat: 0 mi                      │
│  Sun: 0 mi                      │
│                                 │
│  [Log Activity Manually]        │
│  [Connect Strava]               │
│                                 │
├─────────────────────────────────┤
│ What happens if I succeed?      │
│  ✅ Dragon grows to Level 4     │
│  ✅ +150 XP                     │
│  ✅ Unlock "Marathon Master"    │
│                                 │
│ What if I fail?                 │
│  ⚠️  Dragon loses health         │
│  ⚠️  May need to restart goal    │
│                                 │
└─────────────────────────────────┘
```

### Sprouts Collection Screen

```
┌─────────────────────────────────┐
│ ☰  My Sprouts            [+]    │
├─────────────────────────────────┤
│                                 │
│ Active (3)                      │
│                                 │
│ ┌──────────┐ ┌──────────┐      │
│ │    🐉    │ │    🐘    │      │
│ │  Dragon  │ │ Elephant │      │
│ │  Lv 3    │ │  Lv 2    │      │
│ │  85% ❤️   │ │  92% ❤️   │      │
│ └──────────┘ └──────────┘      │
│ ┌──────────┐                   │
│ │    🐦    │                   │
│ │   Bird   │                   │
│ │  Lv 1    │                   │
│ │  65% ❤️   │ ⚠️               │
│ └──────────┘                   │
│                                 │
│ Retired (2)                     │
│                                 │
│ ┌──────────┐ ┌──────────┐      │
│ │    🐱    │ │    💀    │      │
│ │   Cat    │ │  Failed  │      │
│ │ Success! │ │   RIP    │      │
│ └──────────┘ └──────────┘      │
│                                 │
└─────────────────────────────────┘
```

### Stats Screen

```
┌─────────────────────────────────┐
│ ☰  Your Progress                │
├─────────────────────────────────┤
│                                 │
│  Level 12 🏆                    │
│  ████████████░░ 2,450/3,000 XP  │
│                                 │
│  Current Streak: 🔥 14 days     │
│  Best Streak: 🏅 28 days        │
│                                 │
├─────────────────────────────────┤
│ Goals Summary                   │
│                                 │
│  Total Goals: 18                │
│  ✅ Completed: 12               │
│  🔄 Active: 3                   │
│  ❌ Failed: 3                   │
│                                 │
│  Success Rate: 80% 📈           │
│                                 │
├─────────────────────────────────┤
│ By Category                     │
│                                 │
│  🏃 Fitness:    8/10 ✅         │
│  💰 Finance:    3/5 ✅          │
│  📚 Education:  1/2 🔄          │
│  🙏 Faith:      0/1 ❌          │
│                                 │
├─────────────────────────────────┤
│ Achievements (12)               │
│                                 │
│  🏅 First Goal                  │
│  🔥 Week Warrior                │
│  💪 Marathon Master             │
│  💎 Diamond Streak              │
│                                 │
│  [View All]                     │
│                                 │
└─────────────────────────────────┘
```

---

## Key UI Components

### 1. Goal Card (Home Screen)
```dart
Widget GoalCard({
  required String title,
  required String emoji,
  required Sprout sprout,
  required double progress,
  required String timeLeft,
  bool isWarning = false,
}) {
  return Container(
    padding: EdgeInsets.all(16),
    decoration: BoxDecoration(
      gradient: LinearGradient(...),
      borderRadius: BorderRadius.circular(16),
      border: isWarning ? Border.all(color: Colors.red) : null,
    ),
    child: Column(
      children: [
        Row(
          children: [
            Text(emoji + " " + title),
            Spacer(),
            if (isWarning) Icon(Icons.warning, color: Colors.red),
          ],
        ),
        SproutHealthBar(sprout: sprout),
        ProgressBar(progress: progress),
        Text(timeLeft),
      ],
    ),
  );
}
```

### 2. Sprout Health Indicator
```dart
Widget SproutHealthBar({required Sprout sprout}) {
  return Row(
    children: [
      Text(sprout.emoji + " " + sprout.name),
      Text("Lv ${sprout.level}"),
      Spacer(),
      Text("❤️ ${sprout.health}%"),
      LinearProgressIndicator(
        value: sprout.health / 100,
        color: _getHealthColor(sprout.health),
      ),
    ],
  );
}
```

### 3. Goal Progress Widget
```dart
Widget GoalProgress({
  required double current,
  required double target,
  required String unit,
}) {
  return Column(
    children: [
      Text("${current.toStringAsFixed(1)} / $target $unit"),
      LinearProgressIndicator(
        value: current / target,
      ),
      Text("${((current / target) * 100).toInt()}% complete"),
    ],
  );
}
```

---

## User Journey Examples

### Journey 1: New User (Fitness Goal)
1. Downloads app
2. Sees welcome → "What do you want to achieve?"
3. Taps "🏃 Fitness"
4. Sets goal: "Run 20 miles/week"
5. Connects Strava
6. Picks Dragon Sprout
7. Pays $2.99 to mint
8. Sees Dragon in AR
9. Goes for run → Strava syncs → Dragon gains XP
10. Checks daily to see progress

### Journey 2: Existing User (Add Second Goal)
1. Opens app → sees Fitness goal progressing
2. Taps "+ Add New Goal"
3. Selects "💰 Finance"
4. Sets goal: "Save $500/month"
5. Connects Plaid
6. Picks Elephant Sprout
7. Pays $2.99 to mint
8. Now has 2 active Sprouts on home screen
9. Each Sprout tied to specific goal

### Journey 3: Goal Failure
1. User misses fitness goal for week
2. Dragon health drops to 20%
3. App sends notification: "Your Dragon needs you!"
4. User opens app → sees withering Dragon
5. Can either:
   - Pay to revive ($0.99)
   - Let it die and start fresh ($2.99 new Sprout)
6. Creates new motivation to succeed next time

---

## Critical UI/UX Principles

### 1. Goals Are Primary
- Home screen shows **goals**, not just Sprouts
- Sprouts are the **companion** to the goal
- Progress bars for goals, not just pet stats

### 2. Clear Progress Indicators
- Always show: current/target value
- Always show: time remaining
- Always show: Sprout health tied to goal

### 3. Motivation Through Visualization
- See Sprout grow in real-time (AR)
- Visual feedback for every activity
- Celebrations when goals are hit

### 4. Gentle Accountability
- Notifications when Sprout health is low
- Visual warnings on home screen
- But never guilt-trip or shame

### 5. Easy Goal Creation
- 3-step process: Category → Goal → Sprout
- Smart defaults for common goals
- One-tap integration connection

---

## Next Implementation Steps

1. **Backend:** Already done ✅
   - Sprout-Goal relationship in schema
   - 6 goal categories supported

2. **Create New Screens:**
   - Goal creation wizard (3 screens)
   - Enhanced home screen (goal cards)
   - Goal detail screen with AR
   - Stats/progress screen

3. **Update Data Models:**
   - Goal model with all 6 categories
   - Sprout model linked to goal
   - Progress tracking service

4. **Integrate APIs:**
   - Strava (fitness) - already working
   - Plaid (finance) - need credentials
   - Manual logging (education, faith, etc.)

5. **Polish:**
   - Animations for progress
   - AR model scaling based on level
   - Push notifications

---

Ready to start building? Let me know which screen/flow you want to tackle first!
