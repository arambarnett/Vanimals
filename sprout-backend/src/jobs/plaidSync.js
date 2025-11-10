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
exports.startPlaidSyncJob = startPlaidSyncJob;
// Cron job to sync Plaid transactions automatically
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const plaidService_1 = require("../services/plaidService");
const goalTrackingService_1 = require("../services/goalTrackingService");
const prisma = new client_1.PrismaClient();
const plaidService = new plaidService_1.PlaidService();
const goalTrackingService = new goalTrackingService_1.GoalTrackingService();
/**
 * Sync Plaid transactions daily for all connected users
 */
function startPlaidSyncJob() {
    // Run daily at 2:00 AM
    node_cron_1.default.schedule('0 2 * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log('💰 Running Plaid transaction sync...');
        try {
            const plaidIntegrations = yield prisma.integration.findMany({
                where: {
                    provider: 'plaid',
                    isActive: true,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            console.log(`Found ${plaidIntegrations.length} active Plaid integrations`);
            let totalProcessed = 0;
            for (const integration of plaidIntegrations) {
                try {
                    if (!integration.accessToken) {
                        console.error(`No access token for user ${integration.userId}`);
                        continue;
                    }
                    // Fetch transactions from last 7 days
                    const endDate = new Date().toISOString().split('T')[0];
                    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    const transactions = yield plaidService.getTransactions(integration.accessToken, startDate, endDate);
                    // Process transactions
                    let processedCount = 0;
                    for (const txn of transactions) {
                        // Check if already processed
                        const existing = yield prisma.activity.findFirst({
                            where: {
                                userId: integration.userId,
                                externalId: txn.transaction_id,
                            },
                        });
                        if (existing)
                            continue;
                        // Process based on transaction type
                        if (txn.amount < 0) {
                            // Money in (savings/income)
                            yield goalTrackingService.processActivity(integration.userId, {
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
                            // Money out (spending) - only process if user has spending goals
                            const spendingGoals = yield prisma.goal.findMany({
                                where: {
                                    userId: integration.userId,
                                    type: 'financial',
                                    category: 'spending',
                                    isActive: true,
                                },
                            });
                            if (spendingGoals.length > 0) {
                                yield goalTrackingService.processActivity(integration.userId, {
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
                    if (processedCount > 0) {
                        console.log(`  ✅ Processed ${processedCount} transactions for ${integration.user.name}`);
                        totalProcessed += processedCount;
                    }
                    // Update last sync
                    yield prisma.integration.update({
                        where: { id: integration.id },
                        data: { lastSync: new Date() },
                    });
                }
                catch (error) {
                    console.error(`Error syncing Plaid for user ${integration.userId}:`, error);
                }
            }
            console.log(`✅ Plaid sync complete. Processed ${totalProcessed} new transactions.`);
        }
        catch (error) {
            console.error('Error in Plaid sync job:', error);
        }
    }));
    console.log('✅ Plaid sync job scheduled (runs daily at 2:00 AM)');
}
