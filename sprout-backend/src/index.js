"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import routes
const walletAuth_1 = __importDefault(require("./routes/walletAuth"));
const goals_1 = __importDefault(require("./routes/goals"));
const plaid_1 = __importDefault(require("./routes/plaid"));
const sprouts_1 = __importDefault(require("./routes/sprouts"));
const stravaEnhanced_1 = __importDefault(require("./routes/stravaEnhanced"));
const food_1 = __importDefault(require("./routes/food"));
const nft_1 = __importDefault(require("./routes/nft"));
const waitlist_1 = __importDefault(require("./routes/waitlist"));
// Import cron jobs
const sproutHealthDecay_1 = require("./jobs/sproutHealthDecay");
const stravaSync_1 = require("./jobs/stravaSync");
const plaidSync_1 = require("./jobs/plaidSync");
// Load environment variables
dotenv_1.default.config({ path: '_env' });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
app.use('/api/auth', walletAuth_1.default);
app.use('/api/goals', goals_1.default);
app.use('/api/plaid', plaid_1.default);
app.use('/api/sprouts', sprouts_1.default);
app.use('/api/strava', stravaEnhanced_1.default);
app.use('/api/food', food_1.default);
app.use('/api/nft', nft_1.default);
app.use('/api/waitlist', waitlist_1.default);
// Legacy auth route (kept for backward compatibility)
const auth_1 = __importDefault(require("./routes/auth"));
app.use('/auth', auth_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
    });
});
// Start cron jobs
console.log('🚀 Starting cron jobs...');
(0, sproutHealthDecay_1.startSproutHealthDecayJob)();
(0, stravaSync_1.startStravaSyncJob)();
(0, plaidSync_1.startPlaidSyncJob)();
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
exports.default = app;
