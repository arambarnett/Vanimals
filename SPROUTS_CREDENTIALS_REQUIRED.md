# Sprouts App - Required Credentials & Setup

## Backend Environment Variables (sprout-backend/_env)

### ✅ Already Configured
- **Supabase Database**
  - `DATABASE_URL` - PostgreSQL connection string
  - `POSTGRES_PRISMA_URL` - Prisma-specific connection URL
  - `SUPABASE_URL` - Supabase project URL
  - `SUPABASE_ANON_KEY` - Public anonymous key
  - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)
  - `SUPABASE_JWT_SECRET` - JWT signing secret

- **Strava Integration**
  - `STRAVA_CLIENT_ID` - Strava OAuth app ID
  - `STRAVA_CLIENT_SECRET` - Strava OAuth secret

- **Server Configuration**
  - `PORT` - Server port (default: 3000)

### ❌ Still Needed

#### 1. Aptos Blockchain (CRITICAL for NFT functionality)
```bash
# Add to _env file:
APTOS_NETWORK=testnet
APTOS_CONTRACT_ADDRESS=<your_deployed_contract_address>
APTOS_PRIVATE_KEY=<optional_for_server_side_operations>
```

**To get these:**
- Deploy contract from `sprout-contracts/` directory:
  ```bash
  cd sprout-contracts
  aptos init --network testnet
  aptos move publish --named-addresses sprout_addr=<your_testnet_address>
  ```
- Copy the deployed contract address to `APTOS_CONTRACT_ADDRESS`

#### 2. Plaid Banking Integration (For financial goals)
```bash
# Add to _env file:
PLAID_CLIENT_ID=<your_plaid_client_id>
PLAID_SECRET=<your_plaid_secret>
PLAID_ENV=sandbox  # or development/production
```

**To get these:**
- Sign up at https://plaid.com/
- Create a new application
- Get credentials from dashboard
- Start with sandbox environment for testing

#### 3. Google/Apple Social Login (For production Aptos Keyless)
```bash
# Add to _env file:
GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
GOOGLE_CLIENT_SECRET=<your_google_oauth_secret>
APPLE_CLIENT_ID=<your_apple_signin_id>
APPLE_KEY_ID=<your_apple_key_id>
APPLE_TEAM_ID=<your_apple_team_id>
APPLE_PRIVATE_KEY=<your_apple_private_key>
```

**To get these:**
- Google: https://console.cloud.google.com/apis/credentials
- Apple: https://developer.apple.com/account/resources/identifiers/list

---

## Flutter App Configuration

### Update API Base URL

**File:** `sprouts_flutter/lib/core/constants/app_constants.dart`

```dart
class AppConstants {
  // Change this to your deployed backend URL or ngrok URL for testing
  static const String baseUrl = 'http://localhost:3000';  // CHANGE THIS

  // For testing on physical device with local backend:
  // static const String baseUrl = 'http://YOUR_COMPUTER_IP:3000';

  // For deployed backend:
  // static const String baseUrl = 'https://your-backend.vercel.app';
}
```

### Update Aptos Configuration

**File:** `sprouts_flutter/lib/core/constants/blockchain_constants.dart` (create if doesn't exist)

```dart
class BlockchainConstants {
  static const String aptosNetwork = 'testnet';
  static const String aptosRpcUrl = 'https://fullnode.testnet.aptoslabs.com/v1';
  static const String contractAddress = '<YOUR_DEPLOYED_CONTRACT_ADDRESS>';
}
```

### iOS Widget App Group

**In Xcode:**
1. Open `sprouts_flutter/ios/Runner.xcworkspace`
2. Select Runner target → Signing & Capabilities
3. Add "App Groups" capability
4. Create group: `group.com.sprouts.app`
5. Select SproutWidget target → Signing & Capabilities
6. Add same "App Groups" capability with `group.com.sprouts.app`

---

## Testing Credentials Setup

### For Quick Testing (Minimum Required)

1. **Backend:**
   - ✅ Supabase (already configured)
   - ✅ Strava (already configured)
   - ❌ Need: Aptos contract address

2. **Flutter App:**
   - Update `baseUrl` in `app_constants.dart`
   - Add contract address once deployed

3. **Optional for MVP:**
   - Plaid (skip if not testing financial goals)
   - Social login OAuth (app uses demo mode for now)

---

## Deployment Checklist

### Backend Deployment

**Option 1: Vercel (Recommended)**
```bash
cd sprout-backend
vercel --prod
```
Environment variables to set in Vercel dashboard:
- All variables from `_env` file
- Add `APTOS_CONTRACT_ADDRESS` after contract deployment

**Option 2: Railway/Render**
- Connect GitHub repo
- Set environment variables from `_env`
- Deploy

### Testing with Local Backend

If testing locally with iPhone:
1. Get your computer's local IP: `ifconfig | grep inet`
2. Start backend: `cd sprout-backend && npm run dev`
3. Use ngrok for public URL: `ngrok http 3000`
4. Update Flutter `baseUrl` to ngrok URL

---

## Widget Setup Instructions

### iOS Widget
1. Run `flutter pub get` to install home_widget package
2. Open Xcode: `open ios/Runner.xcworkspace`
3. Add Widget Extension target:
   - File → New → Target
   - Select "Widget Extension"
   - Name: "SproutWidget"
   - Add files we created in `ios/SproutWidget/`
4. Configure App Groups (see above)
5. Build and run on device

### Android Widget
1. Widget files already created
2. Run `flutter pub get`
3. Build and install: `flutter run --release`
4. Long-press home screen → Add Widget → Find "Sprout Widget"

---

## Environment-Specific URLs

### Development
- Backend: `http://localhost:3000` or ngrok URL
- Aptos: `https://fullnode.testnet.aptoslabs.com/v1`

### Production
- Backend: Your Vercel/Railway URL
- Aptos: `https://fullnode.mainnet.aptoslabs.com/v1` (when ready for mainnet)

---

## Quick Start Commands

```bash
# 1. Install backend dependencies
cd sprout-backend
npm install

# 2. Deploy Aptos contract
cd ../sprout-contracts
aptos move publish --named-addresses sprout_addr=YOUR_ADDRESS

# 3. Update backend with contract address
cd ../sprout-backend
# Add APTOS_CONTRACT_ADDRESS to _env file

# 4. Start backend
npm run dev

# 5. Install Flutter dependencies
cd ../sprouts_flutter
flutter pub get

# 6. Run on iPhone
flutter run --release -d iPhone
```

---

## Social Login (Current Status)

**Current Implementation:** Demo mode
- App simulates wallet creation
- Uses deterministic wallet addresses
- No real OAuth required for testing

**For Production:** Integrate real OAuth
1. Add Google Sign-In package to Flutter
2. Add Apple Sign-In package to Flutter
3. Configure OAuth credentials (see above)
4. Replace demo code in `aptos_wallet_service.dart` with real OAuth flow

---

## Support & Documentation

- **Aptos Docs:** https://aptos.dev/
- **Flutter Widgets:** https://pub.dev/packages/home_widget
- **Strava API:** https://developers.strava.com/
- **Plaid API:** https://plaid.com/docs/
