# Sprouts Deployment Steps

## Current Status
- ✅ Backend code complete
- ✅ Smart contracts written
- ✅ Database schema updated
- ⚠️ Database connection needs configuration
- ⏳ Deployment pending

## Step 1: Fix Database Connection

Your Supabase database credentials are in `_env` but the connection is failing.

### Option A: Update Supabase Connection
```bash
cd sprout-backend

# Copy env file
cp _env .env

# The connection should use the direct URL, not the pooler
# Edit .env and update DATABASE_URL to use port 5432 instead of 6543:
DATABASE_URL="postgresql://postgres.fuznyncrufagipokvrub:KEWKdPGAX3YDRf6N@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

### Option B: Use Local PostgreSQL
```bash
# Install PostgreSQL locally
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb sprouts

# Update .env
DATABASE_URL="postgresql://localhost:5432/sprouts"
```

## Step 2: Run Database Migration

Once the connection works:

```bash
cd sprout-backend

# Generate migration
npx prisma migrate dev --name add_blockchain_goals_and_sprouts

# This will:
# - Create new tables: sprouts, goals, activities, achievements
# - Remove old tables: animals, habits, milestones
# - Update users table with blockchain fields
# - Generate Prisma client
```

⚠️ **WARNING**: This migration will delete existing data in `animals`, `habits`, and `milestones` tables!

### Safe Migration (Preserve Data)
If you want to preserve existing data:

```bash
# 1. Export current data
npx prisma db pull
npx prisma db seed # if you have seed data

# 2. Manually migrate data
# Write a script to convert:
#   - Animal → Sprout (with NFT placeholders)
#   - Habit → Goal
#   - Milestone → Goal or Achievement

# 3. Then run migration
npx prisma migrate dev
```

## Step 3: Set Up Aptos CLI

```bash
# Install Aptos CLI (macOS)
brew install aptos

# Or using curl
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

# Verify installation
aptos --version
```

## Step 4: Initialize Aptos Account

```bash
cd sprout-contracts

# Initialize new account for testnet
aptos init --profile testnet --network testnet

# This will:
# - Create a new private key
# - Generate a wallet address
# - Save to .aptos/config.yaml

# Fund your account (testnet faucet)
aptos account fund-with-faucet --profile testnet

# Check balance
aptos account list --profile testnet
```

## Step 5: Deploy Smart Contracts

```bash
cd sprout-contracts

# Compile contracts
aptos move compile --named-addresses sprout_addr=testnet

# Test contracts
aptos move test

# Publish to testnet
aptos move publish --profile testnet --named-addresses sprout_addr=testnet

# Copy the module address from output
# It will be something like: 0x1a2b3c4d...
```

## Step 6: Initialize Contracts

```bash
# Initialize Sprout NFT collection
aptos move run \
  --function-id <YOUR_ADDRESS>::sprout_nft::initialize_collection \
  --profile testnet

# Initialize activity tracker
aptos move run \
  --function-id <YOUR_ADDRESS>::activity_tracker::initialize \
  --profile testnet
```

## Step 7: Update Environment Variables

Create `sprout-backend/.env`:

```env
# Database (use your Supabase or local)
DATABASE_URL="postgresql://..."

# Aptos Blockchain
APTOS_NETWORK=testnet
APTOS_MODULE_ADDRESS=0x... # From deployment step
APTOS_ADMIN_PRIVATE_KEY=0x... # From .aptos/config.yaml

# Plaid (sign up at https://plaid.com)
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_sandbox_secret
PLAID_ENV=sandbox
PLAID_WEBHOOK_URL=https://your-api.com/webhooks/plaid

# Strava (already have)
STRAVA_CLIENT_ID=165294
STRAVA_CLIENT_SECRET=8680056c0f4fd78fb0ff482d8323ae34b41d8fee

# Server
PORT=3000
NODE_ENV=development
```

### Get Your Aptos Private Key
```bash
cat ~/.aptos/config.yaml
# Copy the private_key field
```

### Sign Up for Plaid
1. Go to https://plaid.com
2. Sign up for free sandbox account
3. Get Client ID and Secret
4. Add to .env

## Step 8: Update Backend Entry Point

```bash
cd sprout-backend/src

# Backup current index
cp index.ts index.old.ts

# Use new index with all routes
cp index_updated.ts index.ts
```

## Step 9: Start Backend Server

```bash
cd sprout-backend

# Install dependencies (if not done)
npm install

# Generate Prisma client
npx prisma generate

# Start server
npm run dev
```

You should see:
```
🚀 Starting cron jobs...
✅ Sprout health decay job scheduled (runs hourly)
✅ Strava sync job scheduled (runs every 6 hours)
✅ Plaid sync job scheduled (runs daily at 2:00 AM)
🚀 Server is running on port 3000
📊 Health check: http://localhost:3000/health
```

## Step 10: Test API

```bash
# Health check
curl http://localhost:3000/health

# Should return: {"status":"OK","message":"Sprouts backend is running!"}

# Connect a wallet (creates user + mints first Sprout)
curl -X POST http://localhost:3000/api/auth/connect-wallet \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x123abc...",
    "socialProvider": "google",
    "socialProviderId": "google_12345",
    "name": "Test User",
    "email": "test@sprouts.com"
  }'

# Create a fitness goal
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

## Step 11: Flutter App Integration

### Update Dependencies
```yaml
# sprouts_flutter/pubspec.yaml
dependencies:
  http: ^1.1.0
  shared_preferences: ^2.2.2
  url_launcher: ^6.2.1

  # Remove if only used for Privy
  # webview_flutter: ^4.4.2
```

### Create Wallet Service
```bash
cd sprouts_flutter

# Remove old auth
rm lib/data/services/privy_auth_service.dart

# Create new files (see next step)
```

I'll create the Flutter services in the next steps...

## Common Issues & Solutions

### Database Connection Failed
- Check Supabase project is active
- Use direct connection (port 5432) not pooler (port 6543)
- Verify password in connection string

### Aptos CLI Issues
```bash
# Reinstall
brew uninstall aptos
brew install aptos

# Or update
brew upgrade aptos
```

### Contract Deployment Failed
- Check account has enough APT
- Fund account: `aptos account fund-with-faucet --profile testnet`
- Verify network: `aptos account list --profile testnet`

### Migration Errors
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually drop tables
# Then run migration again
```

## Next Steps After Deployment

1. ✅ Backend running on port 3000
2. ✅ Smart contracts deployed to testnet
3. ⏳ Flutter app updates
4. ⏳ Integration testing
5. ⏳ Production deployment

## Production Checklist

Before deploying to production:

- [ ] Deploy backend to Vercel/Railway/Heroku
- [ ] Deploy smart contracts to Aptos mainnet
- [ ] Switch from Supabase pooler to direct connection
- [ ] Encrypt Plaid/Strava tokens in database
- [ ] Add rate limiting and authentication
- [ ] Set up monitoring (Sentry)
- [ ] Configure backups
- [ ] Security audit smart contracts
- [ ] Load testing
- [ ] App store submission (iOS/Android)

## Support

If you run into issues:
1. Check logs: `npm run dev` output
2. Check Prisma Studio: `npx prisma studio`
3. Verify blockchain: `aptos account list --profile testnet`
4. Review error messages and search GitHub issues

---

**Current Priority**: Fix database connection, then run migration.
