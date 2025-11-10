import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import walletAuthRoutes from './routes/walletAuth';
import goalRoutes from './routes/goals';
import plaidRoutes from './routes/plaid';
import sproutRoutes from './routes/sprouts';
import stravaEnhancedRoutes from './routes/stravaEnhanced';
import foodRoutes from './routes/food';
import nftRoutes from './routes/nft';
import waitlistRoutes from './routes/waitlist';

// Import cron jobs
import { startSproutHealthDecayJob } from './jobs/sproutHealthDecay';
import { startStravaSyncJob } from './jobs/stravaSync';
import { startPlaidSyncJob } from './jobs/plaidSync';

// Load environment variables
dotenv.config({ path: '_env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Sprouts backend is running!',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Sprouts Backend API',
    version: '2.0.0',
    features: [
      'Aptos blockchain NFTs',
      'Goal tracking (fitness + financial)',
      'Strava integration',
      'Plaid banking integration',
      'Dynamic Sprout growth/decay',
    ],
  });
});

// API Routes
app.use('/api/auth', walletAuthRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/plaid', plaidRoutes);
app.use('/api/sprouts', sproutRoutes);
app.use('/api/strava', stravaEnhancedRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/waitlist', waitlistRoutes);

// Legacy auth route (kept for backward compatibility)
import authRoutes from './routes/auth';
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start cron jobs
console.log('🚀 Starting cron jobs...');
startSproutHealthDecayJob();
startStravaSyncJob();
startPlaidSyncJob();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Strava Client ID: ${process.env.STRAVA_CLIENT_ID}`);
  console.log(`📚 API Endpoints:`);
  console.log(`   AUTH:`);
  console.log(`   - POST   /api/auth/connect-wallet`);
  console.log(`   - POST   /api/auth/hatch-egg/:userId`);
  console.log(`   - GET    /api/auth/user/:walletAddress`);
  console.log(`   GOALS:`);
  console.log(`   - POST   /api/goals`);
  console.log(`   - GET    /api/goals/user/:userId`);
  console.log(`   FOOD:`);
  console.log(`   - GET    /api/food/:userId`);
  console.log(`   - POST   /api/food/feed`);
  console.log(`   SPROUTS:`);
  console.log(`   - GET    /api/sprouts/user/:userId`);
  console.log(`   - GET    /api/sprouts/:sproutId/health`);
  console.log(`   INTEGRATIONS:`);
  console.log(`   - GET    /api/strava/exchange_token`);
  console.log(`   - POST   /api/strava/sync-activities`);
  console.log(`   - POST   /api/plaid/create-link-token`);
  console.log(`   - POST   /api/plaid/exchange-token`);
  console.log(`\n✅ Sprouts Backend Ready!`);
});

export default app;
