# Platform Integrations for 6 Goal Categories

## Architecture: One Sprout Per Goal

Each user can have **multiple Sprouts**, where each Sprout is tied to **one specific goal**.

```
User (Wallet)
├── Sprout #1 (Dragon) → Fitness Goal → Strava
├── Sprout #2 (Elephant) → Finance Goal → Plaid
├── Sprout #3 (Bird) → Education Goal → Coursera/Udemy
├── Sprout #4 (Plant) → Screen Time → iOS Screen Time API
└── Sprout #5 (Tiger) → Work Goal → RescueTime/Toggl
```

### Business Model
- Users **buy** new Sprouts to track new goals (~$2-5 per Sprout NFT)
- If goal fails (Sprout dies/withers), user must **buy another Sprout** to retry
- Sprouts that succeed can be **leveled up** and kept as achievements

---

## 1. FITNESS 🏃 (Currently Working)

### Platform: Strava
**Status:** ✅ Already integrated

**Credentials:** Already in `_env`
```bash
STRAVA_CLIENT_ID=165294
STRAVA_CLIENT_SECRET=8680056c0f4fd78fb0ff482d8323ae34b41d8fee
```

**Activities Tracked:**
- Running (distance, pace, duration)
- Cycling (distance, speed, elevation)
- Swimming
- Walking
- Hiking

**Goal Examples:**
- Run 20 miles/week
- Cycle 100 miles/month
- Complete 10 workouts/week

**API Docs:** https://developers.strava.com/

---

## 2. FINANCE 💰

### Platform: Plaid (Banking)
**Status:** ❌ Need to set up

**Setup:**
1. Sign up at https://plaid.com/
2. Create application
3. Start with **Sandbox** environment (fake data for testing)

**Credentials Needed:**
```bash
PLAID_CLIENT_ID=<your_client_id>
PLAID_SECRET=<your_secret>
PLAID_ENV=sandbox  # or development/production
```

**Activities Tracked:**
- Bank account balances
- Transactions (income/expenses)
- Savings rate
- Spending by category

**Goal Examples:**
- Save $500/month
- Keep dining expenses under $200/month
- Increase savings by 10%
- No impulse purchases over $50

**API Docs:** https://plaid.com/docs/

**Alternative:** Stripe (for simpler transaction tracking)

---

## 3. EDUCATION 📚

### Platform Options:

#### Option A: Coursera API (Recommended)
**Status:** ❌ Need to set up

**Setup:**
1. Apply for Coursera Partner Program
2. Or use public course completion tracking

**Credentials:**
```bash
COURSERA_CLIENT_ID=<your_client_id>
COURSERA_CLIENT_SECRET=<your_client_secret>
```

**Tracked:**
- Course enrollments
- Lecture completions
- Quiz scores
- Certificates earned

**Goal Examples:**
- Complete 1 course/month
- Watch 5 lectures/week
- Earn 3 certificates/quarter

**API Docs:** https://www.coursera.org/api

#### Option B: Udemy API
**Similar to Coursera, tracks course progress**

#### Option C: Manual Logging
**Simple implementation:**
- User manually logs study hours
- Backend validates with proof (screenshots, notes)
- Time-based tracking (study 10 hours/week)

**No API needed - just:**
```typescript
// Manual education progress endpoint
POST /api/goals/:goalId/log-study
{
  "hours": 2.5,
  "subject": "Web Development",
  "proof": "image_url or notes"
}
```

---

## 4. FAITH 🙏

### Platform Options:

#### Option A: Manual Check-ins (Simplest)
**No API needed**

**Implementation:**
```typescript
// Daily faith activity logging
POST /api/goals/:goalId/log-activity
{
  "activityType": "prayer",
  "duration": 15,  // minutes
  "completed": true,
  "timestamp": "2025-10-02T08:00:00Z"
}
```

**Goal Examples:**
- Pray/meditate 15 mins daily
- Read scripture 3x/week
- Attend service weekly
- Complete devotional daily

#### Option B: Bible Apps Integration
**YouVersion Bible API** (if available)
- Track daily reading
- Devotional completion
- Verse memorization

**Setup:** Contact YouVersion for API access
```bash
YOUVERSION_API_KEY=<your_key>
```

#### Option C: Headspace/Calm (Meditation)
**For meditation/mindfulness tracking**

**Credentials:**
```bash
HEADSPACE_API_KEY=<your_key>
# or
CALM_API_KEY=<your_key>
```

---

## 5. SCREEN TIME ⏱️ (Reduction)

### Platform: iOS Screen Time / Android Digital Wellbeing

#### iOS Screen Time API
**Status:** ❌ Need to implement

**Setup:**
- Use iOS ScreenTime API (requires user permission)
- Access via DeviceActivityReport framework

**Flutter Package:**
```yaml
dependencies:
  screen_time: ^1.0.0  # Example package
```

**Implementation:**
```dart
// Request screen time data
final screenTimeData = await ScreenTime.getTodayUsage();

// Send to backend
POST /api/goals/:goalId/log-screentime
{
  "totalMinutes": 180,
  "socialMediaMinutes": 45,
  "date": "2025-10-02"
}
```

**Goal Examples:**
- Keep total screen time under 3 hours/day
- Reduce social media to 30 mins/day
- No phone after 10pm
- Max 1 hour on entertainment apps/day

**Alternative:** Manual logging with honor system

---

## 6. WORK 💼

### Platform Options:

#### Option A: RescueTime (Recommended)
**Status:** ❌ Need to set up

**Setup:**
1. Sign up at https://www.rescuetime.com/
2. Get API key from dashboard

**Credentials:**
```bash
RESCUETIME_API_KEY=<your_key>
```

**Tracked:**
- Productive time
- Time spent per application
- Focus sessions
- Distraction metrics

**API Docs:** https://www.rescuetime.com/apidoc

**Goal Examples:**
- 6 hours productive work/day
- 4 deep focus sessions/week
- Less than 1 hour on distracting sites

#### Option B: Toggl Track
**Time tracking app**

**Credentials:**
```bash
TOGGL_API_TOKEN=<your_token>
```

**Tracked:**
- Manual time entries
- Project hours
- Billable time

**API Docs:** https://developers.track.toggl.com/

#### Option C: GitHub (for developers)
**Track coding activity**

**Credentials:**
```bash
GITHUB_TOKEN=<personal_access_token>
```

**Tracked:**
- Commits per day
- Pull requests
- Code reviews
- Contribution streaks

**Goal Examples:**
- Commit code 5 days/week
- Complete 3 PRs/week
- Maintain 30-day contribution streak

---

## Implementation Priority

### Phase 1 (MVP - Already Done)
1. ✅ Fitness (Strava)
2. ✅ Finance (Plaid setup needed, but structure exists)

### Phase 2 (Quick Wins)
3. Manual logging for Education
4. Manual logging for Faith
5. Manual logging for Screen Time

### Phase 3 (Full Integration)
6. Coursera/Udemy API for Education
7. iOS Screen Time API
8. RescueTime/Toggl for Work

---

## Backend Changes Needed

### 1. Update Goal Model - Add Sprout Relationship

```prisma
// In schema.prisma
model Goal {
  // ... existing fields

  sproutId String?
  sprout   Sprout? @relation(fields: [sproutId], references: [id])
}

model Sprout {
  // ... existing fields

  goal Goal?  // One-to-one relationship
}
```

### 2. Create Integration Endpoints for Each Platform

```typescript
// src/routes/integrations/
├── strava.ts          ✅ Done
├── plaid.ts           ✅ Done
├── coursera.ts        ⏳ TODO
├── rescueTime.ts      ⏳ TODO
├── screenTime.ts      ⏳ TODO
└── manual.ts          ⏳ TODO (for faith/education manual logging)
```

### 3. Update Sprout Creation Flow

```typescript
// POST /api/sprouts/mint
{
  "userId": "user123",
  "goalId": "goal456",  // Link sprout to goal
  "species": "Dragon",
  "name": "My Fitness Dragon",
  "goalType": "fitness"
}
```

### 4. Goal Failure = Sprout Dies

```typescript
// When goal is not met:
// - Sprout health drops to 0
// - Mark as "withering" on blockchain
// - User must mint new sprout to retry goal
```

---

## Required Credentials Summary

### Must Have (Phase 1)
- ✅ Strava (have)
- ❌ Plaid Client ID + Secret
- ❌ Aptos contract address (deploying now)

### Nice to Have (Phase 2-3)
- ❌ Coursera/Udemy API keys
- ❌ RescueTime API key
- ❌ Toggl API token
- ❌ iOS Screen Time permission (in-app)

### Don't Need (Manual Logging)
- Faith activities
- Education (until API access)
- Screen time (until iOS API implemented)

---

## Testing Strategy

1. **Strava:** Already working, test with real activities
2. **Plaid:** Use sandbox with fake bank accounts
3. **Manual logging:** Test with mock data
4. **Integration testing:**
   - Create goal → Mint sprout → Complete activity → Check sprout health
   - Fail goal → Sprout withers → User buys new sprout

---

## Next Steps

1. ✅ Deploy Aptos contract
2. ✅ Set up ngrok for local testing
3. ❌ Get Plaid sandbox credentials
4. ❌ Implement manual logging for education/faith/screentime
5. ❌ Update schema to link Sprout ↔ Goal
6. ❌ Test full flow with one goal category
