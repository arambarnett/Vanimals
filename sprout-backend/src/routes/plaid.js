"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Plaid banking integration routes
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../lib/prisma");
const plaidService_1 = require("../services/plaidService");
const goalTrackingService_1 = require("../services/goalTrackingService");
const router = express_1.default.Router();
// Using singleton prisma instance from ../lib/prisma
const plaidService = new plaidService_1.PlaidService();
const goalTrackingService = new goalTrackingService_1.GoalTrackingService();
/**
 * Create Plaid Link token for frontend initialization
 */
router.post('/create-link-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, userName } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }
        const linkToken = yield plaidService.createLinkToken(userId, userName);
        res.json({ linkToken });
    }
    catch (error) {
        console.error('Error creating Plaid link token:', error);
        res.status(500).json({ error: 'Failed to create link token' });
    }
}));
/**
 * Exchange public token for access token and store integration
 */
router.post('/exchange-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { publicToken, userId, userName } = req.body;
        if (!publicToken || !userId) {
            res.status(400).json({ error: 'Public token and user ID are required' });
            return;
        }
        // Exchange token with Plaid
        const { accessToken, itemId } = yield plaidService.exchangePublicToken(publicToken);
        // Store integration in database
        const integration = yield prisma_1.prisma.integration.create({
            data: {
                userId,
                provider: 'plaid',
                providerId: itemId,
                providerAccountId: itemId,
                accessToken, // TODO: Encrypt in production
                isActive: true,
                lastSync: new Date(),
                syncFrequency: 'daily',
            },
        });
        // Initial sync of transactions
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        try {
            const transactions = yield plaidService.getTransactions(accessToken, startDate, endDate);
            console.log(`Synced ${transactions.length} initial transactions for user ${userId}`);
        }
        catch (syncError) {
            console.error('Error syncing initial transactions:', syncError);
            // Continue even if initial sync fails
        }
        res.json({
            success: true,
            integration: {
                id: integration.id,
                provider: integration.provider,
                isActive: integration.isActive,
            },
        });
    }
    catch (error) {
        console.error('Error exchanging Plaid token:', error);
        res.status(500).json({ error: 'Failed to connect bank account' });
    }
}));
/**
 * Sync transactions and update financial goals
 */
router.post('/sync-transactions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, days } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }
        // Get Plaid integration
        const integration = yield prisma_1.prisma.integration.findFirst({
            where: {
                userId,
                provider: 'plaid',
                isActive: true,
            },
        });
        if (!integration || !integration.accessToken) {
            res.status(404).json({ error: 'Plaid not connected' });
            return;
        }
        // Fetch transactions
        const daysToSync = days || 30;
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - daysToSync * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const transactions = yield plaidService.getTransactions(integration.accessToken, startDate, endDate);
        // Analyze transactions
        const analysis = plaidService.analyzeSavingsFromTransactions(transactions);
        // Process transactions for financial goals
        let processedCount = 0;
        for (const txn of transactions) {
            // Check if already processed
            const existing = yield prisma_1.prisma.activity.findFirst({
                where: {
                    userId,
                    externalId: txn.transaction_id,
                },
            });
            if (existing)
                continue;
            // Determine if this contributes to goals
            if (txn.amount < 0) {
                // Money in (savings/income)
                yield goalTrackingService.processActivity(userId, {
                    type: 'financial',
                    category: 'savings',
                    value: Math.abs(txn.amount),
                    unit: 'USD',
                    externalId: txn.transaction_id,
                    metadata: {
                        name: txn.name,
                        merchantName: txn.merchant_name,
                        category: txn.category,
                        date: txn.date,
                    },
                });
                processedCount++;
            }
            else if (txn.amount > 0) {
                // Money out (spending) - check against spending limit goals
                const spendingGoals = yield prisma_1.prisma.goal.findMany({
                    where: {
                        userId,
                        type: 'financial',
                        category: 'spending',
                        isActive: true,
                    },
                });
                // Only process if user has spending goals
                if (spendingGoals.length > 0) {
                    yield goalTrackingService.processActivity(userId, {
                        type: 'financial',
                        category: 'spending',
                        value: txn.amount,
                        unit: 'USD',
                        externalId: txn.transaction_id,
                        metadata: {
                            name: txn.name,
                            merchantName: txn.merchant_name,
                            category: txn.category,
                            date: txn.date,
                        },
                    });
                    processedCount++;
                }
            }
        }
        // Update last sync timestamp
        yield prisma_1.prisma.integration.update({
            where: { id: integration.id },
            data: { lastSync: new Date() },
        });
        res.json({
            success: true,
            transactionsCount: transactions.length,
            processedCount,
            analysis: {
                totalSavings: analysis.totalSavings,
                netChange: analysis.netChange,
                savingsTransactionsCount: analysis.savingsTransactions.length,
                spendingTransactionsCount: analysis.spendingTransactions.length,
            },
        });
    }
    catch (error) {
        console.error('Error syncing Plaid transactions:', error);
        res.status(500).json({ error: 'Failed to sync transactions' });
    }
}));
/**
 * Get account balances
 */
router.get('/balance/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const integration = yield prisma_1.prisma.integration.findFirst({
            where: {
                userId,
                provider: 'plaid',
                isActive: true,
            },
        });
        if (!integration || !integration.accessToken) {
            res.status(404).json({ error: 'Plaid not connected' });
            return;
        }
        const accounts = yield plaidService.getBalance(integration.accessToken);
        res.json({ accounts });
    }
    catch (error) {
        console.error('Error fetching Plaid balance:', error);
        res.status(500).json({ error: 'Failed to fetch balance' });
    }
}));
/**
 * Disconnect Plaid integration
 */
router.delete('/disconnect/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        yield prisma_1.prisma.integration.updateMany({
            where: {
                userId,
                provider: 'plaid',
            },
            data: {
                isActive: false,
                accessToken: null,
                refreshToken: null,
            },
        });
        res.json({ success: true, message: 'Plaid disconnected' });
    }
    catch (error) {
        console.error('Error disconnecting Plaid:', error);
        res.status(500).json({ error: 'Failed to disconnect Plaid' });
    }
}));
/**
 * Get spending by category for a user
 */
router.get('/spending-analysis/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { days } = req.query;
        const integration = yield prisma_1.prisma.integration.findFirst({
            where: {
                userId,
                provider: 'plaid',
                isActive: true,
            },
        });
        if (!integration || !integration.accessToken) {
            res.status(404).json({ error: 'Plaid not connected' });
            return;
        }
        const daysToAnalyze = parseInt(days) || 30;
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - daysToAnalyze * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const transactions = yield plaidService.getTransactions(integration.accessToken, startDate, endDate);
        const categorySpending = plaidService.analyzeSpendingByCategory(transactions);
        // Convert Map to object for JSON response
        const spendingByCategory = {};
        categorySpending.forEach((amount, category) => {
            spendingByCategory[category] = amount;
        });
        res.json({
            period: {
                startDate,
                endDate,
                days: daysToAnalyze,
            },
            spendingByCategory,
            totalSpending: Object.values(spendingByCategory).reduce((sum, val) => sum + val, 0),
        });
    }
    catch (error) {
        console.error('Error analyzing spending:', error);
        res.status(500).json({ error: 'Failed to analyze spending' });
    }
}));
/**
 * Check if user's savings goals are on track
 */
router.get('/savings-progress/:userId/:goalId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, goalId } = req.params;
        const goal = yield prisma_1.prisma.goal.findFirst({
            where: {
                id: goalId,
                userId,
                type: 'financial',
            },
        });
        if (!goal) {
            res.status(404).json({ error: 'Savings goal not found' });
            return;
        }
        const progress = plaidService.calculateSavingsProgress(goal.currentValue, goal.targetValue, goal.startDate, goal.endDate || new Date());
        res.json({
            goal: {
                id: goal.id,
                title: goal.title,
                currentValue: goal.currentValue,
                targetValue: goal.targetValue,
                unit: goal.unit,
            },
            progress,
        });
    }
    catch (error) {
        console.error('Error calculating savings progress:', error);
        res.status(500).json({ error: 'Failed to calculate progress' });
    }
}));
exports.default = router;
