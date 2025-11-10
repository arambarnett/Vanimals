# Quick Start: Get Sprouts Running on iPhone

## Step-by-Step Testing Guide

### 1. Deploy Aptos Contract (5 minutes)

```bash
# Install Aptos CLI if needed
brew install aptos

# Navigate to contract directory
cd sprout-contracts

# Initialize testnet account (generates wallet + gets test tokens)
aptos init --network testnet

# You'll get an address like: 0x1234...abcd
# SAVE THIS ADDRESS!

# Update Move.toml with your address
# Edit Move.toml and replace sprout_addr = "_" with your address

# Compile contract
aptos move compile --named-addresses sprout_addr=YOUR_ADDRESS

# Deploy to testnet
aptos move publish --named-addresses sprout_addr=YOUR_ADDRESS --profile default

# Initialize the collection
aptos move run \
  --function-id 'YOUR_ADDRESS::sprout_nft::initialize_collection' \
  --profile default
```

**✅ Save your contract address for next step**

---

### 2. Start Backend with ngrok (2 minutes)

```bash
# Terminal 1 - Start backend
cd sprout-backend

# Add contract address to _env
echo "APTOS_CONTRACT_ADDRESS=YOUR_ADDRESS" >> _env
echo "APTOS_NETWORK=testnet" >> _env
echo "APTOS_RPC_URL=https://fullnode.testnet.aptoslabs.com/v1" >> _env

# Start backend
npm run dev
```

```bash
# Terminal 2 - Start ngrok
ngrok http 3000
```

**Get your ngrok URL:** Open http://localhost:4040
- Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

---

### 3. Update Flutter App (2 minutes)

Create file: `sprouts_flutter/lib/core/constants/app_constants.dart`

```dart
class AppConstants {
  static const String appName = 'Sprouts';

  // Replace with your ngrok URL
  static const String baseUrl = 'https://YOUR_NGROK_URL.ngrok-free.app';

  // Or for production:
  // static const String baseUrl = 'https://your-backend.vercel.app';
}
```

Create file: `sprouts_flutter/lib/core/constants/blockchain_constants.dart`

```dart
class BlockchainConstants {
  static const String aptosNetwork = 'testnet';
  static const String aptosRpcUrl = 'https://fullnode.testnet.aptoslabs.com/v1';

  // Replace with your deployed contract address
  static const String contractAddress = 'YOUR_CONTRACT_ADDRESS';
}
```

---

### 4. Run Flutter App on iPhone (2 minutes)

```bash
cd sprouts_flutter

# Install dependencies
flutter pub get

# Run on iPhone (make sure it's connected)
flutter run --release -d iPhone
```

---

## Testing the Flow

### Test 1: Login
1. App should show "Sign In with Aptos"
2. Tap button
3. Should navigate to collection screen
4. Check backend logs - should see POST to `/api/auth/connect-wallet`

### Test 2: View Backend Status
```bash
# Test backend health
curl https://YOUR_NGROK_URL.ngrok-free.app/health

# Expected response:
{
  "status": "OK",
  "message": "Sprouts backend is running!",
  "timestamp": "..."
}
```

### Test 3: Create Goal (via API)
```bash
curl -X POST https://YOUR_NGROK_URL.ngrok-free.app/api/goals \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_FROM_LOGIN",
    "title": "Run 20 miles this week",
    "type": "fitness",
    "category": "running",
    "targetValue": 20,
    "unit": "miles",
    "frequency": "weekly"
  }'
```

### Test 4: Mint Sprout for Goal
```bash
# From backend terminal, test minting
curl -X POST https://YOUR_NGROK_URL.ngrok-free.app/api/sprouts/mint \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "goalId": "GOAL_ID",
    "name": "My Fitness Dragon",
    "species": "Dragon",
    "rarity": "Common"
  }'
```

---

## What Works Right Now

✅ **Authentication:**
- Aptos wallet creation (demo mode)
- User creation in database

✅ **Goals:**
- Create goals (all 6 categories)
- Track progress
- View analytics

✅ **Strava Integration:**
- OAuth flow
- Sync activities
- Auto-update fitness goals

✅ **Database:**
- Supabase connected
- Prisma ORM configured
- All tables created

---

## What Needs Work

❌ **Sprout Minting:**
- Need to connect backend to Aptos SDK
- Implement mint endpoint

❌ **Platform Integrations:**
- Plaid (need credentials)
- Education platforms (manual logging for now)
- Screen time tracking (manual logging)
- Work tracking (manual logging)

❌ **Widget Integration:**
- Need to complete Xcode setup
- Add widget target to iOS project

---

## Troubleshooting

**Can't connect to backend from iPhone:**
- Check ngrok is running: http://localhost:4040
- Verify ngrok URL in Flutter app_constants.dart
- Test ngrok URL in iPhone Safari first

**Backend errors:**
- Check `_env` file has all credentials
- Verify Supabase connection
- Check logs: `cd sprout-backend && npm run dev`

**Aptos deployment fails:**
- Get more test tokens: `aptos account fund-with-faucet --account YOUR_ADDRESS`
- Verify Move.toml has correct address
- Check network: `aptos init --network testnet`

**Flutter build errors:**
- Run: `flutter clean && flutter pub get`
- Check iOS deployment target: 13.0+
- Update Xcode if needed

---

## Next Steps After Basic Testing

### Priority 1: Complete Sprout Minting
```bash
# Install Aptos TypeScript SDK
cd sprout-backend
npm install @aptos-labs/ts-sdk

# Create sprout minting service
# Implement POST /api/sprouts/mint endpoint
```

### Priority 2: Set Up Plaid
1. Sign up at https://plaid.com/
2. Get sandbox credentials
3. Add to `_env`
4. Test bank connection flow

### Priority 3: Manual Logging Endpoints
For education, faith, screen time, work:
```bash
POST /api/goals/:goalId/log-activity
{
  "type": "education",
  "value": 2.5,  // hours studied
  "notes": "Completed React course module"
}
```

---

## Testing Checklist

- [ ] Aptos contract deployed to testnet
- [ ] Contract address saved
- [ ] Backend running with ngrok
- [ ] Flutter app updated with URLs
- [ ] App runs on iPhone
- [ ] Login works
- [ ] Can view collection screen
- [ ] Backend receives API calls
- [ ] Database stores user data
- [ ] Strava OAuth flow works (if credentials set)

---

## When You're Ready for Production

1. **Deploy Backend:**
   ```bash
   cd sprout-backend
   vercel --prod
   ```

2. **Deploy Contract to Mainnet:**
   ```bash
   cd sprout-contracts
   aptos init --network mainnet
   aptos move publish --named-addresses sprout_addr=YOUR_MAINNET_ADDRESS --profile mainnet
   ```

3. **Update Flutter App:**
   - Change baseUrl to production URL
   - Change Aptos network to mainnet
   - Submit to App Store

4. **Set Up Real OAuth:**
   - Google Sign-In
   - Apple Sign-In
   - Replace demo wallet with real Aptos Keyless

---

## Support Resources

- **Aptos:** https://aptos.dev/
- **Flutter:** https://docs.flutter.dev/
- **ngrok:** https://ngrok.com/docs
- **Strava API:** https://developers.strava.com/
- **Plaid:** https://plaid.com/docs/

---

## Emergency Contacts

- Aptos Discord: https://discord.gg/aptoslabs
- Backend issues: Check logs at `sprout-backend/`
- Flutter issues: Run with `--verbose` flag
