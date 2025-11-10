// Cron job to sync Strava activities automatically
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { GoalTrackingService } from '../services/goalTrackingService';

const prisma = new PrismaClient();
const goalTrackingService = new GoalTrackingService();

/**
 * Sync Strava activities every 6 hours for all connected users
 */
export function startStravaSyncJob() {
  // Run every 6 hours at minute 15
  cron.schedule('15 */6 * * *', async () => {
    console.log('🏃 Running Strava activity sync...');

    try {
      const stravaIntegrations = await prisma.integration.findMany({
        where: {
          provider: 'strava',
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

      console.log(`Found ${stravaIntegrations.length} active Strava integrations`);

      let totalProcessed = 0;

      for (const integration of stravaIntegrations) {
        try {
          // Fetch recent activities
          const activitiesResponse = await fetch(
            'https://www.strava.com/api/v3/athlete/activities?per_page=10',
            {
              headers: {
                'Authorization': `Bearer ${integration.accessToken}`,
              },
            }
          );

          if (!activitiesResponse.ok) {
            console.error(`Failed to fetch activities for user ${integration.userId}`);
            continue;
          }

          const activities = await activitiesResponse.json();

          // Process new activities
          let processedCount = 0;
          for (const activity of activities) {
            // Check if already processed
            const existing = await prisma.activity.findFirst({
              where: {
                userId: integration.userId,
                externalId: activity.id.toString(),
              },
            });

            if (existing) continue;

            // Determine category
            const activityType = activity.type.toLowerCase();
            let category = 'workout';

            if (activityType.includes('run')) category = 'running';
            else if (activityType.includes('ride') || activityType.includes('cycle')) category = 'cycling';
            else if (activityType.includes('swim')) category = 'swimming';
            else if (activityType.includes('walk')) category = 'walking';

            const distanceInMiles = activity.distance / 1609.34;

            await goalTrackingService.processActivity(integration.userId, {
              type: 'fitness',
              category,
              value: distanceInMiles,
              unit: 'miles',
              externalId: activity.id.toString(),
              metadata: {
                name: activity.name,
                type: activity.type,
                distance: activity.distance,
                movingTime: activity.moving_time,
                startDate: activity.start_date,
              },
            });

            processedCount++;
          }

          if (processedCount > 0) {
            console.log(`  ✅ Processed ${processedCount} activities for ${integration.user.name}`);
            totalProcessed += processedCount;
          }

          // Update last sync
          await prisma.integration.update({
            where: { id: integration.id },
            data: { lastSync: new Date() },
          });

        } catch (error) {
          console.error(`Error syncing Strava for user ${integration.userId}:`, error);
        }
      }

      console.log(`✅ Strava sync complete. Processed ${totalProcessed} new activities.`);
    } catch (error) {
      console.error('Error in Strava sync job:', error);
    }
  });

  console.log('✅ Strava sync job scheduled (runs every 6 hours)');
}
