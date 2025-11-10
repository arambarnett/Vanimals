// Cron job to sync Plaid transactions automatically
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { PlaidService } from '../services/plaidService';
import { GoalTrackingService } from '../services/goalTrackingService';

const prisma = new PrismaClient();
const plaidService = new PlaidService();
const goalTrackingService = new GoalTrackingService();

/**
 * Sync Plaid transactions daily for all connected users
 */
export function startPlaidSyncJob() {
  // Run daily at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('💰 Running Plaid transaction sync...');

    try {
      const plaidIntegrations = await prisma.integration.findMany({
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

          const transactions = await plaidService.getTransactions(
            integration.accessToken,
            startDate,
            endDate
          );

          // Process transactions
          let processedCount = 0;
          for (const txn of transactions) {
            // Check if already processed
            const existing = await prisma.activity.findFirst({
              where: {
                userId: integration.userId,
                externalId: txn.transaction_id,
              },
            });

            if (existing) continue;

            // Process based on transaction type
            if (txn.amount < 0) {
              // Money in (savings/income)
              await goalTrackingService.processActivity(integration.userId, {
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
            } else if (txn.amount > 0) {
              // Money out (spending) - only process if user has spending goals
              const spendingGoals = await prisma.goal.findMany({
                where: {
                  userId: integration.userId,
                  type: 'financial',
                  category: 'spending',
                  isActive: true,
                },
              });

              if (spendingGoals.length > 0) {
                await goalTrackingService.processActivity(integration.userId, {
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
          await prisma.integration.update({
            where: { id: integration.id },
            data: { lastSync: new Date() },
          });

        } catch (error) {
          console.error(`Error syncing Plaid for user ${integration.userId}:`, error);
        }
      }

      console.log(`✅ Plaid sync complete. Processed ${totalProcessed} new transactions.`);
    } catch (error) {
      console.error('Error in Plaid sync job:', error);
    }
  });

  console.log('✅ Plaid sync job scheduled (runs daily at 2:00 AM)');
}
