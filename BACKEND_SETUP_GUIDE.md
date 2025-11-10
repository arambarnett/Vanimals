# Sprouts Backend Setup Guide

## What Has Been Implemented ✅

### Backend Routes
1. **Wallet Authentication** (`/api/auth/*`)
   - POST `/connect-wallet` - Register/login with Aptos wallet
   - GET `/user/:walletAddress` - Get user by wallet
   - GET `/user-by-id/:userId` - Get user by ID
   - PUT `/user/:userId` - Update user profile
   - GET `/user/:userId/summary` - Get user stats summary

2. **Goal Management** (`/api/goals/*`)
   - POST `/` - Create new goal
   - GET `/user/:userId` - Get user's goals
   - GET `/:goalId` - Get goal details with progress
   - PUT `/:goalId` - Update goal
   - DELETE `/:goalId` - Delete goal
   - POST `/:goalId/progress` - Manually log progress
   - GET `/:goalId/analytics` - Get detailed analytics
   - GET `/user/:userId/recommendations` - Get goal recommendations

3. **Plaid Banking** (`/api/plaid/*`)
   - POST `/create-link-token` - Initialize Plaid Link
   - POST `/exchange-token` - Connect bank account
   - POST `/sync-transactions` - Sync and process transactions
   - GET `/balance/:userId` - Get account balances
   - DELETE `/disconnect/:userId` - Disconnect Plaid
   - GET `/spending-analysis/:userId` - Analyze spending by category
   - GET `/savings-progress/:userId/:goalId` - Check savings progress

4. **Sprout NFTs** (`/api/sprouts/*`)
   - GET `/user/:userId` - List user's Sprouts
   - GET `/:sproutId` - Get Sprout details
   - GET `/nft/:nftAddress` - Get Sprout by NFT address
   - POST `/:sproutId/feed` - Manually feed Sprout
   - GET `/:sproutId/health` - Check Sprout health status
   - GET `/:sproutId/level-up-info` - Get level-up requirements
   - GET `/:sproutId/history` - Get Sprout evolution history

5. **Strava Integration** (`/api/strava/*`)
   - GET `/exchange_token` - OAuth callback
   - POST `/sync-activities` - Sync activities
   - GET `/activities` - Get Strava activities
   - DELETE `/disconnect/:userId` - Disconnect Strava

### Cron Jobs
1. **Sprout Health Decay** - Runs hourly
   - Decays hunger/health over time
   - Marks Sprouts as withering if neglected

2. **Strava Sync** - Runs every 6 hours
   - Auto-syncs activities for all connected users
   - Processes activities for fitness goals

3. **Plaid Sync** - Runs daily at 2 AM
   - Auto-syncs transactions for all connected users
   - Processes transactions for financial goals

## Setup Instructions

### 1. Install Dependencies

```bash
cd sprout-backend
npm install
```

Dependencies installed:
- `@aptos-labs/ts-sdk` - Aptos blockchain SDK
- `plaid` - Plaid banking API
- `node-cron` - Cron job scheduler
- `@prisma/client` - Database ORM
- `express`, `cors`, `dotenv` - Server basics

### 2. Database Setup

Update your schema:
```bash
# Backup current database first!
cp prisma/schema.prisma prisma/schema.backup.prisma

# Copy new schema
cp prisma/schema_updated.prisma prisma/schema.prisma

# Run migration
npx prisma migrate dev --name blockchain_and_goals

# Generate Prisma client
npx prisma generate
```

### 3. Environment Variables

Copy the example and fill in your values:
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sprouts

# Aptos (get from Aptos deployment)
APTOS_NETWORK=testnet
APTOS_MODULE_ADDRESS=0x... # Your deployed module address
APTOS_ADMIN_PRIVATE_KEY=0x... # Admin account private key

# Plaid (sign up at https://plaid.com)
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox

# Strava (already have)
STRAVA_CLIENT_ID=165294
STRAVA_CLIENT_SECRET=your_secret

PORT=3000
```

### 4. Deploy Aptos Smart Contracts

```bash
cd sprout-contracts

# Initialize Aptos account
aptos init --profile testnet

# Compile contracts
aptos move compile

# Test contracts
aptos move test

# Deploy to testnet
aptos move publish --profile testnet --named-addresses sprout_addr=<your-address>

# Initialize collection
aptos move run \
  --function-id <your-address>::sprout_nft::initialize_collection \
  --profile testnet

# Initialize activity tracker
aptos move run \
  --function-id <your-address>::activity_tracker::initialize \
  --profile testnet
```

Copy the deployed module address to your `.env` file.

### 5. Update Backend Entry Point

Replace the current `index.ts`:
```bash
cd sprout-backend/src
mv index.ts index.old.ts
mv index_updated.ts index.ts
```

Or manually update your `index.ts` to import and use the new routes.

### 6. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

### 7. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Connect wallet (creates user + mints first Sprout)
curl -X POST http://localhost:3000/api/auth/connect-wallet \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x123...",
    "socialProvider": "google",
    "socialProviderId": "google_123",
    "name": "Test User",
    "email": "test@example.com"
  }'

# Create a goal
curl -X POST http://localhost:3000/api/goals \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_from_above",
    "title": "Run 10 miles this week",
    "type": "fitness",
    "category": "running",
    "targetValue": 10,
    "unit": "miles",
    "frequency": "weekly"
  }'
```

## Integration Flows

### Strava Connection Flow
1. User clicks "Connect Strava" in app
2. App redirects to Strava OAuth with callback URL
3. Strava redirects back to `/api/strava/exchange_token?code=...&userId=...`
4. Backend exchanges code for access token
5. Backend syncs last 20 activities
6. Activities automatically update fitness goals
7. Sprouts get fed based on goal progress

### Plaid Connection Flow
1. User clicks "Connect Bank" in app
2. App calls `/api/plaid/create-link-token`
3. App opens Plaid Link with token
4. User selects bank and authenticates
5. Plaid returns public token
6. App calls `/api/plaid/exchange-token` with public token
7. Backend stores access token
8. Backend syncs last 30 days of transactions
9. Transactions update financial goals
10. Sprouts grow based on savings progress

### Goal Tracking Flow
1. User creates goal (fitness or financial)
2. System monitors connected integrations (Strava/Plaid)
3. When activity occurs (workout or transaction):
   - Activity logged in database
   - Goal progress updated
   - Points/XP awarded
   - User's Sprouts get fed (hunger restored)
   - Sprout health improved
   - Sprout gains experience
4. If goal completed:
   - Bonus XP awarded
   - Achievement unlocked
   - Sprouts level up

### Sprout Health Decay
1. Hourly cron job runs
2. For each Sprout:
   - Calculate hours since last fed
   - Decrease hunger by 2 points/hour
   - If hunger < 20, decrease health
   - If health < 30 or hunger < 20, mark as withering
3. Withering Sprouts shown in red in app
4. Users must complete goals to restore health

## Monitoring & Logs

The backend logs important events:
- ✅ Successful operations (minting, feeding, goal completion)
- ⚠️ Warnings (Sprouts withering, low health)
- ❌ Errors (API failures, blockchain errors)

Check logs:
```bash
# In development
npm run dev

# In production
pm2 logs sprouts-backend
```

## Troubleshooting

### Database Issues
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Check database status
npx prisma studio
```

### Blockchain Issues
```bash
# Check Aptos account balance
aptos account list --profile testnet

# Fund account (testnet)
aptos account fund-with-faucet --profile testnet

# View contract
aptos move view \
  --function-id <address>::sprout_nft::get_sprout_stats \
  --args address:0x...
```

### Integration Issues

**Strava**: Check that redirect URL matches in Strava app settings
**Plaid**: Verify you're using correct environment (sandbox/development/production)

## Next Steps

1. **Frontend Integration**:
   - Update Flutter app to use wallet auth instead of Privy
   - Create goal management screens
   - Add Plaid Link integration
   - Enhance Sprout visualization with health bars

2. **Testing**:
   - Test all API endpoints
   - Test cron jobs
   - Test blockchain interactions
   - Load testing

3. **Security**:
   - Encrypt Plaid/Strava tokens in database
   - Add rate limiting
   - Add authentication middleware
   - Security audit smart contracts

4. **Deployment**:
   - Deploy to production server (Vercel, Railway, etc.)
   - Deploy smart contracts to mainnet
   - Set up monitoring (Sentry, LogRocket)
   - Configure backups

## API Documentation

See `IMPLEMENTATION_SUMMARY.md` for complete API reference.

Key endpoints:
- Auth: `/api/auth/connect-wallet`
- Goals: `/api/goals/user/:userId`
- Plaid: `/api/plaid/sync-transactions`
- Sprouts: `/api/sprouts/user/:userId`
- Strava: `/api/strava/sync-activities`
