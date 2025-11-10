// Cron job to decay Sprout health over time
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { GoalTrackingService } from '../services/goalTrackingService';

const prisma = new PrismaClient();
const goalTrackingService = new GoalTrackingService();

/**
 * Run every hour to decay all Sprouts' hunger and health
 * Sprouts that aren't being cared for (no goal completion) will wither
 */
export function startSproutHealthDecayJob() {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('🕐 Running Sprout health decay check...');

    try {
      const sprouts = await prisma.sprout.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      let decayedCount = 0;
      let witheringCount = 0;

      for (const sprout of sprouts) {
        try {
          await goalTrackingService.decaySproutHealth(sprout.id);
          decayedCount++;

          // Check if now withering
          const updated = await prisma.sprout.findUnique({
            where: { id: sprout.id },
          });

          if (updated?.isWithering && !sprout.isWithering) {
            witheringCount++;
            console.log(`⚠️  Sprout "${sprout.name}" is now withering!`);
          }
        } catch (error) {
          console.error(`Error decaying Sprout ${sprout.id}:`, error);
        }
      }

      console.log(`✅ Updated ${decayedCount} Sprouts (${witheringCount} now withering)`);
    } catch (error) {
      console.error('Error in Sprout health decay job:', error);
    }
  });

  console.log('✅ Sprout health decay job scheduled (runs hourly)');
}
