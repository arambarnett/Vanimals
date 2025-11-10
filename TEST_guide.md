
  Testing Plan for Sprouts on Aptos Testnet

  Phase 1: Backend Deployment & Setup

  What you need to deploy:

  1. Deploy Smart Contracts to Aptos Testnet
    - Navigate to sprout-contracts/
    - Install Aptos CLI if not already installed
    - Deploy contract:
    aptos move publish --profile testnet
    - Save the deployed contract address
  2. Deploy Backend to Vercel/Render/Railway
    - The backend needs to be publicly accessible for the mobile app
    - Required environment variables (from _env):
        - All Supabase credentials
      - Strava credentials
      - Contract address (once deployed)
      - PORT=3000
  3. Update Flutter App Configuration
    - Update API base URL to point to deployed backend
    - Update contract address in app
    - Configure testnet network settings

  Phase 2: Testing Checklist

  Authentication & Wallet
  - Test social login flow (Google/Apple)
  - Verify wallet address generation
  - Test backend /api/auth/connect-wallet endpoint
  - Verify user creation in Supabase database

  Sprout NFT Creation (Testnet)
  - Test minting first Sprout NFT on testnet
  - Verify NFT appears in user's wallet
  - Verify NFT metadata is correct
  - Test sprout retrieval via /api/sprouts/user/:userId

  Goal Management
  - Create fitness goal (steps/running)
  - Create financial goal (savings)
  - Test goal retrieval
  - Verify goals stored in database

  Strava Integration
  - Test Strava OAuth flow
  - Connect Strava account
  - Sync recent activities
  - Verify activity data updates goal progress
  - Check sprout health updates based on activities

  Plaid Integration (if applicable)
  - Test Plaid link token creation
  - Connect bank account
  - Sync transactions
  - Verify transaction data updates financial goals

  Sprout Health System
  - Test health decay over time (cron job)
  - Test health increase from goal completion
  - Verify visual updates in app (AR model changes)
  - Test health thresholds (0-100)

  AR & 3D Visualization
  - Test AR camera mode on iPhone
  - Verify 3D model rendering
  - Test model animations
  - Check different health states render correctly

  Phase 3: Backend Requirements

  Must be running and accessible:
  1. Backend Server (Express.js on port 3000)
    - Build: npm run build
    - Start: npm start or npm run dev for development
  2. Cron Jobs (auto-start with server)
    - Sprout health decay job
    - Strava sync job
    - Plaid sync job
  3. Database (already configured)
    - Supabase PostgreSQL (credentials in _env)
  4. External Services
    - Strava API (credentials configured)
    - Plaid API (needs setup if testing financial goals)
    - Aptos testnet RPC node

  Immediate Action Items

  Before running the app:
  1. Deploy contracts to testnet and get contract address
  2. Deploy backend or run locally with ngrok/tunneling for mobile access
  3. Update Flutter app config with backend URL
  4. Run flutter pub get in sprouts_flutter directory
  5. Ensure iPhone has camera permissions enabled

  Backend startup:
  cd sprout-backend
  npm install
  npm run dev  # or npm run build && npm start for production

  If testing locally, use ngrok or similar to expose backend:
  ngrok http 3000

  Then update the Flutter app's API base URL to the ngrok URL.